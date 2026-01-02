

import { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export default function BikramSambatDateInput({
  name,
  value,
  label,
  onChange,
  error,
  helperText,
  variant = "outlined",
  required = false,
  size = "small",
  fullWidth = true,
}) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const bsMonthMaxDays = [31, 32, 31, 32, 31, 30, 30, 31, 30, 30, 30, 30];
  const convertIsoToDisplay = (iso) => {
    if (!iso) return "";
    const [datePart] = iso.split("T");
    return datePart.replace(/-/g, "/");
  };

  useEffect(() => {
    setInputValue(convertIsoToDisplay(value));
  }, [value]);

  const validateBSDate = (dateString) => {
    if (!dateString) {
      return {
        isValid: !required,
        message: required ? "Date is required" : "",
      };
    }

    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(dateString)) {
      return { isValid: false, message: "Format should be YYYY/MM/DD" };
    }

    const parts = dateString.split("/");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (year < 2000 || year > 2099) {
      return { isValid: false, message: "Please enter a valid year" };
    }

    if (month < 1 || month > 12) {
      return { isValid: false, message: "Please enter a valid month" };
    }

    const maxDays = bsMonthMaxDays[month - 1];
    if (day < 1 || day > maxDays) {
      return {
        isValid: false,
        message: `Month ${month} can have maximum ${maxDays} days`,
      };
    }

    return { isValid: true, message: "" };
  };

  const formatToIso = (bsDateString) => {
    const [yyyy, mm, dd] = bsDateString.split("/");
    return `${yyyy}-${mm}-${dd}T00:00:00`;
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value.replace(/[^\d/]/g, "");
    const parts = newValue.split("/");

    if (parts.length > 0) {
      if (parts[0].length > 4) parts[0] = parts[0].substring(0, 4);
      if (parts[0].length === 4 && parts.length === 1) parts.push("");
    }

    if (parts.length > 1) {
      let month = parts[1];
      if (month.length > 2) month = month.substring(0, 2);
      parts[1] = month;
      if (parts.length === 2 && month.length === 2) parts.push("");
    }

    if (parts.length > 2) {
      let day = parts[2];
      if (day.length > 2) day = day.substring(0, 2);
      const monthNum = parseInt(parts[1], 10);
      const maxDays = monthNum >= 1 && monthNum <= 12 ? bsMonthMaxDays[monthNum - 1] : 32;
      if (parseInt(day, 10) > maxDays) day = maxDays.toString();
      parts[2] = day;
    }

    const formattedValue = parts.join("/");

    setInputValue(formattedValue);

    if (formattedValue === "" || /^\d{4}\/\d{2}\/\d{2}$/.test(formattedValue)) {
      const { isValid, message } = validateBSDate(formattedValue);
      setInputError(message);

      if (isValid) {
        const iso = formatToIso(formattedValue);
        onChange(iso);
      } else if (formattedValue === "") {
        onChange("");
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/[^\d]/g, "");

    let formatted = "";
    if (pastedText.length >= 8) {
      const yyyy = pastedText.slice(0, 4);
      const mm = pastedText.slice(4, 6);
      const dd = pastedText.slice(6, 8);
      formatted = `${yyyy}/${mm}/${dd}`;
    }

    setInputValue(formatted);

    if (/^\d{4}\/\d{2}\/\d{2}$/.test(formatted)) {
      const { isValid, message } = validateBSDate(formatted);
      setInputError(message);

      if (isValid) {
        const iso = formatToIso(formatted);
        onChange(iso);
      }
    }
  };

  const handleKeyDown = (e) => {
    const cursorPos = e.target.selectionStart;
    if (
      e.key === "Backspace" &&
      (cursorPos === 5 || cursorPos === 8) &&
      inputValue.charAt(cursorPos - 1) === "/"
    ) {
      e.preventDefault();
      const newValue =
        inputValue.substring(0, cursorPos - 2) + inputValue.substring(cursorPos);
      setInputValue(newValue);

      setTimeout(() => {
        e.target.setSelectionRange(cursorPos - 2, cursorPos - 2);
      }, 0);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setInputError("");
    onChange("");
  };

  return (
    <TextField
      name={name}
      label={label}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      error={!!inputError || !!error}
      helperText={inputError || helperText || ""}
      variant={variant}
      required={required}
      fullWidth={fullWidth}
      size={size}
      placeholder="YYYY/MM/DD"
      inputProps={{ maxLength: 10 }}
      InputProps={{
        endAdornment: inputValue && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} edge="end" size="small">
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiInputBase-root": { fontSize: "16px" },
        "& .MuiFormLabel-root": { fontSize: "14px" },
      }}
    />
  );
}
