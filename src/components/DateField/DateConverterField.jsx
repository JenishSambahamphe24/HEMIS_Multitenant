import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

function DateInputField({
  name,
  label,
  variant,
  control,
  rules,
  format = "YYYY/MM/DD",
  error,
  helperText,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <DateField
              required
              size="small"
              label={label}
              fullWidth
              variant={variant}
              name={name}
              value={value ? dayjs(value, format) : null}
              onChange={(newValue) => {
                const formattedValue = newValue ? newValue.format(format) : "";
                onChange(formattedValue);
              }}
              format={format}
              error={!!error}
              sx={{
                "& .MuiInputBase-root-MuiInput-root": {
                  fontSize: "12px",
                },
                "& .MuiFormLabel-root.Mui-error": {
                  color: "inherit",
                },
                "& .MuiInputBase-root.Mui-error:before": {
                  borderColor: "red",
                },
                "& .MuiInputBase-root.Mui-error:after": {
                  borderColor: "red",
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
      {helperText && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {helperText}
        </div>
      )}
    </div>
  );
}

export default DateInputField;
