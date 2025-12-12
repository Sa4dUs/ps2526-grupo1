import { generateProblems } from "@/lib/problems";
import { encrypt, decrypt } from "@/lib/crypto";
import { ProblemError, ResponsePayload } from "@/types/problem";
import { db } from "@/lib/firebaseClient";
import { doc, runTransaction } from "firebase/firestore";
import { ACHIEVEMENTS } from "@/data/achievements"; 

const timeLimit = 30; 

interface UserBody {
  answer: number;
  encoded: string;
  user_id: string;
  finished?: boolean; 
  score?: number;  
}

interface EncodedBody {
  index: number;
  solution: number;
  score: number;
  startTime: number;
}

const jsonResponse = (data: ResponsePayload | object, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<UserBody>;


    if (body.finished && body.user_id && typeof body.score === 'number') {
        await updateTimeTrialScore(body.user_id, body.score);
        return jsonResponse({ success: true });
    }

    if (!body.encoded) {
      return generateFirstProblem();
    }


    const decoded = JSON.parse(decrypt(body.encoded)) as EncodedBody;
    const is_correct = body.answer && decoded.solution == body.answer;

    const elapsed = (Date.now() - decoded.startTime) / 1000;
    if (elapsed > timeLimit + 2) {
      return jsonResponse({ 
          ok: true, 
          finished: true, 
          points: decoded.score, 
          index: decoded.index 
      });
    }

    const nextIndex = decoded.index + 1;
    const nextProblem = generateProblems(nextIndex);
    const nextScore = is_correct ? decoded.score + 1 : decoded.score;

    const nextEncoded = encrypt(
      JSON.stringify({
        index: nextIndex,
        startTime: decoded.startTime,
        score: nextScore,
        solution: nextProblem.correctAnswer
      })
    );

    return jsonResponse({
      ok: is_correct,
      index: is_correct ? decoded.index + 1 : decoded.index,
      question: nextProblem.question,
      answers: nextProblem.answers,
      encoded: nextEncoded,
    });

  } catch (e) {
    console.error(e);
    return jsonResponse({ error: ProblemError.UnexpectedError }, 500);
  }
}

function generateFirstProblem() {
  const startTime = Date.now();
  const problem = generateProblems(0);

  const payload = encrypt(
    JSON.stringify({
      index: 0,
      solution: problem.correctAnswer,
      score: 0,
      startTime,
    })
  );

  return jsonResponse({
    index: 0,
    question: problem.question,
    answers: problem.answers,
    encoded: payload,
  });
}

async function updateTimeTrialScore(user_id: string, score: number) {
  const ref = doc(db, "users", user_id);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    
    if (!snapshot.exists()) throw new Error("document does not exist");;

    const data = snapshot.data();
    
    const current_best = data.stats?.best_score_timetrial ?? 0;
    
    const new_value = Math.max(current_best, score);

    const current_games = data.stats?.total_games ?? 0;
    const stats = {
      ...data.stats,
      best_score_timetrial: new_value,
      total_games: current_games + 1,
    };

    const achievements = ACHIEVEMENTS.filter(a => a.validator(stats)).map(a => {
      return { name: a.name, image_url: a.image_url }
    });
    transaction.update(ref, { 
      "stats": stats,
      "achievements": achievements,
     });
  });
}