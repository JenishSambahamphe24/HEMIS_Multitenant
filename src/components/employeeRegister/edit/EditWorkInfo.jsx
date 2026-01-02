import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Select,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { createContext, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getFiscalYear, getEmployeePosition } from "../../../services/services";
import { getEmployeeById } from "../../../services/employeeService";
import { getDepartmentNamesForTeaching } from "../../report/CampusReport/CampusServices";
import { useSelector } from "react-redux";
import axios from "axios";
import DateInputField from "../../DateField/DateInputField";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const convertToISODate = (dateString) => {
  if (!dateString) return "";
  const [datePart] = dateString.split(" ");
  return datePart;
};

const EditWorkInfoContext = createContext();
const EditWorkInfoProvider = ({ children }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const methods = useForm();
  const [workInfo, setWorkInfo] = useState({
    employeePositionId: 0,
    position: "",
    joiningType: "",
    joiningDate: 0,
    fiscalYear: 0,
    reference: "",
    joiningletter: "",
    otherletter: "",
    employeeType: "",
    departmentId: "",
    sectionId: "",
    logo: "",
  });

  const onChange = (name, value) => {
    setWorkInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <EditWorkInfoContext.Provider value={{ ...methods, workInfo, onChange }}>
      {children}
    </EditWorkInfoContext.Provider>
  );
};

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

