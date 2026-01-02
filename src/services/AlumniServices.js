import axios from "axios";
import { config as appConfig } from "@config";

 const backendUrl = appConfig.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: backendUrl,
});

// AlumniEmployeeService with flexible filtering
export const AlumniEmployeeService = {
  getAll: () => api.get("/AlumniEmployee"),

  getById: (id, token) =>
    api.get(`/AlumniEmployee/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  // Fetch by Graduation Application ID
  getByGraduationId: (graduationApplicationId) =>
    api.get(
      `/AlumniEmployee/ByGraduationApplication?graduationApplicationId=${graduationApplicationId}`
    ),

  // Fetch by multiple filters
  getByFilters: ({ programId, campusId, enrollmentYear, token }) =>
    api.get("/AlumniEmployee", {
      params: {
        ...(programId && { programId }),
        ...(campusId && { campusId }),
        ...(enrollmentYear && { enrollmentYear }),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  //  Fetch students by batch in Batchmate
  getStudentsByBatch: ({ enrolledYear, campusId, programId, token, pageNumber = 1, pageSize = 9999 }) => {
  // Ensure all parameters are numbers
  const params = {
    enrolledYear: Number(enrolledYear),
    campusId: Number(campusId),
    programId: Number(programId),
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
  };
  
  return api.get("/Graduation/StudentsByBatch", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
},

   getBatchById: (id, token) =>
    api.get(`/Batch/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // CRUD operations
  create: (data) => api.post("/AlumniEmployee/Create", data),

  //update
  update: (id, data, token) =>
    api.put(`/AlumniEmployee/Update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // optional, Axios sets it automatically
      },
    }),

  delete: (id, token) =>
    api.delete(`/AlumniEmployee/Delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // User operations
  changePassword: (data) => api.post("/User/ChangePassword", data),
};

// Fetch graduation data with optional filters and token
export const fetchGraduationData = async (
  token,
  programId,
  campusId,
  batchId
) => {
  const authToken = token || localStorage.getItem("authToken");
  if (!authToken) throw new Error("No token available");

  const params = {};
  if (programId) params.programId = programId;
  if (campusId) params.campusId = campusId;
  if (batchId) params.batchId = batchId;

  const res = await axios.get(`${backendUrl}/Graduation`, {
    headers: { Authorization: `Bearer ${authToken}` },
    params,
  });

  return res.data;
};

// SIMPLIFIED VERSION - Just fetch by ID without filters
export const fetchGraduationDataById = async ({ id, token }) => {
  const authToken = token || localStorage.getItem("authToken");
  if (!authToken) throw new Error("No token available");
  if (!id) throw new Error("Graduation ID is required");


  try {
    const response = await axios.get(`${backendUrl}/Graduation/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error Response:", error.response);
    throw error;
  }
};
