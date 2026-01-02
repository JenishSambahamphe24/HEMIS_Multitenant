import React, { useEffect } from "react";
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
import { createContext, useContext, useState } from "react";
import useAddressData from "../../address/address";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getEmployeeById } from "../../../services/employeeService";

const EditAddressContext = createContext();

const EditAddressInfoProvider = ({ children }) => {
  const methods = useForm();
  const [employeeAddress, setEmployeeAddress] = useState({});
  const onChange = (name, value) => {
    setEmployeeAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <EditAddressContext.Provider
      value={{ ...methods, employeeAddress, onChange }}
    >
      {children}
    </EditAddressContext.Provider>
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

const EditEmployeeAddressGeneralInfo = ({ handleNext, handleBack, id }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useContext(EditAddressContext);
  
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  // Watch form values to get current selections
  const watchedPLocalLevel = watch("pLocalLevel");
  const watchedTLocalLevel = watch("tLocalLevel");

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
  
  const { onChange } = useContext(EditAddressContext);

  const fetchData = async () => {
    try {
      const getEmployeeData = await getEmployeeById(id);
      
      // Set address data state selectors
      setSelectedProvince(getEmployeeData.pProvince);
      setSelectedProvince2(getEmployeeData.tProvince);
      setSelectedDistrict(getEmployeeData.pDistrict);
      setSelectedDistrict2(getEmployeeData.tDistrict);
      setSameAsPermanent(getEmployeeData.isSameAsPermanent);

      // Update form values
      setValue("pProvince", getEmployeeData.pProvince || "");
      setValue("pDistrict", getEmployeeData.pDistrict || "");
      setValue("pLocalLevel", getEmployeeData.pLocalLevel || "");
      setValue("pWardNo", getEmployeeData.pWardNo || "");
      setValue("pTole", getEmployeeData.pTole || "");
      setValue("pHouseNo", getEmployeeData.pHouseNo || "");
      setValue("isSameAsPermanent", getEmployeeData.isSameAsPermanent || false);
      setValue("tProvince", getEmployeeData.tProvince || "");
      setValue("tDistrict", getEmployeeData.tDistrict || "");
      setValue("tLocalLevel", getEmployeeData.tLocalLevel || "");
      setValue("tWardNo", getEmployeeData.tWardNo || "");
      setValue("tTole", getEmployeeData.tTole || "");
      setValue("tHouseNo", getEmployeeData.tHouseNo || "");
    } catch (error) {
      console.log("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const onSubmit = (data) => {
    onChange("pProvince", data.pProvince);
    onChange("pDistrict", data.pDistrict);
    onChange("pLocalLevel", data.pLocalLevel);
    onChange("pWardNo", data.pWardNo);
    onChange("pTole", data.pTole);
    onChange("pHouseNo", data.pHouseNo);
    onChange("isSameAsPermanent", data.isSameAsPermanent || sameAsPermanent);
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

  const getpWardOptions = (pLocalLevel) => {
    if (!pLocalLevel || !noOfWards[pLocalLevel]) return [];
    const wards = noOfWards[pLocalLevel];
    return Array.from({ length: wards }, (_, i) => i + 1);
  };

  const gettWardOptions = (tLocalLevel) => {
    if (!tLocalLevel || !noOfWards2[tLocalLevel]) return [];
    const wards = noOfWards2[tLocalLevel];
    return Array.from({ length: wards }, (_, i) => i + 1);
  };

  const handleSameAsPermanent = (event) => {
    const isChecked = event.target.checked;
    setSameAsPermanent(isChecked);
    setValue("isSameAsPermanent", isChecked);
    onChange("isSameAsPermanent", isChecked);
    
    if (isChecked) {
      const pProvince = watch("pProvince");
      const pDistrict = watch("pDistrict");
      const pLocalLevel = watch("pLocalLevel");
      const pWardNo = watch("pWardNo");
      const pTole = watch("pTole");
      const pHouseNo = watch("pHouseNo");
      
      setValue("tProvince", pProvince);
      setValue("tDistrict", pDistrict);
      setValue("tLocalLevel", pLocalLevel);
      setValue("tWardNo", pWardNo);
      setValue("tTole", pTole);
      setValue("tHouseNo", pHouseNo);
      
      setSelectedProvince2(pProvince);
      setSelectedDistrict2(pDistrict);
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
              rules={{ required: "Province is required" }}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="pProvince"
                  label="Province"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedProvince(value);
                    setSelectedDistrict(null);
                    // Clear dependent fields
                    setValue("pDistrict", "");
                    setValue("pLocalLevel", "");
                    setValue("pWardNo", "");
                    field.onChange(value);
                  }}
                  error={!!errors.pProvince}
                >
                  {uniqueProvinces.map((province) => (
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
            <InputLabel id="pDistrict" required>
              District
            </InputLabel>
            <Controller
              name="pDistrict"
              control={control}
              defaultValue=""
              rules={{ required: "District is required" }}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="pDistrict"
                  label="District"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDistrict(value);
                    setValue("pLocalLevel", "");
                    setValue("pWardNo", "");
                    field.onChange(value);
                  }}
                  error={!!errors.pDistrict}
                >
                  {uniqueDistricts.map((district) => (
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
            <InputLabel id="pLocalLevel" required>
              Local Level
            </InputLabel>
            <Controller
              name="pLocalLevel"
              control={control}
              defaultValue=""
              rules={{ required: "Local Level is required" }}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="pLocalLevel"
                  label="Local Level"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("pLocalLevel", value);
                    setValue("pWardNo", ""); 
                    onChange("pLocalLevel", value);
                    field.onChange(value);
                  }}
                  error={!!errors.pLocalLevel}
                >
                  {uniqueLocalLevels.map((localLevel) => (
                    <MenuItem key={localLevel} value={localLevel}>
                      {localLevel}
                    </MenuItem>
                  ))}
                </ValidationSelect>
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
              rules={{ required: "Ward No is required" }}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="pWardNo"
                  label="Ward No"
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                  }}
                  error={!!errors.pWardNo}
                  disabled={!watchedPLocalLevel || getpWardOptions(watchedPLocalLevel).length === 0}
                >
                  {getpWardOptions(watchedPLocalLevel).map((ward) => (
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
          <Typography variant="subtitle1" sx={{ color: "#636363" }}>
            Current Address
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="isSameAsPermanent"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={field.value || sameAsPermanent}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      handleSameAsPermanent(e);
                    }}
                  />
                }
                label="Same as Permanent Address"
              />
            )}
          />
        </Grid>
        
        {!sameAsPermanent && (
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
                  rules={{ required: !sameAsPermanent ? "Province is required" : false }}
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      labelId="tProvince"
                      label="Province"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedProvince2(value);
                        setSelectedDistrict2(null);
                        setValue("tDistrict", "");
                        setValue("tLocalLevel", "");
                        setValue("tWardNo", "");
                        field.onChange(value);
                      }}
                      error={!!errors.tProvince}
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
                  rules={{ required: !sameAsPermanent ? "District is required" : false }}
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      labelId="tDistrict"
                      label="District"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedDistrict2(value);
                        setValue("tLocalLevel", "");
                        setValue("tWardNo", "");
                        field.onChange(value);
                      }}
                      error={!!errors.tDistrict}
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
                  rules={{ required: !sameAsPermanent ? "Local Level is required" : false }}
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      labelId="tLocalLevel"
                      label="Local Level"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue("tLocalLevel", value);
                        setValue("tWardNo", ""); // Clear ward when local level changes
                        onChange("tLocalLevel", value);
                        field.onChange(value);
                      }}
                      error={!!errors.tLocalLevel}
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
                  rules={{ required: !sameAsPermanent ? "Ward No is required" : false }}
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      labelId="tWardNo"
                      label="Ward No"
                      size="small"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                      error={!!errors.tWardNo}
                      disabled={!watchedTLocalLevel || gettWardOptions(watchedTLocalLevel).length === 0}
                    >
                      {gettWardOptions(watchedTLocalLevel).map((ward) => (
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
      
      <Box mt={1} mb={2} display="flex" width="100%" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleBack}
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

export { EditAddressInfoProvider, EditAddressContext };
export default EditEmployeeAddressGeneralInfo;