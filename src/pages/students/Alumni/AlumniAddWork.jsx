import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { BSToAD } from "bikram-sambat-js";
import BikramSambatDateInput from "../../../components/DateField/DateInputField";
import CloseIcon from "@mui/icons-material/Close";
import useAddressData from "../../../components/address/address";
import axios from "axios";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";

import {config} from '@config';

const AlumniAddWork = ({ onClose, selectedAlumni }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    uniqueProvinces,
    uniqueDistricts,
    uniqueLocalLevels,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedLocalLevel,
    selectedLocalLevel,
    noOfWards,
  } = useAddressData();

  const initialFormData = {
    graduationApplicationId:
      selectedAlumni?.graduationApplicationId?.toString() ||
      selectedAlumni?.id?.toString() ||
      "",
    organizationName: "",
    designation: "",
    officeEmail: "",
    officePhone: "",
    province: "",
    district: "",
    localLevel: "",
    wardNo: "",
    officeAddress: "",
    officeUrl: "",
    workingStatus: "Active",
    joiningLetter: null,
    joingDateBS: "",
    joingDateAD: "",
    workingTillDateBS: "",
    workingTillDateAD: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dateError, setDateError] = useState(null);

  const [errors, setErrors] = useState({
    organizationName: false,
    designation: false,
    joingDateBS: false,
    province: false,
    district: false,
    localLevel: false,
    wardNo: false,
    officeAddress: false,
    officePhone: false,
  });

  // Helper function to compare BS dates
  const compareBSDates = (date1, date2) => {
    if (!date1 || !date2) return 0;

    const [y1, m1, d1] = date1.split("/").map(Number);
    const [y2, m2, d2] = date2.split("/").map(Number);

    if (y1 !== y2) return y1 - y2;
    if (m1 !== m2) return m1 - m2;
    return d1 - d2;
  };

  const validateDates = (joiningDate, workingTillDate) => {
    if (!joiningDate || !workingTillDate) return true;

    const joiningDateFormatted = joiningDate.split("T")[0].replace(/-/g, "/");
    const workingTillDateFormatted = workingTillDate
      .split("T")[0]
      .replace(/-/g, "/");

    return compareBSDates(workingTillDateFormatted, joiningDateFormatted) >= 0;
  };

  const handleJoingDateBsChange = (newValue) => {
    setFormData((prev) => ({ ...prev, joingDateBS: newValue }));
    setDateError(null);

    if (!newValue || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newValue)) {
      setFormData((prev) => ({ ...prev, joingDateAD: "" }));
      return;
    }

    try {
      const datePart = newValue.split("T")[0];
      const bsDateFormatted = datePart.replace(/-/g, "/");
      const convertedDate = BSToAD(bsDateFormatted);
      setFormData((prev) => ({ ...prev, joingDateAD: convertedDate }));

      if (
        formData.workingTillDateBS &&
        !validateDates(newValue, formData.workingTillDateBS)
      ) {
        setDateError("Working till date cannot be before joining date");
      }
    } catch (error) {
      console.error("Failed to convert BS to AD:", error.message);
      setFormData((prev) => ({ ...prev, joingDateAD: "" }));
    }
  };

  const handleWorkingTillDateBsChange = (newValue) => {
    setFormData((prev) => ({ ...prev, workingTillDateBS: newValue }));
    setDateError(null);

    if (!newValue || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newValue)) {
      setFormData((prev) => ({ ...prev, workingTillDateAD: "" }));
      return;
    }

    try {
      const datePart = newValue.split("T")[0];
      const bsDateFormatted = datePart.replace(/-/g, "/");
      const convertedDate = BSToAD(bsDateFormatted);
      setFormData((prev) => ({ ...prev, workingTillDateAD: convertedDate }));

      if (
        formData.joingDateBS &&
        !validateDates(formData.joingDateBS, newValue)
      ) {
        setDateError("Working till date cannot be before joining date");
      }
    } catch (error) {
      console.error("Failed to convert BS to AD:", error.message);
      setFormData((prev) => ({ ...prev, workingTillDateAD: "" }));
    }
  };

  useEffect(() => {
    if (selectedAlumni?.id) {
      fetchWorkHistory();
      setFormData((prev) => ({
        ...prev,
        graduationApplicationId: selectedAlumni.id.toString(),
      }));
    } else {
      setWorkHistory([]);
    }
  }, [selectedAlumni]);

  const fetchWorkHistory = async () => {
    if (!selectedAlumni?.id) return;

    setFetching(true);
    setApiError(null);

    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${backendUrl}/AlumniEmployee?alumniId=${selectedAlumni.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data
        ? [response.data]
        : [];

      const filteredData = data.filter(
        (item) =>
          item?.graduationApplicationId === selectedAlumni.id ||
          item?.AlumniStudentId === selectedAlumni.id
      );

      const mappedData = filteredData.map((item) => ({
        id: item.id,
        organizationName: item.organizationName || item.OrganizationName || "",
        designation: item.designation || item.Designation || "",
        officeEmail: item.officeEmail || item.OfficeEmail || "",
        officePhone: item.officePhone || item.OfficePhone || "",
        officeAddress: item.officeAddress || item.OfficeAddress || "",
        workingStatus: item.workingStatus || item.WorkingStatus || "Active",
        joingDateBS: formatDate(item.joingDate || item.JoingDate || ""),
        joingDateAD: item.joingDateAD || item.JoingDateAD || "",
        workingTillDateBS: formatDate(
          item.workingTillDate || item.WorkingTillDate || ""
        ),
        workingTillDateAD:
          item.workingTillDateAD || item.WorkingTillDateAD || "",
        graduationApplicationId:
          item.graduationApplicationId || item.AlumniStudentId || "",
        province: item.province || item.Province || "",
        district: item.district || item.District || "",
        localLevel: item.localLevel || item.LocalLevel || "",
        wardNo: item.wardNo || item.WardNo || "",
        officeUrl: item.officeUrl || item.OfficeUrl || "",
        remarks: item.remarks || item.Remarks || "",
      }));

      setWorkHistory(mappedData.length ? mappedData : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setApiError(
        error.response?.status === 404
          ? "No work history found"
          : error.response?.data?.message || "Failed to load work history"
      );
      setWorkHistory([]);
    } finally {
      setFetching(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    if (dateString.startsWith("080-")) {
      return "";
    }

    if (dateString.includes("T")) {
      return dateString.split("T")[0].replace(/-/g, "/");
    }

    return dateString;
  };

  const getWardOptions = (municipality) => {
    const wards = noOfWards[municipality] || 0;
    return Array.from({ length: wards }, (_, i) => i + 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "officePhone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      setErrors((prev) => ({
        ...prev,
        officePhone: numericValue.length > 0 && numericValue.length !== 10,
      }));
      return;
    }

    if (name === "wardNo") {
      const numValue = value ? parseInt(value, 10) : "";
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
      setErrors((prev) => ({
        ...prev,
        wardNo: !value,
      }));
      return;
    }

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name] && value) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validateBeforeSubmit = () => {
    const requiredFields = [
      "graduationApplicationId",
      "organizationName",
      "designation",
      "joingDateBS",
      "province",
      "district",
      "localLevel",
      "wardNo",
      "officeAddress",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return false;
    }

    if (formData.officePhone && formData.officePhone.length !== 10) {
      toast.error("Office phone must be 10 digits");
      return false;
    }

    if (
      formData.joingDateBS &&
      formData.workingTillDateBS &&
      !validateDates(formData.joingDateBS, formData.workingTillDateBS)
    ) {
      toast.error("Working till date cannot be before joining date");
      return false;
    }

    return true;
  };

  const validateForm = () => {
    const newErrors = {
      organizationName: !formData.organizationName,
      designation: !formData.designation,
      joingDateBS: !formData.joingDateBS,
      province: !formData.province,
      district: !formData.district,
      localLevel: !formData.localLevel,
      wardNo: !formData.wardNo,
      officeAddress: !formData.officeAddress,
      officePhone: formData.officePhone && formData.officePhone.length !== 10,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const getAuthToken = () => {
    try {
      const localStorageData = JSON.parse(localStorage.getItem("persist:root"));
      const userState = JSON.parse(localStorageData?.user || "{}");
      return userState?.currentUser?.tokenString || "";
    } catch (error) {
      console.error("Error getting auth token:", error);
      return "";
    }
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();
    formDataToSend.append(
      "graduationApplicationId",
      formData.graduationApplicationId
    );

    if (formData.joingDateBS) {
      formDataToSend.append("joingDate", formData.joingDateBS);
      if (formData.joingDateAD) {
        formDataToSend.append("joingDateAD", formData.joingDateAD);
      }
    }

    if (formData.workingTillDateBS) {
      formDataToSend.append("workingTillDate", formData.workingTillDateBS);
      if (formData.workingTillDateAD) {
        formDataToSend.append("workingTillDateAD", formData.workingTillDateAD);
      }
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (
          key !== "graduationApplicationId" &&
          key !== "joingDateBS" &&
          key !== "joingDateAD" &&
          key !== "workingTillDateBS" &&
          key !== "workingTillDateAD" &&
          key !== "joiningLetter"
        ) {
          const finalValue =
            typeof value === "number" ? value.toString() : value;
          formDataToSend.append(key, finalValue);
        }
      }
    });

    if (formData.joiningLetter) {
      formDataToSend.append("joiningLetter", formData.joiningLetter);
    }

    return formDataToSend;
  };

  const submitWorkInfo = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication token not found");
      return null;
    }

    try {
      const formDataToSend = prepareFormData();

      const response = await axios.post(
        `${backendUrl}/AlumniEmployee/Create`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          throw new Error(`Validation errors:\n${errorMessages}`);
        }
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join?.(", ") ||
        "Failed to submit work information";
      throw new Error(errorMessage);
    }
  };

  const updateWorkInfo = async (id) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication token not found");
      return null;
    }

    try {
      const formDataToSend = prepareFormData();

      const response = await axios.put(
        `${backendUrl}/AlumniEmployee/Update/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          throw new Error(`Validation errors:\n${errorMessages}`);
        }
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join?.(", ") ||
        "Failed to update work information";
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) return;
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      let result;
      if (isEditMode && editingId) {
        result = await updateWorkInfo(editingId);
        toast.success("Work information updated successfully!");
      } else {
        result = await submitWorkInfo();
        toast.success("Work information added successfully!");
      }

      if (result) {
        await fetchWorkHistory();
        resetForm();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit work information");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (work) => {
    setIsEditMode(true);
    setEditingId(work.id);

    const newFormData = {
      ...initialFormData,
      graduationApplicationId:
        work.graduationApplicationId?.toString() ||
        selectedAlumni?.graduationApplicationId?.toString() ||
        selectedAlumni?.id?.toString() ||
        "",
      organizationName: work.organizationName || "",
      designation: work.designation || "",
      officeEmail: work.officeEmail || "",
      officePhone: work.officePhone || "",
      province: work.province || "",
      district: work.district || "",
      localLevel: work.localLevel || "",
      wardNo: work.wardNo?.toString() || "",
      officeAddress: work.officeAddress || "",
      officeUrl: work.officeUrl || "",
      workingStatus: work.workingStatus || "Active",
      joiningLetter: null,
      joingDateBS: work.joingDateBS || "",
      joingDateAD: work.joingDateAD || "",
      workingTillDateBS: work.workingTillDateBS || "",
      workingTillDateAD: work.workingTillDateAD || "",
      remarks: work.remarks || "",
    };

    setFormData(newFormData);

    if (work.province) setSelectedProvince(work.province);
    if (work.district) setSelectedDistrict(work.district);
    if (work.localLevel) setSelectedLocalLevel(work.localLevel);

    setErrors({
      organizationName: false,
      designation: false,
      joingDateBS: false,
      province: false,
      district: false,
      localLevel: false,
      wardNo: false,
      officeAddress: false,
      officePhone: false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedLocalLevel(null);
    setIsEditMode(false);
    setEditingId(null);
    setDateError(null);
    setErrors({
      organizationName: false,
      designation: false,
      joingDateBS: false,
      province: false,
      district: false,
      localLevel: false,
      wardNo: false,
      officeAddress: false,
      officePhone: false,
    });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const renderWorkingTillDate = (date) => {
    if (!date || date === "080-01-01T00:00:00") return "Still working....";
    return date;
  };

  return (
    <>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: "rgb(25, 118, 210)",
              textAlign: "center",
            }}
          >
            {isEditMode ? (
              <span>
                Edit Work Information of Alumni{" "}
                <strong>{selectedAlumni.applicantNameEng}</strong>
              </span>
            ) : selectedAlumni ? (
              <span>
                Adding working details of Alumni{" "}
                <strong>{selectedAlumni.applicantNameEng}</strong>
              </span>
            ) : (
              "Add Alumni Work Information"
            )}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Paper elevation={0} sx={{ padding: 2, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <input
                type="hidden"
                name="graduationApplicationId"
                value={formData.graduationApplicationId}
              />

              <Grid item xs={12} sm={3.7}>
                <TextField
                  name="organizationName"
                  label="Organization Name"
                  fullWidth
                  size="small"
                  value={formData.organizationName}
                  onChange={handleChange}
                  error={errors.organizationName}
                  helperText={
                    errors.organizationName && "Organization name is required"
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={2.7}>
                <TextField
                  name="designation"
                  label="Designation"
                  fullWidth
                  size="small"
                  value={formData.designation}
                  onChange={handleChange}
                  error={errors.designation}
                  helperText={errors.designation && "Designation is required"}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={3.3}>
                <TextField
                  name="officeEmail"
                  label="Office Email"
                  fullWidth
                  size="small"
                  type="email"
                  value={formData.officeEmail}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={2.3}>
                <FormControl
                  fullWidth
                  size="small"
                  required
                  error={errors.province}
                >
                  <InputLabel>Province</InputLabel>
                  <Select
                    name="province"
                    label="Province"
                    value={formData.province}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "province", value: e.target.value },
                      });
                      setSelectedProvince(e.target.value);
                      setSelectedDistrict(null);
                      setSelectedLocalLevel(null);
                      setFormData((prev) => ({
                        ...prev,
                        district: "",
                        localLevel: "",
                        wardNo: "",
                      }));
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Province
                    </MenuItem>
                    {uniqueProvinces.map((province, index) => (
                      <MenuItem key={index} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.province && (
                    <Typography variant="caption" color="error">
                      Province is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl
                  fullWidth
                  size="small"
                  required
                  error={errors.district}
                >
                  <InputLabel>District</InputLabel>
                  <Select
                    name="district"
                    label="District"
                    value={formData.district}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "district", value: e.target.value },
                      });
                      setSelectedDistrict(e.target.value);
                      setSelectedLocalLevel(null);
                      setFormData((prev) => ({
                        ...prev,
                        localLevel: "",
                        wardNo: "",
                      }));
                    }}
                    disabled={!formData.province}
                  >
                    <MenuItem value="" disabled>
                      Select District
                    </MenuItem>
                    {uniqueDistricts.map((district, index) => (
                      <MenuItem key={index} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.district && (
                    <Typography variant="caption" color="error">
                      District is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3.5}>
                <FormControl
                  fullWidth
                  size="small"
                  required
                  error={errors.localLevel}
                >
                  <InputLabel>Local Level</InputLabel>
                  <Select
                    name="localLevel"
                    label="Local Level"
                    value={formData.localLevel}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "localLevel", value: e.target.value },
                      });
                      setSelectedLocalLevel(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        wardNo: "",
                      }));
                    }}
                    disabled={!formData.district}
                  >
                    <MenuItem value="" disabled>
                      Select Local Level
                    </MenuItem>
                    {uniqueLocalLevels.map((localLevel, index) => (
                      <MenuItem key={index} value={localLevel}>
                        {localLevel}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.localLevel && (
                    <Typography variant="caption" color="error">
                      Local Level is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <FormControl
                  fullWidth
                  size="small"
                  required
                  error={errors.wardNo}
                >
                  <InputLabel>Ward No.</InputLabel>
                  <Select
                    name="wardNo"
                    label="Ward No."
                    value={formData.wardNo}
                    onChange={handleChange}
                    disabled={!selectedLocalLevel}
                  >
                    <MenuItem value="" disabled>
                      {!selectedLocalLevel
                        ? "Select Local Level first"
                        : "Select Ward"}
                    </MenuItem>
                    {getWardOptions(formData.localLevel).map((ward) => (
                      <MenuItem key={ward} value={ward}>
                        {ward}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.wardNo && (
                    <Typography variant="caption" color="error">
                      Ward number is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  name="officeAddress"
                  label="Office Address"
                  fullWidth
                  size="small"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  error={errors.officeAddress}
                  helperText={errors.officeAddress && "Address is required"}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  name="officePhone"
                  label="Office Phone"
                  fullWidth
                  size="small"
                  value={formData.officePhone}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXX"
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  error={errors.officePhone}
                  helperText={errors.officePhone ? "Must be 10 digits" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={3.1}>
                <TextField
                  name="officeUrl"
                  label="Office URL"
                  fullWidth
                  size="small"
                  value={formData.officeUrl}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={1.9}>
                <BikramSambatDateInput
                  name="joingDateBS"
                  label="Joining Date (B.S)"
                  format={"YYYY/MM/DD"}
                  value={formData.joingDateBS || ""}
                  onChange={handleJoingDateBsChange}
                  error={errors.joingDateBS || !!dateError}
                  helperText={
                    errors.joingDateBS
                      ? "Joining date is required"
                      : dateError || ""
                  }
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <BikramSambatDateInput
                  name="workingTillDateBS"
                  label="Working Till Date (B.S)"
                  format={"YYYY/MM/DD"}
                  value={formData.workingTillDateBS || ""}
                  onChange={handleWorkingTillDateBsChange}
                  error={!!dateError}
                  helperText={dateError || ""}
                />
              </Grid>

              <Grid item xs={12} sm={1.5}>
                <TextField
                  select
                  name="workingStatus"
                  label="Status"
                  size="small"
                  fullWidth
                  value={formData.workingStatus}
                  onChange={handleChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={3.5}>
                <TextField
                  name="joiningLetter"
                  type="file"
                  size="small"
                  label="Joining Letter"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  inputProps={{ accept: "application/pdf" }}
                />
                {isEditMode && (
                  <Typography variant="caption" color="textSecondary">
                    Leave empty to keep existing file
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  name="remarks"
                  label="Remarks"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          {isEditMode && (
            <Button
              onClick={handleCancelEdit}
              variant="outlined"
              color="secondary"
            >
              Cancel Edit
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            marginTop: "20px",
            textAlign: "center",
            color: "primary.main",
            mb: 2,
          }}
        >
          {selectedAlumni?.name
            ? `${selectedAlumni.name}'s Work History`
            : "Work History"}
        </Typography>

        {apiError && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {apiError}
          </Typography>
        )}

        <TableContainer component={Paper}>
          <Table
            sx={{
              "& .MuiTableCell-root": {
                borderRight: "1px solid rgba(224, 224, 224, 1)",
                "&:last-child": { borderRight: "none" },
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "primary.main",
                  "& th": {
                    color: "white",
                    fontWeight: "bold",
                    borderRight: "1px solid rgba(255, 255, 255, 0.5)",
                    "&:last-child": { borderRight: "none" },
                  },
                }}
              >
                <TableCell>Organization</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Office Email</TableCell>
                <TableCell>Office Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Resignation date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetching ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading work history...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : workHistory.length > 0 ? (
                workHistory.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell>{work.organizationName}</TableCell>
                    <TableCell>{work.designation}</TableCell>
                    <TableCell>{work.officeEmail}</TableCell>
                    <TableCell>{work.officePhone}</TableCell>
                    <TableCell>{work.officeAddress}</TableCell>
                    <TableCell>{work.workingStatus}</TableCell>
                    <TableCell>{work.joingDateBS}</TableCell>
                    <TableCell>
                      {renderWorkingTillDate(work.workingTillDateBS)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(work)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {selectedAlumni?.id
                        ? "No work history records found"
                        : "Please select an alumni first"}
                    </Typography>
                    {selectedAlumni?.id && (
                      <Button
                        variant="text"
                        color="primary"
                        onClick={fetchWorkHistory}
                        sx={{ mt: 1 }}
                      >
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </>
  );
};

export default AlumniAddWork;
