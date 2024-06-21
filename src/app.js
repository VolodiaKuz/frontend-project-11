import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';
import getWatchedState from './watchers.js';
import resources from './locales/index.js';
import {
  render,
} from './render.js';

const init = () => {
  const state = {
    rss: [],
    posts: [],
    feeds: [],
    errors: [],
    url: '',
    form: {
      valid: true,
      errors: {},
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

export default async () => {
  const state = init();
  const watchedState = getWatchedState(state);
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const elements = {
    form: document.querySelector('[rss-form="form"]'),
    input: document.querySelector('[rss-form="input"]'),
    submitButton: document.querySelector('[rss-form="button"]'),
    urlExample: document.querySelector('#url-example'),
    postsDiv: document.querySelector('.posts'),
    feedsDiv: document.querySelector('.feeds'),
    modalDiv: document.querySelector('#modal'),
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.fields.input = elements.input.value;
    render(state, i18nInstance, elements);
  });
};
