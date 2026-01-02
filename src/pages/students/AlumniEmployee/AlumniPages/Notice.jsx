
import React from "react";
import { Box, Typography } from "@mui/material";
import Typewriter from "typewriter-effect";

const Notice = () => {
  return (
    <Box className="h-130 flex flex-col items-center justify-center  p-6">
      <Box className="bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-100 shadow-lg rounded-xl px-8 py-12 max-w-2xl text-center">
        <Typography variant="h3" className="  text-sky-700 font-bold mb-4">
          <Typewriter
            options={{
              strings: ["No Notice is Available Now"],
              autoStart: true,
              loop: true,
            }}
          />
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Stay tuned for important updates and announcements. We'll keep you informed as new notices become available.
        </Typography>
      </Box>
    </Box>
  );
};

export default Notice;
