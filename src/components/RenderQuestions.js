import React from 'react';
import QuestionList from './QuestionList';

export default function RenderQuestions(props) {
    const questions = props.questions.map((questionObj, i) => {
        let question = questionObj.question;

        return (
            <div key={'question-' + i} className="question--title">
                <h4>{question}</h4>
                <div className="question--options">
                    <QuestionList
                        handleClick={props.handleClick}
                        answers={props.answers}
                        isChecked={props.isCheck}
                        questionObj={questionObj}
                    />
                </div>
            </div>
        );
    });
    return <div className="questions--wrapper">{questions}</div>;
}
