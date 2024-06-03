import * as yup from 'yup';
import onChange from 'on-change';
// import { object, string } from 'yup';
// import keyBy from 'lodash/keyBy.js';
import keyBy from 'lodash/keyBy.js';

const validate = (fields, state) => {
  const schema = yup.object().shape({
    input: yup.string().trim().required().url()
      .notOneOf(
        [...state.rss, null],
        'RSS уже существует',
      ),
  });
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

const getWatchedState = (state) => onChange(state, () => {
  const validation = validate(state.form.fields, state);
  if (Object.keys(validation).length === 0) {
    state.form.valid = true;
  } else if (validation.input.message === 'RSS уже существует') {
    state.form.valid = false;
  } else {
    state.form.valid = false;
  }
});

export default getWatchedState;
