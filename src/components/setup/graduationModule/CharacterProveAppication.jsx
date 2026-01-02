import React from "react";
import { 
    Box, 
    Typography, 
    TextField, 
    Grid, 
    Paper } from "@mui/material";

const CharacterProveApplication = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "50px",
        maxWidth: "800px",
        margin: " 100px auto",
        border: "1px solid black",
        
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={2} >
      <Typography sx={{ textAlign: "right" }}>
        <label
    htmlFor="date"
    style={{
        fontWeight: "bold",
        display: "inline-block",
        letterSpacing: "5px", 
        }}
        >
        मिति: २०&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;/
        </label>

            
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }} textAlign="left">
          श्रीमान् क्याम्पस प्रमुख ज्यू
        
        </Typography>
        
        <Typography variant="body1" textAlign="left" sx={{ fontWeight: "bold" }}>पाटन संयुक्त क्याम्पस</Typography>
        <Typography variant="body1" textAlign="left" sx={{ fontWeight: "bold" }}>पाटन ढोका, ललितपुर ।</Typography>
        
        <Typography variant="body1" mt={2} sx={{textDecoration: "underline", fontWeight: "bold" }}>
          विषय - चरित्रिक प्रमाण पत्र पाऊ भन्ने बारे ।
        </Typography>
        <Box sx={{ mt: 2 }}>
        <Typography
            variant="body1"
            sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
        >
            महोदय,
        </Typography>

        <Typography
            variant="body1"
            sx={{
            textAlign: "justify",
            textIndent: "40px", 
            lineHeight: 1.8,   
            }}
        >
            उपरोक्त सम्बन्धमा म यस पाटन संयुक्त क्याम्पस अन्तर्गत B.Sc.CSIT को
            नियमित विद्यार्थी भई आफ्नो अध्ययन पूरा गरेको हुनाले यस क्याम्पसबाट
            चरित्रिक प्रमाणपत्र उपलब्ध गराईदिन हुन श्रीमान समक्ष यो निवेदन पेश
            गर्दछु ।
        </Typography>
        </Box>
        
      </Box>

      <Box sx={{ border: "1px solid black" }}>
        {/* Table Content */}
        <Grid container spacing={0}>
          {/* Row 1 */}
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              Applicant's Full Name (Devanagari):
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            {/* Empty column for alignment purposes */}
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>(In Block Letter):</Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
          </Grid>

          {/* Row 2 */}
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>T.U Issue No.:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>T.U Registration No.:</Typography>
          </Grid>

          {/* Row 3 */}
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Symbol Roll No.:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Campus Roll No.:</Typography>
          </Grid>

          {/* Row 4 */}
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Passed Year:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Passed Division:</Typography>
          </Grid>

          {/* Row 5 */}
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              Father's Name (Block Letter):
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
          </Grid>

          {/* Row 6 */}
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Date of Birth (B.S.):</Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderBottom: "1px solid black", padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>A.D.:</Typography>
          </Grid>

          {/* Row 7 */}
          <Grid item xs={6} sx={{ padding: "10px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Contact No.:</Typography>
          </Grid>
          <Grid item xs={6} sx={{ padding: "10px" }}>
            {/* Empty column for alignment purposes */}
          </Grid>
        </Grid>
      </Box>
      {/* Signatures */}

      {/* Official's Signature */}
      <Box mt={4} textAlign="right">
        <Typography marginRight="20px" paddingTop="40px"> ............................</Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}  marginRight="30px">
        
          निवेदकको हस्ताक्षर
        </Typography>
      </Box>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>

    {/* Library Clearance Box */}
      <Grid item xs={6}>
        <Box
        style={{
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            height: "100%",
        }}
        >
        <Typography style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Library (Set Book) Clearance By:
        </Typography>
        <Typography>Signature: ............................................</Typography>
        <Typography style={{ marginTop: "10px" }}>Date: ....................................................</Typography>
        </Box>
      </Grid>

    {/* Lab Clearance Box */}
      <Grid item xs={6}>
        <Box
        style={{
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            height: "100%",
        }}
        >
        <Typography style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Lab Clearance By:
        </Typography>
        <Typography>Signature:............................................</Typography>
        <Typography style={{ marginTop: "10px" }}>Date: ...................................................</Typography>
        </Box>
      </Grid>
    </Grid>


      
    </Paper>
  );
};

export default CharacterProveApplication;
