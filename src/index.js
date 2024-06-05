// import './styles.scss';
// import 'bootstrap';
import getWatchedState from './watchers.js';
import i18n from 'i18next';
import resources from './locales/index.js';
import axios from 'axios';

const init = () => {
  const state = {
    rss: [],
    url: '',
    form: {
      valid: true,
      errors: {},
      fields: {
        input: '',
      },
    }
  };
  return state;
};

const render = (elements, state, i18nInstance) => {
  if (elements.input.value === '') return;
  if (state.rss.includes(elements.input.value)) {
    elements.urlExample.nextElementSibling.classList.remove('text-success');
    elements.urlExample.nextElementSibling.classList.add('text-danger');
    elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.alreadyExist`);
    state.form.rssDuplication = false;
    return;
  }
  if (state.form.valid === true) {
    elements.urlExample.nextElementSibling.classList.remove('text-danger');
    elements.urlExample.nextElementSibling.classList.add('text-success');
    elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.sucessfullyUuploaded`);
    state.rss.push(elements.input.value)
    elements.form.reset();
    elements.input.focus();
    state.form.valid = false;
    return;
  }
  if (state.form.valid === false) {
    elements.urlExample.nextElementSibling.classList.remove('text-success');
    elements.urlExample.nextElementSibling.classList.add('text-danger');
    elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.invalidUrl`);
  }
}

const renderPosts = (elements, state, posts) => {
  const postsDivCard = document.createElement('div');
  postsDivCard.classList.add('card', 'border-0');
  const postsDivCardBody = document.createElement('div');
  postsDivCardBody.classList.add('card-body');
  const postsHeader = document.createElement('h2');
  postsHeader.classList.add('card-title', 'h4');
  postsHeader.textContent = 'Посты';
  const postsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.postsDiv.append(postsDivCard);
  postsDivCard.append(postsDivCardBody);
  postsDivCardBody.append(postsHeader);
  postsDivCard.append(postsUl);

  const feedsDivCard = document.createElement('div');
  feedsDivCard.classList.add('card', 'border-0');
  const feedsDivCardBody = document.createElement('div');
  feedsDivCardBody.classList.add('card-body');
  const feedsHeader = document.createElement('h2');
  feedsHeader.classList.add('card-title', 'h4');
  feedsHeader.textContent = 'Фиды';
  const feedsUl = document.createElement('ul');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.feedsDiv.append(feedsDivCard);
  feedsDivCard.append(feedsDivCardBody);
  feedsDivCardBody.append(feedsHeader);
  feedsDivCard.append(feedsUl);

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
    const a = document.createElement('a');
    a.classList.add('fw-bold')
    a.textContent = post;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = 'Просмотр';
    li.append(a);
    li.append(button);
    postsUl.append(li);
  })
};

export default async () => {
  const elements = {
    // container: document.querySelector('[data-container="sign-up"]'),
    form: document.querySelector('[rss-form="form"]'),
    input: document.querySelector('[rss-form="input"]'),
    submitButton: document.querySelector('[rss-form="button"]'),
    urlExample: document.querySelector('#url-example'),
    postsDiv: document.querySelector('.posts'),
    feedsDiv: document.querySelector('.feeds'),
  };

  const state = init();
  const watchedState = getWatchedState(state);
  const posts = [];
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  elements.submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.form.fields.input = elements.input.value;
    render(elements, state, i18nInstance);
  });

  // elements.submitButton.addEventListener('submit', (e) => {
  //   e.preventDefault();
  // });

  // const apiUrl = 'https://604781a0efa572c1.mokky.dev/items';
  // const apiUrl = 'http://lorem-rss.herokuapp.com/feed';
  // const apiUrl = 'http://rss.cnn.com/rss/cnn_topstories.rss';
  // const apiUrl = 'https://lorem-rss.hexlet.app/feed';
  const apiUrl = 'https://allorigins.hexlet.app/raw?url=https://lorem-rss.hexlet.app/feed';



  axios.get(apiUrl)
    .then(function (response) {
      const result = {};

      const xmlString = response.data;
      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(xmlString, "text/html");
      console.log('parsedHtml-', parsedHtml);

      // const items = parsedHtml.querySelectorAll("item");
      // items.forEach((el) => console.log(el.title))

      // parsedHtml.querySelectorAll("item").forEach((item) => console.log(item.querySelector('title').innerText))
      const re = /<!\[CDATA\[(.*?)\]\]>/mg;
      // parsedHtml.querySelectorAll("item").forEach((item) => console.log(item.querySelector('title')))
      parsedHtml.querySelectorAll("item").forEach((item) => {
        // console.log(item.querySelector('title').textContent);
        // console.log(/<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent)[1]);
        posts.push(/<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent)[1]);
      })
      console.log(posts);
      renderPosts(elements, state, posts);


    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
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
