import axios from 'axios';
import getRss from './parser.js';

const closeModalDiv = (elements) => {
  elements.modalDiv.classList.remove('show');
  elements.modalDiv.removeAttribute('style', 'display: block');
  elements.modalDiv.removeAttribute('aria-modal', 'true');
  elements.modalDiv.removeAttribute('role', 'dialog');
  elements.modalDiv.setAttribute('aria-hidden', 'true');
  const body = document.querySelector('body');
  body.classList.remove('modal-open');
  body.removeAttribute('style');
};

const renderModalDialog = (post, i18nInstance, elements) => {
  elements.modalDiv.classList.add('show');
  elements.modalDiv.setAttribute('style', 'display: block');
  elements.modalDiv.setAttribute('aria-modal', 'true');
  elements.modalDiv.setAttribute('role', 'dialog');
  elements.modalDiv.removeAttribute('aria-hidden');
  const body = document.querySelector('body');
  body.classList.add('modal-open');
  body.setAttribute('style', 'overflow: hidden; padding-right: 18px;');

  document.querySelector('.modal-title').textContent = post.title;
  document.querySelector('.modal-body').textContent = post.description;
  document.querySelector('.modal-footer a').setAttribute('href', post.link);
  document.querySelector('#modal_read_all').textContent = i18nInstance.t('modal.readAll');
  document.querySelector('#modal_close').textContent = i18nInstance.t('modal.close');

  document.querySelector('.modal-footer button').addEventListener('click', () => {
    closeModalDiv(elements);
  });

  document.querySelector('.modal-header button').addEventListener('click', () => {
    closeModalDiv(elements);
  });
};

export const renderPosts = (state, posts, i18nInstance, elements) => {
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('data-id', post.id);
    a.classList.add('fw-bold');
    a.textContent = post.title;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', post.id);
    button.textContent = 'Просмотр';
    li.append(a);
    li.append(button);
    elements.postsUl.append(li);

    button.addEventListener('click', () => {
      renderModalDialog(post, i18nInstance, elements);
      a.classList.add('fw-normal', 'link-secondary');
      a.classList.remove('fw-bold');
      state.postsUi.watched.push(post.id); // добавить отображение просмотренных постов в UI
      console.log(state);
    });
    a.addEventListener('click', () => {
      a.classList.add('fw-normal', 'link-secondary');
      a.classList.remove('fw-bold');
    });
  });
};

const renderPostsContainer = (state, i18nInstance, elements) => {
  elements.postsDiv.innerHTML = '';
  elements.feedsDiv.innerHTML = '';

  const postsDivCard = document.createElement('div');
  postsDivCard.classList.add('card', 'border-0');
  const postsDivCardBody = document.createElement('div');
  postsDivCardBody.classList.add('card-body');
  const postsHeader = document.createElement('h2');
  postsHeader.classList.add('card-title', 'h4');
  postsHeader.textContent = i18nInstance.t('elements.posts');
  const postsUl = document.createElement('ul');
  elements.postsUl = postsUl;
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
  feedsHeader.textContent = i18nInstance.t('elements.feeds');
  const feedsUl = document.createElement('ul');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.feedsDiv.append(feedsDivCard);
  feedsDivCard.append(feedsDivCardBody);
  feedsDivCardBody.append(feedsHeader);
  feedsDivCard.append(feedsUl);

  state.feeds.forEach((feed) => {
    const feedsLi = document.createElement('li');
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedsH3 = document.createElement('h3');
    feedsH3.classList.add('h6', 'm-0');
    feedsH3.textContent = feed.feedsTitle;
    const feedsParagraph = document.createElement('p');
    feedsParagraph.classList.add('m-0', 'small', 'text-black-50');
    feedsParagraph.textContent = feed.feedsDescription;
    feedsUl.prepend(feedsLi);
    feedsLi.append(feedsH3);
    feedsLi.append(feedsParagraph);
  });

  renderPosts(state, state.posts, i18nInstance, elements);

  elements.urlExample.nextElementSibling.classList.remove('text-danger');
  elements.urlExample.nextElementSibling.classList.add('text-success');
  elements.urlExample.nextElementSibling.textContent = i18nInstance.t('rssInput.sucessfullyUploaded');
};

const render = (state, i18nInstance, elements) => {
  if (elements.input.value === '') return;
  if (state.rss.includes(elements.input.value)) {
    elements.urlExample.nextElementSibling.classList.remove('text-success');
    elements.urlExample.nextElementSibling.classList.add('text-danger');
    elements.urlExample.nextElementSibling.textContent = i18nInstance.t('rssInput.alreadyExist');
    state.form.rssDuplication = false;
    return;
  }
  if (state.form.valid === true) {
    state.rss.push(elements.input.value);

    getRss(state, elements.input.value)
      .then((posts) => {
        if (state.errors.length !== 0) {
          elements.urlExample.nextElementSibling.classList.remove('text-success');
          elements.urlExample.nextElementSibling.classList.add('text-danger');
          elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.${state.errors[0]}`);
          state.errors = [];
          return;
        }
        posts.forEach((el) => state.posts.push(el));
        renderPostsContainer(state, i18nInstance, elements);
        elements.form.reset();
        elements.input.focus();
        state.form.valid = false;
      });

    // в данный момент это тестовая реализации функции для проверки обновления постов
    // если она работает правильно, я переделаю её на промисы и вынесу в отдельный модуль
    const delay = 5000;
    setTimeout(async function request() {
      const newPosts = [];
      const existPostsTitles = state.posts.map((post) => post.title);
      const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
      state.rss.forEach(async (url) => {
        console.log('проверка ссылки RSS на наличие новых постов', url);
        const urlWithApi = `${alloriginsApi}${url}`;
        await axios.get(urlWithApi)
          .then((response) => {
            if (response.status === 200) {
              const xmlString = response.data;
              const parser = new DOMParser();
              const parsedHtml = parser.parseFromString(xmlString, 'text/html');
              parsedHtml.querySelectorAll('item').forEach((item) => { // проверка , что новых постов не добавилось
                const title = item.querySelector('title').textContent;
                if (!existPostsTitles.includes(title)) {
                  const link = (item.querySelector('guid').textContent);
                  const description = item.querySelector('description').innerHTML;
                  const obj = { title, link, description };
                  newPosts.push(obj);
                }
              });
              return newPosts;
            }
            return null;
          })
          .then((posts) => {
            posts.forEach((el) => state.posts.push(el));
            renderPosts(state, posts);// если новые посты добавились - они пушатся в state.posts
          })
          .catch((error) => {
            console.log('catch error', error);
          });
        setTimeout(request, delay);
      });
    }, delay);
    return;
  }

  if (state.form.valid === false) {
    elements.urlExample.nextElementSibling.classList.remove('text-success');
    elements.urlExample.nextElementSibling.classList.add('text-danger');
    elements.urlExample.nextElementSibling.textContent = i18nInstance.t('rssInput.invalidUrl');
  }
};

export { render };
