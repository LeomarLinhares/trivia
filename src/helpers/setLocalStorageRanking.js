import store from '../redux/store/index';

const setLocalStorageRanking = async (player) => {
  const { saveInfoReducer: { avatar } } = store.getState();
  const ranking = await JSON.parse(localStorage.getItem('ranking'));

  if (!ranking) {
    localStorage.setItem('ranking', []);
  }

  localStorage.setItem(
    'ranking',
    await JSON.stringify(
      [...ranking, { name: player.name, score: player.score, picture: avatar }],
    ),
  );
};

export default setLocalStorageRanking;
