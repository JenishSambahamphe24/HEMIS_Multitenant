
import  { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  Grid,
  Typography,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Button,
  Dialog,
} from "@mui/material";
import SignatureEdit from "./SignatureEdit";
import axios from "axios";
import toast from "react-hot-toast";
import SignatureDelete from "./SignatureDelete";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const SignatureList = forwardRef(({ fullname, empId }, ref) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [signatureData, setSignatureData] = useState([]);
  const [id, setId] = useState(0);
  const getSignatureData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/uploadsign/by-employee/${empId}`, config);
      setSignatureData(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in fetching signature data:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  useImperativeHandle(ref, () => ({
    refreshData: getSignatureData
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSignatureData();
      } catch (error) {
        toast.error("Failed to fetch signature data");
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id) => {
    setId(id);
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
    getSignatureData();
  };

  const handleDelete = (id) => {
    setId(id);
    setOpenDeleteDialog(true);
  };
  return (
    <div>
      <Grid>
        <Typography
          variant="h5"
          gutterBottom
          style={{
            marginTop: "10px",
            color: "rgb(43, 110, 181)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Signature List
        </Typography>

        <TableContainer component={Paper} sx={{ maxWidth: 850, mx: "auto" }}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "rgb(43, 110, 181)" }}>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    border: "1px solid  #c2c2c2",
                    padding: "4px",
                  }}
                >
                  S.No
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                  }}
                >
                  Signatory FullName
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                  }}
                >
                  Index
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                  }}
                >
                  Signatory Position
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signatureData.length > 0 ? (
                signatureData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid #c2c2c2", padding: "4px" }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid #c2c2c2", padding: "4px" }}
                    >
                      {item.index}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid #c2c2c2", padding: "4px" }}
                    >
                      {item.post}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ color: item.status ? "green" : "red" }}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid #c2c2c2", padding: "1px" }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mx: 1, padding: "2px" }}
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mx: 1, padding: "2px" }}
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <SignatureEdit
            onClose={() => setOpenEditDialog(false)}
            id={id}
            fullName={fullname}
            onDataUpdate={getSignatureData} // Pass refresh function to edit component too
          />
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={openDeleteDialog}
          maxWidth="xs"
          onClose={() => setOpenDeleteDialog(false)}
        >
          <SignatureDelete
            getSignatureData={getSignatureData}
            id={id}
            onClose={handleClose}
          />
        </Dialog>
      </Grid>
    </div>
  );
});

SignatureList.displayName = 'SignatureList';

export default SignatureList;
