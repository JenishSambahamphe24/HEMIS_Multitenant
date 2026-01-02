import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import AddFaculties from "../../components/addingComponents/AddingFaculties";

const ProgramSetupHome = () => {
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;
  return (
    <div>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box mt={0}>
          <AddFaculties />
        </Box>
      </Box>
    </div>
  );
};

export default ProgramSetupHome;
