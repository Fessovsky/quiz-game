import React from 'react';

export default function QuestionList(props) {
    let options = props.questionObj.allAnswers.map((option, j) => {
        let classes = props.answers.find((answer) => {
            return answer.answer === option && answer.questionId === props.questionObj.id;
        })
            ? 'question--btn-option active'
            : 'question--btn-option';
        if (props.isChecked) {
            props.answers.map((answer) => {
                if (
                    answer.questionId === props.questionObj.id &&
                    option === props.questionObj.correctAnswer
                ) {
                    classes += ' right';
                } else if (
                    answer.questionId === props.questionObj.id &&
                    answer.answer === option &&
                    option !== props.questionObj.correctAnswer
                ) {
                    classes += ' wrong';
                } else if (
                    answer.questionId === props.questionObj.id &&
                    answer.answer !== option &&
                    option !== props.questionObj.correctAnswer
                ) {
                    classes += ' disabled';
                }
                return null;
            });
        }
        return (
            <div
                key={props.questionObj.id + j}
                onClick={() => props.handleClick( option, props.questionObj.id)}
                className={classes}>
                {option}
            </div>
        );
    });
    return <>{options}</>;
}
