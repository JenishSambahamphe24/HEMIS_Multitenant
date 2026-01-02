
import { Typography, Box, Dialog, DialogContent, Button, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-hot-toast';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function DeleteDialog({ handleClose, open, id, deleteApi, content }) {
    const handleDelete = async () => {
        try {
            const response = await deleteApi(id);
            toast.success(`${content} deleted successfully!`);
            setTimeout(() => {
                handleClose();
            }, 900);
        } catch (error) {
            console.log(error)
            if (error.status === 409) {
                toast.info(`Other contents are linked to this ${content}. Delete them first !!!`);
            }
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogContent>
                <Box mt='10px'>
                    <Typography >
                        Are you sure you want to delete this {content} ? All associated data will also be permanently removed.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '10px' }} mx='auto'>
                        <Button onClick={handleDelete} color='error' size='small' variant='outlined'>
                            delete
                        </Button>
                        <Button sx={{ marginLeft: '20px' }} color='primary' onClick={handleClose} size='small' variant='outlined'>
                            cancel
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
