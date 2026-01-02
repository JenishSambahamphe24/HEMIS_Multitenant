import { useEffect, useState } from "react";
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
import { createContext, useContext } from "react";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getBatch, getFiscalYear } from "../../../../services/services";
import useProgramData from "../../../../components/programs/Program";
import { StdDocUploader } from "../../../../pages/students/StdDocUploader";

const RegistrationInfoContext = createContext();
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

const RegistrationInfoProvider = ({ children }) => {
  const methods = useForm();
  const [registrationInfo, setRegistrationInfo] = useState({
    transferredDate: '',
    transferredFrom: '',
    isTransferredIn: true,
    transferDoc: null,

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
    programType: "",
    year: "",
    semester: "",
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
    <RegistrationInfoContext.Provider
      value={{ ...methods, registrationInfo, onChange }}
    >
      {children}
    </RegistrationInfoContext.Provider>
  );
};

const RegistrationInfo = ({ handleNext, handleBack }) => {
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      programType: "semester",
      year: "first",
      semester: "first"
    }
  });

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

  // Watch programType to handle conditional rendering
  const programType = watch("programType");
  // Other state variables
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

  // Update programType when selectedProgram changes
  useEffect(() => {
    if (selectedProgram && selectedProgram.programType) {
      setValue("programType", selectedProgram.programType);
    }
  }, [selectedProgram, setValue]);

  const { onChange } = useContext(RegistrationInfoContext);

  const onSubmit = (data) => {
    handleSubmit((formData) => {
      // Update the context with the form data including the IDs
      Object.keys(formData).forEach((key) => {
        onChange(null, key, formData[key]);
      });
      handleNext();
    })(data);
  };

  const onBack = () => {
    handleBack();
  };

  useEffect(() => {
    if (programType === "annual") {
      setValue("semester", "");
    } else {
      setValue("year", "");
    }
  }, [programType, setValue]);

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
          <Grid item xs={12} sm={2}>
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
              {errors.levelId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.levelId.message}
                </span>
              )}
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
              {errors.facultyId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.facultyId.message}
                </span>
              )}
            </FormControl>
          </Grid>

          {/* Program Selection */}
          <Grid item xs={12} sm={4}>
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
              {errors.programId && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.programId.message}
                </span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel sx={{ borderColor: "blue" }} id="majorSubjectId-label">
                Major Subject
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
                    label="Major Subject"
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

          {/* Program Type - Auto-populated and disabled */}
          <Grid item xs={12} sm={2.2}>
            <FormControl size="small" fullWidth>
              <InputLabel id="programType-label" required>
                Program Type
              </InputLabel>
              <Controller
                name="programType"
                control={control}
                defaultValue="semester"
                rules={{ required: "Program type is required" }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    labelId="programType-label"
                    id="programType"
                    label="Program Type"
                    required
                    fullWidth
                    error={!!errors.programType}
                    disabled // Disable since it's auto-populated
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

          {/* Conditional Year/Semester Field */}
          <Grid item xs={12} sm={2}>
            <FormControl size="small" fullWidth>
              <InputLabel required>
                {programType === "annual" ? "Year" : "Semester"}
              </InputLabel>
              <Controller
                name={programType === "annual" ? "year" : "semester"}
                control={control}
                rules={{
                  required: `${programType === "annual" ? "Year" : "Semester"} is required`
                }}
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required
                    labelId={`${programType === "annual" ? "year" : "semester"}-label`}
                    id={programType === "annual" ? "year" : "semester"}
                    label={programType === "annual" ? "Year" : "Semester"}
                    fullWidth
                    error={!!(programType === "annual" ? errors.year : errors.semester)}
                    onChange={(e) => {
                      field.onChange(e);
                      // Clear the other field when this one changes
                      if (programType === "annual") {
                        setValue("semester", "");
                      } else {
                        setValue("year", "");
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select {programType === "annual" ? "Year" : "Semester"}
                    </MenuItem>
                    {programType === "annual" ? (
                      // Show only up to Fourth year for annual programs
                      ['First', 'Second', 'Third', 'Fourth'].map((item, index) => (
                        <MenuItem key={index} value={item}>{item}</MenuItem>
                      ))
                    ) : (
                      // Show all options for semester programs
                      ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'].map((item, index) => (
                        <MenuItem key={index} value={item}>{item}</MenuItem>
                      ))
                    )}
                  </ValidationSelect>
                )}
              />
              {((programType === "annual" && errors.year) || (programType === "semester" && errors.semester)) && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  {programType === "annual" ? errors.year?.message : errors.semester?.message}
                </span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2.3}>
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
          <Grid item xs={12} sm={2.5}>
            <FormControl size="small" fullWidth>
              <InputLabel required>Admission Year</InputLabel>
              <Controller
                name="admissionYear"
                control={control}
                defaultValue=""
                rules={{
                  required: "Admission year is required",
                  pattern: {
                    value: /^\d{0,4}$/,
                    message:
                      "Please enter only numeric values with maximum length of four digits",
                  },
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
              {errors.admissionYear && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.admissionYear.message}
                </span>
              )}
            </FormControl>
          </Grid>

          {/* Completion Year */}
          <Grid item xs={12} sm={2.5}>
            <FormControl size="small" fullWidth>
              <InputLabel required>Completion Year</InputLabel>
              <Controller
                name="completionYear"
                control={control}
                defaultValue=""
                rules={{
                  required: "Completion year is required",
                  pattern: {
                    value: /^\d{0,4}$/,
                    message:
                      "Please enter only numeric values with maximum length of four digits",
                  },
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
              {errors.completionYear && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.completionYear.message}
                </span>
              )}
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
            {errors.dateOfEnrollment && (
              <span style={{ color: 'red', fontSize: '0.75rem' }}>
                {errors.dateOfEnrollment.message}
              </span>
            )}
          </Grid>

          {/* Fiscal Year */}
          {defaultFiscal && (
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="fiscalYearId" required>Fiscal Year</InputLabel>
                <Controller
                  name="fiscalYearId"
                  control={control}
                  defaultValue={defaultFiscal || ""}
                  rules={{ required: "Fiscal year is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      required
                      id="fiscalYearId"
                      size="small"
                      label="Fiscal Year"
                      fullWidth
                      error={!!errors.fiscalYearId}
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
                {errors.fiscalYearId && (
                  <span style={{ color: 'red', fontSize: '0.75rem' }}>
                    {errors.fiscalYearId.message}
                  </span>
                )}
              </FormControl>
            </Grid>
          )}

          {/* Entrance Score */}
          <Grid item xs={12} sm={2}>
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
          <Grid item xs={12} sm={2.5}>
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

          <Grid item xs={12}>
            <h1 className='px-1 text-md mb-1'>
              Transferred from
            </h1>
          </Grid>

          <Grid container spacing='10px' className="px-3">
            <Grid item sm={6}>
              <Controller
                name="transferredFrom"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="transferredFrom"
                    size="small"
                    name="transferredFrom"
                    label="Previous campus/college/institution"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="transferredDate"
                control={control}
                defaultValue={new Date().toISOString().split("T")[0]}
                rules={{ required: "Transfer date is required" }}
                render={({ field }) => (
                  <ValidationTextField
                    {...field}
                    required
                    id="transferredDate"
                    size="small"
                    type="date"
                    name="transferredDate"
                    label="Transfer date"
                    fullWidth
                    error={!!errors.transferredDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
              {errors.transferredDate && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  {errors.transferredDate.message}
                </span>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
                <InputLabel sx={{ borderColor: "blue" }} >
                  Is transferred in ?
                </InputLabel>
                <Controller
                  name="isTransferredIn"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      id="isTransferredIn"
                      label="Is transferred in ?"
                      fullWidth
                    >
                      <MenuItem value={true}>
                        True
                      </MenuItem>
                      <MenuItem disabled value={false}>
                        False
                      </MenuItem>
                    </ValidationSelect>
                  )}
                />
                {errors.programType && (
                  <span style={{ color: 'red', fontSize: '0.75rem' }}>
                    {errors.programType.message}
                  </span>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={3}>
                <StdDocUploader
                  label="Transfer document"
                  name="transferDoc"
                  value={getValues('transferDoc')}
                  onFileChange={(file) => setValue('transferDoc', file)}
                  acceptedTypes="image/*,application/pdf"
                  existingFileUrl={'./'}
                />
              </Grid>
            </Grid>
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

export { RegistrationInfoProvider, RegistrationInfoContext };
export default RegistrationInfo;