"use client";

import { useEffect, useState } from "react";
import { ResponsePayload, ResponseSuccess, Solution } from "@/types/problem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProblemGame } from "../hooks/useProblemGame";
import { getAuth } from "firebase/auth";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";

enum GameState {
    StartScreen,
    Loading,
    Playing,
}

type Token = {
    id: string; 
    value: string;
};

async function requestProblem(solution?: Solution): Promise<ResponsePayload> {
    const res = await fetch("/api/problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: solution ? JSON.stringify(solution) : "null",
    });
    return await res.json();
}

//Componente DraggableBox
function DraggableBox({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id });

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        padding: "10px",
        background: "#eee",
        borderRadius: 4,
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center" as const,
        cursor: "grab",
        touchAction: "none",
        opacity: isDragging ? 0.5 : 1, //Feedback visual al arrastrar
        zIndex: isDragging ? 100 : 10, //Asegura que esté por encima
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}

//caja destino
function DroppableBox({ id, children, }: { id: string; children: React.ReactNode; }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        border: isOver ? "2px solid #3b82f6" : "2px dashed #9ca3af",
        borderRadius: 4,
        width: 44, 
        height: 44, 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isOver ? "#bfdbfe" : "#f9fafb", 
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}

export default function Operatorpage() {
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState(GameState.StartScreen);
    const [availableTokens, setAvailableTokens] = useState<Token[]>([]); //Tokens en el área de origen
    const [equationSlots, setEquationSlots] = useState<(Token | null)[]>([]); //Tokens en las cajas de destino

    const {
        problem,
        isCorrect,
        setProblem,
        setSelected,
        setIsCorrect,
    } = useProblemGame<ResponseSuccess>(async () =>
        requestProblem().then((res) => res as ResponseSuccess)
    );

    //inicializar los tokens cuando cambia el problema ---
    useEffect(() => {
        if (problem) {
            // 1. Parsear la ecuación en tokens con IDs únicos
            const tokens = (
                problem.question.match(/\d+|[()+\-*/]/g) || []
            ).map((value, index) => ({
                id: `token-${index}-${value}-${Math.random()}`, // ID único
                value,
            }));

            // 2. Barajar los tokens para el área de "disponibles"
            const shuffledTokens = [...tokens].sort(() => Math.random() - 0.5);
            setAvailableTokens(shuffledTokens);

            // 3. Crear los "slots" vacíos para la ecuación
            setEquationSlots(new Array(tokens.length).fill(null));
        } else {
            // Limpiar estados si no hay problema
            setAvailableTokens([]);
            setEquationSlots([]);
        }
    }, [problem]); //Se ejecuta cada vez que 'problem' cambia

    const startGame = async () => {
        setScore(0);
        setGameState(GameState.Loading);
        setSelected(null);
        setIsCorrect(null);
        const res = await requestProblem();
        setProblem(res as ResponseSuccess); 
        setGameState(GameState.Playing);
    };

    const cancelGame = () => {
        setScore(0);
        setProblem(null); 
        setSelected(null);
        setIsCorrect(null);
        setGameState(GameState.StartScreen);
    };

    const loadNextProblem = async () => {
        setTimeout(async () => {
            const next = await requestProblem(); 
            if ("error" in next) {
                const fallback = await requestProblem();
                setProblem(fallback as ResponseSuccess);
            } else {
                setProblem(next as ResponseSuccess);
            }
            setIsCorrect(null); 
        }, 1500); //segs de retroalimentación
    };

    const checkAnswer = () => {
        if (!problem) return;
        const submittedEquation = equationSlots.map((t) => t?.value || "").join("");
        let correctAnswer;
        try { //lo meto en un try catch pq si se arma mal la ecueación se rompe el eval
            correctAnswer = Math.round(eval(submittedEquation) * 100) / 100;
        } catch (e) { //si entra aquí es pq es incorrecto
            setIsCorrect(false);
            setTimeout(() => setIsCorrect(null), 1500);
            return;
        }
        if (correctAnswer === problem.solution) {
            setIsCorrect(true);
            setScore((prev) => prev + 1);
            requestProblem({
                solution: problem.solution,
                encoded: problem.encoded,
                user_id: getAuth().currentUser?.uid || "",
            });
            loadNextProblem();
        } else {  //sí el resultado de la ecuación no es correcto
            setIsCorrect(false);
            setTimeout(() => setIsCorrect(null), 1500);
        }
    };

    //manejador principal de Drag-and-Drop
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        // Encuentra el token que se arrastró
        const draggedTokenData =
            availableTokens.find((t) => t.id === active.id) ||
            equationSlots.find((t) => t?.id === active.id);

        if (!draggedTokenData) return; // No se encontró el token

        // Dónde estaba el token originalmente
        const sourceSlotIndex = equationSlots.findIndex((t) => t?.id === active.id);
        const sourceAvailableIndex = availableTokens.findIndex(
            (t) => t.id === active.id
        );

        //si se soltó fuera de un área válida ---
        if (!over) {
            //Si venía de un slot, devolverlo a "disponibles"
            if (sourceSlotIndex !== -1) {
                setEquationSlots((prev) => {
                    const newSlots = [...prev];
                    newSlots[sourceSlotIndex] = null; // Vaciar el slot
                    return newSlots;
                });
                setAvailableTokens((prev) => [...prev, draggedTokenData]);
            }
            return; //Si venía de "disponibles", no hacer nada
        }

        const overId = over.id as string;

        //si se suelta en un slot de la ecuación ---
        if (overId.startsWith("slot-")) {
            const targetSlotIndex = parseInt(overId.split("-")[1], 10);
            const tokenInTargetSlot = equationSlots[targetSlotIndex];

            // Actualizar los slots
            setEquationSlots((prevSlots) => {
                const newSlots = [...prevSlots];
                // Poner el token arrastrado en el nuevo slot
                newSlots[targetSlotIndex] = draggedTokenData;

                //si venía de otro slot
                if (sourceSlotIndex !== -1) {
                    //intercambiar
                    newSlots[sourceSlotIndex] = tokenInTargetSlot
                        ? tokenInTargetSlot
                        : null;
                }
                return newSlots;
            });

            // Actualizar los tokens disponibles
            setAvailableTokens((prevAvailable) => {
                let newAvailable = [...prevAvailable];
                // Si venía de "disponibles", quitarlo
                if (sourceAvailableIndex !== -1) {
                    newAvailable = newAvailable.filter((t) => t.id !== active.id);
                }
                // Si venía de "disponibles" Y desplazó a un token del slot...
                if (sourceAvailableIndex !== -1 && tokenInTargetSlot) {
                    // ...devolver el token desplazado a "disponibles"
                    newAvailable.push(tokenInTargetSlot);
                }
                return newAvailable;
            });
        }
    };

    if (gameState === GameState.StartScreen) {
        return (
            <div className="flex flex-col items-center justify-center w-full flex-grow gap-6">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <h2 className="text-center text-xl font-semibold">Operator challenge mode</h2>
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
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col items-center justify-center w-full flex-grow gap-6 p-4">
                {gameState === GameState.Loading && <p>Loading...</p>}

                {gameState === GameState.Playing && problem && (
                    <Card className="w-full max-w-3xl shadow-lg">
                        <CardHeader className="flex flex-col items-center gap-2">
                            <h2 className="text-center">Score: {score}</h2>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">

                            {/*área de la solución*/}
                            <div className="flex gap-2 p-4 bg-gray-100 rounded-lg justify-center flex-wrap items-center">
                                {equationSlots.map((token, index) => (
                                    <DroppableBox key={`slot-${index}`} id={`slot-${index}`}>
                                        {token ? (<DraggableBox id={token.id}> {token.value} </DraggableBox>) : null}
                                    </DroppableBox>
                                ))}
                                <span className="text-2xl font-semibold text-gray-700">=</span>
                                <div className="flex items-center justify-center w-[44px] h-[44px] bg-blue-100 text-blue-700 rounded-lg font-bold text-xl">
                                    {problem.solution}
                                </div>
                            </div>

                            {/*área de los arrastables*/}
                            <div
                                className="flex gap-2 p-4 justify-center flex-wrap rounded-lg border border-gray-200 w-full"
                                style={{ minHeight: 60 }}
                            >
                                {availableTokens.map((token) => (
                                    <DraggableBox key={token.id} id={token.id}>
                                        {token.value}
                                    </DraggableBox>
                                ))}
                            </div>

                            {isCorrect === true && (
                                <p className="text-green-600 font-semibold">¡Correcto!</p>
                            )}
                            {isCorrect === false && (
                                <p className="text-red-600 font-semibold">Incorrecto. Intenta de nuevo.</p>
                            )}

                            {/*zona de botones*/}
                            <div className="flex flex-col w-full max-w-xs gap-2">
                                <Button
                                    className="w-full"
                                    onClick={checkAnswer}
                                    disabled={isCorrect === true} 
                                >
                                    Check
                                </Button>
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
        </DndContext>
    );
}