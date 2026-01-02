import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import {
  getMajorSubsByProgramId,
  getSubjectBySubjectId,
} from "../../dashboard/services/service";
import axios from "axios";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import { config } from '@config';
import toast from "react-hot-toast";

function EditGroups({ open, onClose, programId, subjectId, onSave }) {
  const backendUrl = config.VITE_BACKEND_URL;
  const [groups, setAllGroups] = useState([]);
  const [checkedGroups, setCheckedGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingGroups, setProcessingGroups] = useState(new Set());

  const addMajorSubject = async (groupId) => {
    try {
      const config = getAuthConfigSafe();
      const formData = new FormData();
      formData.append("SubjectId", subjectId.toString());
      formData.append("MajorSubjectId", groupId.toString());
      const response = await axios.post(
        `${backendUrl}/Subject/AddGroupSubject`,
        formData,
        config
      );
      return response.data;
    } catch (err) {
      console.error(
        "Error adding major subject:",
        err.response?.data || err.message
      );
      console.error("Full error object:", err);
      throw err;
    }
  };

  // const removeMajorSubject = async (groupId) => {
  //   try {
  //     const config = getAuthConfigSafe();
  //     const data = {
  //       SubjectId: subjectId.toString(),
  //       MajorSubjectId: groupId.toString(),
  //     };

  //     const response = await axios.delete(
  //       `${backendUrl}/Subject/RemoveGroupSubject`,
  //       { ...config, data }
  //     );

  //     return response.data;
  //   } catch (err) {
  //     console.error(
  //       "Error removing major subject:",
  //       err.response?.data || err.message
  //     );
  //     console.error("Full error object:", err);
  //     throw err;
  //   }
  // };
  const removeMajorSubject = async (groupId) => {
    try {
      const config = getAuthConfigSafe();
      const formData = new FormData();
      formData.append("SubjectId", subjectId.toString());
      formData.append("MajorSubjectId", groupId.toString());

      const response = await axios.delete(
        `${backendUrl}/Subject/RemoveGroupSubject`,
        {
          ...config,
          data: formData,
        }
      );

      return response.data;
    } catch (err) {
      console.error(
        "Error removing major subject:",
        err.response?.data || err.message
      );
      throw err;
    }
  };


  // const handleGroupCheckboxChange = async (event) => {
  //   //new added for checkpoint 
  //   if (isChecked) {
  //     await addMajorSubject(groupId);
  //     toast.success("Major subject added");
  //   } else {
  //     await removeMajorSubject(groupId);
  //     toast.success("Major subject removed");
  //   }



  //   const groupId = event.target.name;
  //   const isChecked = event.target.checked;

  //   setProcessingGroups((prev) => new Set([...prev, groupId]));

  //   try {
  //     if (isChecked) {
  //       setSelectedGroups((prev) => [...prev, groupId]);
  //       await addMajorSubject(groupId);
  //       console.log(`Successfully added group ${groupId}`);
  //     } else {
  //       setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
  //       await removeMajorSubject(groupId);
  //       console.log(`Successfully removed group ${groupId}`);
  //     }
  //   } catch (error) {
  //     console.error(
  //       `Error ${isChecked ? "adding" : "removing"} group ${groupId}:`,
  //       error
  //     );

  //     // Revert the UI change on error
  //     if (isChecked) {
  //       setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
  //     } else {
  //       setSelectedGroups((prev) => [...prev, groupId]);
  //     }
  //     alert(
  //       `Failed to ${isChecked ? "add" : "remove"} group. Please try again.`
  //     );
  //   } finally {
  //     setProcessingGroups((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(groupId);
  //       return newSet;
  //     });
  //   }
  // };

  const handleGroupCheckboxChange = async (event) => {
    const groupId = event.target.name;
    const isChecked = event.target.checked;

    setProcessingGroups((prev) => new Set([...prev, groupId]));

    try {
      if (isChecked) {
        setSelectedGroups((prev) => [...prev, groupId]);
        await addMajorSubject(groupId);
        toast.success("Major subject added");
      } else {
        setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
        await removeMajorSubject(groupId);
        toast.success("Major subject removed");
      }
    } catch (error) {
      console.error(
        `Error ${isChecked ? "adding" : "removing"} group ${groupId}:`,
        error
      );

      // UI rollback
      if (isChecked) {
        setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
      } else {
        setSelectedGroups((prev) => [...prev, groupId]);
      }

      toast.error(
        `Failed to ${isChecked ? "add" : "remove"} major subject`
      );
    } finally {
      setProcessingGroups((prev) => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  const getSubject = async () => {
    try {
      const response = await getSubjectBySubjectId(subjectId);
      const alreadyPresentGroups = response.majorSubjectIds || [];
      setCheckedGroups(alreadyPresentGroups);
      setSelectedGroups(alreadyPresentGroups.map((id) => id.toString()));
    } catch (err) {
      console.log("Error getting subject:", err);
    }
  };

  const fetchAllMajorSubs = async () => {
    try {
      const response = await getMajorSubsByProgramId(programId);
      setAllGroups(response);
    } catch (error) {
      console.error("Error fetching major subject data:", error);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      const groupIds = selectedGroups.map((id) => parseInt(id, 10));
      onSave(groupIds);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedGroups([]);
    setCheckedGroups([]);
    setAllGroups([]);
    setProcessingGroups(new Set());
    onClose();
  };

  useEffect(() => {
    if (open && subjectId) {
      getSubject();
    }
  }, [subjectId, open]);

  useEffect(() => {
    if (open && programId) {
      fetchAllMajorSubs();
    }
  }, [programId, open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <h1 className="text-center text-lg font-medium text-[#2B6EB5]">
          Add or remove Groups/Major subject
        </h1>
        <Grid container>
          <Grid item xs={12}>
            <Divider>
              <h1 className="text-lg font-medium text-[#2A629A]">Groups</h1>
            </Divider>
            <div className="flex flex-wrap justify-start gap-2 mt-4">
              {groups.map((group) => {
                const isProcessing = processingGroups.has(group.id.toString());
                return (
                  <div key={group.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedGroups.includes(group.id.toString())}
                          onChange={handleGroupCheckboxChange}
                          name={group.id.toString()}
                          disabled={isProcessing}
                          sx={{
                            "&.Mui-checked": {
                              color: "#1976d2",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {group.majorSubjectName}
                        </Typography>
                      }
                    />
                  </div>
                );
              })}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: "#2B6EB5" }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditGroups;
