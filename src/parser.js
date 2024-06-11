import axios from 'axios';

let idGenerator = 1;

const getRss = async (state, url) => {
  const alloriginsApi = 'https://allorigins.hexlet.app/get?url=';
  const urlWithApi = `${alloriginsApi}${url}`;
  await axios.get(urlWithApi)
    .then((response) => {
      // if (response.status !== 200) state.errors.push(response.status);
      if (response.status === 200) {
        console.log('response  = ', response);
        console.log('response  = ', response.data);
        console.log('response  = ', response.data.contents);
        const posts = [];
        // const xmlString = response.data;
        const parser = new DOMParser();
        // const parsedHtml = parser.parseFromString(xmlString, 'text/html');
        const parsedHtml = parser.parseFromString(response.data.contents, 'text/html');
        console.log('parsedHtml', parsedHtml);
        parsedHtml.querySelectorAll('item').forEach((item) => {
          // console.log(item);
          let title;
          if (item.querySelector('title').textContent.startsWith('<')) {
            [, title] = /<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent);
            // console.log('title in if', title);
          } else title = item.querySelector('title').textContent;
          // console.log('title', title);
          // const link = (item.querySelector('link').nextElementSibling); //  tag guid - wtf ???
          const link = (item.querySelector('guid').textContent);
          const id = idGenerator + 1;
          // const description = /<!--\[CDATA\[(.*?)\]\]-->/g
          // .exec(item.querySelector('description').innerHTML)[1];
          const description = /<!--\[CDATA\[(.*?)\]\]-->/g.exec(item.querySelector('description').innerHTML);
          // console.log('description', description);
          idGenerator += 1;
          const obj = {
            title, link, id, description,
          };
          // console.log(obj);
          posts.push(obj);
        });
        return posts;
      }
    })
    .then((posts) => {
      posts.forEach((el) => state.posts.push(el));
    })
    .catch((error) => {
      console.log('catch error', error);
      state.errors.push(error.code);
    });
};

export default getRss;
