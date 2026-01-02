import axios from "axios";
import {config} from '@config';
import { getAuthConfigSafe } from "../../../utils/dateUtils";

const backendUrl = config.VITE_BACKEND_URL;

export async function getStudents(studentId) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Student/${studentId}`,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching students:", err);
    throw err;
  }
}

export async function getProgramGroupsByProgramId(id) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/SubjectGroup/ByProgram/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching Groups", err);
    throw err;
  }
}

export async function getVerifiedStudents() {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Student/GetAllStudent?isVerified=true`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getMajorSubsByProgramId(id) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/MajorSubject/by-program/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllSubjectsByProgramGroups(id) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Subject/GetSubjectByProgramId?programId=${id}`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getSubjectBySubjectId(id) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Subject/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}


export async function getPaginatedVerifiedStudents({
  page,
  programId,
  pageSize,
  // batchId,
  admissionYearId,
  semYear,
  name,
  isVerified = true,
  isTransferredIn
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/Student/GetAllStudentPaginated`;
    const queryParams = [];
    if (isVerified) {
      queryParams.push(`isVerified=${isVerified}`);
    }
    // if (batchId) {
    //   queryParams.push(`BatchId=${batchId}`);
    // }
    if(admissionYearId){
      queryParams.push(`admissionYearId=${admissionYearId}`);
    }
    if (semYear) {
      queryParams.push(`semYear=${semYear}`);
    }
    if (page) {
      queryParams.push(`page=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (isTransferredIn) {
      queryParams.push(`isTransferredIn=${isTransferredIn}`);
    }
    if (programId) {
      queryParams.push(`programid=${programId}`);
    }

    if (name && name.trim() !== "") {
      queryParams.push(`name=${encodeURIComponent(name)}`);
    }
    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getMigratedPaginatedStudent({
  page,
  programId,
  pageSize,
  batchId,
  semYear,
  name,
  isVerified ,
  isTransferredIn
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/Student/GetAllStudentPaginated`;
    const queryParams = [];
    if (isVerified) {
      queryParams.push(`isVerified=${isVerified}`);
    }
    if (batchId) {
      queryParams.push(`BatchId=${batchId}`);
    }
    if (semYear) {
      queryParams.push(`semYear=${semYear}`);
    }
    if (page) {
      queryParams.push(`page=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (isTransferredIn) {
      queryParams.push(`isTransferredIn=${isTransferredIn}`);
    }
    if (programId) {
      queryParams.push(`programid=${programId}`);
    }

    if (name && name.trim() !== "") {
      queryParams.push(`name=${encodeURIComponent(name)}`);
    }
    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getStudentsByMajorSubs({
  page,
  programId,
  pageSize,
  batchId,
  semYear,
  name,
  majorSubId
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/Student/GetPaginatedStdsByMajor`;
    const queryParams = [];
    if (batchId) {
      queryParams.push(`BatchId=${batchId}`);
    }
    if (semYear) {
      queryParams.push(`semYear=${semYear}`);
    }
    if (page) {
      queryParams.push(`page=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (programId) {
      queryParams.push(`programid=${programId}`);
    }
    if (majorSubId) {
      queryParams.push(`majorSubjectId=${majorSubId}`);
    }
    if (name && name.trim() !== "") {
      queryParams.push(`name=${encodeURIComponent(name)}`);
    }
    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllApearedStudents({
  page,
  programId,
  pageSize,
  batchId,
  semester,
  name,
  year
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/ExamAppearManagement/getAllAppearedStudents`;
    const queryParams = [];

    if (batchId) {
      queryParams.push(`BatchId=${batchId}`);
    }
    if (semester) {
      queryParams.push(`semester=${semester}`);
    }
    if (year) {
      queryParams.push(`year=${year}`);
    }
    if (page) {
      queryParams.push(`pageNumber=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (programId) {
      queryParams.push(`programid=${programId}`);
    }
    if (name && name.trim() !== "") {
      queryParams.push(`name=${encodeURIComponent(name)}`);
    }
    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllMarksEnteredStd({
  examscheduleId,
  page,
  pageSize,
  name
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/MarksEntry/FilterByExam`;
    const queryParams = [];

    if (examscheduleId) {
      queryParams.push(`BatchId=${examscheduleId}`);
    }
    if (page) {
      queryParams.push(`page=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (name && name.trim() !== "") {
      queryParams.push(`name=${encodeURIComponent(name)}`);
    }
    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllStdsForMarksEntryByEId({
  examscheduleId,
  page,
  pageSize,
  studentPage,
  studentPageSize,
  name
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/ExamAppearManagement/by-subjectexamschedule`;
    const queryParams = [];

    if (examscheduleId) {
      queryParams.push(`subjectExamScheduleId=${examscheduleId}`);
    }
    if (page) {
      queryParams.push(`page=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (studentPage) {
      queryParams.push(`studentPage=${studentPage}`);
    }
    if (studentPageSize) {
      queryParams.push(`studentPageSize=${studentPageSize}`);
    }
    if (name && name.trim() !== "") {
      queryParams.push(`studentName=${encodeURIComponent(name)}`);
    }

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllViewMarksForASubjectByExam({
  examscheduleId,
  page = 1,
  pageSize = 50,
  name
}) {
  try {
    const config = getAuthConfigSafe();

    const url = new URL(`${backendUrl}/MarksEntry/FilterByExam`);
    const params = url.searchParams;

    if (examscheduleId) {
      params.append("subjectExamScheduleId", examscheduleId);
    }
    params.append("page", page);
    params.append("pageSize", pageSize);

    if (name && name.trim() !== "") {
      params.append("name", name.trim());
    }

    const response = await axios.get(url.toString(), config);
    return response.data;
  } catch (err) {
    console.error("Error fetching marks:", err);
    throw err;
  }
}

export async function getPaginatedStudentsForUpgrade({
  page,
  pageSize,
  batchId,
  programId,
  name,
  semYear,
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/StudentUpgrade/GetStudentUpgradePaginated`;
    const queryParams = [];
    // if (batchId) {
    //   queryParams.push(`BatchId=${batchId}`);
    //   queryParams.push(`fiscalyearId=7`);
    // }
    if (page) {
      queryParams.push(`pageNumber=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (programId) {
      queryParams.push(`programid=${programId}`);
    }
    if (semYear) {
      queryParams.push(`semYear=${semYear}`);
    }
    if (batchId) {
      queryParams.push(`BatchId=${batchId}`);
    }
    if (name && name.trim() !== "") {
      queryParams.push(`name=${encodeURIComponent(name)}`);
    }
    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function upgradeStudents(upgradeData) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.post(
      `${backendUrl}/StudentUpgrade`,
      upgradeData,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getStudentByGender(authToken ) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `${backendUrl}/Student/GetTotalStudents`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getStudentByPrograms(authToken) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `${backendUrl}/Student/GetStudentsByProgram`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getJoiningTypeByEmployeeType(authToken) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `${backendUrl}/Employee/GetJoiningTypeByEmployeeType`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getStudentByFaculty(authToken) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `${backendUrl}/Student/GetStudentsByFacultyForDahsboard`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getStudentByLevelDashboard(authToken) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `${backendUrl}/Student/GetStudentsByLevelForDahsboard`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getEmployees() {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Employee/GetAllEmployeees`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getEmployeeByGender(authToken, collegeId) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      params: {
        campusId: collegeId,
      },
    };

    const response = await axios.get(
      `${backendUrl}/Employee/Report/EmployeeType`,
      config
    );

    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCampusByType(authToken) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `${backendUrl}/Dashboard/GetNoOfCollgeForUniAndAdmin`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAdminProfile() {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Student/GetUserDetails`,
      config
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getStudentByLevelForGPI() {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Student/GetStudentsByLevelForDahsboard`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getStudentByFacultyForGPI() {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/Student/GetStudentsByFacultyForDahsboard`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export const deleteExamSchedule = async (id) => {
  try {
    const config = getAuthConfigSafe();
    if (!config) throw new Error("Token is missing");

    const response = await axios.delete(`${backendUrl}/ExamSchedule/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error while deleting content:", error.response?.data || error.message);
    throw error;
  }
};

export async function getExamDataByExamId(id) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/ExamSchedule/${id}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getExamAppearedStudents({
  programId,
  batchId,
  year,
  semester,
  page,
  pageSize,
  majorSubjectId
}) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/BulkExamAttend/GetAllStudent`;
    const queryParams = [];

    if (batchId) {
      queryParams.push(`BatchId=${batchId}`);
    }
    if (programId) {
      queryParams.push(`programid=${programId}`);
    }
    if (year) {
      queryParams.push(`year=${year}`);
    }
    if (semester) {
      queryParams.push(`semester=${semester}`);
    }
    if (page) {
      queryParams.push(`pageNumber=${page}`);
    }
    if (pageSize) {
      queryParams.push(`pageSize=${pageSize}`);
    }
    if (majorSubjectId) {
      queryParams.push(`majorSubjectId=${majorSubjectId}`);
    }

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export const getAllSubjectExamRoutine = async ({
  batchId,
  pageNumber,
  pageSize,
}) => {
  try {
    const config = getAuthConfigSafe();

    let url = `${backendUrl}/SubjectExamSchedule/GetAllPaged`;
    const queryParams = [];

    if (batchId) queryParams.push(`batchId=${batchId}`);
    if (pageNumber) queryParams.push(`pageNumber=${pageNumber}`);
    if (pageSize) queryParams.push(`pageSize=${pageSize}`);

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getExamAppearedStdByExamId({
  subExamId,
  page,
  pageSize,
  studentPage,
  studentPageSize,
}) {
  try {
    const config = getAuthConfigSafe();

    let url = `${backendUrl}/ExamAppearManagement/by-subjectexamschedule`;
    const queryParams = [];

    if (subExamId) queryParams.push(`subjectExamScheduleId=${subExamId}`);
    if (page) queryParams.push(`page=${page}`);
    if (pageSize) queryParams.push(`pageSize=${pageSize}`);
    if (studentPage) queryParams.push(`studentPage=${studentPage}`);
    if (studentPageSize) queryParams.push(`studentPageSize=${studentPageSize}`);

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getExamScheduleById(examscheduleId) {
  try {
    const config = getAuthConfigSafe();
    const response = await axios.get(
      `${backendUrl}/ExamSchedule/${examscheduleId}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
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

export async function deleteMajorSubsBySubId(formData) {
  try {
    const config = getAuthConfigSafe();

    const response = await axios.delete(
      `${backendUrl}/Subject/RemoveGroupSubject`,
      formData,
      config
    );

    return response.data;
  } catch (err) {
    console.error('Error granting admin access:', err.response?.data || err.message);
    throw err;
  }
}

export async function getDynamicReceiptNumber({ campusId, fiscalYearId }) {
  try {
    const config = getAuthConfigSafe();
    let url = `${backendUrl}/Receipt/GetReceiptNo`;

    const queryParams = [];
    if (campusId) queryParams.push(`CampusId=${campusId}`);
    if (fiscalYearId) queryParams.push(`FiscalYearId=${fiscalYearId}`);

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}