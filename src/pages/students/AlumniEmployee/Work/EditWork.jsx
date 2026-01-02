import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  DialogActions,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AlumniEmployeeService } from "../../../../services/AlumniServices";
import { useAlumni } from "../../../../context/AlumniContext";
import useAddressData from "../../../../components/address/address";

const EditWork = ({ id, onClose }) => {
  const { alumniStudentId, graduationApplicationId } = useAlumni();
  
  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries(["AlumniEmployee"]);

  // Address hook
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
    JoiningLetterName: "",
    JoiningDate: "",
    WorkingTillDate: "",
    Remarks: "",
  });

  const [errors, setErrors] = useState({ OfficePhone: false });

  // Prefill address selections
  useEffect(() => {
    if (formData.Province) setSelectedProvince(formData.Province);
  }, [formData.Province]);

  useEffect(() => {
    if (formData.District) setSelectedDistrict(formData.District);
  }, [formData.District]);

  // Fetch previous work data
  const token = localStorage.getItem("authToken");
  const { data: workData } = useQuery({
    queryKey: ["work", id],
    queryFn: () => AlumniEmployeeService.getById(id, token).then((res) => res.data),
    enabled: !!id && !!token,
  });

  // Prefill form once fetched
  useEffect(() => {
    if (workData) {
      setFormData({
        OrganizationName: workData.organizationName || "",
        Designation: workData.designation || "",
        OfficeEmail: workData.officeEmail || "",
        OfficePhone: workData.officePhone || "",
        Province: workData.province || "",
        District: workData.district || "",
        LocalLevel: workData.localLevel || "",
        WardNo: workData.wardNo || "",
        OfficeAddress: workData.officeAddress || "",
        OfficeUrl: workData.officeUrl || "",
        WorkingStatus: workData.workingStatus || "",
        JoiningLetter: null,
        JoiningLetterName: workData.joiningLetter || "",
        JoiningDate: workData.joiningDate?.split("T")[0] || "",
        WorkingTillDate: workData.workingTillDate?.split("T")[0] || "",
        Remarks: workData.remarks || "",
      });
    }
  }, [workData]);

  // ✅ Mutation
  const updateMutation = useMutation({
    mutationFn: async (formDataToSend) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found. Please log in again.");
        throw new Error("Token not found");
      }
      return await AlumniEmployeeService.update(id, formDataToSend, token);
    },
    onSuccess: () => {
      toast.success("Work detail updated successfully!");
      refetch();
      onClose();
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update work detail.");
    },
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "OfficePhone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      setErrors((prev) => ({ ...prev, OfficePhone: numericValue.length > 0 && numericValue.length !== 10 }));
      return;
    }

    if (name === "JoiningLetter") {
      setFormData((prev) => ({
        ...prev,
        JoiningLetter: files[0],
        JoiningLetterName: files[0]?.name || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle select changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "Province") {
      setSelectedProvince(value);
      setFormData((prev) => ({ ...prev, District: "", LocalLevel: "", WardNo: "" }));
    }
    if (name === "District") {
      setSelectedDistrict(value);
      setFormData((prev) => ({ ...prev, LocalLevel: "", WardNo: "" }));
    }
  };

  const getWardOptions = (localLevel) => {
    const wards = noOfWards[localLevel] || 0;
    return Array.from({ length: wards }, (_, i) => i + 1);
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append required IDs
    formDataToSend.append("id", id);
    formDataToSend.append("alumniStudentId", alumniStudentId);
        formDataToSend.append("GraduationApplicationId", graduationApplicationId);

    // Append other fields in camelCase
    formDataToSend.append("organizationName", formData.OrganizationName);
    formDataToSend.append("designation", formData.Designation);
    formDataToSend.append("officeEmail", formData.OfficeEmail);
    formDataToSend.append("officePhone", formData.OfficePhone);
    formDataToSend.append("province", formData.Province);
    formDataToSend.append("district", formData.District);
    formDataToSend.append("localLevel", formData.LocalLevel);
    formDataToSend.append("wardNo", formData.WardNo ? parseInt(formData.WardNo, 10) : "");
    formDataToSend.append("officeAddress", formData.OfficeAddress);
    formDataToSend.append("officeUrl", formData.OfficeUrl);
    formDataToSend.append("workingStatus", formData.WorkingStatus);
    formDataToSend.append("remarks", formData.Remarks);
    formDataToSend.append("joiningDate", formData.JoiningDate);
    formDataToSend.append("workingTillDate", formData.WorkingTillDate);

    if (formData.JoiningLetter) {
      formDataToSend.append("joiningLetter", formData.JoiningLetter);
    }

    // Debug FormData
    // for (let [key, val] of formDataToSend.entries()) console.log(key, val);

    updateMutation.mutate(formDataToSend);
  };

  return (
    <Paper elevation={3} sx={{ margin: "auto", p: 5, maxWidth: "1000px" }} component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom sx={{ mt: 2, color: "rgb(43, 110, 181)", display: "flex", justifyContent: "center", fontWeight: "bold" }}>
        Update Work Details
      </Typography>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {/* Organization Name */}
        <Grid item xs={12} sm={8} md={6}>
          <TextField label="Organization Name" name="OrganizationName" value={formData.OrganizationName} onChange={handleChange} size="small" fullWidth required />
        </Grid>

        {/* Designation */}
        <Grid item xs={12} sm={4} md={3}>
          <TextField label="Designation" name="Designation" value={formData.Designation} onChange={handleChange} size="small" fullWidth required />
        </Grid>

        {/* Office Email */}
        <Grid item xs={12} sm={4} md={3}>
          <TextField label="Office Email" name="OfficeEmail" value={formData.OfficeEmail} onChange={handleChange} size="small" fullWidth />
        </Grid>

        {/* Office Phone */}
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            label="Office Phone"
            name="OfficePhone"
            value={formData.OfficePhone}
            onChange={handleChange}
            error={errors.OfficePhone}
            helperText={errors.OfficePhone ? "Phone must be 10 digits" : ""}
            size="small"
            fullWidth
          />
        </Grid>

        {/* Province */}
        <Grid item xs={12} sm={4} md={2.5}>
          <FormControl fullWidth size="small" required>
            <InputLabel>Province</InputLabel>
            <Select label="Province" name="Province" value={formData.Province} onChange={handleSelectChange}>
              <MenuItem value="">Select Province</MenuItem>
              {uniqueProvinces.map((province) => (
                <MenuItem key={province} value={province}>{province}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* District */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small" required>
            <InputLabel>District</InputLabel>
            <Select label="District" name="District" value={formData.District} onChange={handleSelectChange}>
              <MenuItem value="">Select District</MenuItem>
              {uniqueDistricts.map((district) => (
                <MenuItem key={district} value={district}>{district}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Local Level */}
        <Grid item xs={12} sm={5} md={3.5}>
          <FormControl fullWidth size="small" required>
            <InputLabel>Local Level</InputLabel>
            <Select label="Local Level" name="LocalLevel" value={formData.LocalLevel} onChange={handleSelectChange}>
              <MenuItem value="">Select Local Level</MenuItem>
              {uniqueLocalLevels.map((localLevel) => (
                <MenuItem key={localLevel} value={localLevel}>{localLevel}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ward */}
        <Grid item xs={12} sm={3} md={2.2}>
          <FormControl fullWidth size="small" required>
            <InputLabel>Ward No.</InputLabel>
            <Select label="Ward No" name="WardNo" value={formData.WardNo} onChange={handleSelectChange}>
              <MenuItem value="">Select Ward</MenuItem>
              {getWardOptions(formData.LocalLevel).map((ward) => (
                <MenuItem key={ward} value={ward}>{ward}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Office Address */}
        <Grid item xs={12} sm={6} md={3.8}>
          <TextField label="Office Address" name="OfficeAddress" value={formData.OfficeAddress} onChange={handleChange} size="small" fullWidth required />
        </Grid>

        {/* Office URL */}
        <Grid item xs={12} sm={6} md={3.5}>
          <TextField label="Office URL" name="OfficeUrl" value={formData.OfficeUrl} onChange={handleChange} size="small" fullWidth />
        </Grid>

        {/* Working Status */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small" required>
            <InputLabel>Working Status</InputLabel>
            <Select label="Working Status" name="WorkingStatus" value={formData.WorkingStatus} onChange={handleSelectChange}>
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Currently Working">Currently Working</MenuItem>
              <MenuItem value="Resigned">Resigned</MenuItem>
              <MenuItem value="Retired">Retired</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Joining Letter */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            type="file"
            size="small"
            name="JoiningLetter"
            onChange={handleChange}
            accept="image/*,application/pdf"
            label="Joining Letter"
            InputLabelProps={{ shrink: true }}
            fullWidth
            helperText={formData.JoiningLetterName}
          />
        </Grid>

        {/* Joining Date */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Joining Date"
            type="date"
            name="JoiningDate"
            value={formData.JoiningDate}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        {/* Till Date */}
        <Grid item xs={12} sm={6} md={5}>
          <TextField
            label="Worked till date (if currently not working)"
            type="date"
            name="WorkingTillDate"
            value={formData.WorkingTillDate}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        {/* Remarks */}
        <Grid item xs={12}>
          <TextField label="Remarks" name="Remarks" value={formData.Remarks} onChange={handleChange} size="small" fullWidth multiline rows={3} />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, pt: 4 }}>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Box>
    </Paper>
  );
};

export default EditWork;
