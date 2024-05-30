// import './styles.scss';
// import 'bootstrap';

import * as yup from 'yup';

// const path = require('node:path');
// const yup = require('../node_modules/yup');
// import * as path from 'node:path';
// import onChange from 'on-change';

// import { yup } from '../node_modules/yup/index.js';
// import { onchange } from '../node_modules/onchange/dist/index.js';

// const schema = yup.object().shape({
//   input: yup.string().trim().required(),
// });

// const validate = (fields) => {
//   try {
//     schema.validateSync(fields, { abortEarly: false });
//     return {};
//   } catch (e) {
//     return keyBy(e.inner, 'path');
//   }
// };

// const watchedState = onChange(state, (path, value) => {
//   const validation = validate(state.registrationForm.data);

//   if (Object.keys(validation).length === 0) console.log('Object.keys(validation).length === 0');

// });



const init = () => {
  const state = {
    rss: ['hey'],
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

export default () => {
  const elements = {
    // container: document.querySelector('[data-container="sign-up"]'),
    form: document.querySelector('[rss-form="form"]'),
    input: document.querySelector('[rss-form="input"]'),
    submitButton: document.querySelector('[rss-form="button"]'),
  };

  const state = init();

  elements.input.addEventListener('input', (e) => {
    // watchedState.registrationForm.data.password = e.target.value;
    console.log('input');
    // console.log(e.target.value);

  });

  elements.submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    // watchedState.registrationForm.data.password = e.target.value;
    state.rss.push(elements.input.value)
    console.log(state.rss);

    const test = document.createElement('p');
    test.textContent = elements.input.value;
    test.classList.add('text-white')
    elements.form.after(test)
    elements.form.append(test)

    elements.input.value = '';
    console.log(elements.input);
    elements.input.focus();

    // const errors = validate(state.form.fields);
    // console.log(errors);
    // watchedState.registrationForm.data.name = e.target.value;

  });

  // elements.submitButton.addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   // // console.log(elements.input.value);
  //   // state.rss.push('submit')
  //   // console.log(state.rss);
  //   // // watchedState.registrationForm.data.password = e.target.value;
  //   // console.log('button');
  //   const test = document.createElement('p');
  //   test.textContent = 'submit';
  //   elements.form.after(test)
  //   elements.form.append(test)
  // });

}

// module.exports = test;
// export default test;
