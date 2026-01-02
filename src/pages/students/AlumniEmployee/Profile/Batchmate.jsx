import React, { useState } from "react";
import { Box, Grid, Paper, Typography, TextField } from "@mui/material";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { AlumniEmployeeService } from "../../../../services/AlumniServices";

const Batchmate = ({ enrolledYear, campusId, programId }) => {
  const token = localStorage.getItem("authToken");
  const [search, setSearch] = useState("");

  // Fetch batchmates
  const { data, isLoading, isError } = useQuery({
    queryKey: ["batchmates", enrolledYear, campusId, programId],
    queryFn: () =>
      AlumniEmployeeService.getStudentsByBatch({
        enrolledYear: Number(enrolledYear),
        campusId: Number(campusId),
        programId: Number(programId),
        token,
        pageNumber: 1,
        pageSize: 9999,
      }).then((res) => res.data),
    enabled: !!enrolledYear && !!campusId && !!programId && !!token,
  });

  const batchmates = data?.data || [];
  const batchNepali = ` My Batchmates ${enrolledYear}`;

  const getFullName = (mate) => {
    if (mate.applicantNameEng) {
      return mate.applicantNameEng;
    }
    return "Unknown Student";
  };

  // 🔍 Filter batchmates
  const filteredBatchmates = batchmates.filter((mate) =>
    getFullName(mate).toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading)
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>Loading batchmates...</Typography>
    );

  if (isError)
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        Failed to load batchmates.
      </Typography>
    );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 1 }}>
      {/* Header */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mt: 2,
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          py: 1,
          borderRadius: 2,
        }}
        className="rounded-xl p-2 bg-[#2B6EB5]"
      >
        {batchNepali}
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by name"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2, mt: 1 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Compact Container - Shows ~8 people */}
      <Box
        sx={{
          flex: 1,
          height: "calc(100vh - 180px)",
          maxHeight: "calc(8 * 85px)", // Approximately 8 items
          overflowY: "auto",
          overflowX: "hidden",
          pr: 0.5,
          pb: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          }
        }}
      >
        {filteredBatchmates.length > 0 ? (
          filteredBatchmates.map((mate, index) => (
            <Paper 
              key={index} 
              className="my-2"
              sx={{
                borderRadius: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box className="flex items-center p-2 gap-2">
                {/* Profile Image - Smaller size */}
                <Box
                  sx={{
                    cursor: "pointer",
                    "& img": {
                      height: 50,
                      width: 50,
                      borderRadius: "50%",
                      objectFit: "cover",
                      "&:hover": { border: "2px solid #56aeff" },
                    },
                  }}
                >
                  <img
                    src={mate.ppSizePhoto || "/image.png"}
                    className="p-0.5"
                    onError={(e) => (e.target.src = "/graduation.png")}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Name - Smaller font */}
                  <Typography 
                    className="text-gray-800 font-semibold"
                    sx={{ 
                      fontSize: '1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {getFullName(mate)}
                  </Typography>

                  {/* Contact Info - Single line */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FaPhoneAlt className="text-purple-900" style={{ fontSize: '0.85rem' }} />
                      <Typography 
                        className="text-gray-500 italic"
                        sx={{ fontSize: '0.88rem' }}
                      >
                        {mate.contactNo || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <MdEmail className="text-purple-900" style={{ fontSize: '0.9rem' }} />
                      <Typography 
                        className="text-gray-600 italic"
                        sx={{ 
                          fontSize: '0.88rem',
                          whiteSpace: 'nowrap',
                          maxWidth: 'full'
                        }}
                      >
                        {mate.email || "N/A"}
                       
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography className="text-gray-600 italic text-center my-4">
            No students found.
          </Typography>
        )}
      </Box>

      {/* Show count */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        {filteredBatchmates.length} batchmates found
      </Typography>
    </Box>
  );
};

export default Batchmate;