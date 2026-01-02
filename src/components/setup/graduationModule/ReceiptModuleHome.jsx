import React from 'react'
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import StudentListForDropout from './StudentListForReceipt'
import GraduationFormForOld from './GraduationFormForOld';

function ReceiptModuleHome() {
    const [value, setValue] = React.useState(0);
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Box sx={{ width: "80%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Graduation Modules"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "4px 16px",
        }}
      >
        <Tab
          label="List of Enrolled Students"
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
          label="Old Students Entry"
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
      {value === 0 && <StudentListForDropout value={value} />}
      {value === 1 && <GraduationFormForOld value={value} />}
    </Box>
  </Box>
  )
}

export default ReceiptModuleHome