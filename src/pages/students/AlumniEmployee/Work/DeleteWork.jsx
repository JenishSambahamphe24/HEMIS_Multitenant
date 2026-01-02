import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { AlumniEmployeeService } from "../../../../services/AlumniServices";

const DeleteWork = ({ id, onClose }) => {

  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries(["AlumniEmployee"]);

const token = localStorage.getItem("authToken");

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => AlumniEmployeeService.delete(id, token),
    onSuccess: () => {
      toast.success("work deleted Successfully!");
      refetch();
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete work");
      console.error("Delete error:", error);
    },
  });
  const handleDelete = () => {
    if (id) {
      deleteMutation(id);
    }
  };
  return (
    <>
      <DialogContent sx={{ maxWidth: 600 }}>
        <Typography>
          Are you sure you want to delete the work Experience ? All associated
          data will also be permanently removed.
        </Typography>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ color: "red", borderColor: "red" }}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </DialogContent>
    </>
  );
};

export default DeleteWork;
