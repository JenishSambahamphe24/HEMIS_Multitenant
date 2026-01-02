import { useState } from "react";

const useFileSizeLimit = (maxSizeMB) => {
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFileSize = (file) => {
    if (file) {
      if (file.size > maxSizeBytes) {
        setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        setIsValid(false);
      } else {
        setError("");
        setIsValid(true);
      }
    }
  };

  return {
    isValid,
    error,
    validateFileSize,
  };
};

export default useFileSizeLimit;
