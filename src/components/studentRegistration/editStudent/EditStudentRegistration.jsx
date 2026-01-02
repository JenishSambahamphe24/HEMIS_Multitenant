import { useEffect, useState, useContext, createContext } from "react";
import {
  Grid,
  TextField,
  Select,
  Box,
  MenuItem,
  InputLabel,
  Button,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import useProgramData from "../../programs/Program";
import { StdDocUploader } from "../../../pages/students/StdDocUploader";
import {
  getBatch,
  getFiscalYear,
} from "../../../services/services";
import { getStudentById } from "../../../services/employeeService";
import { useSelector } from "react-redux";
import BikramSambatDateInput from "../../DateField/DateInputField";

const ValidationSelect = styled(Select)({
  "& select:valid + fieldset": {
    borderColor: "#3572EF",
    borderWidth: 1,
  },
  "& select:invalid + fieldset": {
    borderColor: "#ff0000",
    borderWidth: 1,
  },
  "& select:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important",
  },
});
const EditStudentRegContext = createContext();

const ValidationTextField = styled(TextField)({
  "& input:valid + fieldset": {
    borderColor: "#c2c2c2",
    borderWidth: 1,
  },
  "& input:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important",
  },
});


const EditStudentRegProvider = ({ children }) => {
  const methods = useForm();
  const [editRegistrationInfo, setEditRegistrationInfo] = useState({
    transferredDate: '',
    transferredFrom: '',
    isTransferredIn: true,
    transferDoc: null,
    campusId: 0,
    levelId: 0,
    facultyId: 0,
    programId: 0,
    majorSubjectId: 0,
    admissionYearId: 0,
    complitionYear: "",
    dateOfEnrollment: "",
    fiscalYearId: 0,
    rollNoManual: "",
    universityRegdNo: "",
    entranceScore: "",
    entranceSymbol: "",
    programType: "",
    year: "",
    semester: "",
  });
  const onChange = (name, value) => {
    setEditRegistrationInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <EditStudentRegContext.Provider
      value={{ ...methods, editRegistrationInfo, onChange }}
    >
      {children}
    </EditStudentRegContext.Provider>
  );
};

