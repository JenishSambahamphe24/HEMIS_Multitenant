import React from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Checkbox,
} from '@mui/material';

const FinancialStatusTable = ({ index, fiscalYear, income, operatingExpenditure, capitalExpenditure, bankDetails }) => {
  // Calculate totals
  const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalOperatingExpenditure = operatingExpenditure.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const totalCapitalExpenditure = capitalExpenditure.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Combine all three arrays into one unified array to map over
  const maxLength = Math.max(income.length, operatingExpenditure.length, capitalExpenditure.length);
  const unifiedData = [];

  for (let i = 0; i < maxLength; i++) {
    unifiedData.push({
      income: income[i] || {},
      operatingExpenditure: operatingExpenditure[i] || {},
      capitalExpenditure: capitalExpenditure[i] || {}
    });
  }

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 'bold', color: 'black' }}
      >
        {`${index}.1`} Actual Financial Status in Last F.Y: {fiscalYear}
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: '1px solid black' }}>
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow>
              <TableCell
                align="center"
                rowSpan={2}
                sx={{ border: '1px solid black', fontWeight: 'bold', color: 'white' }}
              >
                Sources of Income
              </TableCell>
              <TableCell
                align="center"
                rowSpan={2}
                sx={{ border: '1px solid black', fontWeight: 'bold', color: 'white' }}
              >
                Amount (Rs.)
              </TableCell>
              <TableCell
                align="center"
                colSpan={4}
                sx={{ border: '1px solid black', fontWeight: 'bold', color: 'white' }}
              >
                Total Expenditures
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                sx={{ border: '1px solid black', fontWeight: 'bold', color: 'white' }}
              >
                Operating Costs
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: '1px solid black', fontWeight: 'bold', color: 'white' }}
              >
                Amount
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: '1px solid black', fontWeight: 'bold', color: 'white' }}
              >
                Capital Expenditure
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: '1px solid black', fontWeight: 'bold', color: 'white' }}
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {unifiedData.map((row, idx) => (
              <TableRow key={idx}>
                {/* Income */}
                <TableCell style={{ border: '1px solid black' }} align="left">
                  {row.income.headName?.headName || ''}
                </TableCell>
                <TableCell style={{ border: '1px solid black' }} align="center">
                  {row.income.amount || ''}
                </TableCell>

                {/* Operating Expenditure */}
                <TableCell style={{ border: '1px solid black' }} align="left">
                  {row.operatingExpenditure.headName?.headName || ''}
                </TableCell>
                <TableCell style={{ border: '1px solid black' }} align="center">
                  {row.operatingExpenditure.amount || ''}
                </TableCell>

                {/* Capital Expenditure */}
                <TableCell style={{ border: '1px solid black' }} align="left">
                  {row.capitalExpenditure.headName?.headName || ''}
                </TableCell>
                <TableCell style={{ border: '1px solid black' }} align="center">
                  {row.capitalExpenditure.amount || ''}
                </TableCell>
              </TableRow>
            ))}

            {/* Grand Total Row */}
            <TableRow sx={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
              <TableCell style={{ border: '1px solid black', fontWeight: 'bold' }} align="left">
                Grand Total
              </TableCell>
              <TableCell style={{ border: '1px solid black', fontWeight: 'bold' }} align="center">
                {totalIncome}
              </TableCell>
              <TableCell style={{ border: '1px solid black' }} align="left"></TableCell>
              <TableCell style={{ border: '1px solid black', fontWeight: 'bold' }} align="center">
                {totalOperatingExpenditure}
              </TableCell>
              <TableCell style={{ border: '1px solid black' }} align="left"></TableCell>
              <TableCell style={{ border: '1px solid black', fontWeight: 'bold' }} align="center">
                {totalCapitalExpenditure}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bank Details Section */}
      <Box
        sx={{
          marginTop: '20px',
          border: '1px solid black',
          borderRadius: '5px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: '10px',
            color: 'black',
          }}
        >
          Bank Account Details:
        </Typography>

        <Box sx={{ marginBottom: '10px' }}>
          <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
            <Typography sx={{ color: 'black', marginBottom: '5px' }}>
              a) Bank Name: {bankDetails.name || 'N/A'}
            </Typography>
            <Typography sx={{ color: 'black', marginBottom: '5px' }}>
              b) Branch: {bankDetails.branch || 'N/A'}
            </Typography>
            <Typography sx={{ color: 'black', marginBottom: '5px' }}>
              c) Account No: {bankDetails.accountNo || 'N/A'}
            </Typography>
          </Stack>
          <Typography sx={{ color: 'black', marginBottom: '10px' }}>
            d) Account Type:
          </Typography>
          <Box sx={{ display: 'flex', gap: '20px', marginLeft: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox />
              <Typography sx={{ color: 'black' }}>Current</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox />
              <Typography sx={{ color: 'black' }}>Saving</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox />
              <Typography sx={{ color: 'black' }}>Others</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FinancialStatusTable;