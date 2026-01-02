import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { ToWords } from "to-words";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const ReceiptPdfExport = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const baseUrl=config.VITE_BASE_URL;
  const toWords = new ToWords();
  const [receiptData, setReceiptData] = useState(null);
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const Logo = currentUser?.institution?.logo;
  const campusName = currentUser?.institution?.campusName;
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const userName = currentUser?.listUser[0]?.roleName;
  const uniName = currentUser?.uniName;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/Receipt/${id}`, config);
        setReceiptData(response.data);
      } catch (error) {
        console.error("Error fetching receipt data:", error);
      }
    };

    fetchReceiptData();
  }, [id]);
  const totalAmount = receiptData?.receiptItem?.reduce((sum, data) => {
    return sum + (data?.amount || 0);
  }, 0);
  const amountPaid = parseFloat(totalAmount);
  let words = "";
  if (!isNaN(amountPaid)) {
    words = toWords.convert(amountPaid, {
      currency: true,
      ignoreDecimal: true,
    });
  } else {
    words = "Invalid amount";
  }

  const ReceiptContent = ({ className = "" }) => (
    <Card
      className={className}
      sx={{
        borderRadius: 4,
        boxShadow: 4,
        backgroundColor: "white",
        minHeight: "600px",
        border: "1px solid #eee",
        padding: 3,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 1,
          }}
        >
          <img
            src={`${baseUrl}/${Logo}`}
            alt="campus Logo"
            width="70px"
            height="70px"
          />
        </Box>
        <Typography variant="body2" align="center">
          {uniName}
        </Typography>
        <Typography variant="body1" align="center" sx={{ fontWeight: 700 }}>
          {campusName}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ fontWeight: 400 }}
          gutterBottom
        >
          {localLevel}, {district}
        </Typography>

        <Typography align="center" gutterBottom>
          Student Income Receipt 
        </Typography>

        <Divider style={{ margin: "20px 0" }} />
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Receipt No:</strong> {receiptData?.receiptNo || ""}
            </Typography>
          </Grid>
          <Grid item xs={6} align="right">
            <Typography variant="body2" textAlign={"right"}>
              <strong>Date:</strong>{" "}
              {receiptData?.dateOfPayment?.slice(0, 10) || ""}
            </Typography>
          </Grid>
          <Grid item xs={12} align="left">
            <Typography variant="body2">
              <strong>Program Name:</strong> {receiptData?.programName || ""}
            </Typography>
            <Typography variant="body2">
              <strong>Student Name:</strong> {receiptData?.studentName}{" "}
              {receiptData?.fullName}
            </Typography>

            <Typography variant="body2">
              <strong>Roll No:</strong> {receiptData?.rollNo || ""}
            </Typography>
          </Grid>
          <Grid item xs={12} align="left"></Grid>
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    width: "8%",
                    fontWeight: "bold",
                  }}
                >
                  क्र.सं./S.No.
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  विवरण/Particulars
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    width: "25%",
                    fontWeight: "bold",
                  }}
                >
                  रकम/Amount
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    fontWeight: "bold",
                  }}
                >
                  कैफियत/Remarks
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {receiptData?.receiptItem.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell
                    align="center"
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
                    {data?.feeTypeName
                      ? data?.feeTypeName
                      : data?.generalFeeTypeName}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {"RS. " +
                      new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(data?.amount)}
                  </TableCell>

                  <TableCell
                    align="center"
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "left",
                    }}
                  >
                    {data?.remarks || "-"}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell
                  colSpan={2}
                  align="right"
                  style={{
                    border: "1px solid #fff",
                    padding: "4px",
                    textAlign: "center",
                    backgroundColor: "#c2c2c2",
                  }}
                >
                  जम्मा / Total:
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: "1px solid #fff",
                    padding: "4px",
                    textAlign: "right",
                    backgroundColor: "#c2c2c2",
                  }}
                >
                  {"RS. " +
                    new Intl.NumberFormat("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(amountPaid)}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: "1px solid #fff",
                    padding: "4px",
                    textAlign: "left",
                    backgroundColor: "#c2c2c2",
                  }}
                ></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography variant="body2" pt={2}>
            Amount In Words: <strong>{words}</strong> /-
          </Typography>
        </TableContainer>

        <Divider sx={{ margin: "10px 0" }} />

        <Typography variant="body2" sx={{ marginTop: "20px" }}>
          <strong>Note:</strong> Please verify all details before final
          submission.
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: "20px" }}
        >
          <Typography variant="body2">
            Printed by: &nbsp;
            <span style={{ textDecoration: "underline" }}>{userName}</span>
          </Typography>
          <Typography variant="body2">
            Signature: .....................................................
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <Box sx={{ maxWidth: 1000, margin: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
                borderRadius: 2,
              }}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>

          <div ref={componentRef}>
            {/* Screen view - Single receipt */}
            <div className="screen-view">
              <ReceiptContent />
            </div>

            {/* Print view - Two receipts side by side (hidden on screen) */}
            <div className="print-view" style={{ display: "none" }}>
              <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                <div style={{ flex: 1, width: "50%" }}>
                  <ReceiptContent className="print-receipt" />
                </div>
                <div style={{ flex: 1, width: "50%" }}>
                  <ReceiptContent className="print-receipt" />
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>

      <style>
        {`
         /* Replace your existing print styles with these improved ones */

