import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';

const extractPosts = (posts, parsedHtml) => {
  parsedHtml.querySelectorAll('item').forEach((item) => {
    const title = item.querySelector('title').textContent;
    const link = (item.querySelector('guid').textContent);
    const id = uniqueId();
    const description = item.querySelector('description').innerHTML;
    const obj = {
      title, link, id, description,
    };
    posts.push(obj);
  });
};

const getRss = (state, url) => {
  const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  const urlWithApi = `${alloriginsApi}${url}`;
  return axios.get(urlWithApi)
    .then((response) => {
      if (response.status !== 200) throw new Error('networkError');
      if (response.status === 200) {
        const posts = [];
        const parser = new DOMParser();
        const parsedHtml = parser.parseFromString(response.data.contents, 'text/html');

        if (parsedHtml.querySelector('rss') === undefined || parsedHtml.querySelector('rss') === null) {
          throw new Error('invalidRss');
        }

        const feedsTitle = parsedHtml.querySelector('title').textContent;
        const feedsDescription = parsedHtml.querySelector('description').textContent;
        state.feeds.push({ feedsTitle, feedsDescription });

        extractPosts(posts, parsedHtml);
        return posts;
      }
      return null;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') throw new Error('networkError');
      else throw new Error('invalidRss');
    });
};

export default getRss;
