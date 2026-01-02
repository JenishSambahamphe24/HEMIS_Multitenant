import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";


const StudentExaminationStatus = ({ rows, index, year }) => {
    const totals = rows.reduce((acc, row) => {
        acc.totalAppeared += row.totalAppeared;
        acc.totalPassed += row.totalPassed;
        acc.maleAppeared += row.maleAppeared;
        acc.malePassed += row.malePassed;
        acc.femaleAppeared += row.femaleAppeared;
        acc.femalePassed += row.femalePassed;
        acc.otherGenderAppeared += row.otherGenderAppeared;
        acc.otherGenderPassed += row.otherGenderPassed;
        return acc;
    }, {
        totalAppeared: 0,
        totalPassed: 0,
        maleAppeared: 0,
        malePassed: 0,
        femaleAppeared: 0,
        femalePassed: 0,
        otherGenderAppeared: 0,
        otherGenderPassed: 0,

    })

    return (
        <div>
            <h3 className="sub-heading mt-6">{index}.1 Status of appeared & passed students in the F.Y: <span >{year}</span> (Please Include Full (Regular) Students only)</h3>
            <TableContainer sx={{ overflowX: 'scroll' }}>
                <Table style={{ borderCollapse: "collapse", background: 'white' }}>
                    <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
                        <TableRow>
                            <TableCell
                                rowSpan={3}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                S.No
                            </TableCell>
                            <TableCell
                                rowSpan={3}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Program Name
                            </TableCell>
                            <TableCell
                                rowSpan={3}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Total appeared
                            </TableCell>
                            <TableCell
                                rowSpan={3}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Total passed
                            </TableCell>
                            <TableCell
                                colSpan={6}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Gender
                            </TableCell>

                            <TableCell
                                rowSpan={3}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Remarks
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                colSpan={2}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Male
                            </TableCell>
                            <TableCell
                                colSpan={2}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Female
                            </TableCell>
                            <TableCell
                                colSpan={2}
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Others
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Appeared
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Passed
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Appeared
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Passed
                            </TableCell>

                            <TableCell
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Appeared
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Passed
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'left'
                                        }}
                                    >
                                        {index + 1}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'left'
                                        }}
                                    >
                                        {row.program}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.totalAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.totalPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.maleAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.malePassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.femaleAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.femalePassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.otherGenderAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >
                                        {row.otherGenderPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: '1px solid black',
                                            // padding: "4px",
                                            textAlign: 'center'
                                        }}
                                    >

                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableRow >
                        <TableCell
                            colSpan={2}
                            sx={{
                                border: '1px solid black',
                                padding: "4px",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                            className="table-footer"
                        >
                            Grand Total
                        </TableCell>
                        {
                            Object.entries(totals).map(([key, value], index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        border: '1px solid black',
                                        textAlign: "center",
                                    }}
                                    className="table-footer"
                                >
                                    {value}
                                </TableCell>
                            ))
                        }
                        <TableCell
                            className="table-footer"
                            sx={{
                                border: '1px solid black',
                                padding: "4px",
                                textAlign: "center",
                            }}
                        >
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
        </div>
    );
};

export default StudentExaminationStatus;
