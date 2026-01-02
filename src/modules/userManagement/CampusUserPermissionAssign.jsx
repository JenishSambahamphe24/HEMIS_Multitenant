
import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Checkbox,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const CampusUserPermissionAssign = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const baseUrl = config.VITE_BASE_URL;
  const [collegeModules, setCollegeModules] = useState([]);
  const [collegeUsers, setCollegeUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [modifiedPermissions, setModifiedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const checkboxRefs = useRef({});

  useEffect(() => {
    const fetchModules = async () => {
      const config = getAuthConfigSafe();
      if (!config) return;
      try {
        const response = await axios.get(
          `${backendUrl}/ModuleCollegeAccess`,
          config
        );
        setCollegeModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const config = getAuthConfigSafe();
      if (!config) return;
      try {
        const response = await axios.get(
          `${backendUrl}/Employee/migrated-employees`,
          config
        );
        setCollegeUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    if (!selectedUserId) return;
    const fetchPermissions = async () => {
      const config = getAuthConfigSafe();
      if (!config) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/User/UserPermissionCollege/${selectedUserId}`,
          config
        );
        setUserPermissions(response.data);
        const assignedModuleIds = response.data
          .filter((perm) => perm.isAssigned)
          .map((perm) => perm.moduleId);

        setModifiedPermissions(assignedModuleIds);

      } catch (error) {
        console.error("Error fetching user permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [selectedUserId]);

  useEffect(() => {
    Object.keys(checkboxRefs.current).forEach((moduleId) => {
      const checkboxEl = checkboxRefs.current[moduleId];
      if (checkboxEl) {
        const isCurrentlyChecked = modifiedPermissions.includes(parseInt(moduleId));
        const wasInitiallyChecked = userPermissions
          .find(perm => perm.moduleId === parseInt(moduleId))?.isAssigned || false;

        checkboxEl.indeterminate = isCurrentlyChecked !== wasInitiallyChecked;
      }
    });
  }, [modifiedPermissions, userPermissions]);

  const handleModuleToggle = (moduleId) => {
    setModifiedPermissions((prev) => {
      const isCurrentlySelected = prev.includes(moduleId);
      if (isCurrentlySelected) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const handleSaveChanges = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user first.");
      return;
    }

    const config = getAuthConfigSafe();
    if (!config) return;

    setSaving(true);

    try {
      const existingPermissionsMap = new Map();
      userPermissions.forEach(perm => {
        existingPermissionsMap.set(perm.moduleId, perm.isAssigned);
      });

      const moduleIds = collegeModules.map(module => {
        const isAssigned = modifiedPermissions.includes(module.id);
        return {
          moduleId: module.id,
          isAssigned: isAssigned
        };
      });

      const response = await axios.post(
        `${backendUrl}/Employee/assign-permissions-to-employee`,
        {
          moduleIds: moduleIds,
          userId: parseInt(selectedUserId),
        },
        config
      );

      const updatedPermissions = collegeModules.map(module => {
        const existingPerm = userPermissions.find(perm => perm.moduleId === module.id);
        return {
          moduleId: module.id,
          name: existingPerm?.name || module.displayName,
          isAssigned: modifiedPermissions.includes(module.id),
          icon: existingPerm?.icon || module.icon
        };
      });

      setUserPermissions(updatedPermissions);

      toast.success("Permissions updated successfully!");

    } catch (error) {
      console.error("Error updating permissions:", error);
      console.error("Error details:", error.response?.data);
      toast.error("An error occurred while updating permissions.");
    } finally {
      setSaving(false);
    }
  };

  const isModuleAssigned = (moduleId) => {
    return modifiedPermissions.includes(moduleId);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          color: '#2B6EB5',
          fontWeight: 500,
          mb: 4
        }}
      >
        Campus User Permission Management
      </Typography>

      <Box sx={{ mb: 4, maxWidth: 400 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="user-select-label">Select User</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            label="Select User"
            disabled={loading}
          >
            {collegeUsers.map((user) => (
              <MenuItem key={user.id} value={user.userId}>
                {`${user.fullName} - ${user.email}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>


      <Card
        sx={{
          border: '2px solid #2B6EB5',
          borderRadius: 2,
          position: 'relative',
          mt: 3
        }}
      >
        <CardContent sx={{ pt: 4 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading permissions...</Typography>
            </Box>
          ) : selectedUserId ? (
            <>
              <Grid container spacing={2}>
                {collegeModules.map((module) => {
                  const isAssigned = isModuleAssigned(module.id);

                  return (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={module.id}>
                      <Card
                        sx={{
                          height: 160,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            boxShadow: 3,
                            borderColor: '#2B6EB5'
                          },
                          ...(isAssigned && {
                            border: '2px solid #2B6EB5',
                            bgcolor: '#f3f7ff'
                          })
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '100%',
                            '&:last-child': { pb: 2 }
                          }}
                        >
                          <Box sx={{ alignSelf: 'flex-start', mb: 1 }}>
                            <Checkbox
                              size="small"
                              checked={isAssigned}
                              ref={(el) => {
                                if (el) checkboxRefs.current[module.id] = el.input;
                                else delete checkboxRefs.current[module.id];
                              }}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleModuleToggle(module.id);
                              }}
                              color="primary"
                              sx={{ p: 0 }}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flex: 1,
                              mb: 1
                            }}
                          >
                            <img
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                objectFit: 'cover'
                              }}
                              alt={module.displayName}
                              src={`${baseUrl}/${module.icon}`}
                            />
                          </Box>

                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.75rem',
                              lineHeight: 1.2,
                              color: '#333',
                              fontWeight: 500,
                              display: 'block',
                              textAlign: 'center',
                              wordWrap: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxHeight: '2.4em'
                            }}
                          >
                            {module.displayName}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                  disabled={loading || saving}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Please select a user to manage permissions
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {!selectedUserId && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            color: '#666'
          }}
        >
          <Typography variant="body1">
            Please select a user to manage permissions
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CampusUserPermissionAssign;