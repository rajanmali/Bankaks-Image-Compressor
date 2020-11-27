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
  const [reducedImageFiles, setReducedImageFiles] = useState([]);
  const [previewList, setPreviewList] = useState([]);

  const imageWrapper = document.getElementById('image-wrapper');
  const existingImages = document.getElementsByName('images[resized]');

  useEffect(() => {
    //Check for browser compatibility with File API
    setIsDisabled(checkBrowserFileApiCompatibility());
    removeExistingPreviewImages();
  }, []);

  useEffect(() => {
    //Check if file is selected and call function to find reduced resolution
    if (selectedFile) {
      findReducedResolutions(selectedFile, 10, 20).then((res) => {
        setReducedImgResolutions([...res]);
      });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    //Create new image objects for the uploaded image with reduced resolutions
    reducedImgResolutions.forEach((resolution, index) => {
      const width = resolution[`imgSizeW-${index}`];
      const height = resolution[`imgSizeH-${index}`];

      let blobReader = new FileReader();
      let dataReader = new FileReader();
      blobReader.readAsArrayBuffer(selectedFile);
      dataReader.readAsDataURL(selectedFile);

      dataReader.onloadend = () => {
        const dataURL = dataReader.result;

        //Create preview image and append it to the image wrapper div
        const previewImage = createNewPreviewImage(dataURL, width, height);
        imageWrapper.appendChild(previewImage);

        //Create new dataURL with reduced image resolution
        resizeBase64Img(dataURL, width, height).then((reducedDataURL) => {
          //Set new file name for each reduced image
          const newFileName = updateImageName(fileName, width, height);

          //Convert dataReader result into File object
          const reducedImageFile = dataURLtoFile(reducedDataURL, newFileName);

          //Push new File object to image file array
          const newReducedImageFiles = reducedImageFiles;
          newReducedImageFiles.push(reducedImageFile);
          setReducedImageFiles([...newReducedImageFiles]);
        });
      };
    });
  }, [reducedImgResolutions]);

  const removeExistingPreviewImages = () => {
    while (existingImages.length > 0) {
      /*  It's a live list so removing the first element each time
      until eventually all the elements in the parent element get removed */
      imageWrapper.removeChild(existingImages[0]);
    }
  };

  const handleFileUpload = (event) => {
    //Remove existing preview images for each new image selection
    removeExistingPreviewImages();
    if (event.target.files[0] && isFileImage(event.target.files[0])) {
      //Push uploaded image to reduced image files array
      const tempReducedImageFiles = reducedImageFiles;
      tempReducedImageFiles.push(event.target.files[0]);
      setReducedImageFiles([...tempReducedImageFiles]);

      //Reset preview list
      setPreviewList([]);

      //Update states for application UI
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
      setIsDisabled(false); // Enabling upload button
      setButtonText("Let's upload this!");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //Update states for application UI
    setIsLoading(true);
    setIsDisabled(true);
    setButtonText("Wait we're uploading your image...");
    try {
      //Check for reduced image files
      if (selectedFile !== '' && reducedImageFiles.length === 3) {
        setIsLoading(false);
        setIsSuccess(true);

        reducedImageFiles.forEach((imageFile) => {
          // Creating a FormData object
          let fileData = new FormData();

          // Adding the 'image' field and the selected file as value to our FormData object
          // Changing file name to make it unique and avoid potential later overrides
          fileData.set('image', imageFile, `${Date.now()}__${imageFile.name}`);

          axiosConfig({
            method: 'post',
            url: '/api/file-upload',
            data: fileData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then(({ data: { fileLocation } }) => {
            const newPreviewList = previewList;
            newPreviewList.push(fileLocation);
            setPreviewList([...newPreviewList]);
          });

          // await axiosConfig({
          //   method: 'post',
          //   url: '/api/file-upload',
          //   data: fileData,
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //   },
          // });
        });

        // Reset to default values after 3 seconds
        setTimeout(() => {
          removeExistingPreviewImages();
          setSelectedFile(null);
          setPreview(null);
          setIsSuccess(false);
          setFileName(null);
          setButtonText('Select your image first');
        }, 3000);
      }
    } catch (error) {
      //Update states for application UI
      setIsLoading(false);
      setIsError(true);
      setFileName(null);
      setSelectedFile(null);
      setPreview(null);
      setButtonText('Your image could not be uploaded');

      // Reset to default values after 3 seconds
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
      {previewList.length > 0 &&
        previewList.map((previewLink) => (
          <button>
            <a
              key={JSON.stringify(previewLink)}
              href={previewLink}
              target="_blank"
              rel="noreferrer"
            >
              Preview Image
            </a>
          </button>
        ))}
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
