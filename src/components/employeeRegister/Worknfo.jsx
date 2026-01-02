import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  Select,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import ImageUploader from "../Reusable-component/ImageUploader";
import { styled } from "@mui/material/styles";
import { createContext, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import {
  getCampus,
  getEmployeePosition,
  getFiscalYear,
} from "../../services/services";
import DateInputField from "../DateField/DateInputField";
import { useSelector } from "react-redux";
import {
  getDepartmentNamesForTeaching,
  getFacultyNamesForTeaching,
} from "../report/CampusReport/CampusServices";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';


const WorkInfoContext = createContext();

const WorkInfoProvider = ({ children }) => {
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
    facultyId: 0
  });
  const onChange = (event, name, value) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      setWorkInfo((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setWorkInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <WorkInfoContext.Provider value={{ ...methods, workInfo, onChange }}>
      {children}
    </WorkInfoContext.Provider>
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
const WorkGeneralInfo = ({ handleNext, handleBack, employeeType }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useContext(WorkInfoContext);
  const { onChange } = useContext(WorkInfoContext);
  const [fiscalYear, setFiscalYear] = useState([]);
  const [defaultFiscal, setDefaultFiscal] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser.listUser[0].roleName;
  const [position, setPosition] = useState([]);
  const [teachingFaculty, setTeachingFaculty] = useState([]);
  const [teachingDepartment, setTeachingDepartment] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState("");

  const fetchTeachingFaculties = async () => {
   const config = getAuthConfigSafe()
    try {
      const response = await axios.get(
        `${backendUrl}/Faculty/GetAllFaculties`,
        config
      );
      setTeachingFaculty(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchTeachingDepartment = async () => {
    const department = await getDepartmentNamesForTeaching();
    setTeachingDepartment(department);
  };
  useEffect(() => {
    fetchTeachingFaculties();
    fetchTeachingDepartment();
  }, []);
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

  const onSubmit = (data) => {
    handleSubmit((formData) => {
      Object.keys(formData).forEach((key) => {
        onChange("", key, formData[key]);
      });
      handleNext();
    })(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCampus();
        const fiscalYear = await getFiscalYear();
        const empPosition = await getEmployeePosition();
        setPosition(empPosition);
        setFiscalYear(fiscalYear);
        const activeFiscalYear = fiscalYear.find(
          (data) => data && data.activeFiscalYear === true
        );
        if (activeFiscalYear) {
          setDefaultFiscal(activeFiscalYear.id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  const onBack = () => {
    handleBack();
  };
  const handleEmployeeType = (value) => {
    setEmployeeTypes(value);
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
                    value={field.value || ""}
                    onChange={(e) => {
                      handleEmployeeType(e.target.value);
                      field.onChange(e.target.value);
                    }}
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
                      {employeeTypes &&
                        position
                          .filter((item) => item.type === employeeTypes)
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
                  />
                )}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel required={roleName !== "Admin"}>
                Teaching Faculty
              </InputLabel>
              <Controller
                name="facultyId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    required={roleName !== "Admin"}
                    id="facultyId"
                    size="small"
                    name="facultyId"
                    label="Teaching Faculty"
                    fullWidth
                    error={!!errors.facultyId}
                    helperText={errors.facultyId ? "Required" : ""}
                  >
                    <MenuItem value={""} disabled>
                      Select
                    </MenuItem>
                    {[
                      ...teachingFaculty.reduce((map, obj) => {
                        if (!map.has(obj.facultyName)) map.set(obj.facultyName, obj);
                        return map;
                      }, new Map()).values()
                    ].map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {item.facultyName}
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
            name="joiningDate"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <DateInputField
                {...field}
                label="Joining Date (BS)"
                name="joiningDate"
                value={field.value}
                format="YYYY/MM/DD"
                onChange={(newValue) => {
                  field.onChange(newValue);
                  onChange("joiningDate", newValue);
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container direction="column" alignItems="flex-start">
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onBack}
            sx={{}}
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
  );
};

export { WorkInfoProvider, WorkInfoContext };
export default WorkGeneralInfo;
