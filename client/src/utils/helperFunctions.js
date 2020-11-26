/*  Function to check whether uploaded file is image or not  */
export const isFileImage = (file) => {
  const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type']);
};

/*  Function to find the resolution of current image and find the required resolution aka divided by 10 and 20  */
export const findReducedResolutions = function (file) {
  //Find the arguements passed down by which image size has to be reduced by and add that to array
  const argArray = Array.from(arguments).splice(
    1,
    Array.from(arguments).length
  );

  const _URL = window.URL || window.webkitURL;
  const reducedImgSize = [];

  return new Promise((resolve, reject) => {
    //Create new image object to find original resolution and reduce it
    const img = new Image();
    const objectUrl = _URL.createObjectURL(file);

    //Wait for image to load to find reduced resolution
    img.onload = function () {
      //Loop through argArray to reduce image resolution and store it in an array
      for (let i = 0; i < argArray.length; i++) {
        let tempObj = {};
        //push reduced resolution for width and height in array
        tempObj[`imgSizeW-${i}`] = this.width / argArray[i];
        tempObj[`imgSizeH-${i}`] = this.height / argArray[i];
        reducedImgSize.push(tempObj);
      }
      resolve(reducedImgSize);
      _URL.revokeObjectURL(objectUrl);
    };

    img.onerror = reject;

    img.src = objectUrl;
  });
};
