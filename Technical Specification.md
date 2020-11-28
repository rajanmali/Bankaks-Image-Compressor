# Technical Specifications

### Front Matter

Title: Bankaks Image Compressor

Author: Rajan Mali

Created on: 27th November, 2020

Last updated: 27th November, 2020

### Introduction

A user on the Bankaks mobile platform wants to upload a picture on their profile for which he is allowed to take their picture using their mobile phone. The picture that the phone camera takes is directly uploaded on a Blob storage platform. A typical image captured by a cell-phone camera is 3 to 9 Mb. Over the slow networks, loading such a big image leads to bad UX and affects the user retention on the application. In order to reduce the image load time, an image uploaded by the User should be saved on the cloud in multiple sizes.

### Implementation

The solution is created in Javascript. For the front-end, [ReactJS] is used for the client side logic handling and presentation of the application, [SCSS] for styling our application and finally [Axios] for fetching and posting our data from the backend. The back-end is created using [NodeJS], [Express] and [Multer] for fetching the data files. And finally, all of our data is store on a [Firebase] storage bucket whose data uploading to the bucket is handled by the backend and can be previewed in the front-end once successfully uploaded.

Bakaks Image Compressor uses a number of open source projects to work properly:

- [VS Code] - Awesome text editor created by Microsoft
- [ReactJS] - Popular JS framework from front-end development
- [Axios] - Promise based HTTP client for the front-end
- [SCSS] - A very popular pre-processor CSS framework
- [NodeJS] - Evented I/O for the backend
- [Express] - Fast node.js network app framework [@tjholowaychuk]
- [Google Cloud Storage] - To communicate with the firebase storage bucket and our server
- [Body-parser] - Middleware to parse incoming request bodies in a middleware before your handlers
- [CORS] - Allow cross-origin requests to be handled from our front-end
- [Morgan] - Monitor API calls on the backend for debugging and testing
- [Helmet] - Middleware to add response and request header to our requests
- [Multer] - Middleware for handling multi part form data

### Limitations

- Backend is configured to handle single image request at a time

### License

MIT

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[vs code]: https://code.visualstudio.com/
[reactjs]: https://reactjs.org/
[axios]: https://github.com/axios/axios
[scss]: https://sass-lang.com/
[nodejs]: http://nodejs.org
[express]: http://expressjs.com
[google cloud storage]: https://www.npmjs.com/package/@google-cloud/storage
[body-parser]: https://www.npmjs.com/package/body-parser
[cors]: https://www.npmjs.com/package/cors
[morgan]: https://www.npmjs.com/package/morgan
[helmet]: https://www.npmjs.com/package/helmet
[multer]: https://www.npmjs.com/package/multer
