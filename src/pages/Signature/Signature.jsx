
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  DialogContent,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import axios from "axios";
import toast from "react-hot-toast";
import SignatureList from "./signatureList";
import {config as appConfig} from '@config';


const Signature = ({ onClose, id, handleSignatureClose }) => {
  const backendUrl = appConfig.VITE_BACKEND_URL;
  const config = getAuthConfigSafe()
  const [employeeFullname, setEmployeeFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const signatureListRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    post: "",
    employeeId: "",
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
    uploadSignature: "",
    stampImage: "",
    institutionImage: "",
  });


  const getEmployeeData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/Employee/${id}`, config);
      const { firstName, middleName, lastName, id: employeeId, userId, campusId } = response.data;
      const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();

      setEmployeeFullname(fullName);
      setFormData((prev) => ({
        ...prev,
        name: fullName,
        employeeId: employeeId,
        campusId,
        userId
      }));
    } catch (error) {
      console.error("ERROR IN FETCHING DATA", error);
      throw error;
    }
  };
  useEffect(() => {
    getEmployeeData()
  }, [])

  const submitSignatureData = async (formData) => {
    try {
      if (!config) throw new Error("Token is Missing");
      const response = await axios.post(
        `${backendUrl}/uploadsign/upload`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error in adding signature data:",
        error.response?.formData || error.message
      );
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await submitSignatureData(formDataToSend);
      if (response.message === "Upload successful") {
        toast.success("Signature added successfully");
        handleClear();

        if (signatureListRef.current) {
          signatureListRef.current.refreshData();
        }
      }
    } catch (error) {
      console.error("Error in adding signature:", error);
      toast.error("Failed to add signature");
    } finally {
      setLoading(false);
    }
  };
  const signatureInputRef = useRef(null);
  const stampImageRef = useRef(null);
  const institutionImageRef = useRef(null);

  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
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
      uploadSignature: "",
      stampImage: "",
      institutionImage: ""
    }));
    if (signatureInputRef.current) signatureInputRef.current.value = null;
    if (stampImageRef.current) stampImageRef.current.value = null;
    if (institutionImageRef.current) institutionImageRef.current.value = null;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };
  const validateNumericInput = (e) => {
    const isValid = /[0-9]/.test(e.key);
    if (!isValid) {
      e.preventDefault();
    }
  };
  return (
    <DialogContent sx={{ maxWidth: "95vw", width: "100%", p: 2 }} onClose={onClose}>
      <Box sx={{ position: "relative", mb: 1 }}>
        <h1 className="text-center text-2xl font-bold mb-4">
          Signature Management
        </h1>
        <p className="text-green-600 text-xs ml-2">
          Note: The campus chief's signature is required on graduation certificates and ID cards. Please ensure it is uploaded with index 1.
        </p>

        <IconButton
          onClick={handleSignatureClose}
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
                  value={employeeFullname}
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
              <Grid item xs={12} md={3.9}>
                <Stack spacing={0.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    <Typography variant="caption">Show position below sign</Typography>
                  </Box>
                  <TextField
                    inputRef={signatureInputRef}
                    type="file"
                    size="small"
                    name="uploadSignature"
                    accept="image/*"
                    label="Signature Image"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleFileChange(e, "uploadSignature")}
                    fullWidth
                    required
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={3.9}>
                {/* <Stack spacing={0.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    <Typography variant="caption">Use signatory stamp</Typography>
                  </Box>
                  <TextField
                    inputRef={stampImageRef}
                    type="file"
                    size="small"
                    name="stampImage"
                    accept="image/*"
                    label="Stamp Image"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleFileChange(e, "stampImage")}
                    fullWidth
                  />
                </Stack> */}
              </Grid>

              <Grid item xs={12} md={3.9}>
                {/* <Stack spacing={0.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    <Typography variant="caption">Use in certificate</Typography>
                  </Box>
                  <TextField
                    inputRef={institutionImageRef}
                    type="file"
                    size="small"
                    name="institutionImage"
                    disabled={formData.isUsedStampInCertificate === false}
                    accept="image/*"
                    label="Institution Stamp"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleFileChange(e, "institutionImage")}
                    fullWidth
                    required
                  />
                </Stack> */}
              </Grid>
            </Grid>

            {/* Status and Remarks */}
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
                type="submit"
                variant="contained"
                size="small"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      <SignatureList fullname={employeeFullname} ref={signatureListRef} empId={id} />
    </DialogContent>
  );
};

export default Signature;