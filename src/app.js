import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';
import * as yup from 'yup';
import watch from './view.js';
import resources from './locales/index.js';
import updateRss from './updateRss.js';
import getRss from './utils.js';

const init = () => ({
  rss: [],
  posts: [],
  feeds: [],
  form: {
    status: 'filling',
    valid: true,
    errors: null,
    fields: {
      input: '',
    },
  },
});

export default () => {
  const elements = {
    form: document.querySelector('[rss-form="form"]'),
    input: document.querySelector('[rss-form="input"]'),
    submitButton: document.querySelector('[rss-form="button"]'),
    urlExample: document.querySelector('#url-example'),
    postsDiv: document.querySelector('.posts'),
    feedsDiv: document.querySelector('.feeds'),
    modalDiv: document.querySelector('#modal'),
    feedback: document.querySelector('.feedback'),
  };

  const state = init();

  const schema = yup.string().trim().required().url('invalidUrl');

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      const watchedState = watch(elements, i18nInstance, state);
      updateRss(watchedState, i18nInstance, elements);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const rssUrl = elements.input.value;
        watchedState.form.errors = null;
        watchedState.form.status = 'valid';

        schema.validate(rssUrl, { abortEarly: false })
          .then(() => {
            if (watchedState.rss.includes(rssUrl)) {
              throw new Error('alreadyExist');
            }
          })
          .then(() => getRss(watchedState, rssUrl))
          .then((posts) => {
            watchedState.rss.push(rssUrl);
            watchedState.posts.push(...posts);
            watchedState.form.status = 'submitted';
          })
          .catch((err) => {
            watchedState.form.errors = err.message;
            watchedState.form.status = 'invalid';
          });
      });
    });
};
