/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axiosConfig from './utils/axiosConfig';

import {
  isFileImage,
  updateImageName,
  createNewPreviewImage,
  findReducedResolutions,
} from './utils/helperFunctions/imageHelperFunctions';
import {
  dataURLtoFile,
  resizeBase64Img,
  checkBrowserFileApiCompatibility,
} from './utils/helperFunctions/fileHelperFunctions';

import Header from './components/Header';
import Footer from './components/Footer';
import ImageForm from './components/ImageForm';
import PreviewList from './components/PreviewList';

function App() {
  //Defining states required for the application
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonText, setButtonText] = useState('Select your image first');

  const [reducedImgResolutions, setReducedImgResolutions] = useState([]);
  const [reducedImageFiles, setReducedImageFiles] = useState([]);
  const [previewList, setPreviewList] = useState([]);

  //Defining DOM elements to be used
  const imageWrapper = document.getElementById('image-wrapper');
  const existingImages = document.getElementsByName('images[resized]');

  useEffect(() => {
    // Check for browser compatibility with File API
    setIsDisabled(checkBrowserFileApiCompatibility());

    // Remove existing preview images if any
    removeExistingPreviewImages();
  }, []);

  useEffect(() => {
    // Check if file is selected and call function to find reduced resolution
    if (selectedFile) {
      findReducedResolutions(selectedFile, 10, 20).then((res) => {
        // Once reduced resolutions have been found, add then to the array
        setReducedImgResolutions([...res]);
      });

      //Create new FileReader object for initially uploaded image
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    // Create new image objects for the uploaded image with reduced resolutions
    reducedImgResolutions.forEach((resolution, index) => {
      // Set new width and height to be used
      const width = resolution[`imgSizeW-${index}`];
      const height = resolution[`imgSizeH-${index}`];

      // Create new FileReader object to extract dataURL and create reduced resolution File Objects
      let dataReader = new FileReader();
      dataReader.readAsDataURL(selectedFile);

      // Wait for FileReader object to get loaded
      dataReader.onloadend = () => {
        // Extract dataURl from FileReader object
        const dataURL = dataReader.result;

        // Create preview image and append it to the image wrapper div
        const previewImage = createNewPreviewImage(dataURL, width, height);
        imageWrapper.appendChild(previewImage);

        // Create new dataURL with reduced image resolution
        resizeBase64Img(dataURL, width, height).then((reducedDataURL) => {
          // Set new file name for each reduced image
          const newFileName = updateImageName(fileName, width, height);

          // Convert dataReader result into File object
          const reducedImageFile = dataURLtoFile(reducedDataURL, newFileName);

          // Push new File object to image file array
          const newReducedImageFiles = reducedImageFiles;
          newReducedImageFiles.push(reducedImageFile);
          setReducedImageFiles([...newReducedImageFiles]);
        });
      };
    });
  }, [reducedImgResolutions]);

  /*  Function to remove all preview images */
  const removeExistingPreviewImages = () => {
    /*  It's a live list so removing the first element each time until 
    eventually all the elements in the parent element get removed */
    while (existingImages.length > 0) {
      imageWrapper.removeChild(existingImages[0]);
    }
  };

  /* Function that gets triggered when a file is selected */
  const handleFileUpload = (event) => {
    //R emove existing preview images for each new image selection
    removeExistingPreviewImages();

    if (event.target.files[0] && isFileImage(event.target.files[0])) {
      // Push uploaded image to reduced image files array
      const tempReducedImageFiles = reducedImageFiles;
      tempReducedImageFiles.push(event.target.files[0]);
      setReducedImageFiles([...tempReducedImageFiles]);

      // Reset preview list for each new selection
      setPreviewList([]);

      // Update states for application UI
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
      setIsDisabled(false); // Enabling upload button
      setButtonText("Let's upload this!");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true); // Update states for application UI
    setIsDisabled(true); // Update states for application UI
    setButtonText("Wait we're uploading your image..."); // Update states for application UI
    try {
      // Check for reduced image files
      if (selectedFile !== '' && reducedImageFiles.length === 3) {
        setIsLoading(false); // Update states for application UI
        setIsSuccess(true); // Update states for application UI

        reducedImageFiles.forEach((imageFile) => {
          // Creating a FormData object
          let fileData = new FormData();

          // Adding the 'image' field and the selected file as value to our FormData object
          // Changing file name to make it unique and avoid potential later overrides
          fileData.set('image', imageFile, `${Date.now()}__${imageFile.name}`);

          // Call on backend API to upload image
          axiosConfig({
            method: 'post',
            url: '/api/file-upload',
            data: fileData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then(({ data: { fileLocation } }) => {
            // Once the image has been uploaded to the cloud storage, retrieve link to the image and add it to preview list
            const newPreviewList = previewList;
            newPreviewList.push(fileLocation);
            setPreviewList([...newPreviewList]);
          });
        });

        // Reset to default values after 3 seconds
        setTimeout(() => {
          removeExistingPreviewImages(); // Update states for application UI
          setSelectedFile(null); // Update states for application UI
          setPreview(null); // Update states for application UI
          setIsSuccess(false); // Update states for application UI
          setFileName(null); // Update states for application UI
          setButtonText('Select your image first'); // Update states for application UI
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false); // Update states for application UI
      setIsError(true); // Update states for application UI
      setFileName(null); // Update states for application UI
      setSelectedFile(null); // Update states for application UI
      setPreview(null); // Update states for application UI
      setButtonText('Your image could not be uploaded'); // Update states for application UI

      // Reset to default values after 3 seconds
      setTimeout(() => {
        setIsError(false); // Update states for application UI
        setButtonText('Select your image first'); // Update states for application UI
      }, 3000);
    }
  };

  return (
    <div className="App App-header">
      <Header />
      <div id="image-wrapper"></div>
      {previewList.length > 0 && <PreviewList previewList={previewList} />}
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
