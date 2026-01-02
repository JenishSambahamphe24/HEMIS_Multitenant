import { useState, useEffect } from 'react';
import './DocUploader.css';
import { FaRegEye } from "react-icons/fa";

export const StdDocUploader = ({
  label,
  name,
  value,
  onFileChange,
  existingFileUrl,
  maxSize = 5 * 1024 * 1024,
  acceptedTypes = 'image/*,application/pdf',
  ...rest
}) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExistingFile, setIsExistingFile] = useState(false);

  useEffect(() => {
    if (existingFileUrl && typeof value === 'string' && value) {
      setIsExistingFile(true);
      setPreview(existingFileUrl);
      setFileName(value);
      const extension = value.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        setFileType('image');
      } else if (extension === 'pdf') {
        setFileType('application/pdf');
      } else {
        setFileType('file');
      }
    } else if (!value) {
      setPreview(null);
      setFileName('');
      setFileType('');
      setError('');
      setIsExistingFile(false);
    }
  }, [value, existingFileUrl]);



  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setIsExistingFile(false);

    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setFileName(file.name);
    setFileType(file.type);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onFileChange?.(file);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      onFileChange?.(file);
    } else {
      setError('Unsupported file type');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    setFileType('');
    setError('');
    setIsExistingFile(false);
    onFileChange?.(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (fileType.startsWith('image/') || fileType === 'image') {
      return (
        <div className="preview-container">
          <img
            src={preview}
            alt="Preview"
            className="preview-image"
            onError={() => {
              setError('Failed to load image');
              setPreview(null);
            }}
          />
          <button onClick={handleRemove} className="remove-button" type="button">✕</button>
          <div className="file-name">{fileName}</div>
          {isExistingFile && <div className="existing-file-badge">📁 Existing File</div>}
        </div>
      );
    }

    if (fileType === 'application/pdf') {
      return (
        <div className="preview-container">
          <div className="pdf-preview">
            <div className="pdf-icon">📄</div>
            <div className="pdf-info">
              <div className="pdf-title text-sm">PDF Document</div>
            </div>
            <div className='w-full  flex justify-center'>
              <a href={preview} target="_blank" rel="noopener noreferrer" className="view-pdf-button text-white p-[3px] rounded-[50%] bg-[#626364]">
                <FaRegEye />
              </a>
            </div>
          </div>
          <button onClick={handleRemove} className="remove-button" type="button">✕</button>
        </div>
      );
    }

    return (
      <div className="preview-container">
        <div className="file-preview">
          <div className="file-icon">📎</div>
          <div className="file-info">
            <div className="file-title">Document</div>
            <div className="file-filename">{fileName}</div>
            {isExistingFile && <div className="existing-file-badge">📁 Existing File</div>}
          </div>
        </div>
        <button onClick={handleRemove} className="remove-button" type="button">✕</button>
      </div>
    );
  };

  return (
    <div className="uploader-container">
      {label && (
        <label className="uploader-label" htmlFor={`file-upload-${name}`}>
          {label}
        </label>
      )}

      {!preview ? (
        <div
          className={`uploader-area ${isDragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById(`file-upload-${name}`).click()}
        >
          <input
            id={`file-upload-${name}`}
            name={name}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden-input"
            {...rest}
          />
          <div className="uploader-icon">📁</div>
          <div className="uploader-text">Click to upload or drag and drop</div>
          <div className="uploader-subtext">
            Max size: {Math.round(maxSize / 1024 / 1024)}MB
          </div>
        </div>
      ) : (
        renderPreview()
      )}

      {error && <div className="error-message">{error}</div>}

      {preview && (
        <button
          className="change-button"
          onClick={() => document.getElementById(`file-upload-${name}`).click()}
          type="button"
        >
           {isExistingFile ? 'Replace File' : 'Change File'}
        </button>
      )}

      {/* Duplicate hidden input for re-triggering file selection */}
      <input
        id={`file-upload-${name}`}
        name={name}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden-input"
        style={{ display: 'none' }}
        {...rest}
      />
    </div>
  );
};
