import React, { useState } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Batchmate from "../Profile/Batchmate";

const notices = [
  {
    id: 1,
    title: "Alumni Meet 2025",
    content:
      "We are excited to announce the Alumni Meet 2025 happening on Jan 5th. Please register on the portal.",
  },
  {
    id: 2,
    title: "Scholarship Applications Open",
    content:
      "Applications for the 2025 alumni-funded scholarship are now open. Deadline: Dec 20, 2024.",
  },
  {
    id: 3,
    title: "Campus Renovation Update",
    content:
      "The renovation of the main building has been completed. New facilities are now available.",
  },
];

const AdminNotice = () => {
    const batchId = localStorage.getItem("batchId");

  const [selectedNotice, setSelectedNotice] = useState(notices[0]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left: Notice Titles */}
        <Grid item xs={12} md={2.5}>
          <Typography
            variant="h6"
            gutterBottom
             fontWeight="bold"
            textAlign="center"
            sx={{
              color: "#2B6EB5",
            }}
          >
            Notice List
          </Typography>
          <List>
            {notices.map((notice) => (
              <Paper
                elevation={3}
                sx={{
                  mb: 1.5,
                  p: 0.5,
                  borderRadius: 2,
                  backgroundColor:
                    selectedNotice.id === notice.id ? "#e3f2fd" : "#fff",
                  transition: "0.3s",
                }}
              >
                <ListItem
                  button
                  key={notice.id}
                  selected={selectedNotice.id === notice.id}
                >
                  <ListItemText primary={notice.title} />
                  <VisibilityIcon
                    onClick={() => setSelectedNotice(notice)}
                    sx={{
                      cursor: "pointer",
                      color:
                        selectedNotice.id === notice.id ? "#2B6EB5" : "#606060",
                    }}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </Grid>

        {/* Right: Selected Notice Content */}
        <Grid item xs={12} md={5.5}>
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
            sx={{
              color: "#2B6EB5",
            }}
          >
            Notices
          </Typography>
          <Paper elevation={2} sx={{ height: "100%", p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {selectedNotice.title}
            </Typography>
            <Typography variant="body1">{selectedNotice.content}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Batchmate batchId={batchId}/>
          </Grid>
      </Grid>
    </Box>
  );
};

export default AdminNotice;
