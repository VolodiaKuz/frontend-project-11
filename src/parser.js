import axios from 'axios';

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
        parsedHtml.querySelectorAll("item").forEach((item) => {
          posts.push(/<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent)[1]);
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
