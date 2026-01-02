import { useState, useEffect } from "react";
import { getAllProgramsWithMajorSubs } from "../../services/services";

function useProgramData() {
  const [programData, setProgramData] = useState([]);
  const [uniqueLevels, setUniqueLevels] = useState([]);
  const [uniqueFaculties, setUniqueFaculties] = useState([]);
  const [uniquePrograms, setUniquePrograms] = useState([]);
  const [uniqueMajorSubjects, setUniqueMajorSubjects] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedMajorSubject, setSelectedMajorSubject] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProgramsWithMajorSubs()
        const programsData = response && response.map((item) => ({
          ...item,
          Level: item.levelName,
          Faculty: item.facultyName,
          Program: item.programName,
          ShortName: item.shortName,
          MajorSubjects: item.majorSubjects || [],
        }));
        setProgramData(programsData);
        const levelsMap = new Map();
        if (Array.isArray(programsData)) {
          programsData.forEach(item => {
            if (
              item &&
              typeof item.levelId !== 'undefined' &&
              typeof item.levelName === 'string'
            ) {
              if (!levelsMap.has(item.levelId)) {
                levelsMap.set(item.levelId, {
                  levelId: item.levelId,
                  levelName: item.levelName
                });
              }
            }
          });
        }
        setUniqueLevels(Array.from(levelsMap.values()));
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle level selection - filter faculties based on selected level
  useEffect(() => {
    if (selectedLevel) {
      const filteredData = programData.filter((data) => data.levelId === selectedLevel);

      // Extract unique faculties for the selected level
      const facultiesMap = new Map();
      filteredData.forEach(item => {
        if (!facultiesMap.has(item.facultyId)) {
          facultiesMap.set(item.facultyId, {
            facultyId: item.facultyId,
            facultyName: item.facultyName
          });
        }
      });
      setUniqueFaculties(Array.from(facultiesMap.values()));

      // Reset dependent selections
      setSelectedFaculty(null);
      setSelectedProgram(null);
      setSelectedMajorSubject(null);
      setUniquePrograms([]);
      setUniqueMajorSubjects([]);
    }
  }, [selectedLevel, programData]);

  // Handle faculty selection - filter programs based on selected level and faculty
  useEffect(() => {
    if (selectedLevel && selectedFaculty) {
      const filteredPrograms = programData
        .filter(
          (data) =>
            data.levelId === selectedLevel && data.facultyId === selectedFaculty
        )
        .map((data) => ({
          id: data.id,
          programName: data.Program,
          shortName: data.ShortName,
          programMgmtId: data.programMgmtId,
          programType: data.programType,
          level:data.level
        }));
      setUniquePrograms(filteredPrograms);

      // Reset dependent selections
      setSelectedProgram(null);
      setSelectedMajorSubject(null);
      setUniqueMajorSubjects([]);
    }
  }, [selectedLevel, selectedFaculty, programData]);

  // Handle program selection - filter major subjects based on selected program
  useEffect(() => {
    if (selectedProgram) {
      const selectedProgramData = programData.find(
        (data) => data.programMgmtId === selectedProgram.programMgmtId
      );

      if (selectedProgramData && selectedProgramData.MajorSubjects.length > 0) {
        const majorSubjects = selectedProgramData.MajorSubjects.map((subject) => ({
          id: subject.id,
          majorSubjectName: subject.majorSubjectName,
          campusId: subject.campusId,
          campusName: subject.campusName,
          status: subject.status,
        }));
        setUniqueMajorSubjects(majorSubjects);
      } else {
        setUniqueMajorSubjects([]);
      }
      setSelectedMajorSubject(null);
    }
  }, [selectedProgram, programData]);

  // Handler functions for cleaner API
  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleFacultySelect = (facultyId) => {
    setSelectedFaculty(facultyId);
  };

  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
  };

  const handleMajorSubjectSelect = (majorSubject) => {
    setSelectedMajorSubject(majorSubject);
  };

  // Reset all selections
  const resetSelections = () => {
    setSelectedLevel(null);
    setSelectedFaculty(null);
    setSelectedProgram(null);
    setSelectedMajorSubject(null);
    setUniqueFaculties([]);
    setUniquePrograms([]);
    setUniqueMajorSubjects([]);
  };

  return {
    // Data
    programData,
    uniqueLevels,
    uniqueFaculties,
    uniquePrograms,
    uniqueMajorSubjects,

    // Selected values
    selectedLevel,
    selectedFaculty,
    selectedProgram,
    selectedMajorSubject,

    // Setters (for direct access if needed)
    setSelectedLevel,
    setSelectedFaculty,
    setSelectedProgram,
    setSelectedMajorSubject,

    // Handlers (recommended way to update selections)
    handleLevelSelect,
    handleFacultySelect,
    handleProgramSelect,
    handleMajorSubjectSelect,

    // Utility
    resetSelections,
  };
}

export default useProgramData;