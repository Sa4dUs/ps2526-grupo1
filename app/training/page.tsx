"use client";
import { useState } from "react";
import { generateProblems } from "../../lib/problems";
import Link from "next/link";

type Problem = {
  question: string;
  answers: number[];
  correctAnswer: number | undefined;
};

export default function TrainingPage() {
  const [level, setLevel] = useState<number | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  function handleLevelClick(lvl: number) {
    setLevel(lvl);
    const generated = generateProblems(lvl);
    setProblem(generated);
    setSelected(null);
    setIsCorrect(null);
  }

  function handleAnswerClick(answer: number) {
    if (selected !== null) return;
    setSelected(answer);
    setIsCorrect(answer === problem?.correctAnswer);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      {level === null ? (
        <>
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            Select Training Level
          </h1>
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                className="px-5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-md"
                onClick={() => handleLevelClick(lvl)}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-red-600 mb-6">
            Quick problems - Level {level}
          </h1>

          <div className="bg-gray-300 h-40 rounded-md flex items-center justify-center mb-6 overflow-hidden">
            <img src="/mathimage.png" alt="Math Problem Illustration" className="w-full h-full object-cover"/>
          </div>

          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mb-6 text-black">{problem?.question}</h2>

            <div className="grid grid-cols-1 gap-3 w-full max-w-md">
              {problem?.answers.map((ans, i) => {
                let btnClass =
                  "w-full py-3 rounded-lg text-white text-lg font-medium transition ";
                if (selected === null)
                  btnClass += "bg-red-400 hover:bg-red-500";
                else if (ans === problem?.correctAnswer)
                  btnClass += "bg-green-500";
                else if (ans === selected)
                  btnClass += "bg-red-500";
                else btnClass += "bg-red-400 opacity-50";

                return (
                  <button key={i} className={btnClass} onClick={() => handleAnswerClick(ans)} disabled={selected !== null} > {ans}</button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-3 mt-8">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleLevelClick(level)}
              >
                Next Problem
              </button>

              <button
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => setLevel(null)}
              >
                Change level
              </button>
              <Link href="/" className="px-6 py-2 bg-white-500 text-black rounded-md hover:bg-white-600 text-center">Back home</Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
