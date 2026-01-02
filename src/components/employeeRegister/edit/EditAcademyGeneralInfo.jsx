import { Grid, TextField, Button, Box } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getEmployeeById } from "../../../services/employeeService";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getLevel } from "../../../services/services";
import { useSelector } from "react-redux";

const EditAcademyContext = createContext();

const EditAcademyInfoProvider = ({ children }) => {
  const methods = useForm();
  const [academyInfo, setAcademyInfo] = React.useState({
    graduatedfrom: "",
    facultyName: "",
    level: "",
    levelName: "",
    enrolledYear: "",
    passedYear: "",
    certificateCopy: "",
    transcriptCopy: "",
    marksheetCopy: "",
    otherDoc: "",
  });

  const onChange = (event, name, value) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      setAcademyInfo((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setAcademyInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <EditAcademyContext.Provider value={{ ...methods, academyInfo, onChange }}>
      {children}
    </EditAcademyContext.Provider>
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

const EditAcademyGeneralInfo = ({
  handleNext,
  handleBack,
  id,
  employeeType,
}) => {
  const { control, handleSubmit, setValue, onChange } =
    useContext(EditAcademyContext);
  const [level, setLevel] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser.listUser[0].roleName;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const levelData = await getLevel();
        setLevel(levelData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await getEmployeeById(id);
        setValue("graduatedfrom", employeeData.graduatedFrom || "");
        setValue("facultyName", employeeData.facultyName || "");
        setValue("level", employeeData.levelName || "");
        setValue("levelName", employeeData.levelName || "");
        setValue("enrolledYear", employeeData.enrolledYear || "");
        setValue("passedYear", employeeData.passedYear || "");
        setValue("certificateCopy", employeeData.certificateCopy || "");
        setValue("transcriptCopy", employeeData.transcriptCopy || "");
        setValue("marksheetCopy", employeeData.marksheetCopy || "");
        setValue("otherDoc", employeeData.otherDoc || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit = (data) => {
    handleSubmit((formData) => {
      Object.keys(formData).forEach((key) => {
        onChange("", key, formData[key]);
      });
      handleNext();
    })(data);
  };
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
        <Grid item xs={12} sm={8}>
          <Controller
            name="graduatedfrom"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                size="small"
                label="Graduated From"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            )}
          />
        </Grid>
        {employeeType && employeeType !== "teaching" ? (
          <Grid item xs={12} sm={4}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel
                sx={{ borderColor: "blue" }}
                id="level"
                required={roleName !== "Admin"}
              >
                level of Education
              </InputLabel>
              <Controller
                name="levelName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    id="levelName"
                    name="levelName"
                    required={roleName !== "Admin"}
                    size="small"
                    label="level of Education"
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select levelName
                    </MenuItem>
                    <MenuItem value="Literate">Literate</MenuItem>
                    <MenuItem value="DLE">DLE</MenuItem>
                    <MenuItem value="SLC">SLC</MenuItem>
                    <MenuItem value="TSLC">TSLC</MenuItem>
                    <MenuItem value="12">12</MenuItem>
                    <MenuItem value="PCL">PCL</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="Bachelor">Bachelor</MenuItem>
                    <MenuItem value="Master">Master</MenuItem>
                    <MenuItem value="MPhil.">MPhil.</MenuItem>
                    <MenuItem value="Ph.D.">Ph.D.</MenuItem>
                    <MenuItem value="N/A">N/A</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        ) : (
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel required>Level</InputLabel>
              <Controller
                name="level"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    required={roleName !== "Admin"}
                    id="level"
                    size="small"
                    name="level"
                    label="Level"
                    fullWidth
                  >
                    {level &&
                      [...new Set(level.map((data) => data.levelName))].map(
                        (uniqueLevel) => (
                          <MenuItem key={uniqueLevel} value={uniqueLevel}>
                            {uniqueLevel}
                          </MenuItem>
                        )
                      )}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <Controller
            name="facultyName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                name="facultyName"
                size="small"
                label="Faculty"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name="enrolledYear"
            control={control}
            render={({ field }) => (
              <ValidationTextField
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{ inputProps: { min: 1950 } }}
                {...field}
                size="small"
                label="Enrolled Year (BS)"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="passedYear"
            control={control}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                name="passedYear"
                InputProps={{ inputProps: { min: 1950 } }}
                size="small"
                label="Passed Year (BS)"
                fullWidth
              />
            )}
          />
        </Grid>
        {/* Include other fields as necessary */}
      </Grid>
      <Box mt={1} mb={2} display="flex" width="100%" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onBack}
          sx={{ marginLeft: "10px" }}
          startIcon={<ChevronLeftRoundedIcon />}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="submit"
          sx={{ marginLeft: "10px" }}
          endIcon={<ChevronRightRoundedIcon />}
        >
          Next
        </Button>
      </Box>
    </Grid>
  );
};

export { EditAcademyInfoProvider, EditAcademyContext };
export default EditAcademyGeneralInfo;
