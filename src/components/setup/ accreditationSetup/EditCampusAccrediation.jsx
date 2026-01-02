import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  CardContent,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import useAddressData from "../../address/address";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';
const backendUrl = config.VITE_BACKEND_URL ;

export async function getUniversity() {
  try {
    const config = getAuthConfigSafe()
    const response = await axios.get(
      `${backendUrl}/University/GetAllUniversities`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

const EditCampusAccrediation = ({ campusId, onClose, open, onUpdate }) => {
  const baseUrl=config.VITE_BASE_URL;
  const {
    uniqueProvinces,
    uniqueDistricts,
    uniqueLocalLevels,
    selectedProvince,
    setSelectedProvince,
    setSelectedDistrict,
    noOfWards,
  } = useAddressData();

  const [campusInfo, setCampusInfo] = useState({
    localLevel: "",
    wardNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [campusData, setCampusData] = useState({});
  const [campusLogo, setCampusLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  const onChange = (event, name, value) => {
    setCampusInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getUniversity().then((data) => {
      if (data) {
        setUniversities(data);
      }
    });
  }, []);

  const { control, handleSubmit, setValue, reset } = useForm();

  const onSubmit = async (data) => {
    const selectedUniversity = universities.find(
      (u) => u.id === data.university
    );

    const apiCampusData = new FormData();
    apiCampusData.append("universityId", data.university || "");
    apiCampusData.append(
      "university",
      selectedUniversity ? selectedUniversity.name : ""
    );
    apiCampusData.append("campusType", data.type || "");
    apiCampusData.append("campusName", data.name || "");
    apiCampusData.append("establishedYear", data.yearOfEstd || "");
    apiCampusData.append("contactPhone", data.phone || "");
    apiCampusData.append("lanlineNo", data.lanlineNo || "");
    apiCampusData.append("contactEmail", data.email || "");
    apiCampusData.append("webUrl", data.url || "");
    apiCampusData.append("province", data.province || "");
    apiCampusData.append("district", data.district || "");
    apiCampusData.append("localLevel", data.localLevel || "");
    apiCampusData.append("ward", data.wardNo || "");
    apiCampusData.append("tole", data.locality || "");
    if (campusLogo) {
      apiCampusData.append("campusLogo", campusLogo);
    }
    apiCampusData.append("remarks", data.remarks || "");

    try {
      setLoading(true);
      const baseConfig = getAuthConfigSafe()
      const config = {
        ...baseConfig,
        headers: {
          ...baseConfig.headers,
          "Content-Type": "multipart/form-data",
        }
      }
      await axios.put(
        `${backendUrl}/AddCampusAccreditation/${campusId}`,
        apiCampusData,
        config
      );
      toast.success("Data posted successfully");
      onClose();
      onUpdate();
      reset();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/AddCampusAccreditation/${campusId}`,
        config
      );
      const campuses = response.data;
      const { province, district, campusLogo } = campuses;
      setCampusData(campuses);
      setSelectedProvince(province);
      setSelectedDistrict(district);
      setCampusData(response.data);
      setValue("university", campuses.universityId);
      setValue("type", campuses.campusType);
      setValue("name", campuses.campusName);
      setValue("yearOfEstd", campuses.establishedYear);
      setValue("phone", campuses.contactPhone);
      setValue("lanlineNo", campuses.lanlineNo);
      setValue("email", campuses.contactEmail);
      setValue("url", campuses.webUrl);
      setValue("province", campuses.province);
      setValue("district", campuses.district);
      setValue("localLevel", campuses.localLevel);
      setValue("wardNo", campuses.ward);
      setValue("locality", campuses.tole);
      setValue("remarks", campuses.remarks);
      setCampusInfo({
        localLevel: campuses.localLevel,
        wardNo: campuses.ward,
      });

      if (campusLogo) {
        setPreviewLogo(`${baseUrl}/${campusLogo}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (campusId) {
      fetchData();
    }
  }, [campusId, setValue]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCampusLogo(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };
  const getWardOptions = (localLevel) => {
    const wards = noOfWards[localLevel] || 0;
    return wards > 0 ? Array.from({ length: wards }, (_, i) => i + 1) : [];
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent>
        <Grid container justifyContent="center" sx={{ marginTop: "1rem" }}>
          <Grid item xs={12} md={10} lg={12}>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Edit Campus for Accreditation
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={5}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="university-label" required>
                        University
                      </InputLabel>
                      <Controller
                        name="university"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            required
                            labelId="university-label"
                            id="university"
                            label="University"
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              Select University
                            </MenuItem>
                            {universities.map((univ) => (
                              <MenuItem key={univ.id} value={univ.id}>
                                {univ.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Campus Name */}
                  <Grid item xs={12} sm={7}>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          id="name"
                          size="small"
                          label="Campus Name"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  {/* Year Of Establishment */}
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="yearOfEstd"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^\d{0,4}$/,
                          message:
                            "Please enter numeric values with a maximum of four digits",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          id="yearOfEstd"
                          size="small"
                          type="text"
                          label="Year Of Establishment"
                          InputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            onInput: (e) => {
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              if (e.target.value.length > 4) {
                                e.target.value = e.target.value.slice(0, 4);
                              }
                            },
                          }}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  {/* Campus Type */}
                  <Grid item xs={12} sm={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="campus-type-label" required>
                        Campus Type
                      </InputLabel>
                      <Controller
                        name="type"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            required
                            labelId="campus-type-label"
                            id="type"
                            label="Campus Type"
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              Select an option
                            </MenuItem>
                            <MenuItem value="constituent">Constituent</MenuItem>
                            <MenuItem value="community">Community</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={5}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Email format not matched",
                        },
                      }}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          id="email"
                          size="small"
                          type="email"
                          label="Email"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  {/* Phone Number */}
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        validate: (value) => {
                          const isValid = /^[0-9]*$/.test(value);
                          return isValid || "Invalid phone number";
                        },
                      }}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          id="phone"
                          type="text"
                          label="Mobile Number"
                          InputProps={{
                            placeholder: "Enter Mobile number",
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            onInput: (e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9-]/g,
                                ""
                              );
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
                      name="lanlineNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="lanlineNo"
                          type="text"
                          label="Landline Number"
                          InputProps={{
                            placeholder: "Enter Mobile number",
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            onInput: (e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9-]/g,
                                ""
                              );
                            },
                          }}
                          fullWidth
                          autoComplete="lanlineNo number"
                          size="small"
                        />
                      )}
                    />
                  </Grid>

                  {/* Province */}
                  <Grid item xs={12} sm={3}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="province-label" required>
                        Province
                      </InputLabel>
                      <Controller
                        name="province"
                        control={control}
                        rules={{ required: "Province is required" }}
                        defaultValue={selectedProvince || ""}
                        render={({ field }) => (
                          <Select
                            {...field}
                            required
                            labelId="province-label"
                            id="province"
                            label="Province"
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              Select a province
                            </MenuItem>
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
                  {/* District */}
                  <Grid item xs={12} sm={3}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="district-label" required>
                        District
                      </InputLabel>
                      <Controller
                        name="district"
                        control={control}
                        defaultValue={""}
                        render={({ field }) => (
                          <Select
                            {...field}
                            required
                            labelId="district-label"
                            id="district"
                            label="District"
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              Select a district
                            </MenuItem>
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
                  {/* Local Level */}
                  <Grid item xs={12} sm={3}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="local-level-label" required>
                        Local Level
                      </InputLabel>
                      <Controller
                        name="localLevel"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            required
                            labelId="local-level-label"
                            id="localLevel"
                            label="Local Level"
                            fullWidth
                            onChange={(e) => {
                              field.onChange(e);
                              onChange(e, "localLevel", e.target.value);
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select a Local Level
                            </MenuItem>
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
                  <Grid item xs={12} sm={3}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="ward-label" required>
                        Ward No.
                      </InputLabel>
                      <Controller
                        name="wardNo"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            required
                            labelId="ward-label"
                            id="wardNo"
                            label="Ward No."
                            fullWidth
                          >
                            <MenuItem value="" disabled>
                              Select Ward No.
                            </MenuItem>
                            {getWardOptions(campusInfo.localLevel).map(
                              (wardNo) => (
                                <MenuItem key={wardNo} value={wardNo}>
                                  {wardNo}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {/* Tole */}
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="locality"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="locality"
                          size="small"
                          label="Tole"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  {/* webUrl */}
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="url"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="url"
                          size="small"
                          label="Web url"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  {/* Remark */}
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="remarks"
                          size="small"
                          label="Remarks"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      id="campusLogo"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="campusLogo">
                      <Button variant="contained" component="span">
                        Upload Campus Logo
                      </Button>
                    </label>
                    {previewLogo && (
                      <img
                        src={previewLogo}
                        alt="Campus Logo Preview"
                        style={{
                          height: "75px",
                          marginTop: "10px",
                        }}
                      />
                    )}
                  </Grid>
                  <Grid container item xs={12} justifyContent={"center"}>
                    <Button
                      size="small"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Campus"}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={onClose}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampusAccrediation;
