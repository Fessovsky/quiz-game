import React from 'react';
import Button from './Button';

export default function InitialView(props) {
    return (
        <>
            <h1>Quiz master</h1>
            <p>Just a regular quiz game</p>
            <Button {...props} />
        </>
    );
}
