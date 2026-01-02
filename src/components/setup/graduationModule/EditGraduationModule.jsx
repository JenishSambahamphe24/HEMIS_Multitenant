import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  DialogContent,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import { StdDocUploader } from "../../../pages/students/StdDocUploader";
import { config } from '@config';

const EditGraduationModule = ({ data, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const uploadURL = config.VITE_UPLOAD_URL;
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const id = data?.id;
  const studentId = data?.student?.id;
  const [loading, setLoading] = useState(false);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [studentsData, setStudentsData] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const config = getAuthConfigSafe();
        const [graduationResponse, fiscalYearResponse] = await Promise.all([
          axios.get(`${backendUrl}/Graduation/${id}`, config),
          axios.get(`${backendUrl}/FiscalYear`, config),
        ]);

        const graduationData = graduationResponse.data;
        setStudentsData(graduationData);

        // Populate form fields
        setValue('fiscalYearId', graduationData.fiscalYearID);
        setValue('universityIssueNo', graduationData.universityIssueNo || '');
        setValue('studentRegNo', graduationData.studentRegNo || '');
        setValue('symbolNo', graduationData.symbolNoUniversity || '');
        setValue('campusRollNo', graduationData.campusRolNo || '');
        setValue('enrolledYear', graduationData.enrolledYear || '');
        setValue('passedYear', graduationData.passedYear || '');
        setValue('division', graduationData.division || '');
        setValue('gpa', graduationData.gpa || '');
        setValue('fatherName', graduationData.fatherName || '');
        setValue('motherName', graduationData.motherName || '');
        setValue('contactNumber', graduationData.contactNo || '');
        setValue('remarks', graduationData.remarks || '');


        setValue('uploadSignature', graduationData.uploadSignature || '');
        setValue('uploadPPSizePhoto', graduationData.uploadPPSizePhoto || '');
        setValue('uploadReceipt', graduationData.uploadReceipt || '');
        setValue('uploadTranscript', graduationData.uploadTranscript || '');
        setValue('uploadOtherDocs', graduationData.uploadOtherDoc || '');

        setFiscalYears(fiscalYearResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load graduation data');
      }
    };

    if (id) {
      fetchInitialData();
    }
    if (id) {
      fetchInitialData();
    }
  }, [id, setValue]);

  const onSubmit = async (formData) => {
    setLoading(true);
    const config = getAuthConfigSafe();
    const payload = new FormData();

    // Append known fields
    payload.append('id', id);
    payload.append('fiscalYearID', formData.fiscalYearId);
    payload.append('studentId', studentId);

    // Student info is READ-ONLY, so we don't send name/email — they come from studentId
    payload.append('universityIssueNo', formData.universityIssueNo || '');
    payload.append('studentRegNo', formData.studentRegNo || '');
    payload.append('symbolNoUniversity', formData.symbolNo || '');
    payload.append('campusRolNo', formData.campusRollNo || '');
    payload.append('enrolledYear',formData.enrolledYear || '');
    payload.append('passedYear', formData.passedYear || '');
    payload.append('division', formData.division || '');
    payload.append('gpa', formData.gpa || '');
    payload.append('fatherName', formData.fatherName || '');
    payload.append('motherName', formData.motherName || '');
    payload.append('contactNo', formData.contactNumber || '');
    payload.append('remarks', formData.remarks || '');

    // ✅ Only append files if they are NEW (File instances)
    if (formData.uploadSignature instanceof File) {
      payload.append('uploadSignature', formData.uploadSignature);
    }
    if (formData.uploadPPSizePhoto instanceof File) {
      payload.append('uploadPPSizePhoto', formData.uploadPPSizePhoto);
    }
    if (formData.uploadReceipt instanceof File) {
      payload.append('uploadReceipt', formData.uploadReceipt);
    }
    if (formData.uploadTranscript instanceof File) {
      payload.append('uploadTranscript', formData.uploadTranscript);
    }
    if (formData.uploadOtherDocs instanceof File) {
      payload.append('uploadOtherDoc', formData.uploadOtherDocs);
    }

    try {
      await axios.put(`${backendUrl}/Graduation/${id}`, payload, config);
      toast.success('Graduation Details updated successfully', {
        autoClose: 1500,
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(
        error.response?.data?.message ||
        'Error updating graduation data: ' + (error.message || 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };

  // Watch document fields for preview URLs
  const watchUploadPPSizePhoto = watch('uploadPPSizePhoto');
  const watchUploadTranscript = watch('uploadTranscript');
  const watchUploadReceipt = watch('uploadReceipt');
  const watchUploadOtherDocs = watch('uploadOtherDocs');
  const watchUploadSignature = watch('uploadSignature');

  return (
    <DialogContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: 'center', color: '#2A629A', padding: '10px' }}
      >
        Edit Graduation Details
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          {/* Student Info - Left */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="body1">Name (English):</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.firstName} {studentsData?.student?.middleName}{' '}
                  {studentsData?.student?.lastName}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">Program:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.programName}
                  {studentsData?.programName}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">Roll Number:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.rollNo}
                  {studentsData?.student?.rollNo}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">Email:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.email}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">Phone:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.phoneNumber}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Student Info - Right */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="body1">Name (Nepali):</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.nepaliName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">Guardian Name:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.guardianName}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">Guardian Phone:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.guardianPhone}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">Permanent Address:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.pProvince}, {studentsData?.student?.pDistrict}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">Admission Year:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {studentsData?.student?.admissionYear}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="universityIssueNo"
              control={control}
              rules={{ required: 'University Issue No is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  size="small"
                  label="University Issue No."
                  error={!!errors.universityIssueNo}
                  helperText={errors.universityIssueNo?.message}
                  InputLabelProps={{
                    shrink: !!field.value,
                  }}
                />
              )}
            />
          </Grid>


          <Grid item xs={12} sm={2}>
            <Controller
              name="studentRegNo"
              control={control}
              rules={{ required: 'Student Registration No is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  size="small"
                  label="Student Registration Number"
                  error={!!errors.studentRegNo}
                  helperText={errors.studentRegNo?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="symbolNo"
              control={control}
              rules={{ required: 'Symbol No is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  size="small"
                  label="Symbol Number"
                  error={!!errors.symbolNo}
                  helperText={errors.symbolNo?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="enrolledYear"
              control={control}
              rules={{ required: 'Enrolled Year is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  size="small"
                  label="Enrolled Year"
                  type="number"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="passedYear"
              control={control}
              rules={{ required: 'Passed Year is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  size="small"
                  label="Passed Year"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.passedYear}
                  helperText={errors.passedYear?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="division"
              control={control}
              rules={{ required: 'Division is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  size="small"
                  {...field}
                  label="Grade/Division"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Controller
              name="gpa"
              control={control}
              rules={{ required: 'GPA is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  size="small"
                  label="GPA/Percentage(%)"
                  type="number"
                  step="0.01"
                  error={!!errors.gpa}
                  InputLabelProps={{ shrink: true }}
                  helperText={errors.gpa?.message}
                />
              )}
            />
          </Grid>

          {/* 🔥 Document Upload Section 🔥 */}
          <Grid item xs={12} style={{
            position: 'relative',
            borderRadius: '5px',
            border: '1px dashed #c1c1c1',
            marginTop: '20px',
            padding: '12px',
          }}>
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                top: '-12px',
                background: 'white',
                padding: '0 8px',
                color: '#666',
                left: '10px',
                fontWeight: 500,
              }}
            >
              Upload Documents
            </Typography>

            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item xs={12} sm={3}>
                <StdDocUploader
                  label="Passport Photo"
                  name="uploadPPSizePhoto"
                  value={watchUploadPPSizePhoto}
                  onFileChange={(file) => setValue('uploadPPSizePhoto', file)}
                  acceptedTypes="image/*"
                  existingFileUrl={
                    watchUploadPPSizePhoto
                      ? `${uploadURL}/Graduation/${watchUploadPPSizePhoto}`
                      : null
                  }
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <StdDocUploader
                  label="Transcript"
                  name="uploadTranscript"
                  value={watchUploadTranscript}
                  onFileChange={(file) => setValue('uploadTranscript', file)}
                  acceptedTypes="image/*,application/pdf"
                  existingFileUrl={
                    watchUploadTranscript
                      ? `${uploadURL}/Graduation/${watchUploadTranscript}`
                      : null
                  }
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <StdDocUploader
                  label="Receipt"
                  name="uploadReceipt"
                  value={watchUploadReceipt}
                  onFileChange={(file) => setValue('uploadReceipt', file)}
                  acceptedTypes="image/*,application/pdf"
                  existingFileUrl={
                    watchUploadReceipt
                      ? `${uploadURL}/Graduation/${watchUploadReceipt}`
                      : null
                  }
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <StdDocUploader
                  label="Other Documents"
                  name="uploadOtherDocs"
                  value={watchUploadOtherDocs}
                  onFileChange={(file) => setValue('uploadOtherDocs', file)}
                  acceptedTypes="image/*,application/pdf"
                  existingFileUrl={
                    watchUploadOtherDocs
                      ? `${uploadURL}/Graduation/${watchUploadOtherDocs}`
                      : null
                  }
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <StdDocUploader
                  label="Signature"
                  name="uploadSignature"
                  value={watchUploadSignature}
                  onFileChange={(file) => setValue('uploadSignature', file)}
                  acceptedTypes="image/*"
                  existingFileUrl={
                    watchUploadSignature
                      ? `${uploadURL}/Graduation/${watchUploadSignature}`
                      : null
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Remarks"
              {...register('remarks')}
              multiline
              rows={2}
            />
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={onClose}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </DialogContent>
  );
};

export default EditGraduationModule;