const EditWorkGeneralInfo = ({ handleNext, handleBack, id, employeeType }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [position, setPosition] = useState([]);
  const [teachingFaculty, setTeachingFaculty] = useState([]);
  console.log("teachingFaculty",teachingFaculty)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useContext(EditWorkInfoContext);
  const [defaultFiscal, setDefaultFiscal] = useState("");
  const [fiscalYear, setFiscalYear] = useState([]);
  const [teachingDepartment, setTeachingDepartment] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser.listUser[0].roleName;

  const fetchPosition = async () => {
    try {
      const empPosition = await getEmployeePosition();
      setPosition(empPosition);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTeachingFaculties = async () => {
  const config = getAuthConfigSafe()
    try {
      const response = await axios.get(
        `${backendUrl}/ProgramMgmt/GetCollegePrograms`,
        config
      );
      setTeachingFaculty(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const fiscalYears = await getFiscalYear();
      setFiscalYear(fiscalYears);
      const employeeData = await getEmployeeById(id);
      setEmployeeData(employeeData);

      const department = await getDepartmentNamesForTeaching();
      setTeachingDepartment(department);
      const joiningDate = convertToISODate(employeeData.joiningDate);
      setValue("employeePositionId", employeeData.employeePositionId || "");
      setValue("employeeType", employeeData.employeeType || "");
      setValue("position", employeeData.position || "");
      setValue("joiningType", employeeData.joiningType || "");
      setValue("teachingFacultyName", employeeData.teachingFacultyName || "");
      setValue("joiningdate", employeeData.joiningDate || "");
      setValue("fiscalYear", employeeData.fiscalYear || "");
      setValue("reference", employeeData.reference || "");
      setValue("joiningletter", employeeData.joiningletter || "");
      setValue("otherletter", employeeData.otherletter || "");
      setValue("departmentId", employeeData.departmentId || "");
      setValue("sectionId", employeeData.sectionId || "");
      const activeFiscalYear = fiscalYears.find(
        (data) => data && data.activeFiscalYear === true
      );
      if (activeFiscalYear) {
        setDefaultFiscal(activeFiscalYear.id);
        setValue("fiscalYear", activeFiscalYear.id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTeachingFaculties();
    fetchData();
    fetchPosition();
  }, [id]);

  const { onChange } = useContext(EditWorkInfoContext);

  const onSubmit = (data) => {
    Object.keys(data).forEach((key) => {
      onChange(key, data[key]);
    });
    handleNext();
  };
  useEffect(() => {
    const fetchData = async () => {
    const config = getAuthConfigSafe()
      try {
        const response = await axios.get(
          `${backendUrl}/Management/Sections`,
          config
        );
        setSectionData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  const onBack = () => {
    handleBack();
  };
  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={onBack}
    >
      <Grid container spacing={1}>
        {employeeType === "administrator" && (
          <Grid item xs={12} sm={3}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel sx={{ borderColor: "blue" }} id="type" required>
                Employee Type
              </InputLabel>
              <Controller
                name="employeeType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required
                    labelId="employeeType"
                    id="employeeType"
                    name="employeeType"
                    label="Employee Type"
                    fullWidth
                  >
                    <MenuItem value="Administrative">Administrative</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>
        )}
        {employeeType !== "teaching" ? (
          <>
            <Grid item xs={12} sm={3.5}>
              <FormControl fullWidth size="small">
                <InputLabel required={roleName !== "Admin"}>
                  Employee Post
                </InputLabel>
                <Controller
                  name="employeePositionId"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      required={roleName !== "Admin"}
                      id="employeePositionId"
                      size="small"
                      name="employeePositionId"
                      label="Employee Post"
                      fullWidth
                    >
                      {position
                        .filter((item) => item.category === "Nonteaching")
                        .map((item, index) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.postName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <ValidationTextField
                    {...field}
                    required={roleName !== "Admin"}
                    id="position"
                    size="small"
                    name="position"
                    label="Position"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel required={roleName !== "Admin"}>
                Employee position
              </InputLabel>
              <Controller
                name="employeePositionId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    required={roleName !== "Admin"}
                    id="employeePositionId"
                    size="small"
                    name="employeePositionId"
                    label="Employee position"
                    fullWidth
                  >
                    {position
                      .filter((item) => item.category === "Teaching")
                      .map((item, index) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.postName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel required={roleName !== "Admin"}>
              Joining Type
            </InputLabel>
            <Controller
              name="joiningType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  required={roleName !== "Admin"}
                  id="joiningType"
                  size="small"
                  name="joiningType"
                  label="Joining Type"
                  fullWidth
                  error={!!errors.joiningType}
                  helperText={errors.joiningType ? "Required" : ""}
                >
                  <MenuItem value={""} disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="permanent">Permament</MenuItem>
                  <MenuItem value="temporary">Temporary</MenuItem>
                  <MenuItem value="partTime">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        {employeeType === "teaching" && (
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel required={roleName !== "Admin"}>
                Teaching Faculty
              </InputLabel>
              <Controller
                name="teachingFacultyName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required={roleName !== "Admin"}
                    id="teachingFacultyName"
                    size="small"
                    name="teachingFacultyName"
                    label="Teaching Faculty"
                    fullWidth
                    error={!!errors.teachingFacultyName}
                    helperText={errors.teachingFacultyName ? "Required" : ""}
                  >
                    <MenuItem value={""} disabled>
                      Select
                    </MenuItem>
                    {[
                      ...new Set(
                        teachingFaculty.map((data) => data.facultyName)
                      ),
                    ].map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>
        )}
        {employeeType === "teaching" && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel required={roleName !== "Admin"}>
                Teaching Department
              </InputLabel>
              <Controller
                name="departmentId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required={roleName !== "Admin"}
                    id="departmentId"
                    size="small"
                    name="departmentId"
                    label="Teaching Department"
                    fullWidth
                  >
                    <MenuItem value={""} disabled>
                      Select Department
                    </MenuItem>
                    {teachingDepartment &&
                      teachingDepartment?.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.departmentName}
                        </MenuItem>
                      ))}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>
        )}
        {employeeType !== "teaching" && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel required={roleName !== "Admin"}>Section</InputLabel>
              <Controller
                name="sectionId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required={roleName !== "Admin"}
                    id="sectionId"
                    size="small"
                    name="sectionId"
                    label="Section"
                    fullWidth
                  >
                    <MenuItem value={""} disabled>
                      Select Section
                    </MenuItem>
                    {sectionData &&
                      sectionData?.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.sectionName}
                        </MenuItem>
                      ))}
                  </ValidationSelect>
                )}
              />
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={3}>
          <Controller
            name="joiningdate"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <DateInputField
                {...field}
                label="Joining Date"
                name="joiningdate"
                value={field.value}
                format="YYYY/MM/DD"
                onChange={(newValue) => {
                  field.onChange(newValue);
                  onChange("joiningdate", newValue);
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box mt={1} mb={2} display="flex" width="100%" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onBack}
          sx={{
            marginLeft: "10px",
          }}
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
  );
};

export { EditWorkInfoProvider, EditWorkInfoContext };
export default EditWorkGeneralInfo;
