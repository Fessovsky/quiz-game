import React from 'react';
import Input from './Input';
export default function Settings(props) {
    const inputs = props.inputs.map((input, i) => {
        return (
            <div className="settings--wrapper" key={input.name + i + '-setting'}>
                <Input {...input} />
            </div>
        );
    });
    return <>{inputs}</>;
}
