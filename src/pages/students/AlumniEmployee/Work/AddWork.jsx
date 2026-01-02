import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAddressData from "../../../../components/address/address";
import { useAlumni } from "../../../../context/AlumniContext";
import { fetchGraduationDataById } from "../../../../services/AlumniServices";
import { config as appConfig } from "@config";

 const backendUrl = appConfig.VITE_BACKEND_URL;

const AddWork = ({ id, onClose }) => {
  const { alumniStudentId, graduationApplicationId } = useAlumni();
  console.log(graduationApplicationId);

  const applicantNameEng = localStorage.getItem("applicantNameEng");


  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries([alumniStudentId]);

  const authToken = localStorage.getItem("authToken");

  // ✅ Fetch graduation data to get applicant name
  const { data: graduationData } = useQuery({
    queryKey: ["graduationData", graduationApplicationId], 
    queryFn: () => fetchGraduationDataById(graduationApplicationId, authToken),
    enabled: !!graduationApplicationId, 
  });

  // Address data hook
  const {
    uniqueProvinces,
    uniqueDistricts,
    uniqueLocalLevels,
    setSelectedProvince,
    setSelectedDistrict,
    noOfWards,
  } = useAddressData();

  const [formData, setFormData] = useState({
    OrganizationName: "",
    Designation: "",
    OfficeEmail: "",
    OfficePhone: "",
    Province: "",
    District: "",
    LocalLevel: "",
    WardNo: "",
    OfficeAddress: "",
    OfficeUrl: "",
    WorkingStatus: "",
    JoiningLetter: null,
    JoingDate: "",
    WorkingTillDate: "",
    Remarks: "",
  });

  const [errors, setErrors] = useState({
    OfficePhone: false,
  });

  //address lists
  useEffect(() => {
    if (formData.Province) setSelectedProvince(formData.Province);
  }, [formData.Province]);

  useEffect(() => {
    if (formData.District) setSelectedDistrict(formData.District);
  }, [formData.District]);

  //  Mutation for submission
  const mutation = useMutation({
    mutationFn: async (formDataToSend) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found. Please log in again.");
        throw new Error("Token not found in localStorage");
      }

      return await axios.post(
        `${backendUrl}/AlumniEmployee/Create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Work detail added successfully!");
      refetch();
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to add work detail.");
      console.error("Error creating alumni employee:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "OfficePhone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      setErrors((prev) => ({
        ...prev,
        OfficePhone: numericValue.length > 0 && numericValue.length !== 10,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "Province") {
      setSelectedProvince(value);
      setFormData((prev) => ({
        ...prev,
        District: "",
        LocalLevel: "",
        WardNo: "",
      }));
    }
    if (name === "District") {
      setSelectedDistrict(value);
      setFormData((prev) => ({
        ...prev,
        LocalLevel: "",
        WardNo: "",
      }));
    }
  };

  const getWardOptions = (localLevel) => {
    const wards = noOfWards[localLevel] || 0;
    return Array.from({ length: wards }, (_, i) => i + 1);
  };

  const handleSubmit = (e) => {
    console.log("handlesubmit clicked");
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("GraduationApplicationId", graduationApplicationId);
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value ?? "");
    });

    if (formData.WardNo)
      formDataToSend.set("WardNo", parseInt(formData.WardNo, 10));

    mutation.mutate(formDataToSend);
  };
  console.log("graduationApplicationId", graduationApplicationId);
  const handleClear = () => {
    setFormData({
      OrganizationName: "",
      Designation: "",
      OfficeEmail: "",
      OfficePhone: "",
      Province: "",
      District: "",
      LocalLevel: "",
      WardNo: "",
      OfficeAddress: "",
      OfficeUrl: "",
      WorkingStatus: "",
      JoiningLetter: null,
      JoingDate: "",
      WorkingTillDate: "",
      Remarks: "",
    });
  };

  return (
    <Paper
      elevation={3}
      className="m-4 p-5 w-full"
      style={{ margin: "auto", maxWidth: "1000px" }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose} sx={{ color: "#999" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mt: 2,
            color: "rgb(43, 110, 181)",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          Adding working detail of&nbsp;
          <strong>
            {applicantNameEng}
          </strong>{" "}
        </Typography>

        <Grid container spacing={2} className="mt-10">
          {/* Organization Details */}
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              label="Organization Name"
              name="OrganizationName"
              value={formData.OrganizationName}
              onChange={handleInputChange}
              size="small"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Designation"
              name="Designation"
              value={formData.Designation}
              onChange={handleInputChange}
              size="small"
              fullWidth
              required
            />
          </Grid>

          {/* Office Contact Info */}
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Office Email"
              name="OfficeEmail"
              value={formData.OfficeEmail}
              onChange={handleInputChange}
              size="small"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Office Phone"
              name="OfficePhone"
              value={formData.OfficePhone}
              onChange={handleInputChange}
              error={errors.OfficePhone}
              helperText={errors.OfficePhone ? "Phone must be 10 digits" : ""}
              size="small"
              fullWidth
            />
          </Grid>

          {/* Dynamic Address Fields */}
          <Grid item xs={12} sm={4} md={2.5}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Province</InputLabel>
              <Select
                label="Province"
                name="Province"
                value={formData.Province}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select Province</MenuItem>
                {uniqueProvinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small" required>
              <InputLabel>District</InputLabel>
              <Select
                label="District"
                name="District"
                value={formData.District}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select District</MenuItem>
                {uniqueDistricts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={5} md={3.5}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Local Level</InputLabel>
              <Select
                label="Local Level"
                name="LocalLevel"
                value={formData.LocalLevel}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select Local Level</MenuItem>
                {uniqueLocalLevels.map((localLevel) => (
                  <MenuItem key={localLevel} value={localLevel}>
                    {localLevel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3} md={2.2}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Ward No.</InputLabel>
              <Select
                label="Ward No"
                name="WardNo"
                value={formData.WardNo}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select Ward</MenuItem>
                {getWardOptions(formData.LocalLevel).map((ward) => (
                  <MenuItem key={ward} value={ward}>
                    {ward}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Office Address and URL */}
          <Grid item xs={12} sm={6} md={3.8}>
            <TextField
              label="Office Address"
              name="OfficeAddress"
              value={formData.OfficeAddress}
              onChange={handleInputChange}
              size="small"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
            <TextField
              label="Office URL"
              name="OfficeUrl"
              value={formData.OfficeUrl}
              onChange={handleInputChange}
              size="small"
              fullWidth
            />
          </Grid>

          {/* Working Status */}
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Working Status</InputLabel>
              <Select
                label="Working Status"
                name="WorkingStatus"
                value={formData.WorkingStatus}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Currently Working">Currently Working</MenuItem>
                <MenuItem value="Resigned">Resigned</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Joining and Till Date */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              type="file"
              size="small"
              name="JoiningLetter"
              onChange={handleInputChange}
              accept="image/*,application/pdf"
              label="Joining Letter"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Joining date"
              type="date"
              name="JoingDate"
              value={formData.JoingDate}
              onChange={handleInputChange}
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              label="Worked till date (if currently not working)"
              type="date"
              name="WorkingTillDate"
              value={formData.WorkingTillDate}
              onChange={handleInputChange}
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              name="Remarks"
              value={formData.Remarks}
              onChange={handleInputChange}
              size="small"
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        {/* Submit / Clear Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, pt: 4 }}>
          <Button type="submit" variant="contained" size="small">
            Submit
          </Button>
          <Button variant="outlined" size="small" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddWork;
