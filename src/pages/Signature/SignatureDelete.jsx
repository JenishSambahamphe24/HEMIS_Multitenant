import {
  Typography,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const SignatureDelete = ({ id, onClose }) => {
  const backendUrl =config.VITE_BACKEND_URL;

  const deleteSignatureData = async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.delete(`${backendUrl}/uploadsign/${id}`, config);
      toast.success("Signature deleted successfully");
      onClose();
    } catch (error) {
      console.error(
        "Error while deleting signature:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete signature. Please try again.");
    }
  };

  return (
    <Dialog open={Boolean(id)} maxWidth="xs" onClose={onClose}>
      <DialogContent>
        <Typography sx={{ px: 4, pt: 4, pb: 2 }}>
          Are you sure you want to delete this data permanently?
        </Typography>

        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "red", borderColor: "red" }}
            onClick={deleteSignatureData}
          >
            Delete
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDelete;
