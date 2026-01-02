import React from "react";
import "./Footer.css";

function Footer() {
 return (
  <div className="bg-[#2B6EB5] text-white px-6 py-6 md:py-5">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      
      {/* Left */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-2 md:mt-6">
          <span className="hover:opacity-80 cursor-pointer text-[16px]">About</span>
          <span className="hover:opacity-80 cursor-pointer text-[16px]">Terms</span>
          <span className="hover:opacity-80 cursor-pointer text-[16px]">Privacy</span>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center">
        <p className="underline mb-1">Call Us for Support</p>
        <p className="mb-1">
          📞 Phone:{" "}
          <a href="tel:+977-9860565214" className="hover:opacity-80">+977-9860565214</a>
        </p>
        <p>
          ✉️ Email:{" "}
          <a href="mailto:dbugtest2016@gmail.com" className="hover:opacity-80">
            dbugtest2016@gmail.com
          </a>
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-col items-center md:items-end mt-2 md:mt-6">
        <span className="text-[16px]">
          Developed by:{" "}
          <a
            href="https://dibugsoft.com/home.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            DEBUGSOFT P. LTD.
          </a>
        </span>
      </div>

    </div>
  </div>
);



}

export default Footer;

// import React from "react";
// import "./Footer.css";

// function Footer() {
//   return (
//     <div className="footer">
//       <div className="mainfooter">
//         <div className="left">
//           <div className="othertext">
//             <span>About</span>
//             <span>Contact</span>
//             <span>Terms</span>
//             <span>Privacy</span>
//           </div>
//         </div>
//         <div className="right">
//           <div className="othertext">
//             <span>
//               Developed by :{" "}
//               <a
//                 href="https://dibugsoft.com/home.aspx"
//                 style={{ textDecoration: "underline", color: "white" }}
//               >
//                 DEBUGSOFT P. LTD.
//               </a>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Footer;
