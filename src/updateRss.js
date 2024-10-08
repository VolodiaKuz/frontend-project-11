import axios from 'axios';

const updateDelay = 5000;

const parseResponse = (response, existPostsTitles) => {
  const newPosts = [];
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

const updateRss = (watchedState) => {
  const existPostsTitles = watchedState.posts.map((post) => post.title);
  const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  watchedState.rss.forEach((url) => {
    const urlWithApi = `${alloriginsApi}${url}`;
    axios.get(urlWithApi)
      .then((response) => parseResponse(response, existPostsTitles))
      .then((posts) => {
        if (posts.length !== 0) watchedState.posts.push(...posts);
      })
      .catch((error) => {
        watchedState.form.errors = error.message;
      });
  });
  setTimeout(updateRss, updateDelay, watchedState);
};

export default updateRss;
