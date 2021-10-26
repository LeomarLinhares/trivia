import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

class Feedback extends React.Component {
  constructor() {
    super();

    this.feedbackText = this.feedbackText.bind(this);
  }

  feedbackText() {
    const LESS_THAN_THREE_HITS = 3;
    const { assertions } = JSON.parse(localStorage.getItem('state')).player;

    if (assertions < LESS_THAN_THREE_HITS) {
      return 'Podia ser melhor...';
    }
    return 'Mandou bem!';
  }

  render() {
    const { score } = JSON.parse(localStorage.getItem('state')).player;
    const { assertions } = JSON.parse(localStorage.getItem('state')).player;

    return (
      <div>
        <h3 data-testid="feedback-text">
          { this.feedbackText() }
        </h3>
        <Header scoreToHeader={ score } />

        {/* score total do jogador */}
        <span data-testid="feedback-total-score">{ score }</span>

        {/* quantidade de perguntas acertadas */}
        <span data-testid="feedback-total-question">{ assertions }</span>
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
