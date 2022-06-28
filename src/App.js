import React from 'react';
import uniqid from 'uniqid';
import he from 'he';
import InitialView from './components/InitialView';
import RenderQuestions from './components/RenderQuestions';
import Button from './components/Button';

function App() {
    const [quiz, setQuiz] = React.useState({
        apiFlags: { amount: 10, category: 9, difficulty: 'medium' },
        isStarted: false,
        isCheck: false,
        answers: [],
        questions: (() => JSON.parse(localStorage.getItem('questions')) || getQuestions())(),
        totalCorrectAnswers: 0,
        quizGameArr: []
    });

    async function getQuestions() {
        const res = await fetch(
            `https://opentdb.com/api.php?amount=${quiz.apiFlags.amount}&category=${quiz.apiFlags.category}&difficulty=${quiz.apiFlags.difficulty}`
        );
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
                return { ...prevState, answers: [], isCheck: false, quizGameArr: quizGameArr };
            });
        }
        makeQuizGameArr();
    }, [quiz.questions]);

    //* handlers
    function handleOptionClick(el, option, questionId) {
        if (quiz.isCheck) {
            return;
        }
        if (quiz.answers.find((e) => e.answer !== option && e.questionId === questionId)) {
            return;
        }
        if (quiz.answers.find((e) => e.answer === option && e.questionId === questionId)) {
            let index = quiz.answers.findIndex((e) => e.answer === option && e.questionId === questionId);
            setQuiz((prevState) => {
                let newAnswers = [...prevState.answers];
                newAnswers.splice(index, 1);
                return { ...prevState, answers: newAnswers };
            });

            return;
        } else {
            let originalQuestion = quiz.quizGameArr.filter((e) => e.id === questionId);
            setQuiz((prevState) => {
                let newAnswers = [...prevState.answers];
                newAnswers.push({
                    questionId: questionId,
                    answer: option,
                    question: originalQuestion[0].question
                });
                return { ...prevState, answers: newAnswers };
            });
        }
    }
    function toggleCheckState() {
        let correctAnswersLength = quiz.answers.filter((answer) => {
            if (
                quiz.quizGameArr.find((e) => {
                    return e.correctAnswer === answer.answer && e.question === answer.question;
                })
            ) {
                return 1;
            } else {
                return 0;
            }
        });

        correctAnswersLength = correctAnswersLength.length;
        setQuiz((prevState) => {
            return { ...prevState, isCheck: !prevState.isCheck, totalCorrectAnswers: correctAnswersLength };
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
        onClick: () => toggleCheckState()
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
                            isCheck={quiz.isCheck}
                        />
                    )}
                    {quiz.isCheck ? (
                        `Your score ${quiz.totalCorrectAnswers}/${quiz.questions.length} correct answers`
                    ) : (
                        <Button {...checkAnswersBtn} />
                    )}
                    <Button
                        onClick={getQuestions}
                        text={quiz.isCheck ? 'Play again' : 'Get new questions'}
                        className="btn btn--normal"
                    />
                </div>
            ) : (
                <InitialView {...buttonInitial} />
            )}
        </div>
    );
}

export default App;
