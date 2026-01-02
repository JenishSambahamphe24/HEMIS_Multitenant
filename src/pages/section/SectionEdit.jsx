import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";

const SectionEdit = ({ section, open, onClose, onUpdateSuccess }) => {
  const [editingSection, setEditingSection] = useState({
    sectionName: "",
    id: "",
    status: true,
    remarks: "",
    sectionType: "Student",
    index: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form when section prop changes
  React.useEffect(() => {
    if (section) {
      setEditingSection({
        sectionName: section.sectionName,
        id: section.id,
        status: section.status,
        remarks: section.remarks,
        sectionType: section.sectionType || "Student",
        index: section.index,
      });
    }
  }, [section]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingSection((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = getAuthConfigSafe()
      const requestBody = {
        id: editingSection.id,
        sectionName: editingSection.sectionName,
        sectionType: editingSection.sectionType,
        status: editingSection.status,
        index: editingSection.index,
        remarks: editingSection.remarks,
      };

      const response = await axios.put(
        `${backendUrl}/Management/UpdateSection/${editingSection.id}`,
        requestBody,
        config
      );

      if (response.status === 200) {
        toast.success("Section updated successfully!");
        onUpdateSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", color: "rgb(43, 110, 181)" }}>
        Edit Section
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={3.5}>
              <TextField
                label="Section Index"
                type="number"
                required
                size="small"
                fullWidth
                name="index"
                value={editingSection.index}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={5.2}>
              <TextField
                label="Section Name"
                required
                fullWidth
                size="small"
                name="sectionName"
                value={editingSection.sectionName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={3.2}>
              <FormControl fullWidth>
                <InputLabel required>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={editingSection.status}
                  size="small"
                  onChange={handleChange}
                  sx={{ color: editingSection.status ? "green" : "red" }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Remarks"
                fullWidth
                size="small"
                name="remarks"
                value={editingSection.remarks}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", padding: "16px 24px" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionEdit;
