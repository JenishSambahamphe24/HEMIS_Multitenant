import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Box
} from "@mui/material";

function SignedAuthority({  index }) {
    return (
        <Box mt='2rem'>
            <h1 className="heading">{index}. Contact person details</h1>
            <Table sx={{ bgcolor: 'white' }}>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Name :</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Name :</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Name :</h1>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Post:</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Post:</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Post:</h1>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Contact No :</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Contact No :</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Contact No :</h1>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Email Address:</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Email Address:</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Email Address:</h1>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Signature :</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Signature :</h1>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                            <h1>Signature :</h1>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableCell colSpan={3} sx={{ border: "1px solid black" }}>
                    <h1 className='mt-4 font-bold text-[12px] ml-4 mb-4'>College Stamp:</h1>
                </TableCell>
            </Table>
            <Box className="flex justify-end my-2">
                <Button variant="contained" size='small' color="primary" >
                    Export to PDF
                </Button>
            </Box>
        </Box>
    )
}

export default SignedAuthority