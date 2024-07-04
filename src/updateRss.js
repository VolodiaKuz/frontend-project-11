import axios from 'axios';
import { renderPosts } from './render.js';

const delay = 5000;

const updateRss = (state) => {
  const newPosts = [];
  const existPostsTitles = state.posts.map((post) => post.title);
  const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  state.rss.forEach((url) => {
    const urlWithApi = `${alloriginsApi}${url}`;
    axios.get(urlWithApi)
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
  });
  setTimeout(updateRss, delay, state);
};

export default updateRss;
