import React from 'react';
import he from 'he';

export default function RenderQuestions(props) {
    const questions = props.questions.map((e, i) => {
        let question = he.decode(e.question);
        let optionsArr = [];
        let correctAnswer = he.decode(e.correct_answer);
        let incorrectAnswers = [];
        for (let k = 0; k < e.incorrect_answers.length; k++) {
            incorrectAnswers[k] = he.decode(e.incorrect_answers[k]);
        }
        optionsArr.push(correctAnswer, incorrectAnswers);
        optionsArr = optionsArr.flat();

        optionsArr.sort(() => (Math.random() > 0.5 ? 1 : -1));
        return (
            <div key={'question-' + i} className="question--title">
                <h4>{question}</h4>
                <div className="question--options">
                    {optionsArr.map((option, j) => {
                        return (
                            <div key={'option-' + j} className="question--option">
                                {option}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    });
    return <div className="questions--wrapper">{questions}</div>;
}
