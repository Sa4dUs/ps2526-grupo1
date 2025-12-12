"use client";

import { useState } from "react";
import { ResponsePayload, ResponseSuccess, Solution } from "@/types/problem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProblemGame } from "../hooks/useProblemGame";
import { AnswerButtons } from "../components/AnswerButtons";
import { useTimer } from "@/lib/timetrial"; // tu hook adaptado
import toast from "react-hot-toast";
import { Clock } from "lucide-react";
import { getAuth } from "firebase/auth";

enum GameState {
    StartScreen,
    Loading,
    Playing,
}

async function requestProblem(solution?: Solution): Promise<ResponsePayload> {
    try {
        const res = await fetch("/api/problem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: solution ? JSON.stringify(solution) : "null",
        });
        return await res.json();
    } catch (e) {
        console.error(e);
        return { error: "UnexpectedError" } as any;
    }
}

export default function TimeTrialPage() {
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState(GameState.StartScreen);

    const {
        problem,
        selected,
        isCorrect,
        setProblem,
        selectAnswer,
        setSelected,
        setIsCorrect,
    } = useProblemGame<ResponseSuccess>(async () => {
        const res = await requestProblem();
        if ("error" in res) throw new Error("Failed to load problem");
        return res as ResponseSuccess;
    });

    const { timeLeft, startTimer } = useTimer(20, () => {
        toast("Time's up!", {
            duration: 1500,
            icon: <Clock size={30} color="white" />,
            style: {
                background: "#f87171",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.2rem",
                padding: "1rem 2rem",
                borderRadius: "0.5rem",
            },
        });
        cancelGame();

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            fetch("/api/problem/timetrial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    score, 
                    timeLeft, 
                    finished: true,
                    user_id: user.uid 
                }),
            }).catch(console.error); //to catch posib errors
        }
    });

    const startGame = async () => {
        setScore(0);
        setGameState(GameState.Loading);
        setSelected(null);
        setIsCorrect(null);
        
        const res = await requestProblem();
        if ("error" in res) {
            toast.error("Error starting game. Try again.");
            setGameState(GameState.StartScreen);
            return;
        }
        
        setProblem(res as ResponseSuccess);
        setGameState(GameState.Playing);
        startTimer();
    };

    const cancelGame = () => {
        setScore(0);
        setProblem(null);
        setSelected(null);
        setIsCorrect(null);
        setGameState(GameState.StartScreen);
    };

    const handleAnswer = async (answer: number) => {
        if (!problem || selected !== null) return;

        selectAnswer(answer);

        const auth = getAuth();
        const response = await requestProblem({
            solution: answer,
            encoded: problem.encoded,
            user_id: auth.currentUser?.uid ?? ""
        });

        if (!("error" in response)) {
            setScore((prev) => prev + 1);
            setIsCorrect(true);
        }
        //charge new problem

        setTimeout(async () => {
            const next = await requestProblem();
            
            if ("error" in next) {
                console.error("Error fetching next problem:", next.error);
                return; 
            }
            
            setProblem(next as ResponseSuccess);
            setSelected(null);
            setIsCorrect(null);
        }, 500);
    };
    //initial screen before starting the game

    if (gameState === GameState.StartScreen) {
        return (
            <div className="flex flex-col items-center justify-center w-full flex-grow gap-6">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <h2 className="text-center text-xl font-semibold">Time trial mode</h2>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 w-full">
                        <Button onClick={startGame} className="w-full max-w-xs">
                            Start game
                        </Button>
                        <Link href="/" className="w-full max-w-xs">
                            <Button variant="outline" className="w-full">
                                Back Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full flex-grow gap-6">
            {gameState === GameState.Loading && <p>Loading...</p>}

            {gameState === GameState.Playing && problem && (
                <Card className="w-full max-w-3xl shadow-lg">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <h2 className="text-center">Score: {score}</h2>
                        <h3 className="text-center text-lg">
                            Time left: {timeLeft}s
                        </h3>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <h2 className="text-xl font-semibold text-center">
                            {problem.question}
                        </h2>

                        {/* El componente AnswerButtons ahora es seguro de usar */}
                        <AnswerButtons
                            answers={problem.answers}
                            selected={selected}
                            isCorrect={isCorrect}
                            onSelect={handleAnswer}
                        />

                        <div className="flex flex-col w-full max-w-xs gap-2">
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={cancelGame}
                            >
                                Cancel
                            </Button>
                            <Link href="/" className="w-full">
                                <Button variant="outline" className="w-full">
                                    Back home
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}