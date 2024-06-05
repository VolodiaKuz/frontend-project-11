import axios from 'axios';
import { array } from 'yup';

// const apiUrl = 'https://604781a0efa572c1.mokky.dev/items';
// const apiUrl = 'http://lorem-rss.herokuapp.com/feed';
// const apiUrl = 'http://rss.cnn.com/rss/cnn_topstories.rss';
// const apiUrl = 'https://lorem-rss.hexlet.app/feed';
const apiUrl = 'https://allorigins.hexlet.app/raw?url=https://lorem-rss.hexlet.app/feed';

const getRss = async (state) => {
  await axios.get(apiUrl)
    .then(function (response) {
      const posts2 = [];
      const xmlString = response.data;
      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(xmlString, "text/html");

      parsedHtml.querySelectorAll("item").forEach((item) => {
        posts2.push(/<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent)[1]);
      })
      return posts2;
    })
    .then((arr) => {
      console.log('then((arr) =>', arr)
      // state.posts.concat(arr)
      arr.forEach((el) => state.posts.push(el))
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

export default getRss;
