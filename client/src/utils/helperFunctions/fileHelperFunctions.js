/*  Function to check for browser compatibility for File API  */
export const checkBrowserFileApiCompatibility = () => {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
    return true;
  }
};

/*  Function to create new File objet from dataURL  */
export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/*  Function that creates new dataURL from input dataURL, width and height  */
export const resizeBase64Img = (dataURL, width, height) => {
  return new Promise((resolve, reject) => {
    //Create new canvas object and image object with new width and height
    var canvas = document.createElement('canvas');
    canvas.style.width = width.toString() + 'px';
    canvas.style.height = height.toString() + 'px';
    let context = canvas.getContext('2d');
    let img = document.createElement('img');
    img.src = dataURL;

    //Once objects have been created, find the dataURL for new image
    img.onload = function () {
      context.scale(width / img.width, height / img.height);
      context.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
};
