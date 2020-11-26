export const isFileImage = (file) => {
  const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type']);
};
