
import React, { useState, useEffect } from 'react'
import { Stack, Dialog, DialogContent, DialogActions, DialogTitle, Grid, Button, IconButton, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import FileUploader from '../../../../Reusable-component/FileUploader';
import { getFiscalYear, getFiscalYearForSelection } from '../../../../../services/services';
import { addSignedStatReport } from '../../CampusServices';
import { useSelector } from 'react-redux';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function AddsignedReportDialog({ handleClose, open, linkId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [fiscalData, setFiscalData] = useState([])
    const [formData, setFormData] = useState({
        fiscalYearId: '',
        fiscalYear: '',
        campusId: currentUser?.institution?.id,
        campusType: currentUser?.institution?.campusType,
        campusName: currentUser?.institution.campusName,
        universityId: currentUser?.institution?.universityId,
        universityName: currentUser?.institution?.university?.name,
        district: currentUser?.institution?.district,
        signedReport: '',
    })

    const handleFileChange = (type, file) => {
        if (type === "signedReport") {
            setFormData((prevData) => ({
                ...prevData,
                signedReport: file
            }));
        }
    };
    useEffect(() => {
        const fetchFiscalYear = async () => {
            try {
                const response = await getFiscalYearForSelection()
                setFiscalData(response)
            } catch (err) {
                console.log(err);
            }
        };
        fetchFiscalYear();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            await addSignedStatReport(formDataToSend);
            toast.success("Report updated successfully");
            handleClose();
        } catch (error) {
            if (error.status === 409) {
                toast.info('Signed Report for this particular F.Y is already uploaded. If you want to upload a new one, please delete the previous one first', { autoClose: 5000 })
            }
            console.error("Error adding Report:", error);
        }
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}

        >
            <DialogTitle sx={{ m: 'auto auto', p: 1 }} >
                Add  Report
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon className='text-red-700' />
            </IconButton>
            <h1 className="text-sm italic px-6"><span className='text-red-700'>Note: </span> Please make sure that the document you are going to upload is officially signed by campus authority</h1>
            <DialogContent >
                <Stack direction='column' rowGap='10px'>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing='1rem'>
                            <Grid item sm={6}>
                                <FormControl size='small' fullWidth>
                                    <InputLabel>Fiscal Year</InputLabel>
                                    <Select
                                        required InputLabelProps={{
                                            sx: {
                                                '& .MuiInputLabel-asterisk': {
                                                    color: 'brown',
                                                },
                                            },
                                        }}
                                        variant='outlined'
                                        name="fiscalYearId"
                                        value={formData.fiscalYearId}
                                        onChange={handleChange}
                                        label='Fiscal Year'
                                    >
                                        {
                                            fiscalData.map((item, index) => (
                                                <MenuItem key={item.id} value={item.id}> {item.yearNepali}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FileUploader
                                    fullWidth
                                    onFileChange={(file) => handleFileChange("signedReport", file)}
                                    name="signedReport"
                                    placeHolder="Signed Report (pdf)"
                                    required
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button type='submit' size='small' variant='contained' >
                                Add
                            </Button>
                        </DialogActions>
                    </form>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default AddsignedReportDialog

