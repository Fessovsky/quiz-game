import React from 'react';
import OptionList from './OptionList';

export default function RenderQuestions(props) {
    const questions = props.questions.map((questionObj, i) => {
        let question = questionObj.question;

        return (
            <div key={'wrap-' + i}>
                <div key={'question-' + i} className="question--title">
                    <h4>{question}</h4>
                    <div className="question--options">
                        <OptionList
                            handleClick={props.handleClick}
                            answers={props.answers}
                            isChecked={props.isCheck}
                            questionObj={questionObj}
                        />
                    </div>
                </div>
                <hr />
            </div>
        );
    });
    return <div className="questions--wrapper">{questions}</div>;
}
