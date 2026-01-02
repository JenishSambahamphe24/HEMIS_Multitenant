import React, { useEffect, useState } from "react";
import {
    Button,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import CommonDeleteDialog from "../../../CommonDeleteDialog";
import { FaFilePdf } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import AddSignedReportDialog from "./components/AddSignedReportDialog";
import { deleteSignedReport, getSignedReportByCampusId } from "../CampusServices";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {config} from '@config';


const StatReportListByFiscalId = () => {
    const fileURL=config.VITE_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);
    const campusId = currentUser?.institution?.id

    const [allReports, setAllReports] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [contentId, setContentId] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const handledialogOpen = (id) => {
        setDialogOpen(true);
    };

    const fetchData = async () => {
        const response = await getSignedReportByCampusId(campusId)
        if (response) {
            setAllReports(response)
        } else {
            setAllReports([])
        }
    }

    const handleDialogClose = async () => {
        fetchData()
        setDialogOpen(false);
    };

    useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteDialogOpen = (id) => {
        setContentId(id)
        setDeleteDialogOpen(true)
    }
    const handleClose = () => {
        setDeleteDialogOpen(false)
        fetchData()
    }


    return (
        <>
            <div style={{ marginTop: "20px", paddingInline: '3rem' }}>
                <Typography variant="h6" bgcolor='#2a629a' color='white' display='inline-block' px='10px' my='20px' textAlign={'left'}>
                    Statistical Report Submitted by Campus
                </Typography>
                <TableContainer sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead style={{ backgroundColor: "#2A629A" }}>
                            <TableRow>
                                {[
                                    "S.No.",
                                    "Fiscal Year",
                                    "File Name",
                                    "File Type",
                                    "Actions"
                                ].map((header, index) => (
                                    <TableCell
                                        key={index}
                                        style={{
                                            color: "#ffffff",
                                            border: "1px solid #ddd",
                                            padding: "4px",
                                            height: "24px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ bgcolor: "white" }}>
                            {allReports.length > 0 ? (
                                allReports.map((item, index) => (
                                    <TableRow key={index} >
                                        <TableCell
                                            style={{
                                                border: "1px solid #c2c2c2",
                                                padding: "4px",
                                                textAlign: "left",
                                            }}
                                        >
                                            {index + 1}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                border: "1px solid #c2c2c2",
                                                padding: "4px",
                                                textAlign: "left",
                                            }}
                                        >
                                            {item.fiscalYear.yearNepali}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                border: "1px solid #c2c2c2",
                                                padding: "4px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <Link to={`${fileURL}/${item.signedReport}`}>
                                                {`${item.campusName.replace(/\s+/g, '_')}_${item.fiscalYear.yearNepali}`}
                                            </Link>
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                border: "1px solid #c2c2c2",
                                                padding: "4px",
                                                textAlign: "left",
                                            }}
                                        >
                                            PDF
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                border: "1px solid #c2c2c2",
                                                padding: "4px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <div className="flex justify-around">
                                                <Link target="_blank" to={`${fileURL}/${item.statReport}`}>
                                                    <FaFilePdf className="text-[#0368b0] text-md" />
                                                </Link>
                                                <FaRegTrashAlt onClick={() => handleDeleteDialogOpen(item.id)} className="text-red-500 text-md" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', border: '1px solid #c2c2c2', color: 'red' }}>
                                        No Statistical Report Uploaded yet !!
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="flex flex-col" style={{ marginTop: "20px" }}>
                    <h1 className="text-lg text-[#0368b0]">
                        Please  Upload officially signed statistical Report for a particular Fiscal Year
                    </h1>
                </div>
                <Button variant="outlined" sx={{ textTransform: 'none', marginTop: '10px' }} size="small" onClick={() => handledialogOpen()}>Upload signed Report </Button>
                <AddSignedReportDialog open={dialogOpen} handleClose={handleDialogClose} setOpen={setDialogOpen} />
                <CommonDeleteDialog
                    id={contentId}
                    open={deleteDialogOpen}
                    handleClose={handleClose}
                    deleteApi={deleteSignedReport}
                    content='content'
                />
            </div>
        </>
    );
};

export default StatReportListByFiscalId;
