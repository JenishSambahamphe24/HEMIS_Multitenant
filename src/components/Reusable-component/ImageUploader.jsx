import React, { useRef, useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';
import { MdOutlineDeleteForever } from "react-icons/md";

function ImageUploader({ allowMultiple = true, onImagesChange, name, placeholder, required }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null); 
  const inputRef = useRef(null);
  const { setNodeRef } = useDroppable({ id: 'droppable' });

  const handleDrop = (event) => {
    event.preventDefault();
    setUploading(true);
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newImages = allowMultiple ? [...images, ...droppedFiles] : [droppedFiles[0]];
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
    setUploading(false);
  };

  const handleInputChange = (event) => {
    setUploading(true);
    const selectedImages = Array.from(event.target.files);
    const newImages = allowMultiple ? [...images, ...selectedImages] : [selectedImages[0]];
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
    setUploading(false);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
  };

  return (
    <div>
      <DndContext>
        <div
          ref={setNodeRef}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onClick={handleClick}
          style={{
            border: '2px dashed #635b5d',
            padding: '5px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          <span style={{ color: '#635b5d' }}>
            {placeholder || 'Drag & Drop images here or click to upload'}
            {required && <span style={{ color: 'red', marginLeft: '5px' }}>*</span>}
          </span>
        </div>
      </DndContext>
      <input
        name={name}
        ref={inputRef}
        type="file"
        multiple={allowMultiple}
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        required={required}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              width: '60px',
              height: '60px',
              transition: 'opacity 0.3s ease',
              opacity: hoveredImageIndex === index ? 0.9 : 1,
            }}
            onMouseEnter={() => setHoveredImageIndex(index)}
            onMouseLeave={() => setHoveredImageIndex(null)}
          >
            <img
              src={URL.createObjectURL(image)}
              alt={`preview ${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'opacity 0.3s ease', 
                opacity: hoveredImageIndex === index ? 0.9 : 1,
              }}
            />
            {hoveredImageIndex === index && ( 
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: 'absolute',
                  top: '22%',
                  right: '22%',
                  backgroundColor: '#e2e4e8',
                  opacity:'.6'
                }}
              >
                <MdOutlineDeleteForever style={{fontSize:'25px', color:'red'}} />
              </IconButton>
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default ImageUploader;