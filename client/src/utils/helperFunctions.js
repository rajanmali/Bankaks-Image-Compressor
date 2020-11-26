export const checkBrowserFileApiCompatibility = () => {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
    return true;
  }
};

/*  Function to check whether uploaded file is image or not  */
export const isFileImage = (file) => {
  const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  return (
    file &&
    acceptedImageTypes.includes(file['type']) &&
    /image/i.test(file.type)
  );
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

export const getBlobUrl = (event) => {
  let blob = new Blob([event.target.result]); // Create blob from reader
  window.URL = window.URL || window.webkitURL;
  return window.URL.createObjectURL(blob); // and get it's URL
};

export const resizeImageWithResolution = (
  image,
  canvasWrapper,
  width,
  height
) => {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  canvasWrapper.appendChild(canvas); // do the actual resized preview

  return canvas.toDataURL('image/jpeg', 0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)
};