const EditStudentRegistrationInfo = ({ handleNext, handleBack, isTransferredIn: initialTransferFlag, id }) => {
  const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useContext(EditStudentRegContext);
  const {
    programData,
    uniqueLevels,
    uniqueFaculties,
    uniquePrograms,
    uniqueMajorSubjects,
    selectedLevel,
    selectedFaculty,
    selectedProgram,
    selectedMajorSubject,
    setSelectedLevel,
    setSelectedFaculty,
    setSelectedProgram,
    setSelectedMajorSubject,
  } = useProgramData();

  const [fiscalYear, setFiscalYear] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [isAdmissionSet, setIsAdmissionSet] = useState(false);

  const [defaultFiscal, setDefaultFiscal] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isProgramDataLoaded, setProgramDataLoaded] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const uniId = currentUser?.institution?.universityId;

  const programType = watch("programType");
  const onChange = useContext(EditStudentRegContext).onChange;

  useEffect(() => {
    if (programData && programData.length > 0 && uniqueLevels.length > 0) {
      setProgramDataLoaded(true);
    }
  }, [programData, uniqueLevels]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBatch()
        setBatchData(response)
      } catch (err) {
        console.log(err)
      }
    };
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFiscalYear()
        setFiscalYear(response);
        const activeFiscal = response.find((fy) => fy.activeFiscalYear === true);
        if (activeFiscal) setDefaultFiscal(activeFiscal.id);
      } catch (err) {
        console.error("Failed to fetch fiscal/batch data:", err);
      }
    };

    if (uniId && id) fetchData();
  }, [uniId, id]);

  const findIdsByNames = (studentData) => {
    let levelId = null;
    let facultyId = null;

    if (studentData.levelName) {
      const level = uniqueLevels.find(l => l.levelName === studentData.levelName);
      levelId = level?.levelId || null;
    }
    if (studentData.facultyName && levelId) {
      const programWithFaculty = programData.find(p =>
        p.levelId === levelId && p.facultyName === studentData.facultyName
      );
      facultyId = programWithFaculty?.facultyId || null;
    }

    return { levelId, facultyId };
  };

  const fetchStudentData = async () => {
    if (!id || isDataLoaded) return;

    try {
      const data = await getStudentById(id);
      setStudentData(data);
      setValue("campusId", data.campusId || "");
      setValue("programId", data.programId || "");
      setValue("majorSubjectId", data.majorSubjectId || "");
      setValue("rollNoManual", data.rollNoManual || "");
      setValue("universityRegdNo", data.universityRegdNo || "");
      setValue("dateOfEnrollment", data.dateOfEnrollment?.split("T")[0] || "");
      setValue("fiscalYearId", data.fiscalYearId || defaultFiscal);
      setValue("entranceScore", data.entranceScore || "");
      setValue("entranceSymbol", data.entranceSymbol || "");
      setValue("transferredFrom", data.transferredFrom || "");
      setValue("transferredDate", data.transferredDate?.split("T")[0] || "");
      setValue("isTransferredIn", data.isTransferredIn ?? true);
      setValue("programType", data.programType || "semester");
      setValue("year", data.year || "");
      setValue("semester", data.semester || "");
      setValue("transferDoc", data.transferDoc || null);

      setValue("admissionYearId", data.admissionYearId || "");
      setValue("complitionYear", data.complitionYear || "");

      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id, defaultFiscal]);

  useEffect(() => {
    if (
      isDataLoaded &&
      studentData &&
      batchData.length > 0 &&
      !isAdmissionSet
    ) {
      if (studentData.admissionYear && !studentData.admissionYearId) {
        const admissionBatch = batchData.find(
          (batch) => batch.batchNepali === studentData.admissionYear.toString()
        );
        if (admissionBatch) {
          setValue("admissionYearId", admissionBatch.id);
        }
      }

      if (studentData.complitionYear) {
        const completionBatch = batchData.find(
          (batch) => batch.batchNepali === studentData.complitionYear.toString()
        );
        if (completionBatch) {
          setValue("completionYear", completionBatch.batchNepali);
        }
      }

      setIsAdmissionSet(true);
    }
  }, [isDataLoaded, studentData, batchData, isAdmissionSet]);

  useEffect(() => {
    if (isDataLoaded && studentData && isProgramDataLoaded && !selectedLevel) {
      const { levelId, facultyId } = findIdsByNames(studentData);
      if (levelId) {
        setSelectedLevel(levelId);
        setValue("levelId", levelId);
      }
    }
  }, [isDataLoaded, studentData, isProgramDataLoaded, selectedLevel]);

  useEffect(() => {
    if (isDataLoaded && studentData && uniqueFaculties.length > 0 && selectedLevel && !selectedFaculty) {
      const { facultyId } = findIdsByNames(studentData);

      if (facultyId) {
        setSelectedFaculty(facultyId);
        setValue("facultyId", facultyId);
      }
    }
  }, [isDataLoaded, studentData, uniqueFaculties.length, selectedLevel, selectedFaculty]);

  useEffect(() => {
    if (isDataLoaded && studentData && uniquePrograms.length > 0 && selectedFaculty && !selectedProgram) {
      if (studentData.programId) {
        const programObj = uniquePrograms.find(p => p.programMgmtId === studentData.programId);
        if (programObj) {
          setSelectedProgram(programObj);
        }
      }
    }
  }, [isDataLoaded, studentData, uniquePrograms.length, selectedFaculty, selectedProgram]);

  useEffect(() => {
    if (isDataLoaded && studentData && uniqueMajorSubjects.length > 0 && selectedProgram && !selectedMajorSubject) {
      if (studentData.majorSubjectId) {
        const majorSubjectObj = uniqueMajorSubjects.find(ms => ms.id === studentData.majorSubjectId);
        if (majorSubjectObj) {
          setSelectedMajorSubject(majorSubjectObj);
        }
      }
    }
  }, [isDataLoaded, studentData, uniqueMajorSubjects.length, selectedProgram, selectedMajorSubject]);

  // New useEffect to populate programType from selectedProgram
  useEffect(() => {
    if (selectedProgram && selectedProgram.programType) {
      setValue("programType", selectedProgram.programType);
    }
  }, [selectedProgram, setValue]);

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
    setSelectedFaculty(null);
    setSelectedProgram(null);
    setSelectedMajorSubject(null);
    setValue("facultyId", "");
    setValue("programId", "");
    setValue("majorSubjectId", "");
  };

  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    setSelectedProgram(null);
    setSelectedMajorSubject(null);
    setValue("programId", "");
    setValue("majorSubjectId", "");
  };

  const handleProgramChange = (programId) => {
    const programObj = uniquePrograms.find(p => p.programMgmtId === programId);
    setSelectedProgram(programObj);
    setSelectedMajorSubject(null);
    setValue("majorSubjectId", "");
    // Set programType from selected program and clear year/semester fields
    if (programObj && programObj.programType) {
      setValue("programType", programObj.programType);
      setValue("year", "");
      setValue("semester", "");
    }
  };

  const handleMajorSubjectChange = (majorSubjectId) => {
    const majorSubjectObj = uniqueMajorSubjects.find(ms => ms.id === majorSubjectId);
    setSelectedMajorSubject(majorSubjectObj);
  };

  const onSubmit = (data) => {
    Object.keys(data).forEach((key) => {
      onChange(key, data[key]);
    });
    handleNext();
  };
  // console.log(selectedProgram)
  return (
    <Grid container component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid mt={".7rem"} container>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={2}>
            <FormControl size="small" fullWidth required error={!!errors.levelId}>
              <InputLabel>Level Name</InputLabel>
              <Controller
                name="levelId"
                control={control}
                rules={{ required: "Level is required" }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    label="Level Name"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      handleLevelChange(value);
                    }}
                    disabled={!uniqueLevels.length}
                  >
                    <MenuItem value="" disabled>Select Level</MenuItem>
                    {uniqueLevels.map((lvl) => (
                      <MenuItem key={lvl.levelId} value={lvl.levelId}>
                        {lvl.levelName}
                      </MenuItem>
                    ))}
                  </ValidationSelect>
                )}
              />
              {errors.levelId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.levelId.message}</span>
              )}
            </FormControl>
          </Grid>

          {/* Faculty */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth required error={!!errors.facultyId}>
              <InputLabel>Faculty Name</InputLabel>
              <Controller
                name="facultyId"
                control={control}
                rules={{ required: "Faculty is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Faculty Name"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      handleFacultyChange(value);
                    }}
                    disabled={!uniqueFaculties.length}
                  >
                    <MenuItem value="" disabled>Select Faculty</MenuItem>
                    {uniqueFaculties.map((fac) => (
                      <MenuItem key={fac.facultyId} value={fac.facultyId}>
                        {fac.facultyName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.facultyId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.facultyId.message}</span>
              )}
            </FormControl>
          </Grid>

          {/* Program */}
          <Grid item xs={12} sm={4}>
            <FormControl size="small" fullWidth required error={!!errors.programId}>
              <InputLabel>Program</InputLabel>
              <Controller
                name="programId"
                control={control}
                rules={{ required: "Program is required" }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    label="Program"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      handleProgramChange(value);
                    }}
                    disabled={!uniquePrograms.length}
                  >
                    <MenuItem value="" disabled>Select Program</MenuItem>
                    {uniquePrograms.map((prog) => (
                      <MenuItem key={prog.programMgmtId} value={prog.programMgmtId}>
                        {prog.programName} ({prog.shortName})
                      </MenuItem>
                    ))}
                  </ValidationSelect>
                )}
              />
              {errors.programId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.programId.message}</span>
              )}
            </FormControl>
          </Grid>

          {/* Major Subject */}
          <Grid item xs={12} sm={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Group/program major</InputLabel>
              <Controller
                name="majorSubjectId"
                control={control}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    label="Group/program major"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      handleMajorSubjectChange(value);
                    }}
                    disabled={!uniqueMajorSubjects.length && uniqueMajorSubjects.length !== 0}
                  >
                    <MenuItem value="">N/A</MenuItem>
                    {uniqueMajorSubjects.map((subj) => (
                      <MenuItem key={subj.id} value={subj.id}>
                        {subj.majorSubjectName}
                      </MenuItem>
                    ))}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={1}>
            <Controller
              name="rollNoManual"
              control={control}
              render={({ field }) => (
                <TextField {...field} size="small" label="Roll No." fullWidth InputLabelProps={{ shrink: true }} />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="universityRegdNo"
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  size="small"
                  label="University Regd. No"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            />
          </Grid>

          {/* Fixed Admission Year Field */}
          <Grid item xs={12} sm={2}>
            <FormControl size="small" fullWidth required error={!!errors.admissionYearId}>
              <InputLabel>Admission Year (BS)</InputLabel>
              <Controller
                name="admissionYearId"
                control={control}
                rules={{ required: "Admission year is required" }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    label="Admission Year (BS)"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    <MenuItem value="" disabled>Select Year</MenuItem>
                    {batchData.map((b) => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.batchNepali}
                      </MenuItem>
                    ))}
                  </ValidationSelect>
                )}
              />
              {errors.admissionYearId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.admissionYearId.message}</span>
              )}
            </FormControl>
          </Grid>

          {/* Completion Year */}
          <Grid item xs={12} sm={2}>
            <FormControl size="small" fullWidth required error={!!errors.complitionYear}>
              <InputLabel>Completion Year (BS)</InputLabel>
              <Controller
                name="complitionYear"
                control={control}
                rules={{ required: "Completion year is required" }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    label="Completion Year (BS)"
                    value={field.value || ""}
                    onChange={(e) => {
                      // Convert to number when setting the value
                      const numValue = Number(e.target.value);
                      field.onChange(numValue);
                    }}
                  >
                    <MenuItem value="" disabled>Select Year</MenuItem>
                    {batchData.map((b) => (
                      <MenuItem key={`completion-${b.id}`} value={Number(b.batchNepali)}>
                        {b.batchNepali}
                      </MenuItem>
                    ))}
                  </ValidationSelect>
                )}
              />
              {errors.complitionYear && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.complitionYear.message}</span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="dateOfEnrollment"
              control={control}
              rules={{ required: "Date of enrollment is required" }}
              render={({ field }) => (
                <BikramSambatDateInput
                  {...field}
                  label="Enroll Date(B.S)"
                  name="dateOfEnrollment"
                  required
                  value={field.value || ""}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                    onChange("dateOfEnrollment", newValue);
                  }}
                />
              )}
            />
          </Grid>


          <Grid item xs={12} sm={2}>
            <FormControl size="small" fullWidth required error={!!errors.fiscalYearId}>
              <InputLabel>Fiscal Year</InputLabel>
              <Controller
                name="fiscalYearId"
                control={control}
                defaultValue={defaultFiscal}
                rules={{ required: "Fiscal year is required" }}
                render={({ field }) => (
                  <Select {...field} label="Fiscal Year">
                    <MenuItem value="" disabled>Select Fiscal Year</MenuItem>
                    {fiscalYear.map((fy) => (
                      <MenuItem key={fy.id} value={fy.id}>
                        {fy.yearNepali}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.fiscalYearId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.fiscalYearId.message}</span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="entranceScore"
              control={control}
              render={({ field }) => (
                <TextField {...field} size="small" label="Entrance Score" type="number" InputLabelProps={{ shrink: true }} fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Controller
              name="entranceSymbol"
              control={control}
              render={({ field }) => (
                <TextField {...field} size="small" label="Entrance Symbol" InputLabelProps={{ shrink: true }} fullWidth />
              )}
            />
          </Grid>
        </Grid>

        {(initialTransferFlag === true || watch("isTransferredIn") === true) && (
          <Grid container spacing={1} mt={1} className="px-3">
            <Grid item xs={12}>
              <h1 className="px-1 text-md mb-1  border-b-[1px] text-[#0368b0] border-[#0362b0]">Transferred From</h1>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="transferredFrom"
                control={control}
                rules={{ required: "Previous institution is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Previous Campus/College/Institution"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!errors.transferredFrom}
                  />
                )}
              />
              {errors.transferredFrom && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.transferredFrom.message}</span>
              )}
            </Grid>

            <Grid item xs={12} sm={2}>
              <Controller
                name="transferredDate"
                control={control}
                rules={{ required: "Transfer date is required" }}
                render={({ field }) => (
                  <ValidationTextField
                    {...field}
                    type="date"
                    label="Transfer Date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.transferredDate}
                    helperText={errors.transferredDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl size="small" fullWidth required error={!!errors.programType}>
                <InputLabel id="programType-label">Program Type</InputLabel>
                <Controller
                  name="programType"
                  control={control}
                  rules={{ required: "Program type is required" }}
                  defaultValue={selectedProgram?.programType || ""}
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      labelId="programType-label"  
                      id="programType"
                      disabled={!!selectedProgram?.programType}
                      label='Program Type'
                    >
                      <MenuItem value="annual">Annual</MenuItem>
                      <MenuItem value="semester">Semester</MenuItem>
                    </ValidationSelect>
                  )}
                />
                {errors.programType && (
                  <span style={{ color: "red", fontSize: "0.75rem" }}>
                    {errors.programType.message}
                  </span>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl size="small" fullWidth required>
                <InputLabel>{programType === "annual" ? "Year" : "Semester"}</InputLabel>
                <Controller
                  name={programType === "annual" ? "year" : "semester"}
                  control={control}
                  rules={{
                    required: `${programType === "annual" ? "Year" : "Semester"} is required`,
                  }}
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      label={programType === "annual" ? "Year" : "Semester"}
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear opposite field
                        if (programType === "annual") setValue("semester", "");
                        else setValue("year", "");
                      }}
                    >
                      <MenuItem value="" disabled>Select</MenuItem>
                      {programType === "annual" ? (
                        ['First', 'Second', 'Third', 'Fourth'].map((val) => (
                          <MenuItem key={val} value={val}>{val}</MenuItem>
                        ))
                      ) : (
                        ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'].map((val) => (
                          <MenuItem key={val} value={val}>{val}</MenuItem>
                        ))
                      )}
                    </ValidationSelect>
                  )}
                />
                {(programType === "annual" ? errors.year : errors.semester) && (
                  <span style={{ color: 'red', fontSize: '0.75rem' }}>
                    {programType === "annual" ? errors.year?.message : errors.semester?.message}
                  </span>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StdDocUploader
                label="Transfer Document"
                name="transferDoc"
                onFileChange={(file) => setValue("transferDoc", file)}
                acceptedTypes="image/*,application/pdf"
              />
            </Grid>
          </Grid>
        )}

        <Grid container justifyContent="flex-end" mt={3}>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<ChevronLeftRoundedIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              size="small"
              type="submit"
              endIcon={<ChevronRightRoundedIcon />}
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>

    </Grid>
  );
};
export { EditStudentRegProvider, EditStudentRegContext };
export default EditStudentRegistrationInfo;
