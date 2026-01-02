import  { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Grid,
    Typography,
    TextField,
    CardContent,
    Paper,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControlLabel,
    Checkbox,
    FormControl,
    Divider
} from "@mui/material";
import { getAllSemesters, getAllYears, getCollegePrograms, postSubject } from "../../../services/services";
import toast from "react-hot-toast";
import { getMajorSubsByProgramId } from "../../dashboard/services/service";
import { useSelector } from "react-redux";

const AddSubject = ({ onSubjectAdded }) => {
    const { currentUser } = useSelector((state) => state.user);
    const campusId = currentUser.institution.id;
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const [programData, setProgramData] = useState([]);
    const [selectedProgramType, setSelectedProgramType] = useState("");
    const [semester, setSemester] = useState([]);
    const [year, setYear] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState(0);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProgramGroups = async () => {
        if (!selectedProgramId || selectedProgramId <= 0) {
            setGroups([]);
            setSelectedGroups([]);
            return;
        }
        try {
            const response = await getMajorSubsByProgramId(selectedProgramId);
            if (response && Array.isArray(response)) {
                setGroups(response);
            } else {
                setGroups([]);
            }
            setSelectedGroups([]);
        } catch (err) {
            console.error("Error fetching program groups:", err);
            setGroups([]);
            setSelectedGroups([]);
        }
    };
    const onSubmit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const formattedData = {
                programId: data.programId,
                subjectName: data.subjectName.trim(),
                subjectType: data.subjectType,
                shortName: data.shortName.trim(),
                code: data.code,
                semester: data.semester || "First",
                year: data.year || "First",
                alias: data.alias || null,
                remarks: data.detail || null,
                pageNumber: 1,
                pageSize: 10,
                campusId: campusId,
                majorSubjectIds: selectedGroups.map(id => parseInt(id))
            };
            const subjectResponse = await postSubject(formattedData);
            if (subjectResponse) {
                toast.success("Subject created successfully!");
                console.log("Subject created successfully:", subjectResponse);
            } else {
                throw new Error("Failed to create subject - no response received");
            }
            reset();
            setSelectedGroups([]);
            setSelectedProgramId(0);
            setSelectedProgramType("");

            if (onSubjectAdded) {
                onSubjectAdded();
            }

        } catch (err) {
            console.error("Error in form submission:", err);
            toast.error("Error creating subject: " + (err.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };
    const fetchYearData = async () => {
        try {
            const yearData = await getAllYears();
            setYear(yearData);
        } catch (err) {
            console.error("Error fetching years:", err);
        }
    };

    const fetchSemesterData = async () => {
        try {
            const semesterData = await getAllSemesters();
            setSemester(semesterData);
        } catch (err) {
            console.error("Error fetching semesters:", err);
        }
    };

    const fetchPrograms = async () => {
        try {
            const programData = await getCollegePrograms();
            setProgramData(programData);
        } catch (err) {
            setProgramData([]);
            console.error("Error fetching programs:", err);
        }
    };

    // Effects
    useEffect(() => {
        fetchPrograms();
        fetchYearData();
        fetchSemesterData();
    }, []);

    useEffect(() => {
        fetchProgramGroups();
    }, [selectedProgramId]);

    // Handle program selection change
    const handleProgramChange = (e) => {
        const selectedValue = Number(e.target.value);
        const selectedProgram = programData.find(
            (program) => program.id === selectedValue
        );

        setSelectedProgramType(selectedProgram?.programType || "");
        setSelectedProgramId(selectedValue);
        setSelectedGroups([]); // Reset selected groups

        // Clear semester/year based on program type
        if (selectedProgram?.programType === "annual") {
            setValue("semester", "");
        } else if (selectedProgram?.programType === "semester") {
            setValue("year", "");
        }
    };

    // Handle individual checkbox change
    const handleGroupCheckboxChange = (event) => {
        const groupId = event.target.name;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedGroups(prev => [...prev, groupId]);
        } else {
            setSelectedGroups(prev => prev.filter(id => id !== groupId));
        }
    };

    const handleSelectAllGroups = () => {
        if (selectedGroups.length === groups.length) {
            setSelectedGroups([]); // Deselect all
        } else {
            setSelectedGroups(groups.map(group => group.id.toString())); // Select all
        }
    };

    return (
        <Paper elevation={5} sx={{ borderRadius: "20px", mb: 2 }}>
            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ textAlign: "center", color: "#2A629A" }}
                >
                    Subject Management
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1}>
                        {/* Program Selection */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="programId" required>
                                    Program Name
                                </InputLabel>
                                <Select
                                    required
                                    {...register("programId", { required: "Program is required" })}
                                    id="programId"
                                    size="small"
                                    name="programId"
                                    fullWidth
                                    value={watch("programId") || ""}
                                    label="Program Name"
                                    onChange={(e) => {
                                        handleProgramChange(e);
                                        setValue("programId", e.target.value);
                                    }}
                                    error={!!errors.programId}
                                >
                                    <MenuItem value="" disabled>
                                        Select Program
                                    </MenuItem>
                                    {programData.length > 0 &&
                                        programData.map((data) => (
                                            <MenuItem key={data.id} value={data.id}>
                                                {data.programName}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {errors.programId && (
                                    <Typography variant="caption" color="error">
                                        {errors.programId.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Year Selection for Annual Programs */}
                        {selectedProgramType === 'annual' && (
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel required>
                                        Select Year
                                    </InputLabel>
                                    <Select
                                        required
                                        {...register("year", {
                                            required: selectedProgramType === "annual" ? "Year is required" : false
                                        })}
                                        size="small"
                                        name="year"
                                        label="Select Year"
                                        fullWidth
                                        value={watch("year") || ""}
                                        error={!!errors.year}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Year
                                        </MenuItem>
                                        {year &&
                                            year.map((yearItem) => (
                                                <MenuItem key={yearItem} value={yearItem}>
                                                    {yearItem}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    {errors.year && (
                                        <Typography variant="caption" color="error">
                                            {errors.year.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        )}

                        {/* Semester Selection for Semester Programs */}
                        {selectedProgramType === 'semester' && (
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel required>
                                        Select Semester
                                    </InputLabel>
                                    <Select
                                        required
                                        {...register("semester", {
                                            required: selectedProgramType === "semester" ? "Semester is required" : false
                                        })}
                                        size="small"
                                        name="semester"
                                        label="Select Semester"
                                        fullWidth
                                        value={watch("semester") || ""}
                                        error={!!errors.semester}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Semester
                                        </MenuItem>
                                        {semester &&
                                            semester.map((semesterItem) => (
                                                <MenuItem key={semesterItem} value={semesterItem}>
                                                    {semesterItem}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    {errors.semester && (
                                        <Typography variant="caption" color="error">
                                            {errors.semester.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        )}

                        {/* Subject Name */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                {...register("subjectName", { required: "Subject name is required" })}
                                id="subjectName"
                                size="small"
                                name="subjectName"
                                label="Subject Name"
                                fullWidth
                                error={!!errors.subjectName}
                                helperText={errors.subjectName?.message}
                            />
                        </Grid>

                        {/* Short Name */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                required
                                {...register("shortName", { required: "Short name is required" })}
                                id="shortName"
                                size="small"
                                name="shortName"
                                label="Short Name"
                                fullWidth
                                error={!!errors.shortName}
                                helperText={errors.shortName?.message}
                            />
                        </Grid>

                        {/* Code */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                required
                                {...register("code", { required: "Code is required" })}
                                id="code"
                                size="small"
                                name="code"
                                label="Code"
                                fullWidth
                                error={!!errors.code}
                                helperText={errors.code?.message}
                            />
                        </Grid>

                        {/* Subject Type */}
                        <Grid item xs={12} sm={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel required>
                                    Subject Type
                                </InputLabel>
                                <Select
                                    required
                                    {...register("subjectType", { required: "Subject type is required" })}
                                    id="subjectType"
                                    size="small"
                                    name="subjectType"
                                    label="Subject Type"
                                    fullWidth
                                    value={watch("subjectType") || ""}
                                    error={!!errors.subjectType}
                                >
                                    <MenuItem value="" disabled>
                                        Select Type
                                    </MenuItem>
                                    <MenuItem value="Compulsory">Compulsory</MenuItem>
                                    <MenuItem value="Elective">Elective</MenuItem>
                                </Select>
                                {errors.subjectType && (
                                    <Typography variant="caption" color="error">
                                        {errors.subjectType.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Alias */}
                        <Grid item xs={12} sm={3}>
                            <TextField
                                {...register("alias")}
                                id="alias"
                                name="alias"
                                size="small"
                                label="Alias"
                                fullWidth
                                error={!!errors.alias}
                                helperText={errors.alias?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={5}>
                            <TextField
                                {...register("detail")}
                                id="detail"
                                name="detail"
                                size="small"
                                label="Details"
                                fullWidth
                                rows={2}
                                error={!!errors.detail}
                                helperText={errors.detail?.message}
                            />
                        </Grid>

                       
                        <Grid item xs={12}>
                            <Divider >
                                <h1 className="text-lg font-medium text-[#2A629A]">
                                    Groups
                                </h1>
                            </Divider>

                            {groups.length > 0 ? (
                                <>
                                    <Grid container alignItems="center" >
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleSelectAllGroups}
                                            sx={{ mb: 1 }}
                                        >
                                            {selectedGroups.length === groups.length ? 'Remove All' : 'Select All'}
                                        </Button>
                                        <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                                            {selectedGroups.length} of {groups.length} selected
                                        </Typography>
                                    </Grid>

                                    <div className="flex justify-start gap-2">
                                        {groups.map((group) => (
                                            <div key={group.id}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={selectedGroups.includes(group.id.toString())}
                                                            onChange={handleGroupCheckboxChange}
                                                            name={group.id.toString()}
                                                            sx={{
                                                                "&.Mui-checked": {
                                                                    color: "#1976d2",
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="body2">
                                                            {group.majorSubjectName}
                                                        </Typography>
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary" textAlign="center">
                                    {selectedProgramId ? "No groups available for this program" : "Select a program to view available groups"}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Grid container justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                backgroundColor: "#007aff",
                                color: "white",
                                minWidth: 120,
                                "&:hover": {
                                    backgroundColor: "#0056b3"
                                }
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </Grid>
                </form>
            </CardContent>
        </Paper>
    );
};

export default AddSubject;