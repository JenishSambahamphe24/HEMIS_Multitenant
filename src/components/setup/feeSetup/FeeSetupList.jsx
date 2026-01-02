import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TableBody,
  TableHead,
  Dialog,
} from "@mui/material";
import axios from "axios";
import EditFeeSetup from "./EditFeeSetup";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const FeeSetupList = ({ onUpdate, onClose, id }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProgram, setSelectedProgramId] = useState(null);
  const [programFee, setProgramFee] = useState([]);

  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/FeeSetup`, config);
      setProgramFee(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (programId) => {
    setSelectedProgramId(programId);
    setOpenEditDialog(true);
  };
  return (
    <div>
      <Grid marginTop="20px">
        <div>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "#2A629A" }}
          >
            Program Fee Setup
          </Typography>
          <TableContainer>
            <Table
              style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    S.No:
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Program Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Program Type
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Duration
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Acad. Year
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Status
                  </TableCell>

                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programFee.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.shortName}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.faculty?.level?.levelName}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.duration}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.academicYear}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.amount}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.status ? (
                        <span style={{ color: "green" }}>Active</span>
                      ) : (
                        <span style={{ color: "red" }}>Inactive</span>
                      )}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      <Button onClick={() => handleEditClick(data.id)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
      >
        <EditFeeSetup
          id={id}
          onClose={() => setOpenEditDialog(false)}
          onUpdate={onUpdate}
        />
      </Dialog>
    </div>
  );
};

export default FeeSetupList;
