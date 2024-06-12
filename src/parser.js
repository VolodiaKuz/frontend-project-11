import axios from 'axios';

let idGenerator = 1;

const getRss = async (state, url) => {
  const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  const urlWithApi = `${alloriginsApi}${url}`;
  return axios.get(urlWithApi)
    .then((response) => {
      console.log('проверка');
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
          // const link = (item.querySelector('link').nextElementSibling); //  tag guid - wtf ???
          const link = (item.querySelector('guid').textContent);
          const id = idGenerator + 1;
          const description = item.querySelector('description').innerHTML;
          idGenerator += 1;
          const obj = {
            title, link, id, description,
          };
          posts.push(obj);
        });
        console.log(posts);
        return posts;
      }
    })
    .then((posts) => {
      posts.forEach((el) => state.posts.push(el));
    })
    .catch((error) => {
      console.log('catch error', error);
      if (error.code === 'ERR_NETWORK') state.errors.push('Ошибка сети');
      else state.errors.push('Ресурс не содержит валидный RSS');
    });
};

export default getRss;
