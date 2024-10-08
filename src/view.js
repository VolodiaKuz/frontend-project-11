import onChange from 'on-change';

const handleErrors = (errors, elements, i18nInstance) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = i18nInstance.t(`rssInput.${errors}`);
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

  elements.modalDiv.querySelector('.modal-title').textContent = post.title;
  elements.modalDiv.querySelector('.modal-body').textContent = post.description;
  elements.modalDiv.querySelector('.modal-footer a').setAttribute('href', post.link);
  elements.modalDiv.querySelector('#modal_read_all').textContent = i18nInstance.t('modal.readAll');
  elements.modalDiv.querySelector('#modal_close').textContent = i18nInstance.t('modal.close');

  elements.modalDiv.querySelector('.modal-footer button').addEventListener('click', () => {
    closeModalDiv(elements);
  });

  elements.modalDiv.querySelector('.modal-header button').addEventListener('click', () => {
    closeModalDiv(elements);
  });
};

const createPostsLink = (post) => {
  const a = document.createElement('a');
  a.setAttribute('href', post.link);
  a.setAttribute('target', '_blank');
  a.setAttribute('data-id', post.id);
  a.classList.add('fw-bold');
  return a;
};

export const renderPosts = (posts, i18nInstance, elements) => {
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = createPostsLink(post);
    a.textContent = post.title;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', post.id);
    button.textContent = i18nInstance.t('elements.readButton');
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

const renderFeeds = (watchedState, elements) => {
  watchedState.feeds.forEach((feed) => {
    const feedsLi = document.createElement('li');
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedsH3 = document.createElement('h3');
    feedsH3.classList.add('h6', 'm-0');
    feedsH3.textContent = feed.feedsTitle;
    const feedsParagraph = document.createElement('p');
    feedsParagraph.classList.add('m-0', 'small', 'text-black-50');
    feedsParagraph.textContent = feed.feedsDescription;
    elements.feedsUl.prepend(feedsLi);
    feedsLi.append(feedsH3);
    feedsLi.append(feedsParagraph);
  });
};

const renderContainer = (i18nInstance, elements, element) => {
  const elementDivCard = document.createElement('div');
  elementDivCard.classList.add('card', 'border-0');
  const elementDivCardBody = document.createElement('div');
  elementDivCardBody.classList.add('card-body');
  const elementHeader = document.createElement('h2');
  elementHeader.classList.add('card-title', 'h4');
  elementHeader.textContent = i18nInstance.t('elements.posts');
  const elementUl = document.createElement('ul');
  elements[`${element}Ul`] = elementUl;
  elementUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements[`${element}Div`].append(elementDivCard);
  elementDivCard.append(elementDivCardBody);
  elementDivCardBody.append(elementHeader);
  elementDivCard.append(elementUl);
};

const render = (watchedState, i18nInstance, elements) => {
  elements.postsDiv.innerHTML = '';
  elements.feedsDiv.innerHTML = '';
  elements.feedback.textContent = '';

  renderContainer(i18nInstance, elements, 'posts');
  renderContainer(i18nInstance, elements, 'feeds');

  renderFeeds(watchedState, elements);
  renderPosts(watchedState.posts, i18nInstance, elements);

  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18nInstance.t('rssInput.sucessfullyUploaded');
};

export default (elements, i18nInstance, state) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.status':
        switch (state.form.status) {
          case 'invalid':
            handleErrors(state.form.errors, elements, i18nInstance);
            break;

          case 'submitted':
            elements.form.reset();
            elements.input.focus();
            break;

          case 'valid':
            elements.feedback.textContent = '';
            break;

          default:
            break;
        }
        break;

      case 'posts':
        render(state, i18nInstance, elements);
        break;

      default:
        break;
    }
  });

  return watchedState;
};
