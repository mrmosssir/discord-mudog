const { default: axios } = require("axios");

function getIdByUrl (url) {
  if (url.indexOf('watch?') < 0 || url.indexOf('v=') < 0) return null;
  return url
    .split('watch?')[1]
    .split('&')
    .find(param => param.indexOf('v=') >= 0)
    .split('v=')[1];
}

async function searchByKeyword (key) {
  const request = encodeURI(`${process.env.YTBASEURL}/?key=${process.env.YTAPIKEY}&part=snippet&maxResult=1&q=${key}`)
  const response = await axios.get(request);
  const video = response.data.items[0];
  return {
    title: video.snippet.title,
    url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
  }
}

async function searchByUrl (url) {
  const id = getIdByUrl(url);
  const request = encodeURI(`${process.env.YTBASEURL}/?key=${process.env.YTAPIKEY}&part=snippet&maxResult=1&id=${id}`);
  const response = await axios.get(request);
  const video = response.data.items[0];
  return {
    title: video.snippet.title,
    url: `https://www.youtube.com/watch?v=${video.id.videoId}`
  }
}

module.exports = {
  getIdByUrl,
  searchByKeyword,
  searchByUrl,
}