import { useForm, Controller } from "react-hook-form";
import React from "react";
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
  MenuItem,
  FormHelperText,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Dialog,
  capitalize,
} from "@mui/material";
import EditEquipmentMgmt from "./EditEquipmentMgmt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EquipMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [equipData, setEquipData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const fetchEquipData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/FurnitureEquipmentVehicle`,
        config
      );
      setEquipData(response.data);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };
  useEffect(() => {
    fetchEquipData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiEquipData = {
      itemType: data.category || "",
      itemName: data.itemName || "",
      noOfQty: data.quantity || 0,
      itemDescription: data.itemDescription || "",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe();
      await axios.post(
        `${backendUrl}/FurnitureEquipmentVehicle`,
        apiEquipData,
        config
      );
      toast.success("Data posted successfully", {
        autoClose: 1500,
      });
      reset();
      fetchEquipData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // State to manage selected category and item options
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemOptions, setItemOptions] = useState([]);

  // Define the options for each category
  const categoryOptions = {
    furniture: ["Desk/Bench", "Tables", "Chairs", "Others"],
    equipment: [
      "Computer",
      "Printer",
      "Photocopy Machine",
      "Camera",
      "Projector",
      "Others",
    ],
    vehicle: [
      "Car",
      "Bus",
      "Jeep",
      "Motorcycle",
      "Bicycle",
      "Scooter",
      "Others",
    ],
  };

  // Handle change event for category selection
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setItemOptions(categoryOptions[category] || []);
  };
  const handleEditClick = (equipId) => {
    setSelectedEquipmentId(equipId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchEquipData();
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px", marginTop: '16px' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Furniture, Equipment, and Vehicle Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Category Dropdown */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.category}
                    >
                      <InputLabel required id="category-label">
                        Category
                      </InputLabel>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Category is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="category-label"
                            label="Category"
                            onChange={(e) => {
                              handleCategoryChange(e);
                              field.onChange(e); // Ensure form state is updated
                            }}
                          >
                            <MenuItem value="furniture">Furniture</MenuItem>
                            <MenuItem value="equipment">Equipment</MenuItem>
                            <MenuItem value="vehicle">Vehicle</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.category && (
                        <FormHelperText>
                          {errors.category.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Item Dropdown */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.itemName}
                    >
                      <Controller
                        name="itemName"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Item name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Item Name"
                            size="small"
                            error={!!errors.itemName}
                            helperText={
                              errors.itemName ? errors.itemName.message : ""
                            }
                            required
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Quantity */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="quantity"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Quantity is required",
                        pattern: {
                          value: /^[1-9][0-9]*$/,
                          message: "Please enter a positive integer",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Quantity"
                          fullWidth
                          autoComplete="quantity"
                          error={!!errors.quantity}
                          inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                        />
                      )}
                    />
                    {errors.quantity && (
                      <FormHelperText error>
                        {errors.quantity.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Item Description */}
                  <Grid item xs={12}>
                    <Controller
                      name="itemDescription"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          label="Item Description"
                          fullWidth
                          autoComplete="itemDescription"
                          multiline
                          rows={2}
                        />
                      )}
                    />
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          label="Remarks"
                          fullWidth
                          autoComplete="remarks"
                          multiline
                          rows={2}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" color="primary">
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Paper>
          <Grid margin="10px">
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", color: "#2A629A" }}
            >
              Equipment List
            </Typography>
            <TableContainer>
              <Table
                style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
              >
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      S.No
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Item Name
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Item Description
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Remarks
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "white" }}>
                  {equipData.length > 0 ? (
                    equipData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {capitalize(data.itemType)}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.itemName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfQty}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.itemDescription}
                        </TableCell>

                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.remarks}
                        </TableCell>

                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <Button onClick={() => handleEditClick(data.id)}>
                            {" "}
                            <EditNoteIcon /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} style={{ textAlign: "center" }}>
                        No Data Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid item xs={false} md={2} />
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="md"
        >
          <EditEquipmentMgmt
            id={selectedEquipmentId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default EquipMgmt;
