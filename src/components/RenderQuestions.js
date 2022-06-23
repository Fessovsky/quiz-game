import React from 'react';

export default function RenderQuestions(props) {
    const questions = props.questions.map((questionObj, i) => {
        let question = questionObj.question;

        return (
            <div key={'question-' + i} className="question--title">
                <h4>{question}</h4>
                <div className="question--options">
                    {questionObj.allAnswers.map((option, j) => {
                        let classes = props.answers.find((answer) => {
                            return answer.answer === option;
                        })
                            ? 'question--btn-option active'
                            : 'question--btn-option';
                        if (props.isCheck) {
                            props.answers.find((answer) => {
                                if (answer.answer === option && option === questionObj.correctAnswer) {
                                    classes += ' right';
                                } else if (answer.answer === option && option !== questionObj.correctAnswer) {
                                    classes += ' wrong';
                                } else {
                                }
                            });
                        }
                        return (
                            <div
                                key={questionObj.id + j}
                                onClick={(buttonElement) =>
                                    props.handleClick(buttonElement, option, questionObj.id)
                                }
                                className={classes}>
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
