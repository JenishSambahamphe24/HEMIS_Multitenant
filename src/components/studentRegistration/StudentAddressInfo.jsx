import React, { useState, createContext, useContext, useEffect } from "react";
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
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import useAddressData from "../address/address";

const StudentAddressContext = createContext();
const StudentAddressProvider = ({ children }) => {
  const methods = useForm();
  const [studentAddress, setStudentAddress] = useState({
    pProvince: "",
    pDistrict: "",
    pLocalLevel: "",
    isSameAsPermament: false,
    pWardNo: 0,
    pTole: "",
    pHouseNo: "",
    tProvince: "",
    tDistrict: "",
    tLocalLevel: "",
    tWardNo: 0,
    tTole: "",
    tHouseNo: "",
  });
  const onChange = (name, value) => {
    setStudentAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <StudentAddressContext.Provider
      value={{ ...methods, studentAddress, onChange }}
    >
      {children}
    </StudentAddressContext.Provider>
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

const StudentAddressInfo = ({ handleNext, handleBack }) => {
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    uniqueProvinces,
    uniqueDistricts,
    uniqueLocalLevels,
    setSelectedProvince,
    setSelectedDistrict,
    uniqueProvinces2,
    uniqueDistricts2,
    setSelectedProvince2,
    setSelectedDistrict2,
    uniqueLocalLevels2,
    noOfWards,
    noOfWards2,
  } = useAddressData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSelectedProvince(studentAddress?.pProvince);
        setSelectedDistrict(studentAddress?.pDistrict);
        setSelectedProvince2(studentAddress?.tProvince);
        setSelectedDistrict2(studentAddress?.tDistrict);
        setSameAsPermanent(studentAddress?.isSameAsPermament);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const { studentAddress, onChange } = useContext(StudentAddressContext);

  const handleSameAsPermanent = (event) => {
    const isChecked = event.target.checked;
    setSameAsPermanent(isChecked);
    onChange("isSameAsPermament", isChecked);
  };

  const onSubmit = (data) => {
    onChange("pProvince", data.pProvince);
    onChange("pDistrict", data.pDistrict);
    onChange("pLocalLevel", data.pLocalLevel);
    onChange("pWardNo", data.pWardNo);
    onChange("pTole", data.pTole);
    onChange("pHouseNo", data.pHouseNo);
    onChange("tProvince", data.tProvince);
    onChange("tDistrict", data.tDistrict);
    onChange("tLocalLevel", data.tLocalLevel);
    onChange("tWardNo", data.tWardNo);
    onChange("tTole", data.tTole);
    onChange("tHouseNo", data.tHouseNo);
    onChange("isSameAsPermament", sameAsPermanent);
    handleNext();
  };

  const onBack = () => {
    handleBack();
  };
  const getpWardOptions = (pLocalLevel) => {
    const wards = noOfWards[pLocalLevel] || 0;
    return Array.from({ length: wards }, (_, i) => i + 1);
  };
  const gettWardOptions = (tLocalLevel) => {
    const wards = noOfWards2[tLocalLevel] || 0;
    return Array.from({ length: wards }, (_, i) => i + 1);
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
          <Typography variant="subtitle1" sx={{ color: "black", mt: "1rem" }}>
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
              rules={{ required: "Province is required" }}
              defaultValue={studentAddress.pProvince || ""}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="pProvince"
                  label="pProvince"
                  size="small"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedProvince(value);
                    setSelectedDistrict(null);
                    field.onChange(value);
                  }}
                  error={!!errors.pProvince}
                  helperText={errors.pProvince ? errors.pProvince.message : ""}
                >
                  <MenuItem value="" disabled>
                    Select Province{" "}
                  </MenuItem>
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
              rules={{ required: "District is required" }}
              defaultValue={studentAddress.pDistrict}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="pDistrict"
                  label="District"
                  size="small"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDistrict(value);
                    field.onChange(value);
                  }}
                  error={!!errors.pDistrict}
                  helperText={errors.pDistrict ? errors.pDistrict.message : ""}
                >
                  <MenuItem value="" disabled>
                    Select District{" "}
                  </MenuItem>
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
              rules={{ required: "Local Level is required" }}
              defaultValue={studentAddress?.pLocalLevel || ""}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="pLocalLevel"
                  label="Local Level"
                  size="small"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    onChange("pLocalLevel", value);
                  }}
                  error={!!errors.pLocalLevel}
                  helperText={
                    errors.pLocalLevel ? errors.pLocalLevel.message : ""
                  }
                >
                  <MenuItem value="" disabled>
                    Select Local levels{" "}
                  </MenuItem>
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
          <FormControl fullWidth size="small">
            <InputLabel required>Ward No</InputLabel>
            <Controller
              name="pWardNo"
              control={control}
              defaultValue={studentAddress?.pWardNo || ""}
              render={({ field }) => (
                <Select
                  required
                  {...field}
                  id="pWardNo"
                  size="small"
                  label="Ward No"
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Ward{" "}
                  </MenuItem>
                  {getpWardOptions(studentAddress.pLocalLevel).map((ward) => (
                    <MenuItem key={ward} value={ward}>
                      {ward}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="pTole"
            control={control}
            defaultValue={studentAddress.pTole}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="pTole"
                size="small"
                label="Tole"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="pHouseNo"
            control={control}
            defaultValue={studentAddress.pHouseNo}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="pHouseNo"
                size="small"
                label="House No"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ color: "black", mt: ".5rem" }}>
            Current address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={sameAsPermanent}
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
                <InputLabel id="tProvince" required={sameAsPermanent === false}>
                  Province
                </InputLabel>
                <Controller
                  name="tProvince"
                  control={control}
                  defaultValue={
                    sameAsPermanent
                      ? studentAddress.pProvince
                      : studentAddress.tProvince
                  }
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      required={sameAsPermanent === false}
                      labelId="tProvince"
                      label="tProvince"
                      size="small"
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedProvince2(value);
                        setSelectedDistrict2(null);
                        field.onChange(value);
                      }}
                      disabled={sameAsPermanent}
                    >
                      <MenuItem value="" disabled>
                        Select Province{" "}
                      </MenuItem>
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
                <InputLabel id="tDistrict" required={sameAsPermanent === false}>
                  District
                </InputLabel>
                <Controller
                  name="tDistrict"
                  control={control}
                  defaultValue={
                    sameAsPermanent
                      ? studentAddress.pDistrict
                      : studentAddress.tDistrict
                  }
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      required={sameAsPermanent === false}
                      labelId="tDistrict"
                      label="District"
                      size="small"
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedDistrict2(value);
                        field.onChange(value);
                      }}
                      disabled={sameAsPermanent}
                    >
                      <MenuItem value="" disabled>
                        Select District{" "}
                      </MenuItem>
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
                <InputLabel
                  id="tLocalLevel"
                  required={sameAsPermanent === false}
                >
                  Local Level
                </InputLabel>
                <Controller
                  name="tLocalLevel"
                  control={control}
                  defaultValue={
                    sameAsPermanent
                      ? studentAddress.pLocalLevel
                      : studentAddress.tLocalLevel
                  }
                  render={({ field }) => (
                    <ValidationSelect
                      {...field}
                      required={sameAsPermanent === false}
                      labelId="tLocalLevel"
                      label="Local Level"
                      size="small"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        onChange("tLocalLevel", value); // Update local level in state
                      }}
                      disabled={sameAsPermanent}
                    >
                      <MenuItem value="" disabled>
                        Select localLevel{" "}
                      </MenuItem>
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

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel required={sameAsPermanent === false}>
                  Ward No
                </InputLabel>
                <Controller
                  name="tWardNo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      required={sameAsPermanent === false}
                      {...field}
                      id="tWardNo"
                      size="small"
                      label="Ward No"
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Ward{" "}
                      </MenuItem>
                      {gettWardOptions(studentAddress.tLocalLevel).map(
                        (ward) => (
                          <MenuItem key={ward} value={ward}>
                            {ward}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="tTole"
                control={control}
                defaultValue={studentAddress.tTole}
                render={({ field }) => (
                  <ValidationTextField
                    {...field}
                    id="tTole"
                    size="small"
                    label="Tole"
                    fullWidth
                    disabled={sameAsPermanent}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="tHouseNo"
                control={control}
                defaultValue={studentAddress.tHouseNo}
                render={({ field }) => (
                  <ValidationTextField
                    {...field}
                    id="tHouseNo"
                    size="small"
                    label="House No"
                    fullWidth
                    disabled={sameAsPermanent}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>

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
          sx={{ marginLeft: "10px" }}
          endIcon={<ChevronRightRoundedIcon />}
        >
          Next
        </Button>
      </Box>
    </Grid>
  );
};

export { StudentAddressProvider, StudentAddressContext };
export default StudentAddressInfo;
