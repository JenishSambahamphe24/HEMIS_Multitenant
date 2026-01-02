
import {
    Box,
    TextField,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    DialogContent,
    IconButton,
    Stack,
} from "@mui/material";

import { LoadingOverlay } from "@mantine/core";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getEmployeeById } from "../../services/employeeService";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

function RolePrevilege({ id, handleRoleClose }) {
    const backendUrl=config.VITE_BACKEND_URL;
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(null);
    const [employeeData, setEmployeeData] = useState({});
    const [formData, setFormData] = useState({
        employeeStatus: null,
        phoneNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        type: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getEmployeeById(id);
            setEmployeeData(response);
            setFormData(prev => ({
                ...prev,
                id: id,
                employeeStatus: response.employeeStatus,
                phoneNumber: response.phoneNumber || "",
                firstName: response.firstName || "",
                middleName: response.middleName || "",
                lastName: response.lastName || "",
                gender: response.gender || "",
                type: response.type || "asdfasd",
            }));
        } catch (err) {
            toast(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGrantAdminAccess = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const config = getAuthConfigSafe()

            const queryParams = new URLSearchParams();
            queryParams.append('employeeId', id);
            queryParams.append('employeeStatus', formData.employeeStatus);
            if (formData.phoneNumber) queryParams.append('phoneNumber', formData.phoneNumber);
            if (formData.firstName) queryParams.append('firstName', formData.firstName);
            if (formData.middleName) queryParams.append('middleName', formData.middleName);
            if (formData.lastName) queryParams.append('lastName', formData.lastName);
            if (formData.gender) queryParams.append('gender', formData.gender);
            if (formData.type) queryParams.append('type', formData.type);

            const apiUrl = `${backendUrl}/Employee/migrate-old-employee?${queryParams.toString()}`;


            const response = await axios.post(
                apiUrl,
                '',
                config
            );

            if (response.data === "Login created or updated. Email sent if status is active.") {
                toast.success("Admin access granted successfully", {
                    autoClose: 2000,
                });

                setTimeout(() => {
                    handleRoleClose();
                }, 1200);
            }
        } catch (error) {
            console.error('Error in handleGrantAdminAccess:', error.response?.data || error.message);

            if (error.response?.data === 'Login already exists for this employee.') {
                toast.error("Login already exists for this employee.", {
                    style: {
                        background: "#007bff",
                        color: "#fff",
                        borderRadius: "8px",
                        fontWeight: "bold",
                    },
                    duration: 3000,
                });
            } else {
                toast.error(error.message || "Failed to grant admin access", {
                    autoClose: 3000,
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <DialogContent sx={{ maxWidth: "95vw", width: "100%", p: 2 }}>
            <Box sx={{ position: "relative", mb: 1 }}>
                <h1 className="text-center text-2xl font-bold">Make User Admin</h1>
                <IconButton
                    onClick={handleRoleClose}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {loading ? (
                <LoadingOverlay
                    visible={loading}
                    zIndex={100}
                    overlayProps={{ radius: "sm", blur: 1 }}
                    loaderProps={{ color: "#1976d2", type: "bars" }}
                />
            ) : (
                <Paper elevation={1} sx={{ p: 3 }}>
                    <form onSubmit={handleGrantAdminAccess}>
                        <Stack spacing={1}>
                            <Grid container marginTop="10px" gap="10px">
                                <Grid item xs={12} sm={3.9}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Employee Full Name"
                                        InputLabelProps={{ shrink: true }}
                                        value={`${employeeData.firstName || ""} ${employeeData.middleName || ""} ${employeeData.lastName || ""}`}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={1.9}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Phone"
                                        name="phoneNumber"
                                        onChange={handleChange}
                                        value={formData.phoneNumber || ""}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3.8}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Email"
                                        value={employeeData.email || ""}
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Position"
                                        value={employeeData.postName || ""}
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                            <Grid container marginTop="10px" gap="10px">
                                <Grid item xs={12} sm={3.2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Teaching Faculty"
                                        value={employeeData.teachingFacultyName || ""}
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12} sm={2.8}>
                                    <FormControl fullWidth required size="small">
                                        <InputLabel>Employee Status</InputLabel>
                                        <Select
                                            name="employeeStatus"
                                            value={formData.employeeStatus}
                                            onChange={handleChange}
                                            label="Employee Status"
                                            sx={{
                                                color: formData.employeeStatus ? "green" : "red",
                                            }}
                                        >
                                            <MenuItem value={true}>Active</MenuItem>
                                            <MenuItem value={false}>Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} style={{ marginTop: "20px" }}>
                                <h1 className="my-1 text-green-700">
                                    <span className="text-md font-bold tracking-wide">Note: </span>
                                    By clicking "Submit", you are about to change the employee's status. An active employee will be granted administrative access.
                                </h1>
                                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="small"
                                    // disabled={submitLoading || !formData.employeeStatus}
                                    >
                                        {submitLoading ? "SUBMITTING..." : "Submit"}
                                    </Button>
                                </Box>
                                {!formData.employeeStatus && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Employee must be active to grant admin access
                                    </p>
                                )}
                            </Grid>
                        </Stack>
                    </form>
                </Paper>
            )}
        </DialogContent>
    );
}

export default RolePrevilege;