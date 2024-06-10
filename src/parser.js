import axios from 'axios';

let idGenerator = 1;

const getRss = async (state, url) => {
  const alloriginsApi = 'https://allorigins.hexlet.app/raw?url=';
  const urlWithApi = `${alloriginsApi}${url}`
  await axios.get(urlWithApi)
    .then(function (response) {
      // if (response.status !== 200) state.errors.push(response.status);
      if (response.status === 200) {
        // console.log('response status = ', response.status);
        const posts = [];
        const xmlString = response.data;
        const parser = new DOMParser();
        const parsedHtml = parser.parseFromString(xmlString, "text/html");
        // console.log('parsedHtml', parsedHtml);
        // console.log('parsedHtml.querySelectorAll("item")', parsedHtml.querySelectorAll("item").length);
        parsedHtml.querySelectorAll("item").forEach((item) => {
          // console.log(item);
          let title;
          if (item.querySelector('title').textContent.startsWith('<')) {
            title = /<!\[CDATA\[(.*?)\]\]>/g.exec(item.querySelector('title').textContent)[1];
            // console.log('title in if', title);
          } else title = item.querySelector('title').textContent;
          // console.log('title', title);
          // const link = (item.querySelector('link').nextElementSibling); //  tag guid - wtf ???
          const link = (item.querySelector('guid').textContent);
          const id = idGenerator + 1;
          // console.log(/<!--\[CDATA\[(.*?)\]\]-->/g.exec(item.querySelector('description').innerHTML));
          // const description = /<!--\[CDATA\[(.*?)\]\]-->/g.exec(item.querySelector('description').innerHTML)[1];
          const description = /<!--\[CDATA\[(.*?)\]\]-->/g.exec(item.querySelector('description').innerHTML);
          // console.log('description', description);
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
    .catch((error) => {
      console.log('catch error', error)
      state.errors.push(error.code)
    })
  // .then((error) => state.errors.push(error)
  // )
}

export default getRss;


{/* <description><!--[CDATA[While Pakistan celebrates onion export success, local consumers face soaring prices and financial strain.]]--></description> */ }

{/* <description><!--[CDATA[The Israeli government is under pressure to secure the release of captives held in Gaza.]]--></description> */ }