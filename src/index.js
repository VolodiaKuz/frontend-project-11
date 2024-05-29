// import './styles.scss';
// import 'bootstrap';

// const test = () => console.log('it worked!');

const init = () => {
  const state = {
    rss: ['hey'],
    url: '',
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
    state.rss.push('submit')
    console.log(state.rss);

    const test = document.createElement('p');
    test.textContent = elements.input.value;
    test.classList.add('text-white')
    // text-white
    elements.form.after(test)
    elements.form.append(test)
  });

  elements.submitButton.addEventListener('submit', (e) => {
    e.preventDefault();
    // // console.log(elements.input.value);
    // state.rss.push('submit')
    // console.log(state.rss);
    // // watchedState.registrationForm.data.password = e.target.value;
    // console.log('button');
    const test = document.createElement('p');
    test.textContent = 'submit';
    elements.form.after(test)
    elements.form.append(test)
  });

}





// module.exports = test;
// export default test;
