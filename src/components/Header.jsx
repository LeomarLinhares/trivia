import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    const { userName, avatar, scoreToHeader } = this.props;

    return (
      <header>
        {/* Avatar do Jogador */}
        <img src={ avatar } alt="avatar-jogador" data-testid="header-profile-picture" />

        {/* Nome do jogador */}
        <h1 data-testid="header-player-name">{ userName }</h1>

        {/* Placar do Jogador */}
        <span data-testid="header-score">{ `Placar: ${scoreToHeader}` }</span>
      </header>
    );
  }
}

Header.propTypes = {
  userName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  scoreToHeader: PropTypes.number.isRequired,
};

const mapStateToProps = (globalState) => ({
  userName: globalState.saveInfoReducer.userName,
  avatar: globalState.saveInfoReducer.avatar,
  score: globalState.saveInfoReducer.score,
});

export default connect(mapStateToProps)(Header);
