import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Feedback extends Component {
  render() {
    return (
      <div>
        <h1 data-testid="feedback-text">
          Feedback
        </h1>
        <Link to="/">
          <button type="button" data-testid="btn-play-again">
            Jogar novamente
          </button>
        </Link>
      </div>
    );
  }
}
