import axios from 'axios';
import { renderPosts } from './view.js';

const UpdateDelay = 5000;

const parseResponse = (response, newPosts, existPostsTitles) => {
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
};

const updateRss = (watchedState, i18nInstance, elements) => {
  const newPosts = [];
  const existPostsTitles = watchedState.posts.map((post) => post.title);
  const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  watchedState.rss.forEach((url) => {
    const urlWithApi = `${alloriginsApi}${url}`;
    axios.get(urlWithApi)
      .then((response) => {
        if (response.status === 200) {
          return parseResponse(response, newPosts, existPostsTitles);
        }
        return null;
      })
      .then((posts) => {
        posts.forEach((el) => watchedState.posts.push(el));
        renderPosts(posts, i18nInstance, elements);
      })
      .catch((error) => {
        watchedState.form.errors = error.message;
      });
  });
  setTimeout(updateRss, UpdateDelay, watchedState);
};

export default updateRss;
