"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AnswerButtons } from "../components/AnswerButtons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Problem = {
	question: string;
	correctAnswer: string;
};

const OPERATORS = ["+", "-", "*", "/"];

function randomExpr() {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const op = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
    return `${a} ${op} ${b}`;
}

function generateProblem(){
    const leftExpression = randomExpr();
    const rightExpression = randomExpr();

    const leftValue = Math.round(eval(leftExpression) * 100) / 100;
    const rightValue = Math.round(eval(rightExpression) * 100) / 100;

    const question = leftExpression + " ? " + rightExpression;

    let correctAnswer;
    if (leftValue > rightValue) {
        correctAnswer = ">";
    } else if (leftValue < rightValue) {
        correctAnswer = "<";
    } else {
        correctAnswer = "=";
    }

    return{
        question,
        correctAnswer,
    };
}

export default function HigherLowerPage() {
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState<Problem | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        setProblem(generateProblem());
    }, []);

    const handleAnswer = (answer: string) => {
        if (!problem || selected !== null) return;

        setSelected(answer);

        const isCorrect = (answer == problem.correctAnswer);

        setIsCorrect(isCorrect);
        
        if(isCorrect){
            setScore((prev) => prev + 1);
        }
        
        setTimeout(() => {
            setProblem(generateProblem());
            setSelected(null);
            setIsCorrect(null);
        }, 500);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full flex-grow gap-6">

            {problem? (
                <Card className="w-full max-w-3xl shadow-lg">
                    <CardHeader>
                        <h2 className="text-center text-2xl">Score: {score}</h2>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-6">
                        
                        <h2 className="text-3xl font-bold text-center">
                            {problem?.question}
                        </h2>

						<AnswerButtons
							answers={["<", ">", "="]}
							selected={selected}
							isCorrect={isCorrect}
							onSelect={handleAnswer}
						/>

                        <Link href="/">
                            <Button variant="outline" className="w-full max-w-xs">
                                Back home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-full max-w-3xl shadow-lg">
                    <CardHeader>
                        <h2 className="text-center text-2xl">An error ocurred</h2>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-6">
                        <Link href="/">
                            <Button variant="outline" className="w-full max-w-xs">
                                Back home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
