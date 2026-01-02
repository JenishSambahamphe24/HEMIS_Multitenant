import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { config as appConfig } from "@config";

const AlumniContext = createContext();

export const AlumniProvider = ({ children }) => {
  const backendUrl = appConfig.VITE_BACKEND_URL;

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  const [graduationApplicationId, setGraduationApplicationId] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [enrolledYear, setEnrolledYear] = useState(null);
  const [campusId, setCampusId] = useState(null);  
  const [institutionId, setInstitutionId] = useState(null);  
  const [campusName, setCampusName] = useState("");
  const [campusAddress, setCampusAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUserAndGraduationData = async () => {
      try {
        const email = localStorage.getItem("email");
        setEmail(email);

        const enrolledYear = localStorage.getItem("enrolledYear");
        setEnrolledYear(enrolledYear);

        const programId = localStorage.getItem("programId");
        setProgramId(programId);

        const institutionId = localStorage.getItem("institutionId");
        setInstitutionId(institutionId);

        const campusIdFromStorage = localStorage.getItem("campusId");
        setCampusId(campusIdFromStorage);

        const graduationApplicationId = localStorage.getItem("graduationApplicationId");
        setGraduationApplicationId(graduationApplicationId);

        //  Fetch campus details if campusId exists
        if (campusIdFromStorage) {
          const res = await axios.get(`${backendUrl}/Campus/${campusIdFromStorage}`);
          setCampusName(res.data.campusName);
          setCampusAddress(`${res.data.localLevel}, ${res.data.district}`);
        }
      } catch (error) {
        console.error("❌ Failed to fetch campus data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndGraduationData();
  }, [backendUrl]);

  return (
    <AlumniContext.Provider
      value={{
        graduationApplicationId,
        institutionId,
        email,
        programId,
        enrolledYear,
        campusId,
        campusName,
        campusAddress,
        loading,
      }}
    >
      {children}
    </AlumniContext.Provider>
  );
};

export const useAlumni = () => useContext(AlumniContext);
