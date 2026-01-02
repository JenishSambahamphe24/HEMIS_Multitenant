import axios from "axios"
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const backendUrl = config.VITE_BACKEND_URL;

export async function getFinanceHead() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(`${backendUrl}/FinanceHead`, config)
    return response.data
  } catch (err) {
    console.log(err)
  }
}