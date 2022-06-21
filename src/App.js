import React from 'react';
import InitialView from './components/InitialView';
import RenderQuestions from './components/RenderQuestions';

function App() {
    const [quiz, setQuiz] = React.useState({
        isStarted: false,
        questions: (() => JSON.parse(localStorage.getItem('questions')))() || getQuestions()
    });

    async function getQuestions() {
        const res = await fetch('https://opentdb.com/api.php?amount=10');
        const data = await res.json();
        setQuiz((prevState) => ({
            ...prevState,
            questions: data.results
        }));
        localStorage.setItem('questions', JSON.stringify(data.results));
    }
    let button = {
        onClick: () =>
            setQuiz((prevState) => ({
                ...prevState,
                isStarted: !prevState.isStarted
            })),
        text: 'My button',
        className: 'btn'
    };
    return (
        <div className="App">
            {quiz.isStarted ? <RenderQuestions questions={quiz.questions} /> : <InitialView {...button} />}
        </div>
    );
}

export default App;
