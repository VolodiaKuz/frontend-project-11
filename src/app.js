import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';
import * as yup from 'yup';
import watch from './view.js';
import resources from './locales/index.js';
import updateRss from './updateRss.js';
import getRss from './parser.js';

const init = () => {
  const state = {
    rss: [],
    posts: [],
    feeds: [],
    errors: [],
    url: '',
    form: {
      status: 'filling',
      valid: true,
      errors: null,
      fields: {
        input: '',
      },
    },
    postsUi: {
      watched: [],
    },
  };
  return state;
};

export default () => {
  const elements = {
    form: document.querySelector('[rss-form="form"]'),
    input: document.querySelector('[rss-form="input"]'),
    submitButton: document.querySelector('[rss-form="button"]'),
    urlExample: document.querySelector('#url-example'),
    postsDiv: document.querySelector('.posts'),
    feedsDiv: document.querySelector('.feeds'),
    modalDiv: document.querySelector('#modal'),
  };

  const state = init();

  const schema = yup.string().trim().required().url('invalidUrl')
    .notOneOf(
      [...state.rss, null],
      'RSS уже существует',
    );

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      const watchedState = watch(elements, i18nInstance, state);
      updateRss(watchedState);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const rssUrl = elements.input.value;

        schema.validate(rssUrl, { abortEarly: false })
          .then(() => {
            watchedState.form.status = 'valid';
            watchedState.form.errors = null;
            if (watchedState.rss.includes(rssUrl)) throw new Error('alreadyExist');
            watchedState.rss.push(rssUrl);
          })
          .then(() => getRss(watchedState, rssUrl))
          .then((posts) => posts.map((post) => post))
          .then((posts) => watchedState.posts.push(...posts))
          .catch((err) => {
            watchedState.form.errors = [err.message];
            watchedState.form.status = 'invalid';
            console.log('err.message- ', err.message);
          });
      });
    });
};
