"use client";

import { useEffect, useState } from "react";
import { ResponseSuccess } from "@/types/problem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
import { generateProblems } from "@/lib/problems"; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";

enum GameState {
    LevelSelection,
    Playing,
}

type Token = {
    id: string; 
    value: string;
};

/* --- Componentes auxiliares de DND --- */
function DraggableBox({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        padding: "10px",
        background: "#eee",
        borderRadius: 4,
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
        touchAction: "none",
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 10,
    };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}

function DroppableBox({ id, children }: { id: string; children: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        border: isOver ? "2px solid #3b82f6" : "2px dashed #9ca3af",
        borderRadius: 4,
        width: 44, height: 44, 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isOver ? "#bfdbfe" : "#f9fafb", 
    };
    return <div ref={setNodeRef} style={style}>{children}</div>;
}

/* --- Componente Principal --- */
export default function OperatorPage() {
    // Estados del Juego
    const [gameState, setGameState] = useState(GameState.LevelSelection);
    const [level, setLevel] = useState<number | null>(null);
    const [problem, setProblem] = useState<ResponseSuccess | null>(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    // Estados de las Fichas (Tokens)
    const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
    const [equationSlots, setEquationSlots] = useState<(Token | null)[]>([]);

    // Función para obtener y procesar un nuevo problema
    const loadProblem = (lvl: number) => {
        const rawProblem = generateProblems(lvl);
        
        const formattedProblem: ResponseSuccess = {
            question: rawProblem.question.replace(" = ?", "").trim(),
            solution: rawProblem.correctAnswer,
            encoded: "local"
        };

        setProblem(formattedProblem);
        setIsCorrect(null);

        // Crear los tokens a partir de la pregunta
        const tokens = (formattedProblem.question.match(/\d+|[()+\-*/]/g) || []).map((value, index) => ({
            id: `token-${index}-${value}-${Math.random()}`,
            value,
        }));

        setAvailableTokens([...tokens].sort(() => Math.random() - 0.5));
        setEquationSlots(new Array(tokens.length).fill(null));
    };

    const handleLevelClick = (lvl: number) => {
        setLevel(lvl);
        setNumberOfQuestions(1);
        setGameState(GameState.Playing);
        loadProblem(lvl);
    };

    const checkAnswer = () => {
        if (!problem) return;
        const submittedEquation = equationSlots.map((t) => t?.value || "").join("");
        
        try {
            const result = Math.round(eval(submittedEquation) * 100) / 100;
            if (result === problem.solution) {
                setIsCorrect(true);
                setNumberOfQuestions(prev => prev + 1);
                setTimeout(() => {
                    loadProblem(level!);
                }, 1500);
            } else {
                setIsCorrect(false);
                setTimeout(() => setIsCorrect(null), 1500);
            }
        } catch (e) {
            setIsCorrect(false);
            setTimeout(() => setIsCorrect(null), 1500);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const draggedToken = availableTokens.find(t => t.id === active.id) || 
                            equationSlots.find(t => t?.id === active.id);

        if (!draggedToken) return;

        //Si se suelta fuera o en lugar inválido, vuelve a disponibles si estaba en un slot
        if (!over || !over.id.toString().startsWith("slot-")) {
            const slotIdx = equationSlots.findIndex(t => t?.id === active.id);
            if (slotIdx !== -1) {
                setEquationSlots(prev => {
                    const next = [...prev];
                    next[slotIdx] = null;
                    return next;
                });
                setAvailableTokens(prev => [...prev, draggedToken]);
            }
            return;
        }

        const targetIdx = parseInt(over.id.toString().split("-")[1]);
        const displacedToken = equationSlots[targetIdx];
        const sourceSlotIdx = equationSlots.findIndex(t => t?.id === active.id);

        setEquationSlots(prev => {
            const next = [...prev];
            next[targetIdx] = draggedToken;
            if (sourceSlotIdx !== -1) next[sourceSlotIdx] = displacedToken;
            return next;
        });

        if (sourceSlotIdx === -1) { 
            setAvailableTokens(prev => {
                const next = prev.filter(t => t.id !== active.id);
                if (displacedToken) next.push(displacedToken);
                return next;
            });
        }
    };

    
    if (gameState === GameState.LevelSelection) {
        return (
            <div className="flex flex-col items-center justify-center w-full flex-grow gap-6">
                <h1 className="text-3xl font-bold text-primary">Select Operator Level</h1>
                <div className="flex flex-wrap justify-center gap-4">
                    {[0, 1, 2, 3].map((lvl) => (
                        <Button key={lvl} size="lg" onClick={() => handleLevelClick(lvl)}>
                            Level {lvl}
                        </Button>
                    ))}
                </div>
                <Dialog>
						<div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
							<span>
								Note: Levels 2 and 3 may generate combined operations.
								Click the info icon for more details.
							</span>

							{/*Botón para abrir el modal*/}
							<DialogTrigger asChild>
								<Button variant="outline" size="icon" className="h-5 w-5 rounded-full">
									<Info className="h-4 w-4" />
								</Button>
							</DialogTrigger>
						</div>
						<DialogContent className="max-w-xs sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Hierarchy of Operations</DialogTitle>
								<DialogDescription>
									This is the order (PEMDAS/BODMAS) used for combined operations.
								</DialogDescription>
							</DialogHeader>
							<div className="mt-4">
								<img
									src="/hierarchyoperations.png"
									alt="Jerarquía de operaciones (PEMDAS)"
									className="rounded-md object-contain w-full"
								/>
							</div>
						</DialogContent>
					</Dialog>
                <Link href="/">
                    <Button variant="outline">Back Home</Button>
                </Link>
            </div>
        );
    }

    /* --- VISTA: JUEGO --- */
    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col items-center justify-center w-full flex-grow p-4 gap-6">
                {problem && (
                    <Card className="w-full max-w-3xl shadow-lg">
                        <CardHeader>
                            <h2 className="text-center font-bold">Question {numberOfQuestions} - Level {level}</h2>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            
                            {/* Slots de la ecuación */}
                            <div className="flex gap-2 p-4 bg-gray-100 rounded-lg justify-center flex-wrap items-center">
                                {equationSlots.map((token, index) => (
                                    <DroppableBox key={`slot-${index}`} id={`slot-${index}`}>
                                        {token && <DraggableBox id={token.id}>{token.value}</DraggableBox>}
                                    </DroppableBox>
                                ))}
                                <span className="text-2xl font-semibold">=</span>
                                <div className="flex items-center justify-center px-4 h-[44px] bg-blue-100 text-blue-700 rounded-lg font-bold text-xl">
                                    {problem.solution}
                                </div>
                            </div>

                            {/* Tokens disponibles */}
                            <div className="flex gap-2 p-4 justify-center flex-wrap rounded-lg border border-gray-200 w-full min-h-[80px]">
                                {availableTokens.map((token) => (
                                    <DraggableBox key={token.id} id={token.id}>{token.value}</DraggableBox>
                                ))}
                            </div>

                            {/* Feedback */}
                            {isCorrect === true && <p className="text-green-600 font-bold">¡Correcto!</p>}
                            {isCorrect === false && <p className="text-red-600 font-bold">Incorrecto. Revisa el orden.</p>}

                            {/* Botones */}
                            <div className="flex flex-col w-full max-w-xs gap-2">
                                <Button className="w-full" onClick={checkAnswer} disabled={isCorrect === true}>
                                    Check Answer
                                </Button>
                                <Button variant="secondary" onClick={() => setGameState(GameState.LevelSelection)}>
                                    Change Level
                                </Button>
                                <Link href="/" className="w-full">
                                    <Button variant="outline" className="w-full">Back home</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DndContext>
    );
}