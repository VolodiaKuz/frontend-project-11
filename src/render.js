import getRss from './parser.js';

const closeModalDiv = () => {
  const modalDiv = document.querySelector('#modal')
  modalDiv.classList.remove('show')
  modalDiv.removeAttribute("style", 'display: block');
  modalDiv.removeAttribute("aria-modal", 'true');
  modalDiv.removeAttribute("role", 'dialog');
  modalDiv.setAttribute("aria-hidden", 'true');
  const body = document.querySelector('body')
  body.classList.remove('modal-open')
  body.removeAttribute("style");
};

const renderModalDialog = (post) => {
  const modalDiv = document.querySelector('#modal')
  modalDiv.classList.add('show')
  modalDiv.setAttribute("style", 'display: block');
  modalDiv.setAttribute("aria-modal", 'true');
  modalDiv.setAttribute("role", 'dialog');
  modalDiv.removeAttribute("aria-hidden");
  const body = document.querySelector('body')
  body.classList.add('modal-open')
  body.setAttribute("style", 'overflow: hidden; padding-right: 18px;');

  document.querySelector('.modal-title').textContent = post.title;
  document.querySelector('.modal-body').textContent = post.description;
  document.querySelector('.modal-footer a').setAttribute('href', post.link)

  document.querySelector('.modal-footer button').addEventListener('click', (e) => {
    closeModalDiv();
  })

  document.querySelector('.modal-header button').addEventListener('click', (e) => {
    closeModalDiv();
  })
};

const renderPosts = (state, i18nInstance) => {
  state.elements.postsDiv.innerHTML = '';
  state.elements.feedsDiv.innerHTML = '';

  const postsDivCard = document.createElement('div');
  postsDivCard.classList.add('card', 'border-0');
  const postsDivCardBody = document.createElement('div');
  postsDivCardBody.classList.add('card-body');
  const postsHeader = document.createElement('h2');
  postsHeader.classList.add('card-title', 'h4');
  postsHeader.textContent = 'Посты';
  const postsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');
  state.elements.postsDiv.append(postsDivCard);
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
  state.elements.feedsDiv.append(feedsDivCard);
  feedsDivCard.append(feedsDivCardBody);
  feedsDivCardBody.append(feedsHeader);
  feedsDivCard.append(feedsUl);

  const feedsLi = document.createElement('li');
  feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0')
  const feedsH3 = document.createElement('h3');
  feedsH3.classList.add('h6', 'm-0');
  feedsH3.textContent = `Lorem ipsum feed for an interval of 1 minutes with ${state.posts.length} item(s)`;
  const feedsParagraph = document.createElement('p');
  feedsParagraph.classList.add('m-0', 'small', 'text-black-50');
  feedsParagraph.textContent = 'This is a constantly updating lorem ipsum feed';
  feedsUl.append(feedsLi);
  feedsLi.append(feedsH3);
  feedsLi.append(feedsParagraph);

  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
    const a = document.createElement('a');
    a.setAttribute("href", post.link);
    a.setAttribute("target", "_blank");
    a.setAttribute("data-id", post.id);
    a.classList.add('fw-bold')
    a.textContent = post.title;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute("data-id", post.id);
    button.textContent = 'Просмотр';
    li.append(a);
    li.append(button);
    postsUl.append(li);

    button.addEventListener('click', (e) => {
      // alert(post.title)
      renderModalDialog(post);
    })
  })
  state.elements.urlExample.nextElementSibling.classList.remove('text-danger');
  state.elements.urlExample.nextElementSibling.classList.add('text-success');
  state.elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.sucessfullyUuploaded`);
};

const render = async (state, i18nInstance) => {
  if (state.elements.input.value === '') return;
  if (state.rss.includes(state.elements.input.value)) {
    state.elements.urlExample.nextElementSibling.classList.remove('text-success');
    state.elements.urlExample.nextElementSibling.classList.add('text-danger');
    state.elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.alreadyExist`);
    state.form.rssDuplication = false;
    return;
  }
  if (state.form.valid === true) {
    state.rss.push(state.elements.input.value)
    // console.log('state.elements.input.value-', state.elements.input.value);
    await getRss(state, state.elements.input.value);
    if (state.errors.length !== 0) {
      console.log('state.errors-', state.errors);
      state.elements.urlExample.nextElementSibling.classList.remove('text-success');
      state.elements.urlExample.nextElementSibling.classList.add('text-danger');
      state.elements.urlExample.nextElementSibling.textContent = `Ошибка сети (code: ${state.errors[0]})`;
      state.errors = [];
      return;
    }
    renderPosts(state, i18nInstance);
    state.elements.form.reset();
    state.elements.input.focus();
    state.form.valid = false;
    return;
  }
  if (state.form.valid === false) {
    state.elements.urlExample.nextElementSibling.classList.remove('text-success');
    state.elements.urlExample.nextElementSibling.classList.add('text-danger');
    state.elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.invalidUrl`);
  }
};

export { render };
