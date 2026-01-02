import { useEffect, createContext, useContext, useState } from "react";
import { useFormContext, FormProvider, useForm, Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Select,
  Box,
  MenuItem,
  InputLabel,
  Button,
  FormControl,
  FormHelperText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getBatch, getFiscalYear } from "../../services/services";
import useProgramData from "../programs/Program";

// Create Context
const StudentRegContext = createContext();

// Styled Components
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

// Provider Component
const StudentRegProvider = ({ children }) => {
  const methods = useForm({
    shouldUnregister: false,
    defaultValues: {
      levelId: "",
      facultyId: "",
      programId: "",
      majorSubjectId: "",
      rollNoManual: "",
      universityRegdNo: "",
      admissionYear: "",
      completionYear: "",
      dateOfEnrollment: "",
      fiscalYearId: "",
      entranceScore: "",
      entranceSymbol: "",
    },
  });

  const [registrationInfo, setRegistrationInfo] = useState({
    campusId: 0,
    levelId: 0,
    facultyId: 0,
    programId: 0,
    majorSubjectId: 0,
    admissionYear: 0,
    dateOfEnrollment: "",
    completionYear: 0,
    fiscalYearId: 0,
    programFee: "",
    paidAmount: "",
    entranceScore: "",
    entranceSymbol: "",
    scholarshipAmount: 0,
    receipt: "",
    haveScholarship: false,
    rollNoManual: "",
    universityRegdNo: "",
  });

  const onChange = (event, name, value) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      setRegistrationInfo((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setRegistrationInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <FormProvider {...methods}>
      <StudentRegContext.Provider value={{ ...methods, registrationInfo, onChange }}>
        {children}
      </StudentRegContext.Provider>
    </FormProvider>
  );
};

// Main Form Component
const StudentRegistrationInfo = ({ handleNext, handleBack }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const {
    uniqueLevels,
    uniqueFaculties,
    uniquePrograms,
    uniqueMajorSubjects,
    selectedLevel,
    selectedFaculty,
    selectedProgram,
    selectedMajorSubject,
    handleLevelSelect,
    handleFacultySelect,
    handleProgramSelect,
    handleMajorSubjectSelect,
  } = useProgramData();
  

  const [fiscalYear, setFiscalYear] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [defaultFiscal, setDefaultFiscal] = useState("");

  const fetchData = async () => {
    try {
      const [fiscalYears, batchData] = await Promise.all([
        getFiscalYear(),
        getBatch(),
      ]);
      setBatchData(batchData);
      setFiscalYear(fiscalYears);
      const activeFiscalYear = fiscalYears.find(
        (data) => data && data.activeFiscalYear === true
      );
      if (activeFiscalYear) {
        setDefaultFiscal(activeFiscalYear.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { onChange } = useContext(StudentRegContext);

  const onSubmit = (data) => {
    // Update the context with the form data including the IDs
    Object.keys(data).forEach((key) => {
      onChange(null, key, data[key]);
    });
    handleNext();
  };

  const onBack = () => {
    handleBack();
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={() => {
        onBack();
      }}
    >
      <Grid mt={".7rem"} container>
        <Grid container spacing={1}>
          {/* Level Selection */}
          <Grid item xs={12} sm={3}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel sx={{ borderColor: "blue" }} id="levelId-label" required>
                Level Name
              </InputLabel>
              <Controller
                name="levelId"
                control={control}
                defaultValue=""
                rules={{ required: "Level is required" }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required
                    labelId="levelId-label"
                    id="levelId"
                    label="Level Name"
                    fullWidth
                    error={!!errors.levelId}
                    onChange={(e) => {
                      field.onChange(e);
                      handleLevelSelect(e.target.value);
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select levels
                    </MenuItem>
                    {uniqueLevels.length > 0 ? (
                      uniqueLevels.map((level) => (
                        <MenuItem key={level.levelId} value={level.levelId}>
                          {level.levelName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No levels available</MenuItem>
                    )}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>

          {/* Faculty Selection */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ borderColor: "blue" }} id="facultyId-label" required>
                Faculty Name
              </InputLabel>
              <Controller
                name="facultyId"
                control={control}
                rules={{ required: "Faculty is required" }}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    required
                    {...field}
                    id="facultyId"
                    size="small"
                    labelId="facultyId-label"
                    label="Faculty Name"
                    fullWidth
                    error={!!errors.facultyId}
                    disabled={!selectedLevel}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFacultySelect(e.target.value);
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Faculty
                    </MenuItem>
                    {uniqueFaculties.length > 0 ? (
                      uniqueFaculties.map((faculty) => (
                        <MenuItem key={faculty.facultyId} value={faculty.facultyId}>
                          {faculty.facultyName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No faculties available</MenuItem>
                    )}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Program Selection */}
          <Grid item xs={12} sm={3}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel sx={{ borderColor: "blue" }} id="programId-label" required>
                Program
              </InputLabel>
              <Controller
                name="programId"
                control={control}
                defaultValue=""
                rules={{ required: "Program is required" }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required
                    labelId="programId-label"
                    id="programId"
                    label="Program"
                    fullWidth
                    error={!!errors.programId}
                    disabled={!selectedFaculty}
                    onChange={(e) => {
                      field.onChange(e);
                      const selectedProgramData = uniquePrograms.find(
                        program => program.programMgmtId === e.target.value
                      );
                      handleProgramSelect(selectedProgramData);
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Programs</em>
                    </MenuItem>
                    {uniquePrograms.length > 0 ? (
                      uniquePrograms.map((program) => (
                        <MenuItem key={program.programMgmtId} value={program.programMgmtId}>
                          {program.programName} ({program.shortName})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No programs available</MenuItem>
                    )}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>

          {/* Major Subject Selection */}
          <Grid item xs={12} sm={3}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel sx={{ borderColor: "blue" }} id="majorSubjectId-label" required>
                Group/program major
              </InputLabel>
              <Controller
                name="majorSubjectId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    labelId="majorSubjectId-label"
                    id="majorSubjectId"
                    label="Group/program major"
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      const selectedMajorSubjectData = uniqueMajorSubjects.find(
                        subject => subject.id === e.target.value
                      );
                      handleMajorSubjectSelect(selectedMajorSubjectData);
                    }}
                  >
                    {uniqueMajorSubjects.length > 0 ? (
                      uniqueMajorSubjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.majorSubjectName}
                        </MenuItem>
                      ))
                    ) : (
                      selectedProgram && (
                        <MenuItem value=''>N/A</MenuItem>
                      )
                    )}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>

          {/* Roll No */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="rollNoManual"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  id="rollNoManual"
                  size="small"
                  name="rollNoManual"
                  label="Roll No."
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* University Regd. No */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="universityRegdNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  id="universityRegdNo"
                  size="small"
                  name="universityRegdNo"
                  label="University Regd. No"
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Admission Year */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel required>Admission Year</InputLabel>
              <Controller
                name="admissionYear"
                control={control}
                defaultValue=""
                rules={{
                  required: "Admission year is required",

                }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required
                    id="admissionYear"
                    size="small"
                    name="admissionYear"
                    label="Admission Year"
                    fullWidth
                    error={!!errors.admissionYear}
                  >
                    <MenuItem value="" disabled>
                      Select Admission Year
                    </MenuItem>
                    {batchData &&
                      batchData.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data.batchNepali}
                        </MenuItem>
                      ))}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>

          {/* Completion Year */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel required>Completion Year</InputLabel>
              <Controller
                name="completionYear"
                control={control}
                defaultValue=""
                rules={{
                  required: "Completion year is required",
                  
                }}

                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required
                    id="completionYear"
                    size="small"
                    name="completionYear"
                    label="Completion Year"
                    fullWidth
                    error={!!errors.completionYear}
                  >
                    <MenuItem value="" disabled>
                      Select Completion Year
                    </MenuItem>
                    {batchData &&
                      batchData.map((data) => (
                        <MenuItem key={data.id} value={data.batchNepali}>
                          {data.batchNepali}
                        </MenuItem>
                      ))}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>

          {/* Date of Enrollment */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="dateOfEnrollment"
              control={control}
              defaultValue={new Date().toISOString().split("T")[0]}
              rules={{ required: "Date of enrollment is required" }}
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  required
                  id="dateOfEnrollment"
                  size="small"
                  type="date"
                  name="dateOfEnrollment"
                  label="Date Of Enrollment"
                  fullWidth
                  error={!!errors.dateOfEnrollment}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>

          {/* Fiscal Year */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.fiscalYearId}>
              <InputLabel required id="fiscalYearId-label">
                Fiscal Year
              </InputLabel>
              <Controller
                name="fiscalYearId"
                control={control}
                defaultValue={defaultFiscal || ""}
                rules={{ required: "Fiscal year is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="fiscalYearId-label"
                    id="fiscalYearId"
                    size="small"
                    label="Fiscal Year"
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Fiscal Year
                    </MenuItem>
                    {fiscalYear.map((data) => (
                      <MenuItem value={data.id} key={data.id}>
                        {data.yearNepali}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.fiscalYearId ? errors.fiscalYearId.message : ""}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Entrance Score */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="entranceScore"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  id="entranceScore"
                  size="small"
                  name="entranceScore"
                  label="Entrance Score"
                  fullWidth
                  type="number"
                />
              )}
            />
          </Grid>

          {/* Entrance Symbol */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="entranceSymbol"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  id="entranceSymbol"
                  size="small"
                  name="entranceSymbol"
                  label="Entrance Symbol"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Navigation Buttons */}
        <Grid container direction="column" alignItems="flex-start">
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              size="small"
              onClick={onBack}
              color="error"
              startIcon={<ChevronLeftRoundedIcon />}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              size="small"
              type="submit"
              sx={{
                marginLeft: "10px",
              }}
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

export { StudentRegProvider, StudentRegContext };
export default StudentRegistrationInfo;

