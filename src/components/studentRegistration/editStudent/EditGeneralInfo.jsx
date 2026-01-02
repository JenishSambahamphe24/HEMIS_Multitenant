import { useEffect, useState, createContext, useContext } from "react";
import {
  Grid,
  Typography,
  TextField,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  capitalize,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getStudentById } from "../../../services/employeeService";
import { BSToAD } from "bikram-sambat-js";
import useAddressData from "../../address/address";
import { getEthnicGroup } from "../../../services/employeeService";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import BikramSambatDateInput from "../../DateField/DateInputField";
import { getDateOnly } from "../../../utils/dateUtils";

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

const EditStudentInfoContext = createContext();

const EditStudentInfoProvider = ({ children }) => {
  const methods = useForm();
  const [editStudentInfo, setEditStudentInfo] = useState({
   nepaliName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    doBBS: "",
    doBAD: "",
    gender: "",
    ethnicity: "",
    nationality: "",
    isFromMartyrFamily: "",
    isMuktaKamaiya: "",
    edg: "",
    disabilityStatus: "",
    disabilityType: "",
    email: "",
    religion: "",
    citizenshipNo: "",
    citizenIssueDist: "",
    citizenFront: "",
    citizenBack: "",
    nidNo: "",
    nidPic: "",
    ppSizePhoto: "",
  });

  const onChange = (event, name, value) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      setEditStudentInfo((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setEditStudentInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  return (
    <EditStudentInfoContext.Provider
      value={{ ...methods, editStudentInfo, onChange }}
    >
      {children}
    </EditStudentInfoContext.Provider>
  );
};

const EditStudentGeneralInfo = ({ handleNext, handleBack, id }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useContext(EditStudentInfoContext);
  const { onChange } = useContext(EditStudentInfoContext);
  const disabilityStatus = watch("disabilityStatus");
  const { address } = useAddressData();
  const [ethnicGroup, setEthnicGroup] = useState([]);
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ethnicGroup = await getEthnicGroup();
        setEthnicGroup(ethnicGroup);
        const getStudentData = await getStudentById(id);
        setStudentData(getStudentData);
        const doBBSFormatted = getStudentData?.doBBS.slice(0, 10);
        const doBADFromApi = getDateOnly(getStudentData?.doBAD);
        setValue("nepaliName", getStudentData.nepaliName);
        setValue("firstName", getStudentData.firstName);
        setValue("middleName", getStudentData.middleName || "");
        setValue("lastName", getStudentData.lastName);
        setValue("phone", getStudentData.phoneNumber);
        setValue("email", getStudentData.email);
        setValue("doBBS", doBBSFormatted);
        setValue("doBAD", doBADFromApi);
        setValue("gender", getStudentData.gender);
        setValue("ethnicity", getStudentData.ethnicity);
        setValue("edg", getStudentData.edg);
        setValue("nidNo", getStudentData.nidNo);
        setValue("nationality", capitalize(getStudentData.nationality));
        setValue("disabilityStatus", getStudentData.disabilityStatus);
        setValue("disabilityType", getStudentData.disabilityType);
        setValue("citizenshipNo", getStudentData.citizenshipNo);
        setValue("pDistrict", getStudentData.pDistrict);
        setValue("citizenIssueDist", getStudentData.citizenIssueDist);
        setValue("isMuktaKamaiaya", getStudentData.isMuktaKamaiya);
        setValue("isFromMartyrFamily", getStudentData.isFromMartyrFamily);
        setValue("religion", getStudentData.religion);
        setValue("digitalSignature", getStudentData.digitalSignature);
        setValue("ppSizePhoto", getStudentData.ppSizePhoto);
        setValue("citizenshipFront", getStudentData.citizenshipFront);
        setValue("citizenshipBack", getStudentData.citizenshipBack);
      } catch (error) {
        console.log("error", error);
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

  const handledoBBSChange = (newValue) => {
    if (!newValue || newValue === "") {
      setValue("doBBS", "");
      setValue("doBAD", "");
      onChange("", "doBBS", "");
      onChange("", "doBAD", "");
      return;
    }

    try {
      // Extract date part from the input (in case it includes time)
      const datePart = newValue.split("T")[0];
      
      // Format BS date to YYYY/MM/DD format expected by BSToAD
      const bsDateFormatted = datePart.replace(/-/g, "/");
      
      // Convert BS to AD
      const convertedDate = BSToAD(bsDateFormatted);
      
      if (convertedDate && convertedDate !== "Invalid Date") {
        // Format the AD date as YYYY-MM-DD
        let formattedADDate = convertedDate;
        
        // If it's a Date object, format it
        if (convertedDate instanceof Date && !isNaN(convertedDate.getTime())) {
          const year = convertedDate.getFullYear();
          const month = String(convertedDate.getMonth() + 1).padStart(2, '0');
          const day = String(convertedDate.getDate()).padStart(2, '0');
          formattedADDate = `${year}-${month}-${day}`;
        }
        // If it's already a string in valid format
        else if (typeof convertedDate === 'string' && 
                 convertedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          formattedADDate = convertedDate;
        }
        // If it's a string but needs formatting
        else if (typeof convertedDate === 'string' && convertedDate !== "Invalid Date") {
          // Try to parse and format
          const parsedDate = new Date(convertedDate);
          if (!isNaN(parsedDate.getTime())) {
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            formattedADDate = `${year}-${month}-${day}`;
          } else {
            console.warn("Could not parse converted date:", convertedDate);
            formattedADDate = "";
          }
        } else {
          console.warn("Invalid date conversion result:", convertedDate);
          formattedADDate = "";
        }
        
        // Update both form values
        setValue("doBBS", newValue);
        setValue("doBAD", formattedADDate);
        
        // Update the context state
        onChange("", "doBBS", newValue);
        onChange("", "doBAD", formattedADDate);
        
      } else {
        // Handle invalid conversion
        console.warn("Invalid date conversion - result is falsy or 'Invalid Date':", convertedDate);
        setValue("doBAD", "");
        onChange("", "doBAD", "");
      }
      
    } catch (error) {
      console.error("Error converting BS to AD:", error);
      setValue("doBAD", "");
      onChange("", "doBAD", "");
    }
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={onBack}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <Controller
            name="nepaliName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                required
                {...field}
                id="nepaliName"
                size="small"
                name="nepaliName"
                label="विद्यार्थीको पुरा नाम देबनगरीमा (unicode)"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "Required" }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="firstName"
                size="small"
                name="firstName"
                required
                label="First Name (English)"
                fullWidth
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="middleName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="middleName"
                size="small"
                name="middleName"
                label="Middle Name"
                fullWidth
                inputProps={{ style: { textTransform: "uppercase" } }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="lastName"
                required
                size="small"
                name="lastName"
                label="Last Name"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="phone"
                type="text"
                name="phone"
                label="Mobile Number"
                InputProps={{
                  placeholder: "98XXXXXXXX",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                  },
                }}
                fullWidth
                autoComplete="phone number"
                size="small"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="email"
                name="email"
                type="email"
                size="small"
                label="Email"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid
          display="flex"
          justifyContent="space-between"
          item
          xs={12}
          sm={2}
        >
          <Controller
            name="doBBS"
            control={control}
            defaultValue=""
            rules={{
              validate: (value) => {
                if (value) {
                  const date = new Date(value);
                  if (isNaN(date.getTime())) {
                    return "Invalid Date";
                  }
                }
                return true;
              },
            }}
            render={({ field }) => (
              <BikramSambatDateInput
                {...field}
                label="Date of Birth (B.S)"
                name="doBBS"
                value={field.value || ""}
                onChange={(newValue) => {
                  field.onChange(newValue);
                  onChange("doBBS", newValue);
                  handledoBBSChange(newValue);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="doBAD"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="doBAD"
                name="doBAD"
                label="Date of Birth (A.D)"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true, 
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={1.5}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Required" }}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel id="gender-label" required>
                  Gender
                </InputLabel>
                <ValidationSelect
                  required
                  labelId="gender"
                  {...field}
                  label="Gender"
                  defaultValue=""
                  error={!!errors.gender}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </ValidationSelect>
                {errors.gender && (
                  <Typography color="error" variant="caption">
                    {errors.gender.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={1.5}>
          <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
            <InputLabel sx={{ borderColor: "blue" }} id="ethnicity" required>
              Ethnicity
            </InputLabel>
            <Controller
              name="ethnicity"
              control={control}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  required
                  labelId="ethnicity"
                  id="ethnicity"
                  name="ethnicity"
                  label="Ethnicity"
                  fullWidth
                  error={!!errors.ethnicity}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                >
                  <MenuItem value="" disabled>
                    Select Ethnicity
                  </MenuItem>
                  {ethnicGroup &&
                    ethnicGroup.map((data) => (
                      <MenuItem key={data.id} value={data.name}>
                        {data.name}
                      </MenuItem>
                    ))}
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
            <InputLabel sx={{ borderColor: "blue" }} id="religion">
              Religion
            </InputLabel>
            <Controller
              name="religion"
              control={control}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="religion"
                  id="religion"
                  name="religion"
                  label="Religion"
                  fullWidth
                  value={field.value || ""}
                >
                  <MenuItem value="" disabled>
                    Select Religion
                  </MenuItem>

                  <MenuItem value={"Hinduism"}>Hinduism</MenuItem>
                  <MenuItem value={"Buddhism"}>Buddhism</MenuItem>
                  <MenuItem value={"Islamic"}>Islamic</MenuItem>
                  <MenuItem value={"Sikhism"}>Sikhism</MenuItem>
                  <MenuItem value={"Kirat"}>Kirat</MenuItem>
                  <MenuItem value={"Christian"}>Christian</MenuItem>
                  <MenuItem value={"Others"}>Others</MenuItem>
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1.5}>
          <Controller
            name="nationality"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="nationality"
                size="small"
                name="nationality"
                label="Nationality"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="disabilityStatus"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel id="disability-status-label">
                  Disability Status
                </InputLabel>
                <ValidationSelect
                  labelId="disability-status-label"
                  {...field}
                  label="Disability Status"
                  defaultValue=""
                >
                  <MenuItem value="able">Able</MenuItem>
                  <MenuItem value="differentlyable">Differently Able</MenuItem>
                </ValidationSelect>
              </FormControl>
            )}
          />
        </Grid>
        {disabilityStatus === "differentlyable" && (
          <Grid item xs={12} sm={1.5}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel
                sx={{ borderColor: "blue" }}
                id="disabilityType"
                required
              >
                Disability Type
              </InputLabel>
              <Controller
                name="disabilityType"
                control={control}
                defaultValue=""
                disabled={disabilityStatus === "able"}
                render={({ field }) => (
                  <Select
                    {...field}
                    required
                    labelId="disabilityType"
                    id="disabilityType"
                    fullWidth
                    label="Dissability Type"
                  >
                    <MenuItem value="" disabled>
                      अपाङ्गता प्रकार{" "}
                    </MenuItem>
                    <MenuItem value="A">क</MenuItem>
                    <MenuItem value="B">ख</MenuItem>
                    <MenuItem value="C">ग</MenuItem>
                    <MenuItem value="D">घ</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={1.5}>
          <Controller
            name="citizenshipNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="citizenshipNo"
                size="small"
                name="citizenshipNo"
                label="Citizenship Number"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="citizenIssueDist"
            control={control}
            defaultValue=""
            render={({ field }) => {
              // Extract unique districts
              const districtOptions =
                address &&
                Array.from(new Set(address.map((data) => data.district)));

              return (
                <Autocomplete
                  {...field}
                  options={districtOptions || []}
                  getOptionLabel={(option) => option || ""}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Issued District"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={1.5}>
          <Controller
            name="nidNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="nidNo"
                name="nidNo"
                type="nidNo"
                size="small"
                label="NID No."
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid paddingLeft="10px" container sm={12}>
          <Grid item sm={4}>
            <FormGroup>
              <Controller
                name="edg"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value ? true : false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Belong to EDG?"
                    sx={{
                      color: "#5a5b5d",
                      "& .MuiFormControlLabel-label": {
                        color: "#5a5b5d",
                      },
                    }}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item sm={4}>
            <FormGroup>
              <Controller
                name="isMuktaKamaiaya"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value ? true : false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Is mukta Kamaiya ?"
                    sx={{
                      color: "#5a5b5d",
                      "& .MuiFormControlLabel-label": {
                        color: "#5a5b5d",
                      },
                    }}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item sm={4}>
            <FormGroup>
              <Controller
                name="isFromMartyrFamily"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value ? true : false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Is from martyr/conflict-affected family ?"
                    sx={{
                      color: "#5a5b5d",
                      "& .MuiFormControlLabel-label": {
                        color: "#5a5b5d",
                      },
                    }}
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<ChevronLeftRoundedIcon />}
              onClick={onBack}
              disabled
            >
              Back
            </Button>
            <Button
              sx={{ marginLeft: "10px" }}
              variant="outlined"
              size="small"
              endIcon={<ChevronRightRoundedIcon />}
              type="submit"
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
export { EditStudentInfoProvider, EditStudentInfoContext };
export default EditStudentGeneralInfo;
