import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  InputLabel,
  FormControl,
  Table,
  TableContainer,
  TableBody,
  TableHead, TableCell, TableRow
} from "@mui/material";
import CommonDeleteDialog from "../../common/CommonDeleteDialog";

import FileUploader from "../../Reusable-component/FileUploader";
import ImageUploader from "../../Reusable-component/ImageUploader";
import { getDateOnly } from "../../../utils/dateUtils";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { addNewResearchPublication, getResearchPubDetail, deletePubDetailById } from "../CampusReport/CampusServices";
import toast from "react-hot-toast";
import { getFiscalYear } from "../../../services/services";
import { useSelector } from "react-redux";
import { getEmployees } from "../../dashboard/services/service";
import DateInputField from "../../DateField/DateInputField";
import EditPublication from "./EditPublication";
import {config} from '@config';


const MgmtForm = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [teacherData, setTeacherData] = useState([])
  const { currentUser } = useSelector((state) => state.user);
  const [researchData, setResearchData] = useState([]);
  const [fiscalData, setFiscalData] = useState([])
  const [id, setId] = useState(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    fiscalYearId: '',
    campusId: currentUser?.institution?.id,
    employeeId: '',
    universityId: currentUser?.institution?.universityId,
    activityType: '',
    publicationType: '',
    activityTitle: '',
    startDate: '',
    endDate: '',
    fundedBy: '',
    fundedDate: '',
    fundedAmount: '',
    isPublished: false,
    publishedAt: '',
    publishedDate: '',
    publicationBy: '',
    publicationFrequency: '',
    supportingMember: '',
    thumbnailImage: null,
    fullDoc: null,
    remarks: ''
  });

  const fetchData = async () => {
    const response = await getResearchPubDetail()
    const empResponse = await getEmployees()
    setTeacherData(empResponse.filter(item => item.employeeType === 'teaching'))
    const fiscalResponse = await getFiscalYear()
    setFiscalData(fiscalResponse)
    setResearchData(response)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })
    try {
      const newResearch = await addNewResearchPublication(formDataToSend);
      toast.success('New Research added successfully');
      setFormData({})
      fetchData()
    } catch (error) {
      console.error('Error adding research:', error);
      toast.error('Error adding research');
    }
  };

  const handleFileChange = (name, file) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };

  const handleEditClick = (id) => {
    setId(id)
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    fetchData()
  }

  const handleDeleteDialogOpen = (id) => {
    setId(id)
    setDeleteDialogOpen(true)
  }
  const handleClose = () => {
    setDeleteDialogOpen(false)
    fetchData()
  }


  return (
    <>
      <Grid container >
        <Grid component={Paper} item xs={12} >
          <Typography
            mt='20px'
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "#2A629A" }}
          >
            Research & Publication Management
          </Typography>
          <Grid component='form' onSubmit={handleSubmit} container mb='20px' mx='auto' columnGap='10px' rowGap='10px' justifyContent='center'>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="activityType-label" required>Activity Type</InputLabel>
                <Select
                  value={formData.activityType}
                  onChange={handleChange}
                  name="activityType"
                  label="Activity Type"
                  size="small"
                >
                  <MenuItem value="Research">Research</MenuItem>
                  <MenuItem value="Publication">Publication</MenuItem>
                  <MenuItem value="Fellowship">Fellowship</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel required>Employee</InputLabel>
                <Select
                  label="Employee"
                  name='employeeId'
                  value={formData.employeeId}
                  size="small"
                  onChange={handleChange}

                >
                  {
                    teacherData.map((item, index) => (
                      <MenuItem key={index} value={item.id}> {`${item.firstName} ${item.middleName || ''} ${item.lastName}`}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                name="activityTitle"
                value={formData.activityTitle}
                required
                onChange={handleChange}
                label="Activity Title"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="activityType-label" required>Fiscal Year</InputLabel>
                <Select
                  value={formData.fiscalYearId}
                  onChange={handleChange}
                  name="fiscalYearId"
                  label="Fiscal Year"
                  size="small"
                >
                  {
                    fiscalData.map((item, index) => (
                      <MenuItem key={item.id} value={item.id}>{item.yearNepali}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <DateInputField
                name='startDate'
                value={formData.startDate}
                onChange={(newValue) => handleChange({ target: { name: 'startDate', value: newValue } })}
                label='Start Date'
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <DateInputField
                name='endDate'
                value={formData.endDate}
                onChange={(newValue) => handleChange({ target: { name: 'endDate', value: newValue } })}
                label='End Date'
                fullWidth
              />
            </Grid>
            <Grid item xs={1.9}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChange}
                    name="isPublished"
                    value={formData.isPublished}
                  />
                }
                label="Published"
              />
            </Grid>
            {formData.isPublished && (
              <Grid item sm={2.9}>
                <DateInputField
                  name='publishedDate'
                  value={formData.publishedDate}
                  onChange={(newValue) => handleChange({ target: { name: 'publishedDate', value: newValue } })}
                  label='Published Date'
                  fullWidth
                />
              </Grid>
            )}
            <Grid item sm={formData.isPublished ? 3 : 4}>
              <DateInputField
                name='fundedDate'
                value={formData.fundedDate}
                onChange={(newValue) => handleChange({ target: { name: 'fundedDate', value: newValue } })}
                label='Funded Date'
                fullWidth
              />
            </Grid>
            <Grid item sm={formData.isPublished ? 3 : 4}>
              <TextField
                required
                name="fundedAmount"
                value={formData.fundedAmount}
                onChange={handleChange}
                label="Funded Amount"
                type="number"
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item sm={formData.isPublished ? 2 : 3}>
              <TextField
                name="supportingMember"
                value={formData.supportingMember}
                label="Supporting Members"
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            {formData.activityType === "Publication" && (
              <>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="publicationType-label" required>
                      Publication Type
                    </InputLabel>
                    <Select
                      labelId="publicationType-label"
                      name="publicationType"
                      value={formData.publicationType}
                      onChange={handleChange}
                      label="Publication Type"
                      fullWidth
                    >
                      <MenuItem value="Professional">Professional</MenuItem>
                      <MenuItem value="Memorial">Memorial</MenuItem>
                      <MenuItem value="Bulletin">Bulletin</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="publicationFrequency-label" required>
                      Publication Frequency
                    </InputLabel>
                    <Select
                      labelId="publicationFrequency-label"
                      name="publicationFrequency"
                      onChange={handleChange}
                      value={formData.publicationFrequency}
                      label="Publication Frequency"
                      fullWidth
                    >
                      <MenuItem value="Annual">Annual</MenuItem>
                      <MenuItem value="Biannual">Biannual</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={3}>
              <TextField
                value={formData.remarks}
                name="remarks"
                label="Remarks"
                fullWidth
                onChange={handleChange}
                size="small"
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={formData.activityType === 'Publication' ? 6 : 4}>
              <ImageUploader
                allowMultiple={false}
                onImagesChange={(newImages) =>
                  handleFileChange("thumbnailImage", newImages[0] || null)
                }
                name="thumbnailImage"
                placeholder="Thumbnail image"
              />
            </Grid>
            <Grid item xs={12} sm={formData.activityType === 'Publication' ? 5 : 4} >
              <FileUploader
                fullWidth
                onFileChange={(file) => handleFileChange("fullDoc", file)}
                name="fullDoc"
                placeHolder="Document"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button type="submit" size="small" variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
      <Grid marginY="10px">
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
                  Research/Publication Title
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Activity Type
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Grants Received
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Start Date
                </TableCell>

                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  End Date
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Status
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
            <TableBody>
              {researchData?.length > 0 ? (
                researchData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.activityTitle}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.activityType}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.fundedAmount}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {getDateOnly(data.startDate)}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {getDateOnly(data.endDate)}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {data.isPublished ? "Published" : "Not Published"}
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
                        <EditNoteIcon /> Edit
                      </Button>
                      <Button color="error" onClick={() => handleDeleteDialogOpen(data.id)}>
                        Delete
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
      <EditPublication open={editDialogOpen} handleClose={handleEditDialogClose} id={id} />
      <Box>
        <CommonDeleteDialog
          id={id}
          open={deleteDialogOpen}
          handleClose={handleClose}
          deleteApi={deletePubDetailById}
          content='Research & Publication'
        />
      </Box>
    </>
  );
};

export default MgmtForm;
