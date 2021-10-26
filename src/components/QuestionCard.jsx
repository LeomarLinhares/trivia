import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import QuestionInfo from './QuestionInfo';
import Header from './Header';

export default class QuestionCard extends React.Component {
  constructor() {
    super();
    this.state = {
      questionIndex: 0,
      stateToLocalStorage: {
        player: {
          name: '',
          assertions: 0,
          score: 0,
          gravatarEmail: '',
        },
      },
      answerListState: [],
      correctAnswerC: 'answer', // State referente a Classe das respostas
      wrongAnswerC: 'answer', // State referente a Classe das respostas
      showbutton: false,
      countdown: 30,
      isDisabled: false,
    };

    this.nextQuestion = this.nextQuestion.bind(this);
    this.setColorAndScore = this.setColorAndScore.bind(this);
    this.countdown = this.countdown.bind(this);
    this.getIDFromSetInterval = this.getIDFromSetInterval.bind(this);
    this.listAnswersMultiple = this.listAnswersMultiple.bind(this);
    this.buttonRedirect = this.buttonRedirect.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  componentDidMount() {
    const { questionIndex } = this.state;
    this.listAnswersMultiple(questionIndex);
    this.getIDFromSetInterval();
  }

  componentWillUnmount() {
    const { intervalID } = this.state;
    clearInterval(intervalID);
  }

  getIDFromSetInterval() {
    const ONE_SECOND = 1000;
    const intervalID = setInterval(this.countdown, ONE_SECOND);

    this.setState({ intervalID });
  }

  setColorAndScore() {
    this.setState({ showbutton: true });
    const { answerListState } = this.state;
    answerListState.forEach((answer) => {
      if (answer.value === true) {
        this.setState({ correctAnswerC: 'answer correct-answer' });
      } else {
        this.setState({ wrongAnswerC: 'answer wrong-answer' });
      }
    });
  }

  countdown() {
    const { countdown, intervalID } = this.state;

    if (countdown === 0) {
      clearInterval(intervalID);
      this.setState({ isDisabled: true });
    } else {
      this.setState({ countdown: countdown - 1 });
    }
  }

  listAnswersMultiple() {
    const { apiResult } = this.props;
    const { questionIndex } = this.state;
    const incorrectAnswers = apiResult[questionIndex].incorrect_answers;
    const incorrectAnswersList = incorrectAnswers.map((answer) => (
      {
        answer,
        value: false,
        difficulty: apiResult[questionIndex].difficulty,
      }
    ));

    const correctAnswer = {
      answer: apiResult[questionIndex].correct_answer,
      value: true,
      difficulty: apiResult[questionIndex].difficulty,
    };
    const answerList = [...incorrectAnswersList, correctAnswer];

    // https://flaviocopes.com/how-to-shuffle-array-javascript/
    const number = 0.5;
    answerList.sort(() => Math.random() - number);
    this.setState({ answerListState: answerList, difficulty: answerList[0].difficulty });
    return answerList;
  }

  nextQuestion() {
    const { questionIndex, intervalID } = this.state;
    this.setState({
      questionIndex: questionIndex + 1,
      wrongAnswerC: 'answer',
      correctAnswerC: 'answer',
      showbutton: false,
    }, () => this.listAnswersMultiple());

    clearInterval(intervalID);
    this.getIDFromSetInterval();
    this.setState({
      countdown: 30,
      isDisabled: false,
    });
  }

  buttonRedirect() {
    const { questionIndex, showbutton } = this.state;
    const LAST_QUESTION = 4;
    return (
      (questionIndex === LAST_QUESTION)
        ? (
          <Link to="/feedback">
            <button
              type="button"
              data-testid="btn-next"
              className="button-next"
              style={ { visibility: showbutton ? 'visible' : 'hidden' } }
              onClick={ () => this.nextQuestion() }
            >
              Próximo
            </button>
          </Link>)
        : (
          <button
            type="button"
            className="button-next"
            style={ { visibility: showbutton ? 'visible' : 'hidden' } }
            onClick={ this.nextQuestion }
            data-testid="btn-next"
          >
            Próximo
          </button>
        )
    );
  }

  submitAnswer(boolean) {
    const { stateToLocalStorage: { player: { score } },
      countdown, difficulty } = this.state;
    const BASE_SCORE = 10;
    const HARD = 3;
    const MEDIUM = 2;
    const EASY = 1;
    let numberOfDifficulty = 0;

    switch (difficulty) {
    case 'hard':
      numberOfDifficulty = HARD;
      break;
    case 'medium':
      numberOfDifficulty = MEDIUM;
      break;
    case 'easy':
      numberOfDifficulty = EASY;
      break;
    default:
      numberOfDifficulty = 0;
      break;
    }

    if (boolean) {
      this.setState({
        stateToLocalStorage: {
          player: {
            name: '',
            assertions: 0,
            score: score
            + BASE_SCORE + (countdown * numberOfDifficulty),
            gravatarEmail: '',
          },
        },
      }, () => {
        const { stateToLocalStorage } = this.state;
        localStorage.setItem('state', JSON.stringify(stateToLocalStorage));
      });
    }
  }

  render() {
    const { apiResult } = this.props;
    const { questionIndex, answerListState, correctAnswerC, wrongAnswerC,
      countdown, isDisabled } = this.state;

    const { score } = JSON.parse(localStorage.getItem('state')).player;

    return (
      <section className="question-card">
        <Header scoreToHeader={ score } />
        <QuestionInfo apiResult={ apiResult } questionIndex={ questionIndex } />
        {answerListState.map((question, index) => (
          question.value === true
            ? (
              <button
                type="button"
                key={ index }
                onClick={ () => { this.submitAnswer(true); this.setColorAndScore(); } }
                data-testid="correct-answer"
                className={ correctAnswerC }
                name={ index }
                disabled={ isDisabled }
              >
                { question.answer }
              </button>)
            : (
              <button
                type="button"
                key={ index }
                onClick={ () => { this.submitAnswer(false); this.setColorAndScore(); } }
                data-testid={ `wrong-answer-${index}` }
                className={ wrongAnswerC }
                name={ index }
                disabled={ isDisabled }
              >
                { question.answer }
              </button>)
        ))}
        { this.buttonRedirect() }
        <span>{ countdown }</span>
      </section>
    );
  }
}

QuestionCard.propTypes = {
  apiResult: PropTypes.shape({
    correct_answer: PropTypes.shape(PropTypes.string),
    incorrect_answers: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    question: PropTypes.string,
  }).isRequired,
};
