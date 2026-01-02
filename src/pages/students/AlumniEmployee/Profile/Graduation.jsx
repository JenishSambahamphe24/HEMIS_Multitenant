import { Box, Grid, Paper, Typography } from "@mui/material";

const Graduation = () => {
  // Load all graduation-related fields from localStorage
  const levelName = localStorage.getItem("levelName");
  const facultyName = localStorage.getItem("facultyName");
  const programName = localStorage.getItem("programName");
  const enrolledYear = localStorage.getItem("enrolledYear");
  const passedYear = localStorage.getItem("passedYear");
  const gpa = localStorage.getItem("gpa");

  const details = [
    { label: "Level", value: levelName },
    { label: "Faculty", value: facultyName },
    { label: "Program", value: programName },
    { label: "Enrolled Year", value: enrolledYear },
    { label: "Graduated Year", value: passedYear },
    {
      label: "Obtained Percentage/Grade",
      value: gpa != null ? (gpa <= 4 ? `${gpa} cgpa` : `${gpa}%`) : "N/A",
    },
  ];

  return (
    <Grid>
      <Box className="flex items-center gap-4 my-4">
        <Typography
          variant="h5"
          className="font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent"
        >
          Academic Info
        </Typography>

              <div className="flex-grow h-0.5 bg-gradient-to-br from-purple-400 to-indigo-400"></div>
      </Box>

      <Paper className="p-6 rounded-xl shadow-sm bg-white">
        <Typography
          variant="h6"
          className="font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent"
        >
          Education Details
        </Typography>

       <Grid container spacing={1.5}>
  {details.map((item, index) => (
    <Grid item xs={12} sm={6} key={index}>
      <Box 
        className="
          p-3 
          rounded-lg 
          border-l-4 
          border-transparent 
          hover:border-purple-400 
          hover:bg-gray-50 
          transition-all 
          duration-200
          group
        "
      >
        <div className="flex justify-between items-start">
          <Typography 
            className="
              text-gray-500 
              text-sm 
              font-medium 
              flex-1
            "
          >
            {item.label}
          </Typography>
          
          
        </div>
        
        <Typography 
          className="
            text-gray-800 
            text-base 
            font-semibold 
            mt-1
            truncate
          "
        >
          {item.value || (
            <span className="text-gray-400 font-normal">
              Not available
            </span>
          )}
        </Typography>
        
        {/* Subtle bottom line */}
        <div className="
          h-px 
          bg-gradient-to-r 
          from-transparent 
          via-gray-100 
          to-transparent 
          mt-3
          group-hover:via-purple-100
          transition-all
          duration-300
        "></div>
      </Box>
    </Grid>
  ))}
</Grid>
      </Paper>
    </Grid>
  );
};

export default Graduation;
