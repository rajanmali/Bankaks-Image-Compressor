# Installation

Bankaks Image Compressor requires [NodeJS](https://nodejs.org/) v10+ to run.

### Setting Up Firebase Cloud Storage

First, you need a Firebase account with an active project and a storage bucket opened:

- Connect to or create a Firebase account.
- Create a new project.
- Give your project a name.
- Activate or don’t activate Google Analytics, it’s up to you.
- In the left side menu, click on “Storage”, and then on “Start”.
- Location: Choose the bucket location closest to you as you can't change this later.

Now you have your default bucket ready to use. Now that we have our storage bucket, we need to generate a private key that our API will use to connect safely to our bucket:

- In the left side menu, click on the settings wheel at the top.
- Select the “Service accounts” tab.
- At the bottom of the page click on the “Generate new private key” button. This will generate a JSON file containing your Firebase account credentials.
- You’ll get a warning saying that this private key should be kept confidential and in a safe place.

Then, create a file called privateKey.json in the ./server/api/services folder and create a .env file in the ./server folder. And copy the contents of the downloaded private key json file into our new privateKey.json file.

```sh
$ cd api/services && touch privateKey.json
$ cp ./your/downloads/downloadPrivateKey.json ./project/location/server/api/services/privateKey.json
```

### For the back-end:

Install the dependencies and devDependencies and start the server.

```sh
$ cd Bankaks-Image-Compressor
$ cd server
$ npm install
$ npm run dev
```

Create a .env file in the root server filder and configure the following environment variables:

```sh
$ touch .env
```

- NODE_ENV=development
- PORT=1337
- CORS_ORIGIN=http://localhost:3000
- GCLOUD_PROJECT_ID='This is your Firebase project ID. You can find it in your Firebase account > Settings > General settings.'
- GCLOUD_APPLICATION_CREDENTIALS=./api/services/privateKey.json
- GCLOUD_STORAGE_BUCKET_URL='This is the google cloud storage bucket URL. Firebase account > Storage > Files tab (which is the default one) > Just above the stored files list on the left, you have a URL like gs://you-project-id.appspot.com. This is it.'

### For the front-end:

Install the dependencies and devDependencies and start the server.

```sh
$ cd Bankaks-Image-Compressor
$ cd client
$ npm install
$ npm start
```
