import { printPosts } from './render.js';

let delay = 5000;

let timerId = setTimeout(async function request() {
  const newPosts = [];
  const existPostsTitles = state.posts.map((post) => post.title)
  const alloriginsApi = 'https://allorigins.hexlet.app/raw?url=';
  const url = state.rss[0];
  // const updateTime = '?unit=second&interval=2+length=3';
  const updateTime = '?length=2';
  const urlWithApi = `${alloriginsApi}${url}${updateTime}`;
  await axios.get(urlWithApi)
    .then(function (response) {
      if (response.status === 200) {
        const xmlString = response.data;
        const parser = new DOMParser();
        const parsedHtml = parser.parseFromString(xmlString, "text/html");
        // console.log('parsedHtml', parsedHtml);
        // console.log('parsedHtml.querySelectorAll("item")', parsedHtml.querySelectorAll("item"));
        parsedHtml.querySelectorAll("item").forEach((item) => {
          console.log(item);
          const title = /<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent)[1];
          if (!existPostsTitles.includes(title)) {
            console.log('new title', title);
            const link = (item.querySelector('guid').textContent);
            const description = /<!--\[CDATA\[(.*?)\]\]-->/g.exec(item.querySelector('description').innerHTML)[1];
            const obj = { title, link, description }
            console.log(obj);
            newPosts.push(obj);
          }
        })
        return newPosts;
      }
    })
    .then((posts) => {
      console.log('new posts - ', posts);
      console.log('state.posts before concat', state.posts);
      printPosts(posts);
      // state.posts.concat(posts);
      posts.forEach((el) => state.posts.push(el))
      console.log('state.posts after concat', state.posts);
      // posts.forEach((el) => state.posts.push(el))  
    })
    .catch((error) => {
      console.log('catch error', error)
      // state.errors.push(error.code)
    })
  timerId = setTimeout(request, delay);
}, delay);

export default timerId;