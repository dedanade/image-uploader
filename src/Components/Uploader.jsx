import React, { useState, Fragment, useRef, useEffect } from 'react';
import { ReactComponent as DRAG_IMAGE } from '../drag_drop_image.svg';

function Uploader(props) {
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const chooseFile = useRef(null);
  const dropRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    let div = dropRef.current;
    if (div) {
      div.addEventListener('dragenter', handleDragIn);
      div.addEventListener('dragleave', handleDragOut);
      div.addEventListener('dragover', handleDrag);
      div.addEventListener('drop', handleDrop);
    }
  }, []);

  const handleDragIn = (e) => {
    e.preventDefault();
  };
  const handleDragOut = (e) => {
    e.preventDefault();
  };
  const handleDrag = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleImageUploading(e);
  };

  const handleOpenFile = () => {
    chooseFile.current.click();
  };

  const handleImageUploading = (e) => {
    let imageFile;
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      imageFile = e.dataTransfer.files[0];
    } else if (e.target && e.target.files.length > 0) {
      imageFile = e.target.files[0];
    } else {
      alert('Unable to Upload Image. Try again');
    }
    setLoading(true);
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', 'pmnbpvw0');
    data.append('cloud_name', 'dedan-test');
    fetch('https://api.cloudinary.com/v1_1/dedan-test/upload', {
      method: 'post',
      body: data,
    })
      .then((resp) => resp.json())
      .then(async (data) => {
        if (data.error) {
          console.log(data);
          setLoading(false);
          alert('error');
        } else {
          setImageUrl(data.secure_url);
          setLoading(false);
          setUploadImage(false);
        }
      });
  };

  const copyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand('copy');
  };
  if (loading)
    return (
      <div className='uploader-container'>
        <div className='loading-card'>
          <p className='loading__header'>Uploading...</p>
          <div className='loading__animation'></div>
        </div>
      </div>
    );

  return (
    <Fragment>
      <input
        ref={chooseFile}
        id='chooseFIle'
        type='file'
        accept='image/*'
        style={{ display: 'none' }}
        onChange={(e) => handleImageUploading(e)}
      />
      <div className='uploader-container'>
        {uploadImage ? (
          <div className='uploader-card'>
            <p className='upload-image__header'>Upload your Image</p>
            <p className='upload-image__sub-header'>
              File should be Jpeg, Png,...
            </p>
            <div ref={dropRef} className='drag-drop__box'>
              <div className='drag-drop__image'>
                <DRAG_IMAGE />
              </div>
              <p className='drag-drop__text'>Drag & Drop your image here</p>
            </div>
            <p className='uploader-text__or'>Or</p>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => handleOpenFile()} className='btn'>
                Choose a file
              </button>
            </div>
          </div>
        ) : (
          <div className='uploader-card success-card'>
            <div style={{ textAlign: 'center' }}>
              <i className='fa fa-check-circle'></i>
            </div>
            <p className='success__header'>Upload Succesfully</p>
            <div className='success__img-card'>
              <img src={imageUrl} alt='Uploaded' />
            </div>
            <div className='clipboard-card'>
              <textarea
                ref={textAreaRef}
                className='clipboard-textarea'
                type='text'
                value={imageUrl || ''}
                readOnly
              />
              <button
                onClick={() => copyToClipboard()}
                data-title='Click to copy'
                className='btn clipboard-btn'
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Uploader;
