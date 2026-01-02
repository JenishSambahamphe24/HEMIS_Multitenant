import { Button, Grid, TextField, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import React from "react";
import { useForm } from "react-hook-form";

const EditEntryMarks = ({ data }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  return (
    <Grid container flexDirection={"row"} spacing={2} sx={{ padding: "2rem" }}>
      <Grid item xs={12} sm={12}>
        <Typography align="center" sx={{ color: blue[700] }}>
          {" "}
          Update marks of Name {data.firstName} Exam Name: {data.examName} on
          subject: {data.subjectName}.
        </Typography>
      </Grid>{" "}
      <Grid item xs={12} sm={3}>
        <TextField
          defaultValue={data.examName}
          value={data.examName}
          id="examName"
          size="small"
          name="examName"
          label="Exam Name"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          id="studentname"
          defaultValue={data.firstName}
          value={data.firstName}
          size="small"
          name="studentname"
          label="Student Name"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          defaultValue={data.rollNo}
          value={data.rollNo}
          id="rollNo"
          size="small"
          name="rollNo"
          label="Roll Number"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          defaultValue={data.subjectName}
          value={data.subjectName}
          id="subjectName"
          size="small"
          name="subjectName"
          label="Subject Name"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          defaultValue={data.theoriticalFullMark}
          value={data.theoriticalFullMark}
          size="small"
          label="Full Marks(Theo.)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          defaultValue={data.theoriticalPassMark}
          value={data.theoriticalPassMark}
          size="small"
          label="Pass Marks(Theo.)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          required
          {...register("theoreticalMarks", { required: true })}
          defaultValue={data.theoreticalMarks}
          id="theoreticalMarks"
          size="small"
          name="theoreticalMarks"
          label="Obtained Marks(Theo.)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          defaultValue={data.practicalFullMark}
          value={data.practicalFullMark}
          size="small"
          label="Full Marks(Pract.)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          defaultValue={data.practicalPassMark}
          value={data.practicalPassMark}
          size="small"
          label="Pass Marks(Pract.)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          required
          {...register("practicalMarks", { required: true })}
          defaultValue={data.practicalMarks || ""}
          id="practicalMarks"
          size="small"
          name="practicalMarks"
          label="Obtained Marks(Pract.)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid container justifyContent={'center'} sx={{ padding: '1rem' }}>
        <Button variant="contained" size="small">Update</Button>
      </Grid>
    </Grid>
  );
};

export default EditEntryMarks;
