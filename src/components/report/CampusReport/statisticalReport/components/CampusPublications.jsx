import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { getDateOnly } from "../../../../../utils/dateUtils";

const CampusPublications = ({ index, sNo, data }) => {
  return (
    <Box >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black", marginBottom: "10px" }}
      >
        {`${index}.${sNo}`}  Campus Publications
      </Typography>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: "1px solid black" }}>
          {/* Header */}
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color:'white'}}
              >
                Publication
              </TableCell>
            </TableRow>
            <TableRow>
              {[
                "Publication Title",
                "Publication Date",
                "Publication Type(e.g Professional, Memorial, Bulletin, Others- please specify)",
                "Publication Period(e.g Annual, Biannual,nOthers-please specify)",
              ].map((header, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold", padding: '5px', color: 'white' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.activityTitle}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black", }}
                  >
                   {getDateOnly(item.publishedDate) || ' '}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.publicationType}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.publicationFrequency}
                  </TableCell>
             
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampusPublications;