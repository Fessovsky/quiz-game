import React from 'react';

export default function Import(props) {
    let input;
    if (props.options) {
        input = props.options.map((option, i) => {
            return <option key={i}>{option}</option>;
        });
    }
    return (
        <>
            <label htmlFor={props.name}>{props.placeholder}</label>
            {props.options ? (
                <select required id={props.name} {...props}>
                    {input}
                </select>
            ) : (
                <input {...props} />
            )}
        </>
    );
}
