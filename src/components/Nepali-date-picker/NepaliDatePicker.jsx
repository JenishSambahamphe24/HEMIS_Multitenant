import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

function NepaliDatePicker({
  required,
  label,
  name,
  width = "100%",
  onDateChange = () => { },
  variant = "outlined",
  shrink = true,
  placeholder = "YYYY/MM/DD",
  value = "",
}) {
  const inputRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadCSS = (href, id) => {
      return new Promise((resolve) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = href;
        link.onload = resolve;
        document.head.appendChild(link);
      });
    };

    const loadResources = async () => {
      try {
        await loadCSS(
          "/NepaliDatePicker/nepali.datepicker.v4.0.5.min.css",
          "nepali-datepicker-css"
        );
        await loadScript(
          "/NepaliDatePicker/nepali.datepicker.v4.0.5.min.js",
          "nepali-datepicker-script"
        );
        setTimeout(() => setIsInitialized(true), 300);
      } catch (error) {
        console.error("Failed to load Nepali date picker resources:", error);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    if (!isInitialized || !inputRef.current) return;

    try {
      $(inputRef.current).nepaliDatePicker("destroy");
    } catch (e) {
      console.error("Error destroying existing date picker:", e);
    }

    try {
      $(inputRef.current).nepaliDatePicker({
        ndpYear: true,
        ndpMonth: true,
        ndpYearCount: 50,
        onChange: function (selectedDate) {
          if (selectedDate && selectedDate.bs) {
            setInternalValue(selectedDate.bs);
            onDateChange(name, selectedDate.bs);
          }
        },
      });

      if (value) {
        $(inputRef.current).nepaliDatePicker("setDate", value);
      }
    } catch (e) {
      console.error("Error initializing Nepali date picker:", e);
    }

    return () => {
      try {
        $(inputRef.current).nepaliDatePicker("destroy");
      } catch (e) {
        console.error("Error cleaning up date picker:", e);
      }
    };
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized || !inputRef.current || value === internalValue) return;

    try {
      $(inputRef.current).nepaliDatePicker("setDate", value);
      setInternalValue(value);
    } catch (e) {
      console.error("Error updating date value:", e);
    }
  }, [value]);

  // Simplified handleClick - just focus, let the datepicker handle the rest
  const handleClick = () => {
    if (!isInitialized || !inputRef.current) return;
    inputRef.current.focus();
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(newValue))
      onDateChange(name, newValue);
  };

  return (
    <div style={{ width }}>
      <TextField
        size="small"
        required={required}
        variant={variant}
        fullWidth
        inputRef={inputRef}
        name={name}
        value={internalValue}
        label={label}
        placeholder={placeholder}
        InputLabelProps={{
          shrink, 
          required, 
        }}
        onClick={handleClick}
        onFocus={handleClick}
        onChange={handleChange}
        inputProps={{
          autoComplete: "off",
          "data-nepali-datepicker": true,
          style: { cursor: "pointer" },
        }}
      />
    </div>
  );
}

export default NepaliDatePicker;
