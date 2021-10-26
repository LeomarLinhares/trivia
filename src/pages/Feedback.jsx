import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

class Feedback extends React.Component {
  render() {
    const { score } = JSON.parse(localStorage.getItem('state')).player;

    return (
      <div>
        <h1 data-testid="feedback-text">
          Feedback
        </h1>
        <Header scoreToHeader={ score } />
        <Link to="/">
          <button type="button" data-testid="btn-play-again">
            Jogar novamente
          </button>
        </Link>
      </div>
    );
  }
}

export default Feedback;
