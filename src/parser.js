// import axios from 'axios';
const axios = require('axios');

const apiUrl = 'http://rss.cnn.com/rss/cnn_topstories.rss';


axios.get(apiUrl)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Всем привет, делаю 3 проект. Подскажите пожалуйста , пытаюсь получть список постов через rss 

