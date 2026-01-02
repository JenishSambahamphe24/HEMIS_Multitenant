import React, { useState } from "react";
import { Grid } from "@mui/material";
import AddSubject from "./AddSubject";
import SubjectList from "./SubjectList";

const SubjectMgmt = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubjectAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={false} md={1} />
      <Grid item xs={12} md={12}>
        <AddSubject onSubjectAdded={handleSubjectAdded} />
        <SubjectList refreshTrigger={refreshTrigger} />
      </Grid>
    </Grid>
  );
};

export default SubjectMgmt;