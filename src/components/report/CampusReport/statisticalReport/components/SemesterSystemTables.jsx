

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./../style.css";


const SemesterSystemTables = ({ rows, title, index, fiscalYear }) => {
  const totals = rows.reduce(
    (acc, item) => {
      acc.male += item.male || 0;
      acc.female += item.female || 0;
      acc.others += item.others || 0;
      acc.total += item.total || 0;
      acc.EDJ += item.EDJ || 0;
      acc.Chhetri += item.Chhetri || 0;
      acc.Brahman += item.Brahman || 0;
      acc.Madhesi += item.Madhesi || 0;
      acc.Dalit += item.Dalit || 0;
      acc.Muslim += item.Muslim || 0;
      acc.Tharu += item.Tharu || 0;
      acc.Janajati += item.Janajati || 0;
      acc.ethnicOthers += item.ethnicOthers || 0;
      acc.ethnicTotals += item.ethnicTotals || 0;
      return acc;
    },
    {
      male: 0,
      female: 0,
      others: 0,
      total: 0,
      EDJ: 0,
      Chhetri: 0,
      Brahman: 0,
      Madhesi: 0,
      Dalit: 0,
      Muslim: 0,
      Tharu: 0,
      Janajati: 0,
      ethnicOthers: 0,
      ethnicTotals: 0,
    }
  );

  return (
    <Box mb={2}>
      <p className="sub-heading">{`2.${index}`} <span className="ml-2">{title}</span></p>
      <TableContainer sx={{ border: "1px solid #ddd" }}>
        <Table sx={{ bgcolor: "white" }} size="small">
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow className="table-heading">
              <TableCell colSpan={15} align="center" sx={{ border: "1px solid black", textTransform: "uppercase", backgroundColor: "#2A629A", }}>
                <p className="table-heading">
                  Student Enrollment in FY {fiscalYear}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell rowSpan={2} align="center" sx={{ border: "1px solid black", color: 'white' }}>
                Semester
              </TableCell>
              <TableCell colSpan={4} align="center" sx={{ border: "1px solid black", color: 'white' }}>
                Gender
              </TableCell>
              <TableCell rowSpan={2} align="center" sx={{ border: "1px solid black", color: 'white' }}>
                EDJ
              </TableCell>
              <TableCell colSpan={9} align="center" sx={{ border: "1px solid black", color: 'white' }}>
                Ethnicity
              </TableCell>
            </TableRow>
            <TableRow>
              {[
                "Male",
                "Female",
                "Others",
                "Total",
                "Brahman",
                "Dalit",
                "Muslim",
                "Tharu",
                "Janajati",
                "Others",
                "Madhesi",
                "Chhetri",
                "Total",
              ].map((header, idx) => (
                <TableCell key={idx} align="center" sx={{ border: "1px solid black" }}>
                  <p className="table-heading">{header}</p>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.semester}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.male}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.female}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.others}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.total}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.EDJ}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.Brahman}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.Dalit}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.Muslim}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.Tharu}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.Janajati}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.ethnicOthers}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.Madhesi}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.Chhetri}</TableCell>
                <TableCell align="left" sx={{ border: "1px solid black" }}>{item.ethnicTotals}</TableCell>
              </TableRow>
            ))}
            <TableRow className="table-footer">
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>Grand Total</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.male}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.female}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.others}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.total}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.EDJ}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.Brahman}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.Dalit}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.Muslim}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.Tharu}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.Janajati}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.ethnicOthers}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.Madhesi}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.Chhetri}</TableCell>
              <TableCell align="left" sx={{ border: "1px solid black", fontWeight: 'bold' }}>{totals.ethnicTotals}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const RenderSemesterTables = ({ data, fiscalYear, index }) => {
  let tableIndex = index;

  return (
    <div>
      {Object.values(data).map((programData, i) => (
        <div key={`${programData.programName}-${i}`} className="mt-2">
          {/* <h1 className="text-2xl font-bold">
            {programData.level} - {programData.faculty}
          </h1> */}
          <div className="mt-1">
            <SemesterSystemTables
              fiscalYear={fiscalYear}
              title={programData.programName}
              index={tableIndex++}
              rows={programData.rows.map((row) => {
                const getValue = (label) =>
                  programData.headers.includes(label)
                    ? row.counts[programData.headers.indexOf(label)]
                    : 0;

                return {
                  semester: row.semester,
                  male: getValue("Male"),
                  female: getValue("Female"),
                  others: getValue("Others"),
                  total: getValue("Totals"),
                  EDJ: getValue("EDJ"),
                  Dalit: getValue("Dalit"),
                  Muslim: getValue("Muslim"),
                  Tharu: getValue("Tharu"),
                  Janajati: getValue("Janajati"),
                  Chhetri: getValue("Chhetri"),
                  Brahman: getValue("Brahman"),
                  Madhesi: getValue("Madhesi"),
                  ethnicOthers: getValue("Other Ethnics"),
                  ethnicTotals: getValue("Ethnic Totals"),
                };
              })}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderSemesterTables;

