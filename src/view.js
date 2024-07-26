import onChange from 'on-change';

const handleErrors = (watchedState, errors, elements, i18nInstance) => {
  elements.urlExample.nextElementSibling.classList.remove('text-success');
  elements.urlExample.nextElementSibling.classList.add('text-danger');
  elements.urlExample.nextElementSibling.textContent = i18nInstance.t(`rssInput.${errors}`);
};

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

export const renderPosts = (watchedState, posts, i18nInstance, elements) => {
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
    });
    a.addEventListener('click', () => {
      a.classList.add('fw-normal', 'link-secondary');
      a.classList.remove('fw-bold');
    });
  });
};

const renderPostsContainer = (watchedState, i18nInstance, elements) => {
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

  watchedState.feeds.forEach((feed) => {
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

  renderPosts(watchedState, watchedState.posts, i18nInstance, elements);

  elements.urlExample.nextElementSibling.classList.remove('text-danger');
  elements.urlExample.nextElementSibling.classList.add('text-success');
  elements.urlExample.nextElementSibling.textContent = i18nInstance.t('rssInput.sucessfullyUploaded');
};

export default (elements, i18nInstance, state) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.status':
        switch (state.form.status) {
          case 'invalid':
            handleErrors(state, state.form.errors, elements, i18nInstance);
            break;

          case 'submitted':
            elements.form.reset();
            elements.input.focus();
            break;

          case 'valid':
            elements.urlExample.nextElementSibling.textContent = '';
            break;

          default:
            break;
        }
        break;

      case 'posts':
        elements.urlExample.nextElementSibling.textContent = '';
        renderPostsContainer(state, i18nInstance, elements);
        break;

      default:
        break;
    }
  });

  return watchedState;
};
