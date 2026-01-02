
import axios from "axios";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const backendUrl = config.VITE_BACKEND_URL;

export async function getTeachingStaffByQualification() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/college/teachingStaffQualifications`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getEnrollmentByEcobelts(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/college/enrollment-by-ecological-belt?fiscalyearid=${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getProvinceWiseEnrollment(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/college/GenerateStudentByProgramProvinceReport/?fiscalyearid=${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getFacultyNamesForTeaching() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/college/GenerateStudentByProgramProvinceReport`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getDepartmentNamesForTeaching() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Management/Departments`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getTeachersByPosition(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Dashboard/College/GetTeachingStaffDistribution?fiscalyearid=${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getTeachersByFaculty(fiscalId) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request

    let url = `${backendUrl}/Dashboard/college/StudentTeacherRatio`;
    if (fiscalId) {
      url += `?fiscalYearId=${fiscalId}`;
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    console.error("Error fetching teachers by faculty:", err);
    throw err;
  }
}

export async function getStatReportForAnualProgram(fiscalId) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/GetAnnualProgramReport?fiscalyearid=${fiscalId}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getStatReportForSemesterProgram(fiscalId) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/GetSemesterProgramReport?fiscalyearid=${fiscalId}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function addSignedStatReport(data) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.post(
      `${backendUrl}/UploadReport`,
      data,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Error uploading signed Report:", err);
    throw err;
  }
}

export async function getSignedReportByCampusId(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/CampusReport/GetByCampus/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteSignedReport(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    await axios.delete(
      `${backendUrl}/UploadReport/${id}`,
      config
    );
  } catch (err) {
    console.log(err);
  }
}

export async function getDropoutStdReport(fiscalId) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/GetStudentsDropOutReport?fiscalyearid=${fiscalId}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getTeachersByDepartments() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    const response = await axios.get(
      `${backendUrl}/Dashboard/College/GetTeachingStaffByDepartment`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getResearchPubDetail() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request
    const response = await axios.get(
      `${backendUrl}/ResearchPublication`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function deletePubDetailById(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request
    const response = await axios.delete(`${backendUrl}/ResearchPublication/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error while deleting content:", error.response?.data || error.message);
    throw error;
  }
}

export async function getResearchPubDetailById(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request
    const response = await axios.get(
      `${backendUrl}/ResearchPublication/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateResearchPubDetailById(id, data) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request
    const response = await axios.patch(
      `${backendUrl}/ResearchPublication/${id}`,
      data,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function addNewResearchPublication(data) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.post(
      `${backendUrl}/ResearchPublication`,
      data,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Error adding new Research publication:", err);
    throw err;
  }
}

export async function getFinanciDetailByFinanceHead(fiscalId) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request
    const response = await axios.get(
      `${backendUrl}/IncomeExpenditureEntry?fiscalYearId=${fiscalId}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function addStudentDoc(data) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.post(
      `${backendUrl}/studentprofile/upsert`,
      data,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Error adding new Research publication:", err);
    throw err;
  }
}

export async function getStdDocById(id) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/studentprofile/by-student/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Error adding new Research publication:", err);
    throw err;
  }
}

export async function getGraduationDataByGender({ fiscalId, campusId }) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request

    let url = `${backendUrl}/Dashboard/College/GetGraduationByGender`;
    const queryParams = [];

    if (fiscalId) {
      queryParams.push(`fiscalYearId=${fiscalId}`);
    }
    if (campusId) {
      queryParams.push(`campusId=${campusId}`);
    }

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getGraduationDataByEthnicity({ fiscalId, campusId }) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request

    let url = `${backendUrl}/Dashboard/College/GetGraduationByEthnicity`;
    const queryParams = [];

    if (fiscalId) {
      queryParams.push(`fiscalYearId=${fiscalId}`);
    }
    if (campusId) {
      queryParams.push(`campusId=${campusId}`);
    }

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getGraduationDataByAgeGroup({ fiscalId, facultyId, levelId, programId }) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request

    let url = `${backendUrl}/Dashboard/Report/GetStudentsByAgeGroupForCollege`;
    const queryParams = [];

    if (fiscalId) {
      queryParams.push(`fiscalyearid=${fiscalId}`);
    }
    if (facultyId) {
      queryParams.push(`facultyid=${facultyId}`);
    }
    if (levelId) {
      queryParams.push(`levelid=${levelId}`);
    }
    if (programId) {
      queryParams.push(`programid=${programId}`);
    }

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getPassRateForCampus({ fiscalId, facultyId, levelId, campusId }) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request

    let url = `${backendUrl}/Dashboard/GetPassRateByProgram`;
    const queryParams = [];

    if (fiscalId) {
      queryParams.push(`fiscalyearid=${fiscalId}`);
    }
    if (facultyId) {
      queryParams.push(`facultyid=${facultyId}`);
    }
    if (levelId) {
      queryParams.push(`levelid=${levelId}`);
    }
    if (campusId) {
      queryParams.push(`collegeId=${campusId}`);
    }
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getNonTeachingReportByPost() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Employee/Report/GetNonTeachingStaffByPostSummary`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getNonTeachingReportBySection() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Employee/Report/GetNonEmployeeBySection`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getTeachingStaffByPostSummary() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Employee/Report/GetTeachingStaffByPostSummary`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getNonTeachingStaffByPostSummary() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Employee/Report/GetNonTeachingStaffByPostSummary`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLandDetailsOfCampus() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Lands`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLabDetailsOfCampus() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Labs`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getBuildingDetailsOfCampus() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Buildings`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getHostelDetailsOfCampus() {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    config.headers["Content-Type"] = "multipart/form-data";
    const response = await axios.get(
      `${backendUrl}/Hostels`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export const getFacilityDataForCampus = async () => {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request
    const response = await axios.get(`${backendUrl}/Facilty`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility data:", error);
  }
};

export const getEquipmentForCampus = async () => {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; // Remove Content-Type for this request
    const response = await axios.get(`${backendUrl}/FurnitureEquipmentVehicle`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility data:", error);
  }
};

export async function getPassrateOfLast5FY(campusId) {
  try {
    const config = getAuthConfigSafe();
    if (!config) {
      throw new Error("Authentication not available");
    }
    delete config.headers["Content-Type"]; 
    
    let url = `${backendUrl}/PassRateCalculation/GetPassRateCalculation`;
    const queryParams = [];
    if (campusId) {
      queryParams.push(`campusId=${campusId}`);
    }
    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}





