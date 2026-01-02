import {
  Grid,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ImageUploader from "../Reusable-component/ImageUploader";
import React, { createContext, useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getFaculty, getLevel } from "../../services/services";
import { useSelector } from "react-redux";

const AcademyContext = createContext();

const AcademyInfoProvider = ({ children }) => {
  const methods = useForm();
  const [academyInfo, setAcademyInfo] = useState({
    employeeid: "",
    graduatedfrom: "",
    faculty: "",
    level: "",
    levelName:"",
    program: "",
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
    <AcademyContext.Provider value={{ ...methods, academyInfo, onChange }}>
      {children}
    </AcademyContext.Provider>
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

const AcademyGeneralInfo = ({ handleNext, handleBack, employeeType }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useContext(AcademyContext);

  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser.listUser[0].roleName;
  const [level, setLevel] = useState([]);

  const { onChange } = useContext(AcademyContext);
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

  const onSubmit = (data) => {
    handleSubmit((formData) => {
      Object.keys(formData).forEach((key) => {
        onChange("", key, formData[key]);
      });
      handleNext();
    })(data);
  };

  const onBack = (data) => {
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
      <Grid container spacing={1}>
        <Grid item xs={12} sm={8}>
          <Controller
            name="graduatedfrom"
            control={control}
            rules={{ required: "Required" }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required={roleName !== "Admin"}
                id="graduatedfrom"
                size="small"
                name="graduatedfrom"
                label="Name of Institution"
                fullWidth
                error={!!errors.graduatedfrom}
                helperText={errors.graduatedfrom ? "Required" : ""}
              />
            )}
          />
        </Grid>
        {employeeType !== "teaching" ? (
          <Grid item xs={12} sm={4}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel
                sx={{ borderColor: "blue" }}
                id="levelName"
                required={roleName !== "Admin"}
              >
                level of Education
              </InputLabel>
              <Controller
                name="levelName"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    required={roleName !== "Admin"}
                    size="small"
                    label="level of Education"
                    fullWidth
                    error={!!errors.levelName}
                    helperText={errors.levelName ? "Required" : ""}
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
        {employeeType !== "teaching" ? (
          <Grid item xs={12} sm={4}>
            <Controller
              name="faculty"
              control={control}
              render={({ field }) => (
                <ValidationTextField
                  {...field}
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
        ) : (
          <Grid item xs={12} sm={4}>
            <Controller
              name="faculty"
              control={control}
              rules={{ required: "Required" }}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required={roleName !== "Admin"}
                  id="faculty"
                  size="small"
                  name="faculty"
                  label="Faculty"
                  fullWidth
                />
              )}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={4}>
          <Controller
            name="program"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required={roleName !== "Admin"}
                id="program"
                size="small"
                name="program"
                label="Program"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="enrolledYear"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                type="number"
                id="enrolledYear"
                size="small"
                name="enrolledYear"
                label="Enrolled Year(BS)"
                fullWidth
                InputProps={{
                  inputProps: { min: 1950 },
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Allow only numeric characters
                    if (e.target.value.length > 4) {
                      e.target.value = e.target.value.slice(0, 4); // Limit input to maximum of four characters
                    }
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="passedYear"
            control={control}
            defaultValue=""
            // rules={{
            //   pattern: {
            //     value: /^\d{0,4}$/,
            //     message:
            //       "Please enter only numeric values with maximum length of four digits",
            //   },
            // }}
            render={({ field }) => (
              <ValidationTextField
                type="number"
                {...field}
                id="passedYear"
                size="small"
                name="passedYear"
                label="Passed Year(BS)"
                fullWidth
                InputProps={{
                  inputMode: "numeric",
                  inputProps: { min: 1950 },
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Allow only numeric characters
                    if (e.target.value.length > 4) {
                      e.target.value = e.target.value.slice(0, 4); // Limit input to maximum of four characters
                    }
                  },
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
  );
};

export { AcademyInfoProvider, AcademyContext };
export default AcademyGeneralInfo;
