// import './styles.scss';
// import 'bootstrap';
import getWatchedState from './watchers.js';
import i18n from 'i18next';
import resources from './locales/index.js';
import {
  render
} from './render.js';

const init = () => {
  const state = {
    rss: [],
    errors: [],
    url: '',
    form: {
      valid: true,
      errors: {},
      fields: {
        input: '',
      },
    },
    elements: {
      form: document.querySelector('[rss-form="form"]'),
      input: document.querySelector('[rss-form="input"]'),
      submitButton: document.querySelector('[rss-form="button"]'),
      urlExample: document.querySelector('#url-example'),
      postsDiv: document.querySelector('.posts'),
      feedsDiv: document.querySelector('.feeds'),
    },
    posts: [],
  };
  return state;
};

export default async () => {
  const state = init();
  const watchedState = getWatchedState(state);
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  state.elements.submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.form.fields.input = state.elements.input.value;
    render(state, i18nInstance);
  });

  // state.elements.submitButton.addEventListener('submit', (e) => {
  //   e.preventDefault();
  // });

}

// Lorem ipsum 2024-06-04T17:02:00Z  // демонстр проект
// Lorem ipsum 2024-06-04T17:02:00Z  // мой 


// const apiUrl = 'https://604781a0efa572c1.mokky.dev/items';
// // функция для получения данных
// async function fetchData() {
//   try {
//     // положительный сценарий
//     const response = await axios.get(apiUrl);
//     if (response.status === 200) {
//       const data = response.data;
//       const tbody = document.querySelector('#productsTable tbody');
//       tbody.innerHTML = '';
//       data.forEach((product) => {
//         const row = document.createElement('tr');
//         const idCell = document.createElement('td');
//         idCell.textContent = product.id;
//         row.appendChild(idCell);

//         const titleCell = document.createElement('td');
//         titleCell.textContent = product.title;
//         row.appendChild(titleCell);
//         const priceCell = document.createElement('td');
//         priceCell.textContent = product.price;
//         row.appendChild(priceCell);
//         const imageUrl = product.image;
//         const imageCell = document.createElement('td');
//         imageCell.innerHTML = `<img src="${imageUrl}" alt="${product.title}" style="width: 100px;">`;
//         row.appendChild(imageCell);
//         tbody.appendChild(row);
//       });
//     } else {
//       console.error('Ошибка запроса', response.status);
//     }
//     console.log('data', data);
//   } catch (error) {
//     // сценарий с ошибкой
//     console.error('Ошибка при выполнении запроса', error.message);
//   }
// }
