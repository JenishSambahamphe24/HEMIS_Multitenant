import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TransferInSystem from "./TransferInSystem";
import InFromOutsideSystem from "./InFromOutsideSystem";

const TransferInStudent = () => {
    const [value, setValue] = React.useState(1);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  return (
     <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box  className='flex '>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Graduation Modules"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tab
            label="Transfer-in (System)"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
              color: value === 0 ? "#1976d2" : "#616161",
              "&.Mui-selected": {
                color: "#1976d2",
              },
            }}
          />
          <Tab
            label="Transfer-in (Outside-System)"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
              color: value === 1 ? "#1976d2" : "#616161",
              "&.Mui-selected": {
                color: "#1976d2",
              },
            }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flexGrow: 1 }}>
        {value === 0 && <TransferInSystem value={value} />}
        {value === 1 && <InFromOutsideSystem value={value} />}
      </Box>
    </Box>
  )
}

export default TransferInStudent