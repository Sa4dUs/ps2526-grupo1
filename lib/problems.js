//function to generate random problems based on the level that the user has selected from 0 to 3
export function generateProblems(level){
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)]; // Randomly select an operator
    const levels = [10, 20, 50, 100]; // Different levels of difficulty, will be used in future
    const maxNumber = levels[level]   //levels[0] means maxNumber will be 10

    //first with numbers from 1 to 10 to simulate the eassiest level
    let a = Math.floor(Math.random() * maxNumber) + 1; //random number between 1 and the maxNumber that referencess the level of the user
    let b = Math.floor(Math.random() * maxNumber) + 1;

    //to avoid negative results in sub
    if (operator === '-' && b > a) {
        [a, b] = [b, a]; 
    }

    //to avoid decimal solutions in division
    if (operator === '/') {
        b = Math.floor(Math.random() * (maxNumber-1)) + 1; 
        const multiplier = Math.floor(Math.random() * maxNumber) + 1; 
        a = b * multiplier; 
    }

    let correctAnswer;  //to hold de correct answer 
    switch (operator) {
        case '+':
            correctAnswer = a + b;
            break;
        case '-':
            correctAnswer = a - b;
            break;
        case '*':
            correctAnswer = a * b;
            break;
        case '/':
            correctAnswer = a / b;
            break;
    }

    //generate 3 wrong answers
    const answers = new Set()
    answers.add(correctAnswer);
    while (answers.size < 4) {
        let wrongAnswer = correctAnswer + Math.floor(Math.random() * (maxNumber * 2 + 1)) - maxNumber;  //random answer relative to the correct one
        if (wrongAnswer !== correctAnswer) {
            answers.add(wrongAnswer);
        }
    }

    //shuffle answers
    const shuffledAnswers = Array.from(answers).sort(() => Math.random() - 0.5);
    return {
        question: `${a} ${operator} ${b} = ?`,
        answers: shuffledAnswers,
        correctAnswer
    };

};
