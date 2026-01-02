import axios from "axios";
import { getAuthConfigSafe } from "../utils/dateUtils";

import {config} from '@config';
const backendUrl = config.VITE_BACKEND_URL;


export async function getIdCardBatches() {
  try {
    const auth = getAuthConfigSafe();
    const response = await axios.get(`${backendUrl}/IdCardInfo/batches`, auth);
    return response.data;
  } catch (err) {
    console.error("API ERROR:", err);
    return [];
  }
}

export async function getIdCardInfoByBatchId(id) {
  try {
    const auth = getAuthConfigSafe();
    const response = await axios.get(`${backendUrl}/IdCardInfo/by-batchNo/${id}`, auth);
    return response.data;
  } catch (err) {
    console.error("API ERROR:", err);
    return [];
  }
}


export async function getEthnicGroup(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/EthinicGroup`, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCollegePrograms() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/ProgramMgmt/GetCollegePrograms`, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllSemesters() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/StudentUpgrade/Semesters`, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllYears() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/StudentUpgrade/Years`, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllProgramsWithMajorSubs() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/MajorSubject/GetProgramsWithMajorSubjects`, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllAlumniStudents() {
  try {
   const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Graduation`, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}
//for the getting all the alumni List of the unverified students
export async function getAllAlumniUnverifiedStudents() {
  try {
   const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Graduation/GraduationApplications/Pending`, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getFacultyByFacultyId(facultyId) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/Faculty/${facultyId}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getSignaturedEmpById() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/uploadsign`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getFacultyByUniId(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/Faculty/GetAllFaculties/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getProgramById(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/ProgramMgmt/${id}`, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getProgramByCollegeId(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/ProgramMgmt/GetProgramByCOllegeId?collegeid=${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getReceiptNoByCollegeId(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/Receipt/GetReceiptNo?CampusId=${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLevelById(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/level/${id}`, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLevelByUniId(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/level/GetAllLebel/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function postProgram(formData) {
  try {
    const config = getAuthConfigSafe()
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key] || "");
    });
    const response = await axios.post(
      `${backendUrl}/ProgramMgmt`,
      data,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}
export async function patchProgram(programData, id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.patch(
      `${backendUrl}/ProgramMgmt/${id}`,
      programData,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Error in patchProgram:", err);
    throw err;
  }
}

export async function postSubject(formattedData) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.post(
      `${backendUrl}/Subject`,
      formattedData,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function postFee(payload) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.post(
      `${backendUrl}/FeeSetup`,
      payload,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getFaculty() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/Faculty/GetAllFaculties`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}

export async function getLevel() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/Level/GetAllLevels`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getProgram() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/ProgramMgmt/GetAllPrograms`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getSubject() {
  try {
    const config = getAuthConfigSafe()

    const response = await axios.get(
      `${backendUrl}/Subject/GetAllSubjects`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getCampus() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/Campus/GetAllCampuses`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getCampusForSelection() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/Campus/GetCampusForSelection`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getCampusById(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Campus/${id} `, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getFiscalYear() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/FiscalYear`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}

export async function getFiscalYearForSelection() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/FiscalYear/GetFiscalYearsForSelection`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}

export async function getFiscalYearById(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/FiscalYear/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}
export async function getBatch() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Batch`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}

export async function getBatchById(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Batch/${id} `, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getEmployeePosition() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/EmployeePositions`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}

export async function getEmployeePositionById(id) {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/EmployeePositions/${id}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}

export async function getUniDropoutData({ campusId, fiscalId, levelId, uniId }) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/Dashboard/GetStudentsDropOutReport`;

    const queryParams = [];
    if (campusId) {
      queryParams.push(`campusId=${campusId}`);
    }
    if (fiscalId) {
      queryParams.push(`fiscalyearid=${fiscalId}`);
    }
    if (uniId) {
      queryParams.push(`uniId=${uniId}`);
    }
    if (levelId) {
      queryParams.push(`LevelId=${levelId}`);
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


export async function getGraduationOfLast5FY(campusId) {
  try {
   const config = getAuthConfigSafe()
    let url = `${backendUrl}/Graduation/GetGraduationOfFiscalYear`;
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

export async function getDropoutOfLast5FY() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/DropOut/GetDropoutOfFiscalYear`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
