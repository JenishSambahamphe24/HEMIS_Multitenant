import React, { useEffect, useState } from "react";
import {
  Grid,
  CardContent,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import GetCollegePrograms from "./GetCollegePrograms";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const AddFaculties = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [levels, setLevels] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [preSelectedPrograms, setPreSelectedPrograms] = useState([]);
  const [preSelectedLevels, setPreSelectedLevels] = useState([]);
  const [preSelectedFaculty, setPreSelectedFaculty] = useState([]);
  const [programData, setProgramData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const universityId =
    currentUser?.type === "college" ? currentUser.institution?.universityId : 0;

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const config = getAuthConfigSafe();
        const response = await axios.get(
          `${backendUrl}/ProgramMgmt/GetAllPrograms/${universityId}`,
          config
        );
        const allPrograms = response.data;
        const uniqueLevels = [
          ...new Set(allPrograms.map((program) => program.levelName)),
        ];

        setLevels(uniqueLevels);
        setPrograms(allPrograms);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchPrograms();
    }
  }, [universityId]);

  useEffect(() => {
    const fetchCollegePrograms = async () => {
      setLoading(true);
      try {
        const config = getAuthConfigSafe();
        
        const response = await axios.get(
          `${backendUrl}/ProgramMgmt/GetCollegePrograms`,
          config
        );
        const collegePrograms = response.data;

        setProgramData(collegePrograms);

        // Process pre-selected data
        if (collegePrograms && collegePrograms.length > 0) {
          const preSelected = new Set(
            collegePrograms.map((program) => program.programName)
          );
          setPreSelectedPrograms([...preSelected]);
          setSelectedPrograms([...preSelected]);
          
          const preSelectedLevels = new Set(
            collegePrograms.map((program) => program.levelName)
          );
          setPreSelectedLevels([...preSelectedLevels]);
          setSelectedLevels([...preSelectedLevels]);
          
          const preSelectedFaculty = new Set(
            collegePrograms.map((program) => program.facultyName)
          );
          setPreSelectedFaculty([...preSelectedFaculty]);
          setSelectedFaculties([...preSelectedFaculty]);
        }
      } catch (err) {
        console.error("Error fetching college programs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegePrograms();
  }, []);

  const getAvailableFaculties = () => {
    if (selectedLevels.length === 0) return [];
    const faculties = programs
      .filter((program) => selectedLevels.includes(program.levelName))
      .map((program) => program.facultyName);

    return [...new Set(faculties)];
  };

  const getAvailablePrograms = () => {
    if (selectedFaculties.length === 0) return [];
    const programsList = programs
      .filter(
        (program) => 
          selectedLevels.includes(program.levelName) && 
          selectedFaculties.includes(program.facultyName)
      )
      .map((program) => program.programName);

    return [...new Set(programsList)];
  };

  const handleLevelSelection = (levelName, checked) => {
    // Update selected levels
    const newSelectedLevels = checked
      ? [...selectedLevels, levelName]
      : selectedLevels.filter((selectedLevel) => selectedLevel !== levelName);
    
    setSelectedLevels(newSelectedLevels);
    
    if (!checked) {
      // When a level is unchecked, we need to remove faculties that are only available in this level
      // First, get faculties available in remaining selected levels
      const availableFacultiesInRemainingLevels = programs
        .filter(p => newSelectedLevels.includes(p.levelName))
        .map(p => p.facultyName);
      
      const uniqueAvailableFaculties = [...new Set(availableFacultiesInRemainingLevels)];
      
      // Update selectedFaculties to only include those available in remaining levels or pre-selected
      const updatedFaculties = selectedFaculties.filter(
        faculty => uniqueAvailableFaculties.includes(faculty) || preSelectedFaculty.includes(faculty)
      );
      
      setSelectedFaculties(updatedFaculties);
      
      // Similarly, remove programs that are no longer available
      const availableProgramsAfterRemoval = programs
        .filter(p => 
          newSelectedLevels.includes(p.levelName) && 
          updatedFaculties.includes(p.facultyName))
        .map(p => p.programName);
      
      // Update selectedPrograms to only include those still available or pre-selected
      setSelectedPrograms(
        selectedPrograms.filter(program => 
          availableProgramsAfterRemoval.includes(program) || 
          preSelectedPrograms.includes(program)
        )
      );
    }
    // When a level is checked, we don't need to do anything special
    // Faculties and programs will become available in the UI without being automatically selected
  };

  const handleFacultySelection = (facultyName, checked) => {
    // Update selected faculties
    const newSelectedFaculties = checked
      ? [...selectedFaculties, facultyName]
      : selectedFaculties.filter(faculty => faculty !== facultyName);
    
    setSelectedFaculties(newSelectedFaculties);
    
    if (!checked) {
      const availableProgramsInRemainingFaculties = programs
        .filter(p => 
          selectedLevels.includes(p.levelName) && 
          newSelectedFaculties.includes(p.facultyName))
        .map(p => p.programName);
      
      setSelectedPrograms(
        selectedPrograms.filter(program => 
          availableProgramsInRemainingFaculties.includes(program) || 
          preSelectedPrograms.includes(program)
        )
      );
    }
  };

  const handleProgramSelection = (programName, checked) => {
    if (preSelectedPrograms.includes(programName) && !checked) {
      return;
    }
    
    setSelectedPrograms((prevPrograms) =>
      checked
        ? [...prevPrograms, programName]
        : prevPrograms.filter(program => program !== programName)
    );
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (levels.includes(name)) {
      handleLevelSelection(name, checked);
    } else if (getAvailableFaculties().includes(name)) {
      handleFacultySelection(name, checked);
    } else if (getAvailablePrograms().includes(name)) {
      handleProgramSelection(name, checked);
    }
  };

  const formatDataForAPI = () => {
    const newProgramIds = programs
      .filter(program => 
        selectedPrograms.includes(program.programName) && 
        !preSelectedPrograms.includes(program.programName)
      )
      .map(program => program.id);
    
    return {
      programId: newProgramIds,
      isActive: true,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Check if there are any new programs to add
    const dataToSend = formatDataForAPI();
    if (dataToSend.programId.length === 0) {
      console.log("No new programs to add");
      return;
    }
    
    setLoading(true);
    try {
      const config = getAuthConfigSafe();
      await axios.post(
        `${backendUrl}/ProgramMgmt/AddProgramToCollege`,
        dataToSend,
        config
      );
      // Refresh the page after successful submission
      window.location.reload();
    } catch (error) {
      console.error("Error submitting data:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={false} md={2} />
        <Grid item xs={12} md={12}>
          <Typography textAlign="center" color={blue[700]} padding={2}>
            College Programs
          </Typography>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              {loading ? (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Divider textAlign="left">
                        <span style={{ color: "#1976d2" }}>Level</span>
                      </Divider>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      {levels.map((level) => (
                        <FormControlLabel
                          key={level}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedLevels.includes(level)}
                              onChange={handleCheckboxChange}
                              name={level}
                              disabled={preSelectedLevels.includes(level)}
                              sx={{
                                "&.Mui-disabled": {
                                  color: "blue",
                                },
                                "&.Mui-checked.Mui-disabled": {
                                  color: "blue",
                                },
                              }}
                            />
                          }
                          label={
                            <span style={{ color: "black" }}>
                              {level}
                            </span>
                          }
                        />
                      ))}
                    </Grid>
                    {selectedLevels.length > 0 && (
                      <>
                        <Grid item xs={12}>
                          <Divider textAlign="left">
                            <span style={{ color: "#1976d2" }}>Faculty</span>
                          </Divider>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          {getAvailableFaculties().map((faculty) => (
                            <FormControlLabel
                              key={faculty}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={selectedFaculties.includes(faculty)}
                                  onChange={handleCheckboxChange}
                                  name={faculty}
                                  disabled={preSelectedFaculty.includes(faculty)}
                                  sx={{
                                    "&.Mui-disabled": {
                                      color: "blue",
                                    },
                                    "&.Mui-checked.Mui-disabled": {
                                      color: "blue",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "black" }}>
                                  {faculty}
                                </span>
                              }
                            />
                          ))}
                        </Grid>
                      </>
                    )}
                    {selectedFaculties.length > 0 && (
                      <>
                        <Grid item xs={12}>
                          <Divider textAlign="left">
                            <span style={{ color: "#1976d2" }}>Program</span>
                          </Divider>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          {getAvailablePrograms().map((program) => (
                            <FormControlLabel
                              key={program}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={selectedPrograms.includes(program)}
                                  onChange={handleCheckboxChange}
                                  name={program}
                                  disabled={preSelectedPrograms.includes(program)}
                                  sx={{
                                    "&.Mui-disabled": {
                                      color: "blue",
                                    },
                                    "&.Mui-checked.Mui-disabled": {
                                      color: "blue",
                                    },
                                  }}
                                />
                              }
                              label={
                                <span style={{ color: "black" }}>
                                  {program}
                                </span>
                              }
                            />
                          ))}
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Box mt={2} display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="small"
                      sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#1565c0",
                        },
                        padding: "6px 12px",
                        borderRadius: 2,
                      }}
                      disabled={
                        selectedPrograms.length === 0 ||
                        selectedPrograms.every(program => 
                          preSelectedPrograms.includes(program)
                        )
                      }
                    >
                      Add Programs
                    </Button>
                  </Box>
                </form>
              )}
            </CardContent>
          </Paper>
          <Box mt={2}>
            <Typography
              textAlign="center"
              style={{ color: "#1976d2", padding: "10px" }}
            >
              List of Campus Programs
            </Typography>
            <GetCollegePrograms programData={programData} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AddFaculties;