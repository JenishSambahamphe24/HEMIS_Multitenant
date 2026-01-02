import React from "react";
import { Typography } from "@mui/material";
import Typewriter from "typewriter-effect";
import AlumniLogin from "./UserAdmin/Login";


const Home = () => {
  return (
   <>
   <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12 bg-white">
  {/* Text Section */}
  <div className="md:w-1/2 mb-6 md:mb-0 text-center md:text-left">
     <Typography variant="h3" className="text-sky-700 font-bold">
            <Typewriter
              options={{
                strings: ["Welcome to  our Alumni", "Welcome Back, Graduate! 🎓"],
                autoStart: true,
                loop: true,
              }}
            />
          </Typography>
   
     <Typography variant="h6" className="text-green-600">
      Celebrating connections, journeys, and achievements. Stay inspired.
          </Typography>
     <Typography variant="h6" className="text-green-600">
            This is where your story continues. Reconnect with your roots, share your success, and celebrate the community you helped build.
          </Typography>
  </div>

  {/* Image Section */}
  <div className="md:w-1/2 flex justify-center">
    <img src="/degree.png" className="h-100" alt="Lady Graduate" />
    {/* <AlumniLogin/> */}
  </div>
</div>

   </>
  );
};

export default Home;
