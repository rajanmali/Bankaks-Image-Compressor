// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://localhost:1337'
      : 'https://bankaks-image-compressor.rajanmali.vercel.app',
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Authorization'] = process.env.AUTH_TOKEN;

export default instance;
