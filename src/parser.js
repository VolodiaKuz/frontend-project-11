import axios from 'axios';
// app_1  |       - waiting for locator('text=Ресурс не содержит валидный RSS') 

let idGenerator = 1;

const getRss = async (state, url) => {
  const alloriginsApi = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  const urlWithApi = `${alloriginsApi}${url}`;
  await axios.get(urlWithApi)
    .then((response) => {
      console.log('проверка');
      if (response.status !== 200) throw new Error('Ошибка сети');
      if (response.status === 200) {
        // console.log('response  = ', response);
        // console.log('response  = ', response.data);
        // console.log('response  = ', response.data.contents);
        const posts = [];
        // const xmlString = response.data;
        const parser = new DOMParser();
        // const parsedHtml = parser.parseFromString(xmlString, 'text/html');
        const parsedHtml = parser.parseFromString(response.data.contents, 'text/html');
        console.log(parsedHtml);

        const feedsTitle = parsedHtml.querySelector('title').textContent;
        const feedsDescription = parsedHtml.querySelector('description').textContent;
        state.feeds.push({ feedsTitle, feedsDescription });
        console.log(state.feeds);

        if (parsedHtml.querySelector('rss') === undefined || parsedHtml.querySelector('rss') === null) {
          console.log("parsedHtml.querySelector('rss') === null")
          throw new Error('Ресурс не содержит валидный RSS');
        }

        // console.log('parsedHtml', parsedHtml);
        parsedHtml.querySelectorAll('item').forEach((item) => {
          // console.log(item);

          // let title;
          // if (item.querySelector('title').textContent.startsWith('<')) {
          //   [, title] = /<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent);
          //   // console.log('title in if', title);
          // } else title = item.querySelector('title').textContent;

          const title = item.querySelector('title').textContent;
          // console.log('title', title);
          // const link = (item.querySelector('link').nextElementSibling); //  tag guid - wtf ???
          const link = (item.querySelector('guid').textContent);
          const id = idGenerator + 1;
          // const description = /<!--\[CDATA\[(.*?)\]\]-->/g
          // .exec(item.querySelector('description').innerHTML)[1];
          // const description = /<!--\[CDATA\[(.*?)\]\]-->/g.exec(item.querySelector('description').innerHTML);
          const description = item.querySelector('description').innerHTML;
          // console.log('description', description);
          idGenerator += 1;
          const obj = {
            title, link, id, description,
          };
          // console.log(obj);
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

      // if (error === 'Ресурс не содержит валидный RSS') state.errors.push(error);
      // else state.errors.push(error.code);
      // state.errors.push(error);
    });
};

export default getRss;
