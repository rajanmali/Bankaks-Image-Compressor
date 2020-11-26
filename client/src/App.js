import { useState, useEffect } from 'react';
import axiosConfig from './utils/axiosConfig';

import { isFileImage, findReducedResolutions } from './utils/helperFunctions';
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

  const [reducedImageSizeArray, setReducedImagSizeArray] = useState([]);

  useEffect(() => {
    if (selectedFile) {
      findReducedResolutions(selectedFile, 10, 20).then((res) => {
        console.log(res);
        setReducedImagSizeArray([...res]);
      });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    console.log(reducedImageSizeArray);
  }, [reducedImageSizeArray]);

  const handleFileUpload = (event) => {
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
