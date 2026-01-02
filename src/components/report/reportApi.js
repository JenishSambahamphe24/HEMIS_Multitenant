import axios from "axios"
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const backendUrl = config.VITE_BACKEND_URL;

export async function fetchTeacherReportByJoiningType(fiscalId) {
  try {
  const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Dashboard/GenerateTeacherReport?fiscalyearId=${fiscalId}`, config)
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export async function getStudentsForAnnexReport() {
  try {
  const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Dashboard/GetStudentsFilterableReport`, config)
    return response.data
  } catch (err) {
    console.log(err)
  }
}

