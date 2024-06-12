import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';

const getRss = async (state, url) => {
  const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  const urlWithApi = `${alloriginsApi}${url}`;
  await axios.get(urlWithApi)
    .then((response) => {
      if (response.status !== 200) throw new Error('Ошибка сети');
      if (response.status === 200) {
        const posts = [];
        const parser = new DOMParser();
        const parsedHtml = parser.parseFromString(response.data.contents, 'text/html');
        const feedsTitle = parsedHtml.querySelector('title').textContent;
        const feedsDescription = parsedHtml.querySelector('description').textContent;
        state.feeds.push({ feedsTitle, feedsDescription });

        if (parsedHtml.querySelector('rss') === undefined || parsedHtml.querySelector('rss') === null) {
          console.log("parsedHtml.querySelector('rss') === null");
          throw new Error('Ресурс не содержит валидный RSS');
        }

        parsedHtml.querySelectorAll('item').forEach((item) => {
          const title = item.querySelector('title').textContent;
          // const link = (item.querySelector('link').nextElementSibling); //  tag guid - what ???
          const link = (item.querySelector('guid').textContent);
          const id = uniqueId();
          const description = item.querySelector('description').innerHTML;
          const obj = {
            title, link, id, description,
          };
          posts.push(obj);
        });
        return posts;
      }
      return null;
    })
    .then((posts) => {
      posts.forEach((el) => state.posts.push(el));
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') state.errors.push('Ошибка сети');
      else state.errors.push('Ресурс не содержит валидный RSS');
    });
};

export default getRss;
