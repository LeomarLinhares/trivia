import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import { Link } from 'react-router-dom';
import { setInfo, fetchTriviaAPI } from '../redux/actions';

// Requisito 1
class Login extends React.Component {
  constructor() {
    super();

    this.handleInput = this.handleInput.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.configButton = this.configButton.bind(this);
    this.getTokenFromAPI = this.getTokenFromAPI.bind(this);

    this.state = {
      playerName: '',
      playerEmail: '',
    };
  }

  componentDidMount() {
    const stateToLocalStorage = {
      player: {
        name: '',
        assertions: 0,
        score: 0,
        gravatarEmail: '',
      },
    };
    localStorage.setItem('state', JSON.stringify(stateToLocalStorage));
  }

  // Função que seta as informações do usuário (nome, avatar, e score)
  setUserInfo() {
    const { playerName, playerEmail } = this.state;
    const { userInfo } = this.props;

    const gravatarEmail = md5(playerEmail).toString();
    const imgAvatar = `https://www.gravatar.com/avatar/${gravatarEmail}`;

    const info = {
      name: playerName,
      avatar: imgAvatar,
      score: 0,
    };

    // a função do onclick chama a action que seta o email para o estado global
    userInfo(info);
  }

  // Função que seta o token no LocalStorage
  async getTokenFromAPI() {
    const { getQuestions } = this.props;
    const URL = 'https://opentdb.com/api_token.php?command=request';
    const result = await fetch(URL);
    const response = await result.json();
    const { token } = response;
    localStorage.setItem('token', token);
    getQuestions();
  }

  // Função que pega os values dos inputs
  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  configButton() {
    const { history } = this.props;
    history.push('/settings');
  }

  render() {
    const { playerEmail, playerName } = this.state;

    return (
      <form className="login-form">
        <label htmlFor="input-player-name">
          <input
            id="input-player-name"
            className="input-name"
            type="text"
            data-testid="input-player-name"
            name="playerName"
            onChange={ this.handleInput }
          />
        </label>

        <label htmlFor="input-gravatar-email">
          <input
            id="input-gravatar-email"
            className="input-email"
            type="email"
            data-testid="input-gravatar-email"
            name="playerEmail"
            onChange={ this.handleInput }
          />
        </label>
        <Link to="/game">
          <button
            className="button-login"
            type="button"
            data-testid="btn-play"
            disabled={ playerEmail === '' || playerName === '' }
            onClick={ async () => { this.setUserInfo(); this.getTokenFromAPI(); } }
          >
            Jogar
          </button>
        </Link>
        <button
          className="button-settings"
          type="button"
          data-testid="btn-settings"
          onClick={ this.configButton }
        >
          Configurações
        </button>
      </form>
    );
  }
}

Login.propTypes = {
  userInfo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  getQuestions: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  userInfo: (info) => dispatch(setInfo(info)),
  getQuestions: () => dispatch(fetchTriviaAPI()),
});

export default connect(null, mapDispatchToProps)(Login);
