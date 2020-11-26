import PropTypes from 'prop-types';
import Spinner from './Spinner';

const ImageForm = ({
  isLoading,
  isError,
  isSuccess,
  preview,
  fileName,
  isDisabled,
  buttonText,
  handleFileUpload,
  handleSubmit,
}) => {
  return (
    <main>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label className="uploader">
          <div className="upload-space">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {isError || isSuccess ? (
                  <i className={`icon-${isSuccess ? 'success' : 'error'}`}></i>
                ) : (
                  <>
                    {preview ? (
                      <div className="preview">
                        <img
                          src={preview}
                          alt="Preview of the file to be uploaded"
                        />
                      </div>
                    ) : (
                      <i className="icon-upload"></i>
                    )}
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </>
                )}
              </>
            )}
          </div>
          {isError || isSuccess ? (
            <p className={isSuccess ? 'success' : 'error'}>
              {isSuccess ? 'Upload successful!' : 'Something went wrong ...'}
            </p>
          ) : (
            <p className="filename">
              {fileName ? fileName : 'No file selected yet'}
            </p>
          )}
        </label>

        <button
          type="submit"
          className="btn"
          disabled={isDisabled}
          tabIndex={0}
        >
          {buttonText}
        </button>
      </form>
    </main>
  );
};

ImageForm.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  isSuccess: PropTypes.bool,
  isDisabled: PropTypes.bool,
  preview: PropTypes.string,
  fileName: PropTypes.string,
  buttonText: PropTypes.string,
  handleFileUpload: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default ImageForm;
