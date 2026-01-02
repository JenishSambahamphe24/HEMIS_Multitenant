import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Box,
  Button,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { createContext } from "react";
import useAddressData from "../../address/address";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getStudentById } from "../../../services/employeeService";

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


const EditStudentAddressContext = createContext();
const EditStudentAddressProvider = ({ children }) => {
  const methods = useForm();
  const [editStudentAddress, setEditStudentAddress] = useState({});
  const onChange = (name, value) => {
    setEditStudentAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <EditStudentAddressContext.Provider
      value={{ ...methods, editStudentAddress, onChange }}
    >
      {children}
    </EditStudentAddressContext.Provider>
  );
};
const EditStudentAddressInfo = ({ handleNext, handleBack, id }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useContext(EditStudentAddressContext);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  // Watch the local level values to update ward options dynamically
  const watchedPLocalLevel = watch("pLocalLevel");
  const watchedTLocalLevel = watch("tLocalLevel");

  const [editStudentAddress, setEditStudentAddress] = useState({
    pProvince: "",
    pDistrict: "",
    pLocalLevel: "",
    pWardNo: 0,
    pTole: "",
    pHouseNo: "",
    isSameAsPermament: false,
    tProvince: "",
    tDistrict: "",
    tLocalLevel: "",
    tWardNo: 0,
    tTole: "",
    tHouseNo: "",
  });

  const fetchData = async () => {
    try {
      const getStudentData = await getStudentById(id);
      setSelectedProvince(getStudentData.pProvince);
      setSelectedProvince2(getStudentData.tProvince);
      setSelectedDistrict(getStudentData.pDistrict);
      setSelectedDistrict2(getStudentData.tDistrict);
      setSameAsPermanent(getStudentData?.isSameAsPermanent? true: false);
      setValue("pProvince", getStudentData.pProvince);
      setValue("pDistrict", getStudentData.pDistrict);
      setValue("pLocalLevel", getStudentData.pLocalLevel);
      setValue("pWardNo", getStudentData.pWardNo);
      setValue("pTole", getStudentData.pLocality);
      setValue("pHouseNo", getStudentData.pHouseNo);
      setValue("isSameAsPermanent", getStudentData?.isSameAsPermanent);
      setValue("tProvince", getStudentData.tProvince);
      setValue("tDistrict", getStudentData.tDistrict);
      setValue("tLocalLevel", getStudentData.tLocalLevel);
      setValue("tWardNo", getStudentData.tWardNo);
      setValue("tTole", getStudentData.tLocality);
      setValue("tHouseNo", getStudentData.tHouseNo);

      setEditStudentAddress({
        pProvince: getStudentData.pProvince,
        pDistrict: getStudentData.pDistrict,
        pLocalLevel: getStudentData.pLocalLevel,
        pWardNo: getStudentData.pWardNo,
        pTole: getStudentData.pLocality,
        pHouseNo: getStudentData.pHouseNo,
        isSameAsPermanent: getStudentData.isSameAsPermanent,
        tProvince: getStudentData.tProvince,
        tDistrict: getStudentData.tDistrict,
        tLocalLevel: getStudentData.tLocalLevel,
        tWardNo: getStudentData.tWardNo,
        tTole: getStudentData.tLocality,
        tHouseNo: getStudentData.tHouseNo,
      });
    } catch (error) {
      console.log("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const {
    uniqueProvinces,
    uniqueDistricts,
    uniqueLocalLevels,
    setSelectedProvince,
    setSelectedDistrict,
    uniqueProvinces2,
    uniqueDistricts2,
    uniqueLocalLevels2,
    setSelectedProvince2,
    setSelectedDistrict2,
    noOfWards,
    noOfWards2,
  } = useAddressData();
  const { onChange } = useContext(EditStudentAddressContext);

  const onSubmit = (data) => {
    onChange("pProvince", data.pProvince);
    onChange("pDistrict", data.pDistrict);
    onChange("pLocalLevel", data.pLocalLevel);
    onChange("pWardNo", data.pWardNo);
    onChange("pTole", data.pTole);
    onChange("pHouseNo", data.pHouseNo);
    onChange(
      "isSameAsPermanent",
      data.isSameAsPermanent || sameAsPermanent ? true : false
    );
    onChange("tProvince", data.tProvince);
    onChange("tDistrict", data.tDistrict);
    onChange("tLocalLevel", data.tLocalLevel);
    onChange("tWardNo", data.tWardNo);
    onChange("tTole", data.tTole);
    onChange("tHouseNo", data.tHouseNo);
    handleNext();
  };
  const onBack = () => {
    handleBack();
  };
  
  // Updated functions to use watched values instead of state
  const getpWardOptions = (pLocalLevel) => {
    const localLevel = pLocalLevel || watchedPLocalLevel;
    const wards = noOfWards[localLevel] || 0;
    return Array.from({ length: wards }, (_, i) => i + 1);
  };
  
  const gettWardOptions = (tLocalLevel) => {
    const localLevel = tLocalLevel || watchedTLocalLevel;
    const wards = noOfWards2[localLevel] || 0;
    return Array.from({ length: wards }, (_, i) => i + 1);
  };
  
  const handleSameAsPermanent = (event) => {
    const isChecked = event.target.checked;
    setSameAsPermanent(isChecked);
    onChange("isSameAsPermament", isChecked);
  };
  
  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={onBack}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ color: "#636363" }}>
            Permanent Address
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl size="small" fullWidth>
            <InputLabel id="pProvince" required>
              Province
            </InputLabel>
            <Controller
              name="pProvince"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  required
                  labelId="pProvince"
                  label="Province"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedProvince(value);
                    setSelectedDistrict(null);
                    field.onChange(value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {uniqueProvinces.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl size="small" fullWidth>
            <InputLabel id="pDistrict" required>
              District
            </InputLabel>
            <Controller
              name="pDistrict"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                required
                  {...field}
                  labelId="pDistrict"
                  label="District"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDistrict(value);
                    field.onChange(value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {uniqueDistricts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl size="small" fullWidth>
            <InputLabel id="pLocalLevel" required>
              Local Level
            </InputLabel>
            <Controller
              name="pLocalLevel"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                required
                  {...field}
                  labelId="pLocalLevel"
                  label="Local Level"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("pLocalLevel", value);
                    setValue("pWardNo", ""); // Reset ward when local level changes
                    onChange("pLocalLevel", value);
                    field.onChange(value);
                  }}
                >
                  {uniqueLocalLevels.map((localLevel) => (
                    <MenuItem key={localLevel} value={localLevel}>
                      {localLevel}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl size="small" fullWidth>
            <InputLabel id="pWardNo" required>
              Ward No
            </InputLabel>
            <Controller
              name="pWardNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  required
                  labelId="pWardNo"
                  label="Ward No"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                  }}
                  error={!!errors.pWardNo}
                  helperText={errors.pWardNo ? errors.pWardNo.message : ""}
                >
                  {getpWardOptions().map((ward) => (
                    <MenuItem key={ward} value={ward}>
                      {ward}
                    </MenuItem>
                  ))}
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="pTole"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="pTole"
                size="small"
                name="pTole"
                label="Tole"
                value={field.value || ""}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="pHouseNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="pHouseNo"
                size="small"
                name="pHouseNo"
                label="House No"
                value={field.value || ""}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#636363", mt: ".5rem" }}
          >
            Current Address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={sameAsPermanent ? true : false}
                onChange={handleSameAsPermanent}
              />
            }
            label="Same as Permanent Address"
          />
        </Grid>
        {sameAsPermanent === false && (
          <>
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel id="tProvince" required>
                  Province
                </InputLabel>
                <Controller
                  name="tProvince"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      required
                      labelId="tProvince"
                      label="Province"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedProvince2(value);
                        setSelectedDistrict2(null);
                        field.onChange(value);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {uniqueProvinces2.map((province) => (
                        <MenuItem key={province} value={province}>
                          {province}
                        </MenuItem>
                      ))}
                    </ValidationSelect>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel id="tDistrict" required>
                  District
                </InputLabel>
                <Controller
                  name="tDistrict"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      required
                      labelId="tDistrict"
                      label="District"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedDistrict2(value);
                        field.onChange(value);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {uniqueDistricts2.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </ValidationSelect>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel id="tLocalLevel" required>
                  Local Level
                </InputLabel>
                <Controller
                  name="tLocalLevel"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      required
                      labelId="tLocalLevel"
                      label="Local Level"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue("tLocalLevel", value);
                        setValue("tWardNo", ""); // Reset ward when local level changes
                        onChange("tLocalLevel", value);
                        field.onChange(value);
                      }}
                    >
                      {uniqueLocalLevels2.map((localLevel) => (
                        <MenuItem key={localLevel} value={localLevel}>
                          {localLevel}
                        </MenuItem>
                      ))}
                    </ValidationSelect>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel id="tWardNo" required>
                  Ward No
                </InputLabel>
                <Controller
                  name="tWardNo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      required
                      labelId="tWardNo"
                      label="Ward No"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                    >
                      {gettWardOptions().map((ward) => (
                        <MenuItem key={ward} value={ward}>
                          {ward}
                        </MenuItem>
                      ))}
                    </ValidationSelect>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="tTole"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationTextField
                    {...field}
                    id="tTole"
                    size="small"
                    name="tTole"
                    label="Tole"
                    value={field.value || ""}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="tHouseNo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ValidationTextField
                    {...field}
                    id="tHouseNo"
                    size="small"
                    name="tHouseNo"
                    label="Current House No"
                    value={field.value || ""}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Grid item display="flex" justifyContent="flex-end" xs={12}>
        <Box mt={1} mb={2} display="flex">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleBack}
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

export { EditStudentAddressProvider, EditStudentAddressContext };
export default EditStudentAddressInfo;