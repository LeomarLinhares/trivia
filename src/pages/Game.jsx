import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import QuestionCard from '../components/QuestionCard';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      stateToLocalStorage: {
        player: {
          name: '',
          assertions: 0,
          score: 0,
          gravatarEmail: '',
        },
      },
    };
  }

  componentDidMount() {
    const { stateToLocalStorage } = this.state;
    localStorage.setItem('state', JSON.stringify(stateToLocalStorage));
  }

  render() {
    const { questions, loading } = this.props;

    if (loading) return 'Loading...';
    return (
      <div className="game-page">
        <QuestionCard apiResult={ questions } />
      </div>
    );
  }
}

Game.propTypes = {
  getQuestions: PropTypes.func,
  loading: PropTypes.bool,
  questions: PropTypes.arrayOf(PropTypes.object),
}.isRequired;

const mapStateToProps = (state) => ({
  questions: state.setQuestionsReducer.questions,
  loading: state.setQuestionsReducer.loading,
});

export default connect(mapStateToProps)(Game);
