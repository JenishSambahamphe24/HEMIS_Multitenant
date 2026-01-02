import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  DialogContent,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';


const SignatureEdit = ({ id, onClose, fullName }) => {
  const backendUrl = config.VITE_BACKEND_URL;
const uploadURL = config.VITE_UPLOAD_URL;

  const [signatureData, setSignatureData] = useState([]);

  const uploadSignatureRef = useRef();
  const stampImageRef = useRef();
  const institutionImageRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    post: "",
    status: true,
    remarks: "",
    index: 0,
    isPositionBelowSign: false,
    isUsedSignatureStamp: false,
    isUsedStampInCertificate: false,
    isSignatureInCharacterCertificate: false,
    isSignatureInIdCard: false,
    isSignatureInReportCard: false,
    isSignatureInAccountReceipt: false,
    isSignatureInRecommendationLetter: false,
    uploadSignature: null,
    stampImage: null,
    institutionImage: null,
  });

  const [fetchedUploadSignature, setFetchedUploadSignature] = useState(null);
  const [fetchedStampImage, setFetchedStampImage] = useState(null);
  const [fetchedInstitutionImage, setFetchedInstitutionImage] = useState(null);


  const getSignatureData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/uploadsign/${id}`, config);
      const data = response.data;
      setFormData(prev => ({
        ...prev,
        name: data.fullName || fullName || "",
        post: data.post || "",
        status: data.status ?? true,
        remarks: data.remarks || "",
        index: data.index || 0,
        isPositionBelowSign: data.isPositionBelowSign || false,
        isUsedSignatureStamp: data.isUsedSignatureStamp || false,
        isUsedStampInCertificate: data.isUsedStampInCertificate || false,
        isSignatureInCharacterCertificate:
          data.isSignatureInCharacterCertificate || false,
        isSignatureInIdCard: data.isSignatureInIdCard || false,
        isSignatureInReportCard: data.isSignatureInReportCard || false,
        isSignatureInAccountReceipt: data.isSignatureInAccountReceipt || false,
        isSignatureInRecommendationLetter:
          data.isSignatureInRecommendationLetter || false,
        // Reset file fields to null for new uploads
        uploadSignature: null,
        stampImage: null,
        institutionImage: null,
      }));

      // Set fetched files separately
      setFetchedUploadSignature(data.uploadSignature);
      setFetchedStampImage(data.stampImage);
      setFetchedInstitutionImage(data.institutionImage);

    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const result = await updateSignatureData(formData);
      if (result) {
        toast.success("Signature updated successfully!");
        onClose()
      }
    } catch (error) {
      console.error("Error updating signature:", error);
      toast.error("Failed to update signature data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSignatureData();
        setSignatureData(data);
      } catch (error) {
        toast.error("Failed to fetch signature data");
      }
    };
    fetchData();
  }, []);

  const updateSignatureData = async (formData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token is Missing");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const form = new FormData();

      if (formData.uploadSignature) {
        form.append('uploadSignature', formData.uploadSignature);
      } else if (fetchedUploadSignature) {
        form.append('uploadSignature', fetchedUploadSignature);
      }

      if (formData.stampImage) {
        form.append('stampImage', formData.stampImage);
      } else if (fetchedStampImage) {
        form.append('stampImage', fetchedStampImage);
      }

      if (formData.institutionImage) {
        form.append('institutionImage', formData.institutionImage);
      } else if (fetchedInstitutionImage) {
        form.append('institutionImage', fetchedInstitutionImage);
      }

      Object.keys(formData).forEach(key => {
        if (!['uploadSignature', 'stampImage', 'institutionImage'].includes(key)) {
          let value = formData[key];

          if (key === 'index') {
            value = value === '' || value === null || value === undefined ? 0 : Number(value);
          } else if (key === 'status') {
            value = Boolean(value);
          } else if (key.startsWith('is')) {
            value = Boolean(value);
          } else if (value === null || value === undefined) {
            value = '';
          }

          form.append(key, value);
        }
      });
      for (let [key, value] of form.entries()) {
        console.log(key, value, typeof value);
      }
      const response = await axios.patch(
        `${backendUrl}/uploadsign/${id}`,
        form,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Updated file change handlers following EditPublication pattern
  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadSignature: file,
      }));
      // Clear fetched image when new file is selected
      setFetchedUploadSignature(null);
    }
  };

  const handleRemoveUploadSignature = () => {
    setFetchedUploadSignature(null);
    setFormData(prev => ({
      ...prev,
      uploadSignature: null,
    }));
    // Clear the file input
    if (uploadSignatureRef.current) {
      uploadSignatureRef.current.value = '';
    }
  };

  const handleStampImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        stampImage: file,
      }));
      // Clear fetched image when new file is selected
      setFetchedStampImage(null);
    }
  };

  const handleRemoveStampImage = () => {
    setFetchedStampImage(null);
    setFormData(prev => ({
      ...prev,
      stampImage: null,
    }));
    // Clear the file input
    if (stampImageRef.current) {
      stampImageRef.current.value = '';
    }
  };

  const handleInstitutionImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        institutionImage: file,
      }));
      // Clear fetched image when new file is selected
      setFetchedInstitutionImage(null);
    }
  };

  const handleRemoveInstitutionImage = () => {
    setFetchedInstitutionImage(null);
    setFormData(prev => ({
      ...prev,
      institutionImage: null,
    }));
    // Clear the file input
    if (institutionImageRef.current) {
      institutionImageRef.current.value = '';
    }
  };

  const validateNumericInput = (e) => {
    const isValid = /[0-9]/.test(e.key);
    if (!isValid) {
      e.preventDefault();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleEdit();
  };

  return (
    <DialogContent sx={{ maxWidth: "95vw", width: "100%", p: 2 }} onClose={onClose}>
      <Box sx={{ position: "relative", mb: 1 }}>
        <h1 className="text-center text-2xl font-bold">
          Edit Signatory
        </h1>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Paper elevation={1} sx={{ p: 1 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Grid container gap='10px'>
              <Grid item xs={12} sm={4.9}>
                <TextField
                  fullWidth
                  size="small"
                  label="Signatory Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={6} sm={1.9}>
                <TextField
                  fullWidth
                  size="small"
                  label="Index"
                  type="number"
                  name="index"
                  value={formData.index}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  onKeyDown={validateNumericInput}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4.9}>
                <TextField
                  fullWidth
                  size="small"
                  label="Position"
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            <Grid container gap='10px'>
              <Grid item xs={12} sm={6} md={3.9}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="isPositionBelowSign"
                      checked={formData.isPositionBelowSign}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          isPositionBelowSign: e.target.checked,
                        }));
                      }}
                    />
                  }
                  label="Show position below sign?"
                />
                <TextField
                  type="file"
                  size="small"
                  name="uploadSignature"
                  inputRef={uploadSignatureRef}
                  accept="image/*"
                  variant="outlined"
                  label="Signature Image"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleSignatureChange}
                  fullWidth
                />
                {fetchedUploadSignature && (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginTop: "12px",
                    }}
                  >
                    <img
                      src={`${uploadURL}/signatures/${fetchedUploadSignature}`}
                      alt="signature"
                      style={{
                        width: "120px",
                        height: "80px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveUploadSignature}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "2px",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="isUsedSignatureStamp"
                      checked={formData.isUsedSignatureStamp}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          isUsedSignatureStamp: e.target.checked,
                        }));
                      }}
                    />
                  }
                  label="Use signatory stamp?"
                />
                <TextField
                  type="file"
                  size="small"
                  name="stampImage"
                  inputRef={stampImageRef}
                  accept="image/*"
                  variant="outlined"
                  label="Stamp Image"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleStampImageChange}
                  disabled={!formData.isUsedSignatureStamp}
                  fullWidth
                />

                {fetchedStampImage && (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginTop: "12px",
                    }}
                  >
                    <img
                      src={`${uploadURL}/signatures/${fetchedStampImage}`}
                      alt="stamp"
                      style={{
                        width: "120px",
                        height: "80px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveStampImage}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "2px",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3.9}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="isUsedStampInCertificate"
                      checked={formData.isUsedStampInCertificate}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          isUsedStampInCertificate: e.target.checked,
                        }));
                      }}
                    />
                  }
                  label="Use stamp your certificate?"
                />
                <TextField
                  type="file"
                  size="small"
                  name="institutionImage"
                  inputRef={institutionImageRef}
                  accept="image/*"
                  variant="outlined"
                  label="Campus/College/Institution Stamp"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleInstitutionImageChange}
                  fullWidth
                />
                {fetchedInstitutionImage && (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginTop: "12px",
                    }}
                  >
                    <img
                      src={`${uploadURL}/signatures/${fetchedInstitutionImage}`}
                      alt="stamp"
                      style={{
                        width: "120px",
                        height: "80px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveInstitutionImage}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "2px",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </Grid>
            </Grid>

            {/* Status and Remarks Row */}
            <Grid container gap='10px'>
              <Grid item xs={12} sm={2.9}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                    sx={{
                      color: formData.status ? "green" : "red",
                    }}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8.9}>
                <TextField
                  fullWidth
                  size="small"
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* Certificate Usage Checkboxes */}
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
                Select where to use this signature
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {[
                  { key: "isSignatureInCharacterCertificate", label: "Character Certificate" },
                  { key: "isSignatureInIdCard", label: "ID Card" },
                  { key: "isSignatureInReportCard", label: "Report Card" },
                  { key: "isSignatureInAccountReceipt", label: "Account Receipt" },
                  { key: "isSignatureInRecommendationLetter", label: "Recommendation Letter" },
                ].map((item) => (
                  <Box
                    key={item.key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minWidth: "200px",
                      flex: "1 1 auto",
                    }}
                  >
                    <Checkbox
                      size="small"
                      name={item.key}
                      checked={formData[item.key]}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }));
                      }}
                    />
                    <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, pt: .5 }}>
              <Button
                variant="contained"
                size="small"
                type="submit"
              >
                Update
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onClose}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </DialogContent>
  );
};
export default SignatureEdit;
