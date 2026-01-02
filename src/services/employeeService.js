import axios from "axios";
import { getAuthConfigSafe } from "../utils/dateUtils";
import {config} from "@config"
const backendUrl = config.VITE_BACKEND_URL;

export async function getEmployeeById(id) {
  
  try {
   const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Employee/${id}`, config);
    return response.data;
  } catch (err) {}
}

export async function getStudentById(id) {
  try {
   const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/Student/${id}`, config);
    return response.data;
  } catch (err) {
    console.log(err);
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
