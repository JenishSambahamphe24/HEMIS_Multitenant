import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Button,
  ListItemIcon
} from '@mui/material';
import { Home, School, LocationOn, Payment } from '@mui/icons-material';

const profileImageUrl = 'https://via.placeholder.com/150';

const GlassCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100vh',
  maxWidth: 'none',
  margin: 0,
  borderRadius: 0,
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  boxShadow: theme.shadows[8],
}));

const Sidebar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '200px',  // Reduced sidebar width
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
  padding: theme.spacing(1.5),
  height: '100vh',
  boxShadow: theme.shadows[4],
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(1.5),
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[4],
}));

const Menu = styled(List)(({ theme }) => ({
  width: '100%',
  padding: 0,
  marginTop: theme.spacing(1.5),
}));

const MenuItem = styled(ListItem)(({ theme, selected }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
  
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  margin: theme.spacing(0.5, 0),
  // transition: 'background-color 0.2s ease, color 0.2s ease',
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
}));

const ContentArea = styled(CardContent)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  marginLeft: theme.spacing(1.5),
  maxWidth: `calc(100% - 200px)`,  // Adjusted width to fit the reduced sidebar width
  width: '100%',
}));

const sections = {
  general: 'General Info Content',
  academic: 'Academic Info Content',
  address: 'Address Info Content',
  payment: 'Payment Info Content',
};

const sectionIcons = {
  general: <Home />,
  academic: <School />,
  address: <LocationOn />,
  payment: <Payment />,
};

const StudentProfile = () => {
  const [selectedSection, setSelectedSection] = useState('general');

  return (
    <Container component="main" maxWidth="xl" disableGutters >
      <GlassCard>
        <Sidebar>
          <ProfileImage alt="Profile Image" src={profileImageUrl} />
          <Menu>
            {Object.keys(sections).map((section) => (
              <MenuItem
                key={section}
                button
                selected={selectedSection === section}
                onClick={() => setSelectedSection(section)}
              >
                <ListItemIcon>
                  {sectionIcons[section]}
                </ListItemIcon>
                <ListItemText primary={section.charAt(0).toUpperCase() + section.slice(1)} />
              </MenuItem>
            ))}
          </Menu>
        </Sidebar>
        <ContentArea>
          <Typography variant="h4" component="h2" gutterBottom>
            {sections[selectedSection]}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 20 }}>
              Edit
            </Button>
          </Box>
        </ContentArea>
      </GlassCard>
    </Container>
  );
};

export default StudentProfile;
