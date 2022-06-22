import React from 'react';
import uniqid from 'uniqid';
import he from 'he';
import InitialView from './components/InitialView';
import RenderQuestions from './components/RenderQuestions';
import Button from './components/Button';

function App() {
    const [quiz, setQuiz] = React.useState({
        isStarted: false,
        check: false,
        answers: [],
        questions: (() => JSON.parse(localStorage.getItem('questions')) || getQuestions())()
    });

    async function getQuestions() {
        const res = await fetch('https://opentdb.com/api.php?amount=10');
        const data = await res.json();
        const newData = {};

        newData['results'] = data.results.map((el) => {
            return { ...el, id: uniqid('q-') };
        });
        setQuiz((prevState) => ({
            ...prevState,
            questions: newData.results
        }));
        localStorage.setItem('questions', JSON.stringify(newData.results));
    }

    React.useEffect(() => {
        async function makeQuizGameArr() {
            if ((await quiz.questions) === undefined) {
                return;
            }
            const quizGameArr = quiz.questions.map((e) => {
                let question = he.decode(e.question);
                let correctAnswer = he.decode(e.correct_answer);
                let optionsArr = [];
                let incorrectAnswers = [];
                for (let k = 0; k < e.incorrect_answers.length; k++) {
                    incorrectAnswers[k] = he.decode(e.incorrect_answers[k]);
                }
                optionsArr.push(correctAnswer, incorrectAnswers);
                optionsArr = optionsArr.flat();

                optionsArr.sort(() => (Math.random() > 0.5 ? 1 : -1));
                return {
                    id: e.id,
                    question: question,
                    correctAnswer: correctAnswer,
                    allAnswers: optionsArr
                };
            });
            setQuiz((prevState) => {
                return { ...prevState, answers: [], quizGameArr: quizGameArr };
            });
        }
        makeQuizGameArr();
        console.log('questions changed');
    }, [quiz.questions]);

    //* handlers
    function handleOptionClick(el, option, questionId) {
        if (quiz.answers.find((e) => e.answer === option)) {
            let index = quiz.answers.findIndex((e) => e.answer === option);
            setQuiz((prevState) => {
                let newAnswers = [...prevState.answers];
                newAnswers.splice(index, 1);
                return { ...prevState, answers: newAnswers };
            });
            return;
        }

        setQuiz((prevState) => {
            let newAnswers = [...prevState.answers];
            newAnswers.push({ questionId: questionId, answer: option });
            return { ...prevState, answers: newAnswers };
        });
    }
    function checkAllAnswers(answers, currentGame) {
        currentGame.find((answer) => {
            console.log(answer.id, '- id');
        });
    }
    //* buttons
    let buttonInitial = {
        onClick: () =>
            setQuiz((prevState) => ({
                ...prevState,
                isStarted: !prevState.isStarted
            })),
        text: 'Start quiz',
        className: 'btn btn--big '
    };
    let checkAnswersBtn = {
        text: 'Check answers',
        className: 'btn btn--normal ',
        onClick: () => checkAllAnswers(quiz.answers, quiz.quizGameArr)
    };
    return (
        <div className="App">
            {quiz.isStarted ? (
                <div>
                    {quiz.quizGameArr.length > 0 && (
                        <RenderQuestions
                            questions={quiz.quizGameArr}
                            answers={quiz.answers}
                            handleClick={handleOptionClick}
                            check={quiz.check}
                            
                        />
                    )}
                    <Button {...checkAnswersBtn} />
                    <Button onClick={getQuestions} text="Get new questions" className="btn btn--normal" />
                </div>
            ) : (
                <InitialView {...buttonInitial} />
            )}
        </div>
    );
}

export default App;
