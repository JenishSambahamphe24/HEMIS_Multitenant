import React, { useRef, useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function FileUploader({
    onFileChange,
    name,
    placeHolder = 'Drag and drop a file here or click to upload',
    required = false,
}) {
    const [file, setFile] = useState(null); 
    const inputRef = useRef(null);
    const { setNodeRef } = useDroppable({ id: 'droppable' });

    const isAcceptedFileType = (file) => {
        const acceptedTypes = [
            'application/pdf',
        ];
        return file && acceptedTypes.includes(file.type);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (isAcceptedFileType(droppedFile)) {
            setFile(droppedFile);
            if (onFileChange) onFileChange(droppedFile);
        }
    };

    const handleInputChange = (event) => {
        const selectedFile = event.target.files[0];
        if (isAcceptedFileType(selectedFile)) {
            setFile(selectedFile);
            if (onFileChange) onFileChange(selectedFile);
        }
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (onFileChange) onFileChange(null);
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
                        {file ? file.name : placeHolder}
                        {required && <span style={{ color: 'red', marginLeft: '5px' }}>*</span>}
                    </span>
                </div>
            </DndContext>
            <input
                name={name}
                ref={inputRef}
                type="file"
                accept=".pdf"
                onChange={handleInputChange}
                style={{ display: 'none' }}
                required={required}
            />
            {file && (
                <div
                    className="relative mt-1 bg-gray-400 p-2 rounded-md inline-flex items-center"
                    style={{ paddingRight: '50px' }}
                >
                    <p className="text-sm tracking-wide">{file.name}</p>
                    <IconButton
                        size="small"
                        onClick={handleRemoveFile}
                        style={{
                            position: 'absolute',
                            top: '3px',
                            right: '3px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
            )}
        </div>
    );
}

export default FileUploader;
