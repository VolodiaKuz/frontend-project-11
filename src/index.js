// import './styles.scss';
// import 'bootstrap';
import getWatchedState from './watchers.js';
import i18n from 'i18next';
import resources from './locales/index.js';

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

const render = (elements, state) => {
  console.log('elements.input.value === ', elements.input.value);
  if (elements.input.value === '') return;
  if (state.rss.includes(elements.input.value)) {
    elements.urlExample.nextElementSibling.classList.remove('text-success');
    elements.urlExample.nextElementSibling.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    elements.urlExample.nextElementSibling.textContent = 'RSS уже существует';
    state.form.rssDuplication = false;
    return;
  }
  if (state.form.valid === true) {
    elements.urlExample.nextElementSibling.classList.remove('text-danger');
    elements.urlExample.nextElementSibling.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    elements.urlExample.nextElementSibling.textContent = 'RSS успешно загружен';
    state.rss.push(elements.input.value)
    elements.form.reset();
    elements.input.focus();
    state.form.valid = false;
    return;
  }
  if (state.form.valid === false) {
    elements.urlExample.nextElementSibling.classList.remove('text-success');
    elements.urlExample.nextElementSibling.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    elements.urlExample.nextElementSibling.textContent = 'Ссылка должна быть валидным URL';
  }
}

export default async () => {
  const elements = {
    // container: document.querySelector('[data-container="sign-up"]'),
    form: document.querySelector('[rss-form="form"]'),
    input: document.querySelector('[rss-form="input"]'),
    submitButton: document.querySelector('[rss-form="button"]'),
    urlExample: document.querySelector('#url-example'),
  };

  const state = init();
  const watchedState = getWatchedState(state);

  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  console.log(i18nInstance.t(`buttonLanguage`));

  elements.submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.form.fields.input = elements.input.value;
    render(elements, state);
  });

  // elements.submitButton.addEventListener('submit', (e) => {
  //   e.preventDefault();
  // });
}
