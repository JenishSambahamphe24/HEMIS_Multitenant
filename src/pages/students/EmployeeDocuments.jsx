import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {
    Box,
    Grid,
    Button,
    Paper,
    TextField,
} from "@mui/material";
import { useSelector } from 'react-redux';
import { StdDocUploader } from './StdDocUploader';
import { addStudentDoc, getStdDocById } from '../../components/report/CampusReport/CampusServices';
import toast from 'react-hot-toast';
import { LoadingOverlay } from '@mantine/core';
import { config } from '@config';

const outerBorderStyle = {
    position: 'relative',
    borderRadius: '5px',
    border: '1px solid #2B6EB5',
    marginTop: '30px',
    padding: '8px',
};

const sectionHeadingStyle = {
    position: 'absolute',
    top: '-16px',
    color: '#2B6EB5',
    left: '15px',
    border: '1px solid #2B6EB5',
    borderRadius: '10px',
    background: 'white',
    padding: '2px 8px',
    fontWeight: '500'
};

// Helper function to extract filename from path
const extractFileName = (filePath) => {
    if (!filePath) return null;
    // Extract just the filename from the full path
    return filePath.split('/').pop();
};

function EmployeeDocuments() {
    const uploadURL = config.VITE_UPLOAD_URL;
    const { id } = useParams();
    const [stdDoc, setStdDoc] = useState(null);
    const [isExistingStudent, setIsExistingStudent] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const campusId = currentUser?.institution?.id;

    const [originalFiles, setOriginalFiles] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [formData, setFormData] = useState({
        campusId: campusId,
        studentId: id,
        campusName: "",
        studentFullName: "",
        remark: "",
        ppSizePhoto: null,
        citizenshipFront: null,
        citizenshipBack: null,
        nid: null,
        nidBack: null,
        transcript: null,
        academicCharecterCertificateSee: null,
        migrationCertificate: null,
        academicTranscriptHS: null,
        academicCharecterCertificateHS: null,
        academicMigrationCertificateHS: null,
        academicTranscriptBachelor: null,
        academicCharecterCertificateBachelor: null,
        academicMigrationCertificateBachelor: null,
        academicTranscriptMaster: null,
        academicCharecterCertificateMaster: null,
        academicMigrationMaster: null,
        anyOtherDoc1: null,
        anyOtherDoc2: null,
        anyOtherDoc3: null
    });

    const getExistingFileUrl = (folder, fileName) => {
        if (!fileName || !isExistingStudent) return null;
        return `${uploadURL}/StudentProfile/${campusId}/Student/${folder}/${fileName}?t=${Date.now()}`;
    };

    const fetchStudentData = async () => {
        setIsLoading(true);
        try {
            const response = await getStdDocById(id);
            // ✅ Use response.data instead of response
            const data = response.data;
            setStdDoc(data);
            setIsExistingStudent(true);

            // Store original file names
            const originalFileData = {
                ppSizePhoto: extractFileName(data.ppSizePhoto),
                citizenshipFront: extractFileName(data.citizenshipFront),
                citizenshipBack: extractFileName(data.citizenshipBack),
                nid: extractFileName(data.nid),
                nidBack: extractFileName(data.nidBack),
                transcript: extractFileName(data.transcript),
                academicCharecterCertificateSee: extractFileName(data.academicCharecterCertificateSee),
                migrationCertificate: extractFileName(data.migrationCertificate),
                academicTranscriptHS: extractFileName(data.academicTranscriptHS),
                academicCharecterCertificateHS: extractFileName(data.academicCharecterCertificateHS),
                academicMigrationCertificateHS: extractFileName(data.academicMigrationCertificateHS),
                academicTranscriptBachelor: extractFileName(data.academicTranscriptBachelor),
                academicCharecterCertificateBachelor: extractFileName(data.academicCharecterCertificateBachelor),
                academicMigrationCertificateBachelor: extractFileName(data.academicMigrationCertificateBachelor),
                academicTranscriptMaster: extractFileName(data.academicTranscriptMaster),
                academicCharecterCertificateMaster: extractFileName(data.academicCharecterCertificateMaster),
                academicMigrationMaster: extractFileName(data.academicMigrationMaster),
                anyOtherDoc1: extractFileName(data.anyOtherDoc1),
                anyOtherDoc2: extractFileName(data.anyOtherDoc2),
                anyOtherDoc3: extractFileName(data.anyOtherDoc3)
            };
            setOriginalFiles(originalFileData);

            setFormData(prev => ({
                ...prev,
                campusId: campusId,
                studentId: id,
                campusName: data.campusName || "",
                studentFullName: data.studentFullName || "",
                remark: data.remark || "",
                // Reset file fields to null (user can re-upload)
                ppSizePhoto: null,
                citizenshipFront: null,
                citizenshipBack: null,
                nid: null,
                nidBack: null,
                transcript: null,
                academicCharecterCertificateSee: null,
                migrationCertificate: null,
                academicTranscriptHS: null,
                academicCharecterCertificateHS: null,
                academicMigrationCertificateHS: null,
                academicTranscriptBachelor: null,
                academicCharecterCertificateBachelor: null,
                academicMigrationCertificateBachelor: null,
                academicTranscriptMaster: null,
                academicCharecterCertificateMaster: null,
                academicMigrationMaster: null,
                anyOtherDoc1: null,
                anyOtherDoc2: null,
                anyOtherDoc3: null
            }));
        } catch (err) {
            console.log('Error fetching student documents:', err);
            if (err.response?.status === 404) {
                setIsExistingStudent(false);
                setStdDoc(null);
            } else {
                toast.error('Error loading student documents');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchStudentData();
        }
    }, [id, campusId, refreshTrigger]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.campusId || !formData.studentId) {
                toast.error('Campus ID and Student ID are required');
                return;
            }

            const submitData = new FormData();
            const fileFields = [
                'ppSizePhoto',
                'citizenshipFront',
                'citizenshipBack',
                'nid',
                'nidBack',
                'transcript',
                'academicCharecterCertificateSee',
                'migrationCertificate',
                'academicTranscriptHS',
                'academicCharecterCertificateHS',
                'academicMigrationCertificateHS',
                'academicTranscriptBachelor',
                'academicCharecterCertificateBachelor',
                'academicMigrationCertificateBachelor',
                'academicTranscriptMaster',
                'academicCharecterCertificateMaster',
                'academicMigrationMaster',
                'anyOtherDoc1',
                'anyOtherDoc2',
                'anyOtherDoc3'
            ];

            submitData.append('campusId', formData.campusId);
            submitData.append('studentId', formData.studentId);
            submitData.append('campusName', formData.campusName || '');
            submitData.append('studentFullName', formData.studentFullName || '');
            submitData.append('remark', formData.remark || '');

            if (isExistingStudent && stdDoc?.id) {
                submitData.append('id', stdDoc.id);
            }

            fileFields.forEach((fieldName) => {
                const value = formData[fieldName];

                if (value instanceof File) {
                    submitData.append(fieldName, value);
                } else if (isExistingStudent && originalFiles[fieldName]) {
                    submitData.append(`existing_${fieldName}`, originalFiles[fieldName]);
                } else {
                    submitData.append(fieldName, '');
                }
            });

            await addStudentDoc(submitData);

            // Refresh data
            await fetchStudentData();
            setRefreshTrigger(prev => prev + 1);

            toast.success(isExistingStudent ? 'Documents updated successfully!' : 'Documents uploaded successfully!');

        } catch (error) {
            console.error('Error uploading documents:', error);
            if (error.response?.status === 404 && !isExistingStudent) {
                toast.error('Student not found. Please check the student ID.');
            } else {
                toast.error('Failed to upload documents. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        const resetFormData = { ...formData };
        const fileFields = [
            'ppSizePhoto', 'citizenshipFront', 'citizenshipBack', 'nid', 'nidBack',
            'transcript', 'academicCharecterCertificateSee', 'migrationCertificate',
            'academicTranscriptHS', 'academicCharecterCertificateHS', 'academicMigrationCertificateHS',
            'academicTranscriptBachelor', 'academicCharecterCertificateBachelor', 'academicMigrationCertificateBachelor',
            'academicTranscriptMaster', 'academicCharecterCertificateMaster', 'academicMigrationMaster',
            'anyOtherDoc1', 'anyOtherDoc2', 'anyOtherDoc3'
        ];

        fileFields.forEach(field => {
            resetFormData[field] = null;
        });

        setFormData(resetFormData);
        toast.info('Form has been reset');
    };

    const handleFileChange = (fieldName, file) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: file
        }));
    };

    const handleTextChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const getDisplayValue = (fieldName) => {
        if (formData[fieldName] instanceof File) {
            return formData[fieldName];
        }
        return originalFiles[fieldName] || null;
    };

    if (isLoading) {
        return (
            <LoadingOverlay
                visible={isLoading}
                zIndex={100}
                overlayProps={{ radius: "sm", blur: 1 }}
                loaderProps={{ color: "#1976d2", type: "bars" }}
            />
        );
    }

    return (
        <>
            <Grid component={Paper} elevation={8} padding={'20px'} container>
                <Grid item xs={12} mb='10px'>
                    <h1 className='text-3xl text-center text-[#2B6EB5]'>
                        Student Document Uploader
                        {isExistingStudent && <span className="text-sm text-green-600 block">Existing Student</span>}
                        {!isExistingStudent && <span className="text-sm text-blue-600 block">New Student</span>}
                    </h1>
                </Grid>

                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    {/* Citizenship and NID Section */}
                    <Grid container xs={12} style={outerBorderStyle}>
                        <h1 style={sectionHeadingStyle}>Citizenship and NID</h1>
                        <Grid item xs={3} className='pt-4 pl-2 pb-2'>
                            <StdDocUploader
                                label='Profile Photo'
                                name='ppSizePhoto'
                                value={getDisplayValue('ppSizePhoto')}
                                existingFileUrl={getExistingFileUrl('ppsizePhoto', originalFiles.ppSizePhoto)}
                                onFileChange={(file) => handleFileChange('ppSizePhoto', file)}
                                acceptedTypes="image/*"
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2 pb-2'>
                            <StdDocUploader
                                label='Citizenship Front'
                                name='citizenshipFront'
                                value={getDisplayValue('citizenshipFront')}
                                existingFileUrl={getExistingFileUrl('citizenship', originalFiles.citizenshipFront)}
                                onFileChange={(file) => handleFileChange('citizenshipFront', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Citizenship Back'
                                name='citizenshipBack'
                                value={getDisplayValue('citizenshipBack')}
                                existingFileUrl={getExistingFileUrl('citizenship', originalFiles.citizenshipBack)}
                                onFileChange={(file) => handleFileChange('citizenshipBack', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='NID Front'
                                name='nid'
                                value={getDisplayValue('nid')}
                                existingFileUrl={getExistingFileUrl('NID', originalFiles.nid)}
                                onFileChange={(file) => handleFileChange('nid', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='NID Back'
                                name='nidBack'
                                value={getDisplayValue('nidBack')}
                                existingFileUrl={getExistingFileUrl('NID', originalFiles.nidBack)}
                                onFileChange={(file) => handleFileChange('nidBack', file)}
                            />
                        </Grid>
                    </Grid>

                    {/* Secondary Education Examination */}
                    <Grid container xs={12} style={outerBorderStyle}>
                        <h1 style={sectionHeadingStyle}>Secondary Education Examination</h1>
                        <Grid item xs={3} className='pt-4 pl-2 pb-2'>
                            <StdDocUploader
                                label='Transcript (SEE)'
                                name='transcript'
                                value={getDisplayValue('transcript')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.transcript)}
                                onFileChange={(file) => handleFileChange('transcript', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Character Certificate (SEE)'
                                name='academicCharecterCertificateSee'
                                value={getDisplayValue('academicCharecterCertificateSee')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicCharecterCertificateSee)}
                                onFileChange={(file) => handleFileChange('academicCharecterCertificateSee', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Migration Certificate (SEE)'
                                name='migrationCertificate'
                                value={getDisplayValue('migrationCertificate')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.migrationCertificate)}
                                onFileChange={(file) => handleFileChange('migrationCertificate', file)}
                            />
                        </Grid>
                    </Grid>

                    {/* Higher Secondary Education */}
                    <Grid container xs={12} style={outerBorderStyle}>
                        <h1 style={sectionHeadingStyle}>Higher Secondary Education</h1>
                        <Grid item xs={3} className='pt-4 pl-2 pb-2'>
                            <StdDocUploader
                                label='Transcript (HSE)'
                                name='academicTranscriptHS'
                                value={getDisplayValue('academicTranscriptHS')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicTranscriptHS)}
                                onFileChange={(file) => handleFileChange('academicTranscriptHS', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Character Certificate (HSE)'
                                name='academicCharecterCertificateHS'
                                value={getDisplayValue('academicCharecterCertificateHS')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicCharecterCertificateHS)}
                                onFileChange={(file) => handleFileChange('academicCharecterCertificateHS', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Migration Certificate (HSE)'
                                name='academicMigrationCertificateHS'
                                value={getDisplayValue('academicMigrationCertificateHS')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicMigrationCertificateHS)}
                                onFileChange={(file) => handleFileChange('academicMigrationCertificateHS', file)}
                            />
                        </Grid>
                    </Grid>

                    {/* Bachelor */}
                    <Grid container xs={12} style={outerBorderStyle}>
                        <h1 style={sectionHeadingStyle}>Bachelor</h1>
                        <Grid item xs={3} className='pt-4 pl-2 pb-2'>
                            <StdDocUploader
                                label='Transcript (Bachelor)'
                                name='academicTranscriptBachelor'
                                value={getDisplayValue('academicTranscriptBachelor')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicTranscriptBachelor)}
                                onFileChange={(file) => handleFileChange('academicTranscriptBachelor', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Character Certificate (Bachelor)'
                                name='academicCharecterCertificateBachelor'
                                value={getDisplayValue('academicCharecterCertificateBachelor')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicCharecterCertificateBachelor)}
                                onFileChange={(file) => handleFileChange('academicCharecterCertificateBachelor', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Migration Certificate (Bachelor)'
                                name='academicMigrationCertificateBachelor'
                                value={getDisplayValue('academicMigrationCertificateBachelor')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicMigrationCertificateBachelor)}
                                onFileChange={(file) => handleFileChange('academicMigrationCertificateBachelor', file)}
                            />
                        </Grid>
                    </Grid>

                    {/* Masters */}
                    <Grid container xs={12} style={outerBorderStyle}>
                        <h1 style={sectionHeadingStyle}>Masters</h1>
                        <Grid item xs={3} className='pt-4 pl-2 pb-2'>
                            <StdDocUploader
                                label='Transcript (Masters)'
                                name='academicTranscriptMaster'
                                value={getDisplayValue('academicTranscriptMaster')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicTranscriptMaster)}
                                onFileChange={(file) => handleFileChange('academicTranscriptMaster', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Character Certificate (Masters)'
                                name='academicCharecterCertificateMaster'
                                value={getDisplayValue('academicCharecterCertificateMaster')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicCharecterCertificateMaster)}
                                onFileChange={(file) => handleFileChange('academicCharecterCertificateMaster', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Migration Certificate (Masters)'
                                name='academicMigrationMaster'
                                value={getDisplayValue('academicMigrationMaster')}
                                existingFileUrl={getExistingFileUrl('academicDoc', originalFiles.academicMigrationMaster)}
                                onFileChange={(file) => handleFileChange('academicMigrationMaster', file)}
                            />
                        </Grid>
                    </Grid>

                    {/* Other Documents */}
                    <Grid container xs={12} style={outerBorderStyle}>
                        <h1 style={sectionHeadingStyle}>Other Documents</h1>
                        <Grid item xs={3} className='pt-4 pl-2 pb-2'>
                            <StdDocUploader
                                label='Other Document 1'
                                name='anyOtherDoc1'
                                value={getDisplayValue('anyOtherDoc1')}
                                existingFileUrl={getExistingFileUrl('otherDoc', originalFiles.anyOtherDoc1)}
                                onFileChange={(file) => handleFileChange('anyOtherDoc1', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Other Document 2'
                                name='anyOtherDoc2'
                                value={getDisplayValue('anyOtherDoc2')}
                                existingFileUrl={getExistingFileUrl('otherDoc', originalFiles.anyOtherDoc2)}
                                onFileChange={(file) => handleFileChange('anyOtherDoc2', file)}
                            />
                        </Grid>
                        <Grid item xs={3} className='pt-4 pl-2'>
                            <StdDocUploader
                                label='Other Document 3'
                                name='anyOtherDoc3'
                                value={getDisplayValue('anyOtherDoc3')}
                                existingFileUrl={getExistingFileUrl('otherDoc', originalFiles.anyOtherDoc3)}
                                onFileChange={(file) => handleFileChange('anyOtherDoc3', file)}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', width: '100%' }}>
                        <Button
                            size='small'
                            variant='contained'
                            type='submit'
                            disabled={isSubmitting || !id}
                            sx={{ backgroundColor: '#2B6EB5', color: 'white' }}
                        >
                            {isSubmitting ? 'Submitting...' : (isExistingStudent ? 'Update Documents' : 'Upload Documents')}
                        </Button>
                        <Button
                            size='small'
                            variant='outlined'
                            color='warning'
                            sx={{ marginLeft: '20px' }}
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Grid>
        </>
    );
}

export default EmployeeDocuments;