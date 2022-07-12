import React from 'react';
import uniqid from 'uniqid';
import he from 'he';
import InitialView from './components/InitialView';
import RenderQuestions from './components/RenderQuestions';
import Button from './components/Button';
import Settings from './components/Settings';

function App() {
    const [isLoading, setLoading] = React.useState(false);
    const [apiFlags, setApiFlags] = React.useState({
        amount: 10,
        category: 9,
        difficulty: 'medium',
        isChanged: false
    });

    const [quiz, setQuiz] = React.useState({
        isStarted: false,
        isCheck: false,
        answers: [],
        questions: [],
        totalCorrectAnswers: 0,
        quizGameArr: []
    });

    const [initialQuestions, setInitialQuestions] = React.useState({
        initialQuestionsArray: []
    });

    let uri = React.useMemo(
        () =>
            `https://opentdb.com/api.php?amount=${apiFlags.amount}&category=${
                apiFlags.category
            }&difficulty=${apiFlags.difficulty.toLowerCase()}`,
        [apiFlags]
    );
    React.useEffect(() => {
        async function getQuestions() {
            setLoading(true);
            const res = await fetch(uri);
            const data = await res.json();
            const newData = {};
            newData['results'] = data.results.map((el) => {
                return { ...el, id: uniqid('q-') };
            });
            localStorage.setItem('initialQuestions', JSON.stringify(newData.results));
            setInitialQuestions((prevState) => ({
                ...prevState,
                initialQuestionsArray: newData.results
            }));
            setLoading(false);
        }
        setInitialQuestions(() => {
            return {
                initialQuestionsArray: JSON.parse(localStorage.getItem('initialQuestions')) || getQuestions()
            };
        });
    }, [uri]);

    React.useEffect(() => {
        async function makeQuizGameArr() {
            if (initialQuestions.initialQuestionsArray === undefined) {
                return;
            }
            const quizGameArr = initialQuestions.initialQuestionsArray.map((e) => {
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
    }, [initialQuestions]);

    //* handlers
    function handleOptionClick(option, questionId) {
        if (quiz.isCheck) {
            return;
        }
        if (quiz.answers.find((e) => e.answer !== option && e.questionId === questionId)) {
            setQuiz((prevState) => {
                let index = quiz.answers.findIndex((e) => e.answer === option && e.questionId === questionId);
                let newAnswers = [...prevState.answers];
                newAnswers.splice(index, 1);
                let originalQuestion = quiz.quizGameArr.filter((e) => e.id === questionId);
                newAnswers.push({
                    questionId: questionId,
                    answer: option,
                    question: originalQuestion[0].question
                });
                return { ...prevState, answers: newAnswers };
            });
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
        }).length;

        setQuiz((prevState) => {
            return { ...prevState, isCheck: !prevState.isCheck, totalCorrectAnswers: correctAnswersLength };
        });
    }
    async function getQuestions() {
        setLoading(true);
        const res = await fetch(uri);
        const data = await res.json();
        const newData = {};
        newData['results'] = data.results.map((el) => {
            return { ...el, id: uniqid('q-') };
        });
        localStorage.setItem('initialQuestions', JSON.stringify(newData.results));
        setInitialQuestions((prevState) => ({
            ...prevState,
            initialQuestionsArray: newData.results
        }));
        setLoading(false);
    }
    //* buttons
    let buttonInitial = {
        onClick: () => {
            if (apiFlags.isChanged) {
                setApiFlags((prevState) => {
                    return { ...prevState, isChanged: false };
                });
                getQuestions();
            }
            setQuiz((prevState) => ({
                ...prevState,
                isStarted: !prevState.isStarted
            }));
        },
        text: 'Start quiz',
        className: 'btn btn--big '
    };
    let checkAnswersBtn = {
        text: 'Check answers',
        className: 'btn btn--normal ',
        onClick: () => toggleCheckState()
    };
    function handleInputChange(event) {
        const { name, value } = event.target;
        setApiFlags((prevState) => ({
            ...prevState,
            isChanged: true,
            [name]: +value || value
        }));
    }
    let settingsInputs = [
        {
            type: 'number',
            placeholder: 'Amount of questions',
            className: 'settings--input',
            name: 'amount',
            min: 1,
            max: 10,
            value: apiFlags.amount,
            onChange: (e) => handleInputChange(e)
        },
        {
            type: 'number',
            placeholder: 'Category of questions',
            className: 'settings--input',
            name: 'category',
            optionsobj: [
                { id: 9, name: 'General Knowledge' },
                { id: 10, name: 'Entertainment: Books' },
                { id: 11, name: 'Entertainment: Film' },
                { id: 12, name: 'Entertainment: Music' },
                { id: 13, name: 'Entertainment: Musicals & Theatres' },
                { id: 14, name: 'Entertainment: Television' },
                { id: 15, name: 'Entertainment: Video Games' },
                { id: 16, name: 'Entertainment: Board Games' },
                { id: 17, name: 'Science & Nature' },
                { id: 18, name: 'Science: Computers' },
                { id: 19, name: 'Science: Mathematics' },
                { id: 20, name: 'Mythology' },
                { id: 21, name: 'Sports' },
                { id: 22, name: 'Geography' },
                { id: 23, name: 'History' },
                { id: 24, name: 'Politics' },
                { id: 25, name: 'Art' },
                { id: 26, name: 'Celebrities' },
                { id: 27, name: 'Animals' },
                { id: 28, name: 'Vehicles' },
                { id: 29, name: 'Entertainment: Comics' },
                { id: 30, name: 'Science: Gadgets' },
                { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
                { id: 32, name: 'Entertainment: Cartoon & Animations' }
            ],
            value: apiFlags.category,
            onChange: handleInputChange
        },
        {
            type: 'text',
            placeholder: 'Difficulty of questions',
            className: 'settings--input',
            name: 'difficulty',
            options: ['Choose', 'Easy', 'Medium', 'Hard'],
            value: apiFlags.difficulty,
            onChange: handleInputChange
        }
    ];
    return (
        <div className="App">
            {isLoading ? (
                <h1 className="loading">
                    Loading
                    <span className="animate">.</span>
                    <span className="animate">.</span>
                    <span className="animate">.</span>
                </h1>
            ) : quiz.isStarted ? (
                <div>
                    {quiz.quizGameArr.length > 0 && (
                        <RenderQuestions
                            questions={quiz.quizGameArr}
                            answers={quiz.answers}
                            handleClick={handleOptionClick}
                            isCheck={quiz.isCheck}
                        />
                    )}
                    <div className="buttons-wrapper">
                        {quiz.isCheck ? (
                            `Your score ${quiz.totalCorrectAnswers}/${initialQuestions.initialQuestionsArray.length} correct answers`
                        ) : (
                            <Button {...checkAnswersBtn} />
                        )}
                        <Button
                            onClick={getQuestions}
                            text={quiz.isCheck ? 'Play again' : 'Get new questions'}
                            className="btn btn--normal"
                        />
                        <Button
                            onClick={() => setQuiz((prevState) => ({ ...prevState, isStarted: false }))}
                            text="Settings"
                            className="btn btn--normal"
                        />
                    </div>
                </div>
            ) : (
                <>
                    <InitialView {...buttonInitial} />
                    <Settings inputs={settingsInputs} />
                </>
            )}
        </div>
    );
}

export default App;
