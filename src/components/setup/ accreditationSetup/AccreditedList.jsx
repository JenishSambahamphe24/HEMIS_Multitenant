import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  styled,
} from "@mui/material";
import axios from "axios";
import EditAccrediatedCampuses from "./EditAccrediatedCampuses";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


// Styled components for enhanced aesthetics
const StyledTableContainer = styled(TableContainer)({
  borderRadius: "10px",
  border: "1px solid #c2c2c2",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#2A629A",
});

const StyledTableCell = styled(TableCell)({
  color: "#ffffff",
  textAlign: "center",
  border: "1px solid #c2c2c2",
  padding: "8px",
  fontSize: "0.8rem",
});

const StyledTableRow = styled(TableRow)(({ theme, expired }) => ({
  backgroundColor: expired ? "#ffebee" : theme.palette.background.default,
  "&:hover": {
    backgroundColor: expired ? "#ffcdd2" : theme.palette.action.hover,
  },
}));

const StyledButton = styled(Button)({
  fontSize: "0.7rem",
  padding: "4px 8px",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
});

const AccreditedList = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [accreditedData, setAccreditedData] = useState([]);
  const [accrediationData, setAccrediationData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/AddAccreditation`,
        config
      );
      setAccreditedData(response.data);
    } catch (error) {
      console.error("Error fetching accredited data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  const isExpired = (expirationDate) => {
    const currentDate = new Date();
    const expiryDate = new Date(expirationDate);
    return currentDate > expiryDate;
  };

  const handleEdit = (data) => {
    setAccrediationData(data);
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    fetchData();
  };

  return (
    <>
      <Typography
        variant="h6"
        textAlign="center"
        color="primary"
        sx={{ marginBottom: 2 }}
      >
        Accredited Campus List
      </Typography>
      <StyledTableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="accredited campus table">
          <StyledTableHead>
            <TableRow>
              <StyledTableCell width={"5%"}>S.No.</StyledTableCell>
              <StyledTableCell>Campus Name</StyledTableCell>
              <StyledTableCell>University</StyledTableCell>
              <StyledTableCell>Campus Type</StyledTableCell>
              <StyledTableCell>Accredited Date</StyledTableCell>
              <StyledTableCell>Expired Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {accreditedData && accreditedData.length > 0 ? (
              accreditedData.map((data, index) => {
                const expired = isExpired(data.dateOfExpireAccreditationEng);

                return (
                  <StyledTableRow key={index} expired={expired}>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.campusName}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.universityName}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.campusType}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {formatDate(data.dateOfAccreditationEng)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {formatDate(data.dateOfExpireAccreditationEng)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      <Box
                        color={expired ? "red" : "green"}
                        fontWeight="bold"
                        fontSize="0.8rem"
                      >
                        {expired ? "Expired" : "Accredited"}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      <StyledButton
                        size="small"
                        variant="contained"
                        onClick={() => handleEdit(data)}
                      >
                        Edit
                      </StyledButton>
                    </TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{
                    padding: "4px",
                    border: "1px solid #c2c2c2",
                    textAlign: "center",
                  }}
                >
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <EditAccrediatedCampuses
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        accrediationData={accrediationData}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default AccreditedList;
