import { useState, useEffect } from 'react';
import axiosConfig from './utils/axiosConfig';

import {
  isFileImage,
  findReducedResolutions,
  getBlobUrl,
  // resizeImageWithResolution,
  checkBrowserFileApiCompatibility,
} from './utils/helperFunctions';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageForm from './components/ImageForm';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonText, setButtonText] = useState('Select your image first');

  const [reducedImgResolutions, setReducedImgResolutions] = useState([]);
  // const [reducedImages, setReducedImage] = useState([]);

  const imageWrapper = document.getElementById('image-wrapper');
  const existingImages = document.getElementsByName('images[resized]');

  useEffect(() => {
    //Check for browser compatibility with File API
    setIsDisabled(checkBrowserFileApiCompatibility());
    removeExistingImages();
  }, []);

  useEffect(() => {
    //Check if file is selected and call function to find reduced resolution
    if (selectedFile) {
      console.log(selectedFile);
      findReducedResolutions(selectedFile, 10, 20).then((res) => {
        setReducedImgResolutions([...res]);
      });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    reducedImgResolutions.forEach((resolution, index) => {
      const width = resolution[`imgSizeW-${index}`];
      const height = resolution[`imgSizeH-${index}`];

      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);

      reader.onload = function (event) {
        const blobURL = getBlobUrl(event);
        const image = new Image();
        image.src = blobURL;
        image.width = width;
        image.height = height;
        image.name = 'images[resized]';

        // const resizedImage = resizeImageWithResolution(
        //   image,
        //   blobURL,
        //   imageWrapper,
        //   width,
        //   height
        // );

        imageWrapper.appendChild(image);
      };
    });
  }, [reducedImgResolutions]);

  const removeExistingImages = () => {
    while (existingImages.length > 0) {
      /*  It's a live list so removing the first element each time
      until eventually all the elements in the parent element get removed */
      imageWrapper.removeChild(existingImages[0]);
    }
  };

  const handleFileUpload = (event) => {
    removeExistingImages();
    if (event.target.files[0] && isFileImage(event.target.files[0])) {
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
      setIsDisabled(false); // Enabling upload button
      setButtonText("Let's upload this!");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);
    setButtonText("Wait we're uploading your image...");
    try {
      if (selectedFile !== '') {
        // Creating a FormData object
        let fileData = new FormData();

        // Adding the 'image' field and the selected file as value to our FormData object
        // Changing file name to make it unique and avoid potential later overrides
        fileData.set(
          'image',
          selectedFile,
          `${Date.now()}-${selectedFile.name}`
        );

        await axiosConfig({
          method: 'post',
          url: '/api/file-upload',
          data: fileData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setIsLoading(false);
        setIsSuccess(true);

        // Reset to default values after 3 seconds
        setTimeout(() => {
          setSelectedFile(null);
          setPreview(null);
          setIsSuccess(false);
          setFileName(null);
          setButtonText('Select your image first');
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setFileName(null);
      setSelectedFile(null);
      setPreview(null);
      setButtonText('Your image could not be uploaded');

      setTimeout(() => {
        setIsError(false);
        setButtonText('Select your image first');
      }, 3000);
    }
  };

  return (
    <div className="App App-header">
      <Header />
      <div id="image-wrapper"></div>
      <ImageForm
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        preview={preview}
        fileName={fileName}
        isDisabled={isDisabled}
        buttonText={buttonText}
        handleFileUpload={handleFileUpload}
        handleSubmit={handleSubmit}
      />
      <Footer />
    </div>
  );
}

export default App;
