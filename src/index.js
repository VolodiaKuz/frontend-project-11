// import './styles.scss';
// import 'bootstrap';

import * as yup from '../node_modules/yup';
import onChange from '../node_modules/on-change';
// import { object, string } from 'yup';
// import keyBy from 'lodash/keyBy.js';
import keyBy from '../node_modules/lodash/keyBy.js';


const validate = (fields, state) => {
  const schema = yup.object().shape({
    input: yup.string().trim().required().url()
      .notOneOf(
        [...state.rss, null],
        'RSS уже существует',
      ),
  });
  // const schema = object().shape({
  //   input: string().trim().required().url()
  //     .notOneOf(
  //       [...state.rss, null],
  //       'RSS уже существует',
  //     ),
  // });
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

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

export default () => {
  const elements = {
    // container: document.querySelector('[data-container="sign-up"]'),
    form: document.querySelector('[rss-form="form"]'),
    input: document.querySelector('[rss-form="input"]'),
    submitButton: document.querySelector('[rss-form="button"]'),
    urlExample: document.querySelector('#url-example'),
  };

  const state = init();

  const watchedState = onChange(state, (path, value) => {
    const validation = validate(state.form.fields, state);
    if (Object.keys(validation).length === 0) {
      state.form.valid = true;
    } else if (validation.input.message === 'RSS уже существует') {
      state.form.valid = false;
    } else {
      state.form.valid = false;
    }
  });

  elements.submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.form.fields.input = elements.input.value;
    render(elements, state);
  });

  // elements.submitButton.addEventListener('submit', (e) => {
  //   e.preventDefault();
  // });
}
