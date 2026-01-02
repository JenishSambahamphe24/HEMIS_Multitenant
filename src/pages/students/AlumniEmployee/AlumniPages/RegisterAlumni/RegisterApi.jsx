import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { BSToAD, ADToBS } from "bikram-sambat-js";
import { config as appConfig } from "@config";

const backendUrl = appConfig?.VITE_BACKEND_URL || "";

// -------------------- Date Helpers --------------------
export const getTodayBS = () => {
  const today = new Date();
  const todayAD = today.toISOString().split("T")[0].replace(/-/g, "/");
  try {
    return ADToBS(todayAD);
  } catch {
    return "";
  }
};

export const getTodayAD = () => {
  return new Date().toISOString().split("T")[0];
};

// -------------------- Validation --------------------
export const validatePhone = (value) => {
  if (!value) {
    return "Contact number is required";
  }
  if (!/^[0-9]{10}$/.test(value)) {
    return "Please enter a valid 10-digit phone number";
  }
  return "";
};

export const validateAlumniForm = (formData) => {
  const errors = {};

  if (!formData.ApplicantNameEng?.trim()) {
    errors.ApplicantNameEng = "Applicant name (English) is required";
  }

  if (!formData.ApplicantNameNep?.trim()) {
    errors.ApplicantNameNep = "Applicant name (Nepali) is required";
  }

  if (!formData.Email) {
    errors.Email = "Email is required";
  }

  const phoneErr = validatePhone(formData.ContactNo || "");
  if (phoneErr) {
    errors.ContactNo = phoneErr;
  }

  if (!formData.Gender) {
    errors.Gender = "Gender is required";
  }

  if (!formData.Ethinicity) {
    errors.Ethinicity = "Ethnicity is required";
  }

  return errors;
};

// -------------------- FormData / Payload --------------------
export const createAlumniPayload = (formData, fileUploads) => {
  const payload = new FormData();

  // Append all textual form fields matching API field names exactly
  const textFields = {
    FiscalYearID: formData.FiscalYearID,
    ApplicantNameEng: formData.ApplicantNameEng,
    ApplicantNameNep: formData.ApplicantNameNep,
    DoBNepali: formData.DoBNepali,
    DoBEng: formData.DoBEng,
    Email: formData.Email,
    Gender: formData.Gender,
    Ethinicity: formData.Ethinicity,
    StudentAddress: formData.StudentAddress,
    StudentRegNo: formData.StudentRegNo,
    IssueDateNep: formData.IssueDateNep,
    IssueDateEng: formData.IssueDateEng,
    UniversityIssueNo: formData.UniversityIssueNo,
    SymbolNoUniversity: formData.SymbolNoUniversity,
    CampusRollNo: formData.CampusRollNo,
    EnrolledYear: formData.EnrolledYear,
    PassedYear: formData.PassedYear,
    Division: formData.Division,
    GPA: formData.GPA,
    FatherName: formData.FatherName,
    MotherName: formData.MotherName,
    ContactNo: formData.ContactNo,
    Remarks: formData.Remarks,
    Status: formData.Status,
    CampusId: Number(formData.CampusId),
     ProgramMgmtId: Number(formData.ProgramMgmtId),
  };

  Object.entries(textFields).forEach(([key, value]) => {
    payload.append(key, value !== undefined && value !== null ? value : "");
  });

  // Append files if present - using exact API field names
  if (fileUploads.UploadPPSizePhoto) {
    payload.append("UploadPPSizePhoto", fileUploads.UploadPPSizePhoto);
  }
  if (fileUploads.UploadSignature) {
    payload.append("UploadSignature", fileUploads.UploadSignature);
  }
  if (fileUploads.UploadReceipt) {
    payload.append("UploadReceipt", fileUploads.UploadReceipt);
  }
  if (fileUploads.UploadTranscript) {
    payload.append("UploadTranscript", fileUploads.UploadTranscript);
  }
  if (fileUploads.UploadOtherDoc) {
    payload.append("UploadOtherDoc", fileUploads.UploadOtherDoc);
  }

  return payload;
};

//------------------- API mutation function-----------------------------
export const createAlumni = async (data) => {
  const response = await axios.post(
    `${backendUrl}/Graduation/AlumniSubmitGraduationApplication`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// React Query mutation hook
export const useCreateAlumniMutation = () => {
  return useMutation({
    mutationFn: createAlumni,
    onSuccess: () => {
      toast.success("Alumni registered successfully!");
    },
    onError: (err) => {
      console.error("Submission error:", err);
      const message =
        err?.response?.data?.message || "Failed to register alumni";
      toast.error(message);
    },
  });
};

// Initial form data
export const getInitialFormData = (CampusId = 0, ProgramMgmtId
 = "") => ({
  FiscalYearID: "",
  ApplicantNameEng: "",
  ApplicantNameNep: "",
  DoBNepali: "",
  DoBEng: "",
  Email: "",
  Gender: "",
  Ethinicity: "",
  StudentAddress: "",
  StudentRegNo: "",
  IssueDateNep: getTodayBS(),
  IssueDateEng: getTodayAD(),
  UniversityIssueNo: "",
  SymbolNoUniversity: "",
  CampusRollNo: "",
  EnrolledYear: "",
  PassedYear: "",
  Division: "",
  GPA: "",
  FatherName: "",
  MotherName: "",
  ContactNo: "",
  Remarks: "",
  Status: "",
  CampusId,
  ProgramMgmtId

});

// Initial file uploads
export const getInitialFileUploads = () => ({
  UploadPPSizePhoto: null,
  UploadSignature: null,
  UploadReceipt: null,
  UploadTranscript: null,
  UploadOtherDoc: null,
});

// -------------------- New API Fetch Functions --------------------
export const fetchEthinicGroups = async () => {
  try {
    const response = await axios.get(`${backendUrl}/EthinicGroup`);
    return response.data || [];
  } catch (err) {
    console.error("Error fetching ethnic groups:", err);
    return [];
  }
};

export const fetchFiscalYears = async () => {
  try {
    const response = await axios.get(`${backendUrl}/FiscalYear`);
    return response.data || [];
  } catch (err) {
    console.error("Error fetching fiscal years:", err);
    return [];
  }
};
