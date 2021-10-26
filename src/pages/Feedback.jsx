import React from 'react';
import Header from '../components/Header';

class Feedback extends React.Component {
  render() {
    const { score } = JSON.parse(localStorage.getItem('state')).player;

    return (
      <div>
        <Header scoreToHeader={ score } />
        <h1 data-testid="feedback-text">Feedback</h1>
      </div>
    );
  }
}

export default Feedback;
