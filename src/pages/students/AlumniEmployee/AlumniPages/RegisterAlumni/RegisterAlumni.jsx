import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { BSToAD } from "bikram-sambat-js";
import { StdDocUploader } from "../../../StdDocUploader";
import {
  fetchFiscalYears,
  validateAlumniForm,
  createAlumniPayload,
  useCreateAlumniMutation,
  getInitialFormData,
  getInitialFileUploads,
  fetchEthinicGroups,
} from "./RegisterApi";
import BikramSambatDateInput from "../../../../../components/DateField/DateInputField";
import { config as appConfig } from "@config";
import { useAlumni } from "../../../../../context/AlumniContext";
import { getProgramByCollegeId } from "../../../../../services/services";

export default function AlumniRegistration() {
  const campusId = appConfig.VITE_CAMPUSID;
  const { programId } = useAlumni();

  const [formData, setFormData] = useState(
    getInitialFormData(campusId, programId)
  );

  const [fileUploads, setFileUploads] = useState(getInitialFileUploads());
  const [errors, setErrors] = useState({});
  const [fiscalYears, setFiscalYears] = useState([]);
  const [ethnicGroup, setEthnicGroup] = useState([]);
  const [programs, setPrograms] = useState([]);

  // -------------------- Handlers --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "Level") setLevel(value);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (fieldName, file) => {
    setFileUploads((prev) => ({ ...prev, [fieldName]: file }));
  };
  // Convert BS -> AD for DOB
  const handleDobBsChange = (newValue) => {
    setFormData((prev) => ({ ...prev, DoBNepali: newValue }));

    if (!newValue || typeof newValue !== "string") {
      setFormData((prev) => ({ ...prev, DoBEng: "" }));
      return;
    }

    try {
      const datePart = newValue.split("T")[0];
      const bsDateFormatted = datePart.replace(/-/g, "/");
      const converted = BSToAD(bsDateFormatted);
      const convertedNormalized = converted.replace(/\//g, "-");
      setFormData((prev) => ({ ...prev, DoBEng: convertedNormalized }));
    } catch (err) {
      console.error("Failed to convert BS -> AD (DOB):", err);
      setFormData((prev) => ({ ...prev, DoBEng: "" }));
    }
  };

  // Convert BS -> AD for issue date
  const handleIssueDateBsChange = (newValue) => {
    setFormData((prev) => ({ ...prev, IssueDateNep: newValue }));

    if (!newValue || typeof newValue !== "string") {
      setFormData((prev) => ({ ...prev, IssueDateEng: "" }));
      return;
    }

    try {
      const datePart = newValue.split("T")[0];
      const bsDateFormatted = datePart.replace(/-/g, "/");
      const converted = BSToAD(bsDateFormatted);
      const convertedNormalized = converted.replace(/\//g, "-");
      setFormData((prev) => ({ ...prev, IssueDateEng: convertedNormalized }));
    } catch (err) {
      console.error("Failed to convert BS -> AD (issue date):", err);
      setFormData((prev) => ({ ...prev, IssueDateEng: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = validateAlumniForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm())
      return toast.error("Please fix the errors in the form");

    const payload = createAlumniPayload(formData, fileUploads);
    createAlumniMutation.mutate(payload, {
      onSuccess: () => handleClear(),
    });
  };

  const handleClear = () => {
  setFormData(getInitialFormData(campusId, ""));
  setFileUploads(getInitialFileUploads());
  setErrors({});
};


  // -----------------Fetching Api data------------------------
  useEffect(() => {
    const loadData = async () => {
      const [ethnic, fiscal] = await Promise.all([
        fetchEthinicGroups(),
        fetchFiscalYears(),
      ]);
      setEthnicGroup(ethnic);
      setFiscalYears(fiscal);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!campusId) return;

    const loadPrograms = async () => {
      const data = await getProgramByCollegeId(campusId);
      setPrograms(Array.isArray(data) ? data : []);
    };

    loadPrograms();
  }, [campusId]);

  // React Query mutation for submit
  const createAlumniMutation = useCreateAlumniMutation();

  // Styling helpers
  const outerBorderStyle = {
    position: "relative",
    borderRadius: "5px",
    border: "1px dashed #c1c1c1",
    marginTop: "30px",
    paddingX: "1px",
  };

  const sectionHeadingStyle = {
    position: "absolute",
    top: "-10px",
    color: "#666666",
    left: "15px",
    border: "1px solid #666666",
    borderRadius: "10px",
    background: "white",
    padding: "2px 8px",
    fontWeight: "500",
  };

  return (
    <Box className="bg-indigo-100 flex items-center justify-center p-10 pb-20">
      <Box className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Title */}
        <Box className="w-full bg-gradient-to-br from-purple-400 to-indigo-400 p-6 mb-4">
          <Typography
            variant="h4"
            className="text-center text-white font-extrabold tracking-wide drop-shadow-md"
          >
            Alumni Registration
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ paddingX: "8px" }}>
            {/* Row 1 */}
            <Grid item xs={12} sm={6} md={2.3}>
              <TextField
                fullWidth
                select
                label="Graduated Fiscalyear"
                required
                size="small"
                name="FiscalYearID"
                value={formData.FiscalYearID || ""}
                onChange={handleChange}
                error={!!errors.FiscalYearID}
                helperText={errors.FiscalYearID}
              >
                <MenuItem value="" disabled>
                  Select Fiscal Year
                </MenuItem>
                {fiscalYears.map((fy) => (
                  <MenuItem key={fy.id} value={fy.id}>
                    {fy.yearNepali || `Fiscal Year ${fy.yearNepali}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3.4}>
              <TextField
                fullWidth
                label="आवेदकको नाम देवनागरीमा (Unicode)"
                size="small"
                name="ApplicantNameNep"
                value={formData.ApplicantNameNep}
                onChange={handleChange}
                error={!!errors.ApplicantNameNep}
                helperText={errors.ApplicantNameNep}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3.6}>
              <TextField
                fullWidth
                label="Applicant Name (English)"
                required
                size="small"
                name="ApplicantNameEng"
                value={formData.ApplicantNameEng}
                onChange={handleChange}
                error={!!errors.ApplicantNameEng}
                helperText={errors.ApplicantNameEng}
              />
            </Grid>

            {/* Row 2 - DOB */}
            <Grid item xs={12} sm={6} md={2.7}>
              <BikramSambatDateInput
                required
                label="Date of Birth (B.S)"
                name="DoBNepali"
                value={formData.DoBNepali}
                onChange={handleDobBsChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.3}>
              <TextField
                name="DoBEng"
                size="small"
                label="Date of Birth (A.D)"
                value={formData.DoBEng}
                InputProps={{ readOnly: true }}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3.4}>
              <TextField
                fullWidth
                label="Email"
                required
                size="small"
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                error={!!errors.Email}
                helperText={errors.Email}
              />
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} sm={6} md={1.9}>
              <TextField
                fullWidth
                label="Gender"
                select
                required
                size="small"
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                error={!!errors.Gender}
                helperText={errors.Gender}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Ethinicity"
                select
                required
                size="small"
                name="Ethinicity"
                value={formData.Ethinicity}
                onChange={handleChange}
                error={!!errors.Ethinicity}
                helperText={errors.Ethinicity}
              >
                <MenuItem value="" disabled>
                  Select Ethinicity
                </MenuItem>
                {ethnicGroup?.map((data) => (
                  <MenuItem key={data.id} value={data.name}>
                    {data.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="Registration Number"
                required
                size="small"
                name="StudentRegNo"
                value={formData.StudentRegNo}
                onChange={handleChange}
                error={!!errors.StudentRegNo}
                helperText={errors.StudentRegNo}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="StudentAddress"
                required
                size="small"
                name="StudentAddress"
                value={formData.StudentAddress}
                onChange={handleChange}
                error={!!errors.StudentAddress}
                helperText={errors.StudentAddress}
              />
            </Grid>

            {/* Date of Issue */}
            <Grid item xs={12} sm={6} md={3}>
              <BikramSambatDateInput
                required
                label="Date of Issue (B.S)"
                name="IssueDateNep"
                value={formData.IssueDateNep}
                onChange={handleIssueDateBsChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="IssueDateEng"
                size="small"
                label="Date of Issue (A.D)"
                value={formData.IssueDateEng}
                InputProps={{ readOnly: true }}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="University Issue No."
                size="small"
                name="UniversityIssueNo"
                value={formData.UniversityIssueNo}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Symbol Number"
                size="small"
                name="SymbolNoUniversity"
                value={formData.SymbolNoUniversity}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Campus Roll No."
                size="small"
                name="CampusRollNo"
                value={formData.CampusRollNo}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Enrolled Year (B.S)"
                name="EnrolledYear"
                required
                size="small"
                value={formData.EnrolledYear}
                onChange={handleChange}
                error={!!errors.EnrolledYear}
                helperText={errors.EnrolledYear}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Passed Year (B.S)"
                name="PassedYear"
                required
                size="small"
                value={formData.PassedYear}
                onChange={handleChange}
                error={!!errors.PassedYear}
                helperText={errors.PassedYear}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Program"
                required
                size="small"
                name="ProgramMgmtId"
                value={formData.ProgramMgmtId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ProgramMgmtId: Number(e.target.value),
                  }))
                }
                error={!!errors.ProgramMgmtId}
                helperText={errors.ProgramMgmtId}
              >
                <MenuItem value="" disabled>
                  Select Program
                </MenuItem>

                {programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.programName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Grade / Division"
                name="Division"
                size="small"
                value={formData.Division}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="GPA / Percentage"
                name="GPA"
                size="small"
                value={formData.GPA}
                onChange={handleChange}
              />
            </Grid>

            {/* Names and Contact */}
            <Grid item xs={12} sm={6} md={3.5}>
              <TextField
                fullWidth
                label="Father Name"
                required
                size="small"
                name="FatherName"
                value={formData.FatherName}
                onChange={handleChange}
                error={!!errors.FatherName}
                helperText={errors.FatherName}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Mother Name"
                size="small"
                name="MotherName"
                value={formData.MotherName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Contact Number"
                required
                size="small"
                type="tel"
                name="ContactNo"
                value={formData.ContactNo}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  if (raw.length <= 10) {
                    handleChange({
                      target: { name: "ContactNo", value: raw },
                    });
                  }
                }}
                error={!!errors.ContactNo}
                helperText={errors.ContactNo}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={2}
                size="small"
                name="Remarks"
                value={formData.Remarks}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Document Upload Section */}
          <Grid container item xs={12} sx={outerBorderStyle}>
            <Typography sx={sectionHeadingStyle}>
              Passport size photo & Documents
            </Typography>

            <Grid
              item
              xs={12}
              sm={6}
              md={2}
              sx={{ pt: 4 , pl: 1, pb: 1, ml: 3 }}
            >
              <StdDocUploader
                label="Upload PP size photo"
                name="UploadPPSizePhoto"
                value={fileUploads.UploadPPSizePhoto}
                onFileChange={(file) =>
                  handleFileChange("UploadPPSizePhoto", file)
                }
                acceptedTypes="image/*"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={2}
              sx={{ pt: 4, pl: 2, pb: 1, ml: 3 }}
            >
              <StdDocUploader
                label="Upload Transcript"
                name="UploadTranscript"
                value={fileUploads.UploadTranscript}
                onFileChange={(file) =>
                  handleFileChange("UploadTranscript", file)
                }
                acceptedTypes="image/*,application/pdf"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={2}
              sx={{ pt: 4, pl: 1, pb: 1, ml: 3 }}
            >
              <StdDocUploader
                label="Upload Receipt"
                name="UploadReceipt"
                value={fileUploads.UploadReceipt}
                onFileChange={(file) => handleFileChange("UploadReceipt", file)}
                acceptedTypes="image/*,application/pdf"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={2}
              sx={{ pt: 4, pl: 1, pb: 1, ml: 3 }}
            >
              <StdDocUploader
                label="Upload Other Doc"
                name="UploadOtherDoc"
                value={fileUploads.UploadOtherDoc}
                onFileChange={(file) =>
                  handleFileChange("UploadOtherDoc", file)
                }
                acceptedTypes="image/*,application/pdf"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={2}
              sx={{ pt: 4, pl: 1, pb: 1, ml: 3 }}
            >
              <StdDocUploader
                label="Upload Signature"
                name="UploadSignature"
                value={fileUploads.UploadSignature}
                onFileChange={(file) =>
                  handleFileChange("UploadSignature", file)
                }
                acceptedTypes="image/*"
              />
            </Grid>
          </Grid>

          {/* Submit and Clear Buttons */}
          <Box className="flex justify-center gap-4 mt-10 pb-8">
            <Button
              type="submit"
              variant="contained"
              className="px-6 py-2 bg-gradient-to-br from-purple-400 to-indigo-400 text-white font-bold shadow-md hover:opacity-90"
              disabled={createAlumniMutation.isLoading}
            >
              {createAlumniMutation.isLoading ? "Submitting..." : "Submit"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              className="px-6 py-2 font-bold border-gray-400 text-gray-700 hover:bg-gray-100"
              onClick={handleClear}
              type="button"
            >
              Clear
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
