import React from 'react';

export default function Import(props) {
    let input;
    if (props.options) {
        input = props.options.map((option, i) => {
            return (
                <option key={i} value={option}>
                    {option}
                </option>
            );
        });
    }
    if (props.optionsobj) {
        input = props.optionsobj.map((option, i) => {
            return (
                <option key={i} value={option.id}>
                    {option.name}
                </option>
            );
        });
    }
    return (
        <>
            <label htmlFor={props.name}>{props.placeholder}</label>
            {props.options || props.optionsobj ? (
                <select required id={props.name} {...props}>
                    {input}
                </select>
            ) : (
                <input {...props} />
            )}
        </>
    );
}
