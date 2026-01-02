import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  InputLabel,
  FormControl,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { styled } from '@mui/material/styles';
import FileUploader from "../../Reusable-component/FileUploader";
import ImageUploader from "../../Reusable-component/ImageUploader";
import {  getResearchPubDetailById, updateResearchPubDetailById } from "../CampusReport/CampusServices";
import toast from "react-hot-toast";
import { getFiscalYear } from "../../../services/services";
import { getEmployees } from "../../dashboard/services/service";
import DateInputField from "../../DateField/DateInputField";
import {config} from '@config';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  height: 'auto',
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const EditPublication = ({ handleClose, open, id }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [teacherData, setTeacherData] = useState([])
  const [fiscalData, setFiscalData] = useState([])
  const [formData, setFormData] = useState({
    fiscalYearId: '',
    fiscalYear: {
      id: '',
      yearNepali: '',
      yearEnglish: '',
      activeFiscalYear: '',
      index: 1
    },
    campusId: '',
    employeeId: '',
    universityId: '',
    activityType: '',
    publicationType: '',
    activityTitle: '',
    startDate: '',
    endDate: '',
    fundedBy: '',
    fundedDate: '',
    fundedAmount: '',
    isPublished: true,
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
    const response = await getResearchPubDetailById(id)
    const empResponse = await getEmployees()
    const fiscalResponse = await getFiscalYear()
    setTeacherData(empResponse.filter(item => item.employeeType === 'teaching'))
    setFiscalData(fiscalResponse)
    setFormData({
      fiscalYearId: response.fiscalYearId || 0,
      campusId: response.campusId || null,
      employeeId: response.employeeId || null,
      universityId: response.universityId || null,
      activityType: response.activityType || '',
      publicationType: response.publicationType || '',
      activityTitle: response.activityTitle || '',
      startDate: response.startDate || '',
      endDate: response.endDate || '',
      fundedBy: response.fundedBy || '',
      fundedDate: response.fundedDate || '',
      fundedAmount: response.fundedAmount || '',
      isPublished: response.isPublished || false,
      publishedAt: response.publishedAt || '',
      publishedDate: response.publishedDate || '',
      publicationBy: response.publicationBy || '',
      publicationFrequency: response.publicationFrequency || '',
      supportingMember: response.supportingMember || '',
      thumbnailImage: response.thumbnailImage || null,
      fullDoc: response.fullDoc || null,
      remarks: response.remarks || ''
    });
  }

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

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
      const newResearch = await updateResearchPubDetailById(id, formDataToSend);
      toast.success('successfully updated');
      handleClose()
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

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}

    >
      <DialogTitle sx={{ m: 'auto auto', p: 1 }} >
        Edit Research & publication
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent >

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
                  checked={formData.isPublished}
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
      </DialogContent>
    </BootstrapDialog>
  );
};

export default EditPublication;