@media screen {
  .print-view {
    display: none !important;
  }
  .screen-view {
    display: block !important;
  }
}

@media print {
  @page {
    size: A4 landscape;
    margin: 0.5in;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
  
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  body {
    padding: 0 !important;
    margin: 0 !important;
    font-family: Arial, sans-serif !important;
    color: #000 !important;
  }
  
  .screen-view {
    display: none !important;
  }
  
  .print-view {
    display: block !important;
  }
  
  .print-view > div {
    display: flex !important;
    flex-wrap: nowrap !important;
    gap: 20px !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .print-view > div > div {
    flex: 1 !important;
    width: 50% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .MuiButton-root {
    display: none !important;
  }
  
  .print-receipt.MuiCard-root {
    border: 2px solid #000 !important;
    box-shadow: none !important;
    padding: 16px !important;
    margin: 0 !important;
    min-height: auto !important;
    page-break-inside: avoid !important;
    border-radius: 0 !important;
    background: white !important;
  }
  
  .print-receipt .MuiCardContent-root {
    padding: 12px !important;
  }
  
  .print-receipt .MuiTableCell-root {
    padding: 6px !important;
    font-size: 12px !important;
    border: 1px solid #000 !important;
    color: #000 !important;
    background: white !important;
    font-weight: 400 !important;
    line-height: 1.4 !important;
  }
  
  .print-receipt .MuiTableHead-root .MuiTableCell-root {
    font-weight: 700 !important;
    background: #f5f5f5 !important;
    font-size: 12px !important;
  }
  
  .print-receipt .MuiTableRow-root {
    border-bottom: 1px solid #000 !important;
  }
  
  .print-receipt .MuiTableContainer-root {
    margin-top: 12px !important;
    margin-bottom: 12px !important;
  }
  
  .print-receipt .MuiTypography-root {
    font-size: 12px !important;
    line-height: 1.4 !important;
    margin: 4px 0 !important;
    color: #000 !important;
    font-family: Arial, sans-serif !important;
  }
  
  .print-receipt .MuiTypography-body1 {
    font-size: 14px !important;
    font-weight: 700 !important;
  }
  
  .print-receipt .MuiTypography-body2 {
    font-size: 11px !important;
  }
  
  .print-receipt .MuiTableHead-root {
    background-color: #f5f5f5 !important;
  }
  
  .print-receipt .MuiDivider-root {
    margin: 8px 0 !important;
    border-color: #000 !important;
    border-width: 1px !important;
  }
  
  .print-receipt img {
    width: 60px !important;
    height: 60px !important;
  }
  
  .print-receipt .MuiBox-root {
    margin: 6px 0 !important;
  }
  
  .print-receipt .MuiGrid-container {
    margin: 10px 0 !important;
  }
  
  /* Ensure total row is clearly visible */
  .print-receipt .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root {
    background-color: #e0e0e0 !important;
    font-weight: 700 !important;
    border: 2px solid #000 !important;
  }
  
  /* Strong text emphasis */
  .print-receipt strong {
    font-weight: 700 !important;
    color: #000 !important;
  }
}
        `}
      </style>
    </>
  );
};

export default ReceiptPdfExport;
