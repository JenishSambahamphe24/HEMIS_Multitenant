import React, { createContext, useContext, useEffect, useState } from "react";
import {
    Grid,
    TextField,
    Button,
    Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

const ValidationTextField = styled(TextField)({
    "& input:valid + fieldset": {
        borderColor: "#c2c2c2",
        borderWidth: 1,
    },

    "& input:valid:focus + fieldset": {
        borderLeftWidth: 4,
        padding: "4px !important",
    },
});
const BankInfoContext = createContext()

const BankInfoProvider = ({ children }) => {
    const methods = useForm();
    const [bankInfo, setBankInfo] = useState({
        bankName: '',
        bankAc: '',
        bankBranch: '',
        panNo: ''
    })
    const onChange = (event, name, value) => {
        setBankInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
  
    return (
        <BankInfoContext.Provider value={{ ...methods, bankInfo, onChange }}>
            {children}
        </BankInfoContext.Provider>
    )
}

function BankInfo({ handleNext, handleBack }) {
    const { control, handleSubmit, formState: { errors } } = useContext(BankInfoContext)
    const { currentUser } = useSelector((state) => state.user);
    const roleName = currentUser.listUser[0].roleName;
    const { onChange } = useContext(BankInfoContext)
    
    const onSubmit = (formData) => {
        Object.entries(formData).forEach(([key, value]) => {
            onChange(null, key, value);
        });
        handleNext();
    };
    

    const onBack = (data) => {
        handleBack();
    };
    return (
        <Grid
            container
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            onReset={() => {
                onBack();
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="bankName"
                        control={control}
                        render={({ field }) => (
                            <ValidationTextField
                                {...field}
                                required
                                id="bankName"
                                size="small"
                                name="bankName"
                                label="Bank Name"
                                fullWidth
                               
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="bankAc"
                        control={control}
                        render={({ field }) => (
                            <ValidationTextField
                                {...field}
                                required
                                id="bankAc"
                                size="small"
                                name="bankAc"
                                label="Bank Account Number"
                                fullWidth
                                
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="bankBranch"
                        control={control}
                        render={({ field }) => (
                            <ValidationTextField
                                {...field}
                                required
                                id="bankBranch"
                                size="small"
                                name="bankBranch"
                                label="Branch"
                                fullWidth
                                
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="panNo"
                        control={control}
                        render={({ field }) => (
                            <ValidationTextField
                                {...field}
                                required
                                id="panNo"
                                size="small"
                                name="panNo"
                                label="PAN Number"
                                fullWidth
                                
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container direction="column" alignItems="flex-start">
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={onBack}
                        sx={{}}
                        startIcon={<ChevronLeftRoundedIcon />}
                    >
                        Back
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        type="submit"
                        sx={{
                            marginLeft: "10px",
                        }}
                        endIcon={<ChevronRightRoundedIcon />}
                    >
                        Next
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
export { BankInfoProvider, BankInfoContext };
export default BankInfo