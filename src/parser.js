import axios from 'axios';

let idGenerator = 1;

const getRss = async (state, url) => {
  const alloriginsApi = 'https://allorigins.hexlet.app/raw?url=';
  const urlWithApi = `${alloriginsApi}${url}`
  await axios.get(urlWithApi)
    .then(function (response) {
      if (response.status !== 200) state.errors.push(response.status);
      if (response.status === 200) {
        console.log('response status = ', response.status);
        const posts = [];
        const xmlString = response.data;
        const parser = new DOMParser();
        const parsedHtml = parser.parseFromString(xmlString, "text/html");
        console.log('parsedHtml', parsedHtml);
        parsedHtml.querySelectorAll("item").forEach((item) => {
          const title = /<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent)[1];
          // const link = (item.querySelector('link').nextElementSibling); //  tag guid - wtf ???
          const link = (item.querySelector('guid').textContent);
          const id = idGenerator + 1;
          const description = /<!--\[CDATA\[(.*?)\]\]-->/g.exec(item.querySelector('description').innerHTML)[1];
          // const description = item.querySelector('description').innerHTML;
          // console.log(description);
          idGenerator += 1;
          const obj = { title, link, id, description }
          // console.log(obj);
          posts.push(obj);
        })
        return posts;
      }
    })
    .then((posts) => {
      posts.forEach((el) => state.posts.push(el))
    })
    .catch(function (error) {
      // handle error
      console.log('catch error', error);
    });
}

export default getRss;
