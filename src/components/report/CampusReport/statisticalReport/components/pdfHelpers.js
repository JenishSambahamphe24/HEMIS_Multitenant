import autoTable from "jspdf-autotable";
const headStyles = {
  fillColor: [42, 98, 154],
  textColor: [255, 255, 255],
  fontStyle: "normal",
  lineWidth: 0.1,
  lineColor: ["white"],
};
 export const rightMargin = 10;
 export const leftMargin = 10;
 export const topMargin = 10;
 export const bottomMargin = 10;
 export const tableFontSize = 10;

 const headFont = 10;
 const bodyFont = 8; 


function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return "";
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays.toString();
  } catch (error) {
    return "";
  }
}

export async function generateAnnualTablesPDF(
  doc,
  annualProgram,
  pageIndex,
  selectedYear
) {
  let yPosition = topMargin + 14;
  let subIndex = 1;

  for (const programData of Object.values(annualProgram)) {
    if (yPosition > doc.internal.pageSize.height - bottomMargin - 60) {
      doc.addPage();
      yPosition = topMargin + 10;
    }
    doc.setFontSize(bodyFont);
    doc.text(`${pageIndex}.${subIndex} ${programData.programName}`, leftMargin, yPosition);
    yPosition += 6;

    const headers = [
      [
        "Year",
        "Male",
        "Female",
        "Others",
        "Total",
        "EDJ",
        "Dalit",
        "Muslim",
        "Tharu",
        "Janajati",
        "Chhetri",
        "Brahman",
        "Others",
        "Total",
      ],
    ];

    const rows = programData.rows.map((row) => {
      const getValue = (label) =>
        programData.headers.includes(label)
          ? row.counts[programData.headers.indexOf(label)]
          : 0;

      return [
        row.year,
        getValue("Male").toString(),
        getValue("Female").toString(),
        getValue("Others").toString(),
        getValue("Totals").toString(),
        getValue("EDJ").toString(),
        getValue("Dalit").toString(),
        getValue("Muslim").toString(),
        getValue("Tharu").toString(),
        getValue("Janajati").toString(),
        getValue("Chhetri").toString(),
        getValue("Brahman").toString(),
        getValue("Other Ethnics").toString(),
        getValue("Ethnic Totals").toString(),
      ];
    });

    const totals = programData.rows.reduce(
      (acc, row) => {
        const getValue = (label) =>
          programData.headers.includes(label)
            ? row.counts[programData.headers.indexOf(label)]
            : 0;
        acc.male += getValue("Male") || 0;
        acc.female += getValue("Female") || 0;
        acc.others += getValue("Others") || 0;
        acc.total += getValue("Totals") || 0;
        acc.EDJ += getValue("EDJ") || 0;
        acc.Dalit += getValue("Dalit") || 0;
        acc.Muslim += getValue("Muslim") || 0;
        acc.Tharu += getValue("Tharu") || 0;
        acc.Janajati += getValue("Janajati") || 0;
        acc.Chhetri += getValue("Chhetri") || 0;
        acc.Brahman += getValue("Brahman") || 0;
        acc.ethnicOthers += getValue("Other Ethnics") || 0;
        acc.ethnicTotals += getValue("Ethnic Totals") || 0;
        return acc;
      },
      {
        male: 0,
        female: 0,
        others: 0,
        total: 0,
        EDJ: 0,
        Dalit: 0,
        Muslim: 0,
        Tharu: 0,
        Janajati: 0,
        Chhetri: 0,
        Brahman: 0,
        ethnicOthers: 0,
        ethnicTotals: 0,
      }
    );

    rows.push([
      "Grand Total",
      totals.male.toString(),
      totals.female.toString(),
      totals.others.toString(),
      totals.total.toString(),
      totals.EDJ.toString(),
      totals.Dalit.toString(),
      totals.Muslim.toString(),
      totals.Tharu.toString(),
      totals.Janajati.toString(),
      totals.Chhetri.toString(),
      totals.Brahman.toString(),
      totals.ethnicOthers.toString(),
      totals.ethnicTotals.toString(),
    ]);

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: headStyles,
      foot: [],
      margin: { top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin },
      styles: { fontSize: bodyFont, cellPadding: 2 },
      willDrawCell: function (data) {
        if (data.row.index === rows.length - 1) {
          doc.setFont(undefined, "bold");
        }
      },
    });

    // Update Y position for next content
    yPosition = doc.autoTable.previous.finalY + 10;
    subIndex++;
  }
}

export async function generateSemesterTablesPDF(
  doc,
  semesterProgram,
  pageIndex,
  selectedYear
) {
  let yPosition = topMargin + 14;
  let subIndex = 1;

  for (const programData of Object.values(semesterProgram)) {
    if (yPosition > doc.internal.pageSize.height - bottomMargin - 60) {
      doc.addPage();
      yPosition = topMargin + 10;
    }

    doc.setFontSize(11);
    yPosition += 5;
    doc.text(
      `${pageIndex}.${subIndex} ${programData.programName}`,
      leftMargin,
      yPosition
    );
    yPosition += 6;

    const headers = [
      [
        "Year",
        "Male",
        "Female",
        "Others",
        "Total",
        "EDJ",
        "Dalit",
        "Muslim",
        "Tharu",
        "Janajati",
        "Chhetri",
        "Brahman",
        "Others",
        "Total",
      ],
    ];

    const rows = programData.rows.map((row) => {
      const getValue = (label) =>
        programData.headers.includes(label)
          ? row.counts[programData.headers.indexOf(label)]
          : 0;

      return [
        row.semester,
        getValue("Male").toString(),
        getValue("Female").toString(),
        getValue("Others").toString(),
        getValue("Totals").toString(),
        getValue("EDJ").toString(),
        getValue("Dalit").toString(),
        getValue("Muslim").toString(),
        getValue("Tharu").toString(),
        getValue("Janajati").toString(),
        getValue("Chhetri").toString(),
        getValue("Brahman").toString(),
        getValue("Other Ethnics").toString(),
        getValue("Ethnic Totals").toString(),
      ];
    });

    const totals = programData.rows.reduce(
      (acc, row) => {
        const getValue = (label) =>
          programData.headers.includes(label)
            ? row.counts[programData.headers.indexOf(label)]
            : 0;
        acc.male += getValue("Male") || 0;
        acc.female += getValue("Female") || 0;
        acc.others += getValue("Others") || 0;
        acc.total += getValue("Totals") || 0;
        acc.EDJ += getValue("EDJ") || 0;
        acc.Dalit += getValue("Dalit") || 0;
        acc.Muslim += getValue("Muslim") || 0;
        acc.Tharu += getValue("Tharu") || 0;
        acc.Janajati += getValue("Janajati") || 0;
        acc.Chhetri += getValue("Chhetri") || 0;
        acc.Brahman += getValue("Brahman") || 0;
        acc.ethnicOthers += getValue("Other Ethnics") || 0;
        acc.ethnicTotals += getValue("Ethnic Totals") || 0;
        return acc;
      },
      {
        male: 0,
        female: 0,
        others: 0,
        total: 0,
        EDJ: 0,
        Dalit: 0,
        Muslim: 0,
        Tharu: 0,
        Janajati: 0,
        Chhetri: 0,
        Brahman: 0,
        ethnicOthers: 0,
        ethnicTotals: 0,
      }
    );

    rows.push([
      "Grand Total",
      totals.male.toString(),
      totals.female.toString(),
      totals.others.toString(),
      totals.total.toString(),
      totals.EDJ.toString(),
      totals.Dalit.toString(),
      totals.Muslim.toString(),
      totals.Tharu.toString(),
      totals.Janajati.toString(),
      totals.Chhetri.toString(),
      totals.Brahman.toString(),
      totals.ethnicOthers.toString(),
      totals.ethnicTotals.toString(),
    ]);

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: headStyles,
      foot: [],
      margin: {
        top: topMargin,
        right: rightMargin,
        bottom: bottomMargin,
        left: leftMargin,
      },
      styles: { fontSize: tableFontSize, cellPadding: 2 },
      willDrawCell: function (data) {
        if (data.row.index === rows.length - 1) {
          doc.setFont(undefined, "bold");
        }
      },
    });
    yPosition = doc.autoTable.previous.finalY + 10;
    subIndex++;
  }
}

export async function generateExaminationStatusPDF(
  doc,
  passRateData,
  pageIndex,
  selectedYear
) {
  try {
    let yPosition = topMargin + 14;
    doc.setFontSize(11);
    yPosition += 5;
    doc.text(
      `${pageIndex}.1 Status of appeared & passed students in the F.Y: ${selectedYear} (Regular Students only)`,
      leftMargin,
      yPosition
    );
    yPosition += 6;

    const headers = [
      [
        "S.No",
        "Program",
        "Appeared",
        "Passed",
        "Appeared(M)",
        "Passed(M)",
        "Appeared(Fe)",
        "Passed(Fe)",
        "Appeared(O)",
        "Passed(O)",
        "Remarks",
      ],
    ];

    const bodyRows = [];
    const totals = {
      totalAppeared: 0,
      totalPassed: 0,
      maleAppeared: 0,
      malePassed: 0,
      femaleAppeared: 0,
      femalePassed: 0,
      otherGenderAppeared: 0,
      otherGenderPassed: 0,
    };

    passRateData.forEach((row, i) => {
      const rowData = [
        i + 1,
        row.program || "",
        row.totalAppeared || 0,
        row.totalPassed || 0,
        row.maleAppeared || 0,
        row.malePassed || 0,
        row.femaleAppeared || 0,
        row.femalePassed || 0,
        row.otherGenderAppeared || 0,
        row.otherGenderPassed || 0,
        row.remarks || "",
      ];

      bodyRows.push(rowData);

      totals.totalAppeared += row.totalAppeared || 0;
      totals.totalPassed += row.totalPassed || 0;
      totals.maleAppeared += row.maleAppeared || 0;
      totals.malePassed += row.malePassed || 0;
      totals.femaleAppeared += row.femaleAppeared || 0;
      totals.femalePassed += row.femalePassed || 0;
      totals.otherGenderAppeared += row.otherGenderAppeared || 0;
      totals.otherGenderPassed += row.otherGenderPassed || 0;
    });

    bodyRows.push([
      "",
      "Grand Total",
      totals.totalAppeared,
      totals.totalPassed,
      totals.maleAppeared,
      totals.malePassed,
      totals.femaleAppeared,
      totals.femalePassed,
      totals.otherGenderAppeared,
      totals.otherGenderPassed,
      "",
    ]);

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: bodyRows,
      theme: "grid",
      headStyles: headStyles,
      columnStyles: {
        0: { cellWidth: 8 }, // S.No
        1: { cellWidth: 35 }, // Program
        2: { cellWidth: 18 }, // Total appeared
        3: { cellWidth: 18 }, // Total passed
        4: { cellWidth: 14 }, // Appeared-Male
        5: { cellWidth: 14 }, // Passed-Male
        6: { cellWidth: 14 }, // Appeared-female
        7: { cellWidth: 14 }, // Passed-female
        8: { cellWidth: 14 }, // Appeared-other
        9: { cellWidth: 14 }, // Passed-other
        10: { cellWidth: 20 }, // Remarks
      },
      margin: {
        top: topMargin,
        right: rightMargin,
        bottom: bottomMargin,
        left: leftMargin,
      },
      styles: {
        fontSize: tableFontSize,
        cellPadding: 2,
        overflow: "linebreak",
      },
      willDrawCell: function (data) {
        if (data.row.index === bodyRows.length - 1) {
          doc.setFont(undefined, "bold");
        }
      },
    });

    return doc.autoTable.previous.finalY + 10;
  } catch (error) {
    console.error("Error generating student examination status PDF:", error);
    return topMargin + 10;
  }
}

export async function generateTeachingStaffPDF(
  doc,
  pageIndex,
  yPosition,
  teachingData
) {
  try {
    let yPosition = topMargin + 14;
    const tableWidth = doc.internal.pageSize.width - (leftMargin + rightMargin);
    const teachingTotals = teachingData.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if (key !== "position") {
          acc[key] = (acc[key] || 0) + (curr[key] || 0);
        }
      });
      return acc;
    }, {});

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    yPosition += 5;
    doc.text(
      `${pageIndex}.1 Teaching staff by gender and contract type by post`,
      leftMargin,
      yPosition
    );
    yPosition += 2;

    const headers = [
      [
        "Post",
        "Permanent",
        "",
        "",
        "",
        "Temporary",
        "",
        "",
        "",
        "Contract",
        "",
        "",
        "",
        "Part-Time",
        "",
        "",
        "",
        "Grand Total",
      ],
      [
        "",
        "M",
        "F",
        "O",
        "T",
        "M",
        "F",
        "O",
        "T",
        "M",
        "F",
        "O",
        "T",
        "M",
        "F",
        "O",
        "T",
        "",
      ],
    ];

    const body = teachingData.map((row) => [
      row.position,
      row.permanentMale || 0,
      row.permanentFemale || 0,
      row.permanentOther || 0,
      row.permanentTotal || 0,
      row.temporaryMale || 0,
      row.temporaryFemale || 0,
      row.temporaryOther || 0,
      row.temporaryTotal || 0,
      row.contractMale || 0,
      row.contractFemale || 0,
      row.contractOther || 0,
      row.contractTotal || 0,
      row.partTimeMale || 0,
      row.partTimeFemale || 0,
      row.partTimeOther || 0,
      row.partTimeTotal || 0,
      row.grandTotal || 0,
    ]);

    const totalRow = [
      "Total",
      teachingTotals.permanentMale || 0,
      teachingTotals.permanentFemale || 0,
      teachingTotals.permanentOther || 0,
      teachingTotals.permanentTotal || 0,
      teachingTotals.temporaryMale || 0,
      teachingTotals.temporaryFemale || 0,
      teachingTotals.temporaryOther || 0,
      teachingTotals.temporaryTotal || 0,
      teachingTotals.contractMale || 0,
      teachingTotals.contractFemale || 0,
      teachingTotals.contractOther || 0,
      teachingTotals.contractTotal || 0,
      teachingTotals.partTimeMale || 0,
      teachingTotals.partTimeFemale || 0,
      teachingTotals.partTimeOther || 0,
      teachingTotals.partTimeTotal || 0,
      teachingTotals.grandTotal || 0,
    ];

    body.push(totalRow);

    const mergeConfig = [
      { row: 0, col: 1, colSpan: 4 },
      { row: 0, col: 5, colSpan: 4 },
      { row: 0, col: 9, colSpan: 4 },
      { row: 0, col: 13, colSpan: 4 },
      { row: 0, col: 0, rowSpan: 2 },
      { row: 0, col: 17, rowSpan: 2 },
    ];

    doc.autoTable({
      head: headers,
      body: body,
      startY: yPosition,
      margin: {
        top: topMargin,
        bottom: bottomMargin,
        left: leftMargin,
        right: rightMargin,
      },
      tableWidth: tableWidth,
      theme: "grid",
      headStyles,
      bodyStyles: {
        halign: "center",
        fontSize: tableFontSize,
      },
      columnStyles: {
        0: { halign: "left", cellWidth: tableWidth * 0.25 },
        17: { fontStyle: "bold" },
      },
      styles: {
        overflow: "linebreak",
        cellPadding: 2,
      },
      pageBreak: "auto",
      didParseCell: function (data) {
        if (data.section === "head") {
          mergeConfig.forEach((merge) => {
            if (
              data.row.index === merge.row &&
              data.column.index === merge.col
            ) {
              if (merge.rowSpan) data.cell.rowSpan = merge.rowSpan;
              if (merge.colSpan) data.cell.colSpan = merge.colSpan;
            }
          });
        }

        if (data.section === "body") {
          const isTotalRow = data.row.raw[0] === "Total";
          const totalCols = [4, 8, 12, 16, 17];

          if (isTotalRow || totalCols.includes(data.column.index)) {
            data.cell.styles.fontStyle = "bold";
          }

          if (isTotalRow) {
            data.cell.styles.fillColor = [240, 240, 240];
          }
        }
      },
    });

    let finalY = doc.autoTable.previous?.finalY || yPosition;
    finalY += 15;

    const pageHeight = doc.internal.pageSize.height;

    if (finalY > pageHeight - bottomMargin) {
      doc.addPage();
      finalY = topMargin;
    }
    return finalY;
  } catch (error) {
    console.error("Error generating teaching staff PDF:", error);
    return yPosition + 10;
  }
}

export async function generateNonTeachingStaffPDF(
  doc,
  pageIndex,
  yPosition,
  nonTeachingData
) {
  try {
    const tableWidth = doc.internal.pageSize.width - leftMargin * 2;
    const nonTeachingTotals = nonTeachingData.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if (key !== "position") {
          acc[key] = (acc[key] || 0) + (curr[key] || 0);
        }
      });
      return acc;
    }, {});

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    yPosition += 5;
    doc.text(
      `${pageIndex}.2 Non-Teaching staff by gender and contract type by post`,
      leftMargin,
      yPosition
    );
    yPosition += 2;

    const teachingHeaders = [
      [
        "Post",
        "Permanent",
        "",
        "",
        "",
        "Temporary",
        "",
        "",
        "",
        "Contract",
        "",
        "",
        "",
        "Part-Time",
        "",
        "",
        "",
        "Grand Total",
      ],
      [
        "",
        "M",
        "F",
        "O",
        "T",
        "M",
        "F",
        "O",
        "T",
        "M",
        "F",
        "O",
        "T",
        "M",
        "F",
        "O",
        "T",
        "",
      ],
    ];

    const teachingBody = nonTeachingData.map((row) => [
      row.position,
      row.permanentMale || 0,
      row.permanentFemale || 0,
      row.permanentOther || 0,
      row.permanentTotal || 0,
      row.temporaryMale || 0,
      row.temporaryFemale || 0,
      row.temporaryOther || 0,
      row.temporaryTotal || 0,
      row.contractMale || 0,
      row.contractFemale || 0,
      row.contractOther || 0,
      row.contractTotal || 0,
      row.partTimeMale || 0,
      row.partTimeFemale || 0,
      row.partTimeOther || 0,
      row.partTimeTotal || 0,
      row.grandTotal || 0,
    ]);

    const nonTeachingTotalsRow = [
      "Total",
      nonTeachingTotals.permanentMale || 0,
      nonTeachingTotals.permanentFemale || 0,
      nonTeachingTotals.permanentOther || 0,
      nonTeachingTotals.permanentTotal || 0,
      nonTeachingTotals.temporaryMale || 0,
      nonTeachingTotals.temporaryFemale || 0,
      nonTeachingTotals.temporaryOther || 0,
      nonTeachingTotals.temporaryTotal || 0,
      nonTeachingTotals.contractMale || 0,
      nonTeachingTotals.contractFemale || 0,
      nonTeachingTotals.contractOther || 0,
      nonTeachingTotals.contractTotal || 0,
      nonTeachingTotals.partTimeMale || 0,
      nonTeachingTotals.partTimeFemale || 0,
      nonTeachingTotals.partTimeOther || 0,
      nonTeachingTotals.partTimeTotal || 0,
      nonTeachingTotals.grandTotal || 0,
    ];

    teachingBody.push(nonTeachingTotalsRow);

    const tableStyles = {
      headStyles: headStyles,
      bodyStyles: {
        halign: "center",
        fontSize: tableFontSize,
      },
      columnStyles: {
        0: {
          halign: "left",
          cellWidth: tableWidth * 0.25,
        },
        17: {
          fontStyle: "bold",
        },
      },
      theme: "grid",
      margin: { top: 2, right: leftMargin, bottom: 5, left: leftMargin },
      styles: {
        overflow: "linebreak",
        cellPadding: 2,
      },
      tableWidth: tableWidth,
    };

    const teachingMergeConfig = [
      { row: 0, col: 1, rowSpan: 1, colSpan: 4 },
      { row: 0, col: 5, rowSpan: 1, colSpan: 4 },
      { row: 0, col: 9, rowSpan: 1, colSpan: 4 },
      { row: 0, col: 13, rowSpan: 1, colSpan: 4 },
      { row: 0, col: 0, rowSpan: 2, colSpan: 1 },
      { row: 0, col: 17, rowSpan: 2, colSpan: 1 },
    ];

    doc.autoTable({
      head: teachingHeaders,
      body: teachingBody,
      startY: yPosition,
      ...tableStyles,
      didParseCell: (data) => {
        if (data.section === "head") {
          for (const merge of teachingMergeConfig) {
            if (
              data.row.index === merge.row &&
              data.column.index === merge.col
            ) {
              data.cell.rowSpan = merge.rowSpan;
              data.cell.colSpan = merge.colSpan;
            }
          }
        }

        if (data.section === "body") {
          const isTotalRow = data.row.raw[0] === "Total";
          const totalCols = [4, 8, 12, 16, 17];

          if (isTotalRow || totalCols.includes(data.column.index)) {
            data.cell.styles.fontStyle = "bold";
          }

          if (isTotalRow) {
            data.cell.styles.fillColor = [240, 240, 240];
          }
        }
      },
    });

    yPosition = doc.autoTable.previous.finalY + 15;
    return yPosition;
  } catch (error) {
    console.error("Error generating staff PDF:", error);
    return yPosition + 10;
  }
}

// Resear Publication, Fellowship
export async function generateResearcherPDF(doc, pageIndex, researchData) {
  let yPosition = topMargin + 14;
  yPosition += 5;
  const sectionTitle = `${pageIndex}.1 Researcher Details:`;
  doc.setFontSize(11);
  doc.text(sectionTitle, leftMargin, yPosition);
  yPosition += 5;

  const mainHeaders = [
    [
      { content: "Researcher Details (Faculty Members)", colSpan: 4 },
      { content: "Particulars", colSpan: 5 },
    ],
  ];
  const subHeaders = [
    [
      "SNo",
      "Name",
      "Position",
      "Teaching Faculty",
      "Research Title",
      "Sponsoring Agency",
      "Grant Received",
      "Research Duration (days)",
      "Remarks",
    ],
  ];

  const rows =
    researchData?.length > 0
      ? researchData.map((item, index) => [
          index + 1,
          item.employeeName || "",
          item.postName || "",
          item.teachingFacultyName || "",
          item.activityTitle || "",
          item.fundedBy || "",
          item.fundedAmount || "",
          calculateDuration(item.startDate, item.endDate),
          item.remarks || "",
        ])
      : [];

  doc.autoTable({
    startY: yPosition,
    head: [...mainHeaders, ...subHeaders],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: tableFontSize,
      cellPadding: 2,
      halign: "center",
      valign: "middle",
    },
    margin: {
      top: 2,
      right: 10,
      bottom: 5,
      left: leftMargin,
    },
    headStyles: headStyles,
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { cellWidth: 15 }, // SNo - narrower
      1: { cellWidth: "auto" }, // Name
      2: { cellWidth: "auto" }, // Position
      3: { cellWidth: "auto" }, // Teaching Faculty
      4: { cellWidth: "auto" }, // Research Title
      5: { cellWidth: "auto" }, // Sponsoring Agency
      6: { cellWidth: "auto" }, // Grant Received
      7: { cellWidth: "auto" }, // Research Duration
      8: { cellWidth: "auto" }, // Remarks
    },
    didDrawPage: (data) => {
      yPosition = data.cursor.y + 10;
    },
  });

  // Add footnote
  doc.setFontSize(9);
  // Use setFont instead of setFontStyle for newer jsPDF versions
  doc.setFont(undefined, "italic");
  doc.text(
    "*: Please mention whether the Research is completed, ongoing, or in the pipeline etc.",
    leftMargin,
    yPosition
  );
  yPosition += 10;

  return yPosition;
}

export async function generatePublicationsPDF(
  doc,
  pageIndex,
  startY,
  publicationData
) {
  try {
    let yPosition = startY;
    const tableWidth = doc.internal.pageSize.width - (leftMargin + rightMargin);
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");

    // Title
    const title = `${pageIndex}.2 Researcher Publications`;
    doc.text(title, leftMargin, yPosition);
    yPosition += 5;

    // Table headers
    const headers = [
      [
        "S.No",
        "Name",
        "Post",
        "Faculty",
        "Publication Title",
        "Publication Date",
        "Name of Journals",
        "Remarks*",
      ],
    ];

    // Body rows
    const rows =
      publicationData.length > 0
        ? publicationData.map((item, idx) => [
            (idx + 1).toString(),
            item.employeeName || "",
            item.postName || "",
            item.teachingFacultyName || "",
            item.activityTitle || "",
            item.publishedDate || "",
            item.journalName || "",
            item.remarks || "",
          ])
        : [
            [
              {
                content: "No Data Available",
                colSpan: 8,
                styles: { halign: "center" },
              },
            ],
          ];

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: headStyles,
      bodyStyles: {
        fontSize: tableFontSize,
        halign: "center",
      },
      styles: {
        cellPadding: 2,
        overflow: "linebreak",
      },
      margin: {
        top: topMargin,
        bottom: bottomMargin,
        left: leftMargin,
        right: rightMargin,
      },
      tableWidth: tableWidth,
      columnStyles: {
        0: { cellWidth: tableWidth * 0.06 },
        1: { cellWidth: tableWidth * 0.13 },
        2: { cellWidth: tableWidth * 0.1 },
        3: { cellWidth: tableWidth * 0.12 },
        4: { cellWidth: tableWidth * 0.18 },
        5: { cellWidth: tableWidth * 0.13 },
        6: { cellWidth: tableWidth * 0.15 },
        7: { cellWidth: tableWidth * 0.13 },
      },
    });

    let finalY = doc.autoTable.previous?.finalY || yPosition;
    finalY += 10;
    if (finalY > pageHeight - bottomMargin - 15) {
      doc.addPage();
      finalY = topMargin;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "italic");

    const footnote =
      "*: Please mention whether the publication is Research Report or published refereed Journals/professional Journals/other Journal.";

    const splitFootnote = doc.splitTextToSize(
      footnote,
      doc.internal.pageSize.width - leftMargin - rightMargin
    );

    doc.text(splitFootnote, leftMargin, finalY);
    finalY += splitFootnote.length * 5;

    return finalY;
  } catch (error) {
    console.error("Error generating publications PDF:", error);
    return startY + 10;
  }
}

export async function generateCampusPubPDF(
  doc,
  pageIndex,
  startY,
  publicationData
) {
  try {
    let yPosition = startY;
    const tableWidth = doc.internal.pageSize.width - (leftMargin + rightMargin);
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");

    const title = `${pageIndex}.3 Campus Publications`;
    doc.text(title, leftMargin, yPosition);
    yPosition += 5;

    const headers = [
      [
        "Publication Title",
        "Publication Date",
        "Publication (e.g Professional, Memorial, Bulletin, Others - please specify)",
        "Publication Period (e.g Annual, Biannual, Others - please specify)",
      ],
    ];

    const rows =
      publicationData.length > 0
        ? publicationData.map((item) => [
            item.activityTitle || "",
            getDateOnly(item.publishedDate) || "",
            item.publicationType || "",
            item.publicationFrequency || "",
          ])
        : [
            [
              {
                content: "No Data Available",
                colSpan: 4,
                styles: { halign: "center" },
              },
              {},
              {},
              {},
            ],
          ];

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: headStyles,
      bodyStyles: {
        fontSize: tableFontSize,
        halign: "center",
      },
      styles: {
        cellPadding: 2,
        overflow: "linebreak",
      },
      margin: {
        top: topMargin,
        bottom: bottomMargin,
        left: leftMargin,
        right: rightMargin,
      },
      tableWidth: tableWidth,
      columnStyles: {
        0: { cellWidth: tableWidth * 0.25 },
        1: { cellWidth: tableWidth * 0.2 },
        2: { cellWidth: tableWidth * 0.3 },
        3: { cellWidth: tableWidth * 0.25 },
      },
    });

    let finalY = doc.autoTable.previous?.finalY || yPosition;
    finalY += 10;
    if (finalY > pageHeight - bottomMargin) {
      doc.addPage();
      finalY = topMargin;
    }
    return finalY;
  } catch (error) {
    console.error("Error generating campus publications PDF:", error);
    return startY + 10;
  }
}

export async function generateFellowshipPDF(
  doc,
  pageIndex,
  startY,
  fellowshipData
) {
  try {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const tableWidth = pageWidth - (leftMargin + rightMargin);

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");

    const title = `${pageIndex}.4 Faculty Member receiving Fellowship:`;
    doc.text(title, leftMargin, yPosition);
    yPosition += 5;

    const headers = [
      [
        {
          content: "Fellowship Faculty Members Details",
          colSpan: 4,
          styles: {
            halign: "center",
            fillColor: [42, 98, 154],
            textColor: 255,
          },
        },
        {
          content: "Particulars",
          colSpan: 6,
          styles: {
            halign: "center",
            fillColor: [42, 98, 154],
            textColor: 255,
          },
        },
      ],
      [
        "SNo",
        "Name",
        "Post",
        "Faculty",
        "Fellowship Duration",
        "Sponsoring Agency",
        "Fellowship Award Date",
        "Fellowship Duration",
        "Total Fellowship amount",
        "Total Fellowship amount (Rs.)",
      ],
    ];

    const rows =
      fellowshipData.length > 0
        ? fellowshipData.map((item, idx) => [
            idx + 1,
            item.employeeName || "",
            item.employeePosition || "",
            item.facultyName || "",
            item.employeeName || "",
            item.fundedBy || "",
            getDateOnly(item.fundedAt) || "",
            item.duration || "",
            item.fundedAmount || "",
            item.fundedAmount || "",
          ])
        : [
            [
              {
                content: "No Data Available",
                colSpan: 10,
                styles: { halign: "center" },
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
          ];

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: headStyles,
      bodyStyles: {
        fontSize: tableFontSize,
        halign: "center",
      },
      styles: {
        cellPadding: 2,
        overflow: "linebreak",
      },
      margin: {
        top: topMargin,
        bottom: bottomMargin,
        left: leftMargin,
        right: rightMargin,
      },
      tableWidth: tableWidth,
      columnStyles: {
        0: { cellWidth: tableWidth * 0.07 },
        1: { cellWidth: tableWidth * 0.13 },
        2: { cellWidth: tableWidth * 0.1 },
        3: { cellWidth: tableWidth * 0.1 },
        4: { cellWidth: tableWidth * 0.1 },
        5: { cellWidth: tableWidth * 0.1 },
        6: { cellWidth: tableWidth * 0.1 },
        7: { cellWidth: tableWidth * 0.1 },
        8: { cellWidth: tableWidth * 0.1 },
        9: { cellWidth: tableWidth * 0.1 },
      },
    });

    let finalY = doc.autoTable.previous?.finalY || yPosition;
    finalY += 10;
    if (finalY > pageHeight - bottomMargin - 20) {
      doc.addPage();
      finalY = topMargin;
    }

    // Footer note
    doc.setFontSize(10);
    doc.setFont(undefined, "italic");
    doc.text(
      "Does the campus have a Research Management Cell: Yes [ ]   No [ ]",
      leftMargin,
      finalY
    );
    finalY += 5;
    doc.text(
      "Note: Make additional copies of this form if necessary",
      pageWidth / 2,
      finalY,
      { align: "center" }
    );

    return finalY + 5;
  } catch (error) {
    console.error("Error generating fellowship PDF:", error);
    return startY + 10;
  }
}
// Infrastructure Details
export async function generateLandDetailsPDF(doc, pageIndex, landDetails) {
  try {
    let yPosition = topMargin + 14;
    const tableWidth = doc.internal.pageSize.width - (leftMargin + rightMargin);

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    yPosition += 5;
    const title = `${pageIndex}.1 Land details of campus`;
    doc.text(title, leftMargin, yPosition);
    yPosition += 2;

    const headers = [
      [
        "S.No",
        "Kitta No.",
        "Total Area (sq.ft)",
        "Area Unit",
        "Ownership",
        "Sheet No.",
        "Remarks",
      ],
    ];

    const rows = landDetails.map((item, i) => [
      (i + 1).toString(),
      item.kittaNo?.toString() || "",
      item.totalArea ? `${item.totalArea} sq. ft` : "",
      item.unit || "",
      item.ownerShip ? "Yes" : "No",
      item.sheetNo?.toString() || "",
      item.remarks || "",
    ]);

    const grandTotal = landDetails.reduce(
      (total, item) => total + Number(item.totalArea || 0),
      0
    );

    if (landDetails.length > 0) {
      rows.push(["", "Grand Total", `${grandTotal}`, "", "", "", ""]);
    } else {
      rows.push([
        {
          content: "No Data Available",
          colSpan: 7,
          styles: { halign: "center" },
        },
      ]);
    }

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: headStyles,
      bodyStyles: {
        fontSize: tableFontSize,
        halign: "center",
      },
      styles: {
        cellPadding: 2,
        overflow: "linebreak",
      },
      margin: {
        top: topMargin,
        bottom: bottomMargin,
        left: leftMargin,
        right: rightMargin,
      },
      tableWidth: tableWidth,
      columnStyles: {
        0: { cellWidth: tableWidth * 0.08 }, // S.No
        1: { cellWidth: tableWidth * 0.15 },
        2: { cellWidth: tableWidth * 0.2 },
        3: { cellWidth: tableWidth * 0.1 },
        4: { cellWidth: tableWidth * 0.15 },
        5: { cellWidth: tableWidth * 0.15 },
        6: { cellWidth: tableWidth * 0.17 },
      },
      didParseCell: function (data) {
        const isTotalRow =
          landDetails.length > 0 && data.row.raw[1] === "Grand Total";
        if (isTotalRow) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });

    let finalY = doc.autoTable.previous?.finalY || yPosition;
    finalY += 15;

    const pageHeight = doc.internal.pageSize.height;

    if (finalY > pageHeight - bottomMargin) {
      doc.addPage();
      finalY = topMargin;
    }

    return finalY;
  } catch (error) {
    console.error("Error generating land details PDF:", error);
    return startY + 10;
  }
}

export async function generateBuildingDetailsPDF(
  doc,
  pageIndex,
  startY,
  buildingData
) {
  try {
    let yPosition = startY;
    const tableWidth = doc.internal.pageSize.width - (leftMargin + rightMargin);
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");

    // Title
    const title = `${pageIndex}.2 Building details of campus`;
    doc.text(title, leftMargin, yPosition);
    yPosition += 5;

    // Headers
    const headers = [
      [
        "S.No",
        "Block No",
        "Area (sq.ft)",
        "No. of classroom",
        "Area (sq.ft)",
        "Ownership",
        "Has Internet Connection?",
        "Remarks",
      ],
    ];

    // Body rows
    const rows = buildingData.map((item, idx) => [
      (idx + 1).toString(),
      item.houseName || "",
      item.areaCoveredByBuilding?.toString() || "0",
      item.noOfClassrooms?.toString() || "0",
      item.areaCoveredByAllRooms?.toString() || "0",
      item.ownershipOfBuilding ? "Yes" : "No",
      item.hasInternetConnection ? "Yes" : "No",
      item.remarks || "",
    ]);

    // Grand totals
    const grandTotalOfBuilding = buildingData.reduce(
      (total, item) => total + Number(item.areaCoveredByBuilding || 0),
      0
    );
    const grandTotalOfRooms = buildingData.reduce(
      (total, item) => total + Number(item.areaCoveredByAllRooms || 0),
      0
    );
    const grandTotalOfClasses = buildingData.reduce(
      (total, item) => total + Number(item.noOfClassrooms || 0),
      0
    );

    if (buildingData.length > 0) {
      rows.push([
        "Grand Total",
        "",
        `${grandTotalOfBuilding}`,
        grandTotalOfClasses.toString(),
        `${grandTotalOfRooms}`,
        "",
        "",
        "",
      ]);
    } else {
      rows.push([
        {
          content: "No Data Available",
          colSpan: 8,
          styles: { halign: "center" },
        },
      ]);
    }

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: headStyles,
      bodyStyles: {
        fontSize: tableFontSize,
        halign: "center",
      },
      styles: {
        cellPadding: 2,
        overflow: "linebreak",
      },
      margin: {
        top: topMargin,
        bottom: bottomMargin,
        left: leftMargin,
        right: rightMargin,
      },
      tableWidth: tableWidth,
      columnStyles: {
        0: { cellWidth: tableWidth * 0.08 }, // S.No
        1: { cellWidth: tableWidth * 0.15 },
        2: { cellWidth: tableWidth * 0.12 },
        3: { cellWidth: tableWidth * 0.15 },
        4: { cellWidth: tableWidth * 0.12 },
        5: { cellWidth: tableWidth * 0.13 },
        6: { cellWidth: tableWidth * 0.15 },
        7: { cellWidth: tableWidth * 0.1 },
      },
      didParseCell: function (data) {
        const isTotalRow =
          buildingData.length > 0 && data.row.raw[0] === "Grand Total";
        if (isTotalRow) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });

    let finalY = doc.autoTable.previous?.finalY || yPosition;
    finalY += 15;

    if (finalY > pageHeight - bottomMargin) {
      doc.addPage();
      finalY = topMargin;
    }

    return finalY;
  } catch (error) {
    console.error("Error generating building details PDF:", error);
    return startY + 10;
  }
}

export async function generateLabDetailsPDF(doc, pageIndex, startY, labData) {
  let yPosition = startY;
  doc.setFontSize(11);
  doc.text(`${pageIndex}.3 Lab details of campus`, leftMargin, yPosition);
  yPosition += 4;

  const headers = [
    [
      "S.No",
      "Lab Name",
      "Building Name",
      "Area Covered",
      "Lab Type",
      "Adequacy ?",
      "Internet ?",
      "Equipments",
      "Remarks",
    ],
  ];

  const rows = labData.map((item, index) => [
    index + 1,
    item.labName || "",
    item.buildingName || "",
    item.areaCoveredByLab || "",
    item.labType || "",
    item.adequencyOfLabEquipment ? "Yes" : "No",
    item.hasInternetConnection ? "Yes" : "No",
    item.equipmentAtLab || "",
    item.remarks || "",
  ]);

  const totalArea = labData.reduce(
    (sum, item) => sum + Number(item.areaCoveredByLab || 0),
    0
  );

  if (labData.length > 0) {
    rows.push(["", "Grand Total", "", `${totalArea}`, "", "", "", "", ""]);
  }

  doc.autoTable({
    startY: yPosition,
    head: headers,
    body: rows,
    theme: "grid",
    styles: {
      fontSize: tableFontSize,
      cellPadding: 2,
    },
    margin: { top: 2, right: 10, bottom: 5, left: leftMargin },
    headStyles: headStyles,
    didDrawPage: (data) => {
      yPosition = data.cursor.y + 10;
    },
  });
  return yPosition;
}

export async function generateHostelDetailsPDF(doc, pageIndex, hostelData) {
  let yPosition = topMargin + 14;
  const sectionTitle = `${pageIndex}.4 Hostel details of campus`;

  const grandTotalOfRooms = hostelData?.reduce(
    (total, item) => total + Number(item.noOfRoomsInHostel || 0),
    0
  );
  const grandTotalOfSeats = hostelData.reduce(
    (total, item) => total + Number(item.noOfSeats || 0),
    0
  );
  const grandTotalOfArea = hostelData.reduce(
    (total, item) => total + Number(item.areaCoveredByHostel || 0),
    0
  );

  // Section Title
  doc.setFontSize(11);
  doc.text(sectionTitle, leftMargin, yPosition);
  yPosition += 4;

  const headers = [
    [
      "S.No",
      "Type",
      "Rooms",
      "Seats",
      "Area (sq.ft)",
      "Block",
      "Playground",
      "Internet",
      "Drinking Water",
      "Toilet",
      "Remarks",
    ],
  ];

  const rows = hostelData.map((item, index) => [
    index + 1,
    item.hostelType || "",
    item.noOfRoomsInHostel || "",
    item.noOfSeats || "",
    `${item.areaCoveredByHostel || ""}`,
    item.buildingId || "",
    item.hasPlayground ? "Yes" : "No",
    item.hasInternet ? "Yes" : "No",
    item.hasDrinkingWater ? "Yes" : "No",
    item.hasToilet ? "Yes" : "No",
    item.remarks || "",
  ]);

  // Grand total row
  if (hostelData.length > 0) {
    rows.push([
      "",
      "Grand Total",
      grandTotalOfRooms,
      grandTotalOfSeats,
      `${grandTotalOfArea}`,
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
  }

  doc.autoTable({
    startY: yPosition,
    head: headers,
    body: rows,
    theme: "grid",
    styles: {
      fontSize: tableFontSize,
      cellPadding: 2,
    },
    margin: {
      top: 2,
      right: 10,
      bottom: 5,
      left: leftMargin,
    },
    headStyles: headStyles,
    didDrawPage: (data) => {
      yPosition = data.cursor.y + 10;
    },
  });

  return yPosition;
}

export async function generateFacilityDetailsPDF(
  doc,
  pageIndex,
  startY,
  facilityData
) {
  let yPosition = startY;
  const sectionTitle = `${pageIndex}. Facility details of campus`;

  // Section Title
  doc.setFontSize(11);
  doc.text(sectionTitle, leftMargin, yPosition);
  yPosition += 4;

  const headers = [
    [
      "S.No",
      "Facility Type",
      "Facility Availability",
      "Adequacy of Facility",
      "Remarks",
    ],
  ];

  const rows = facilityData.map((item, index) => [
    index + 1,
    item.facilityType || "",
    item.facilityAvailability ? "Yes" : "No",
    item.adequacyOfFacility ? "Yes" : "No",
    item.remarks || "",
  ]);

  if (facilityData.length > 0) {
    rows.push(["", "Grand Total", "", "", ""]);
  }

  doc.autoTable({
    startY: yPosition,
    head: headers,
    body: rows,
    theme: "grid",
    styles: {
      fontSize: tableFontSize,
      cellPadding: 2,
    },
    margin: {
      top: 2,
      right: 10,
      bottom: 5,
      left: leftMargin,
    },
    headStyles: headStyles,
    didDrawPage: (data) => {
      yPosition = data.cursor.y + 10;
    },
  });

  return yPosition;
}

export async function generateEquipmentDetailsPDF(
  doc,
  pageIndex,
  startY,
  equipData
) {
  let yPosition = startY;
  const sectionTitle = `${pageIndex}.5 Equipment details of campus`;

  doc.setFontSize(11);
  doc.text(sectionTitle, leftMargin, yPosition);
  yPosition += 4;

  const grandTotalQuantity = equipData.reduce(
    (total, item) => total + Number(item.noOfQty),
    0
  );

  const headers = [
    [
      "S.No.",
      "Category",
      "Item Name",
      "Quantity",
      "Item Description",
      "Remarks",
    ],
  ];

  const rows = equipData.map((item, index) => [
    index + 1,
    item.itemType ? item.itemType.toUpperCase() : "",
    item.itemName || "",
    `${item.noOfQty} Qty.`,
    item.itemDescription || "",
    item.remarks || "",
  ]);

  if (equipData.length > 0) {
    rows.push(["", "Grand Total", "", `${grandTotalQuantity} Qty.`, "", ""]);
  }

  doc.autoTable({
    startY: yPosition,
    head: headers,
    body: rows,
    theme: "grid",
    styles: {
      fontSize: tableFontSize,
      cellPadding: 2,
    },
    margin: {
      top: 2,
      right: 10,
      bottom: 5,
      left: leftMargin,
    },
    headStyles: headStyles,
    didDrawPage: (data) => {
      yPosition = data.cursor.y + 10;
    },
  });

  return yPosition;
}

// Financial Details
export function generateActualFinancePDF(doc, { index, fiscalYear, income, operatingExpenditure, capitalExpenditure, bankDetails }) {
  const leftMargin = 10;
  const rightMargin = 10;
  const topMargin = 10;
  const bottomMargin = 10;

  let yPosition = topMargin + 14;
  const tableWidth = doc.internal.pageSize.getWidth() - (leftMargin + rightMargin);

  try {
    // Calculate totals
    const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalOperating = operatingExpenditure.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalCapital = capitalExpenditure.reduce((sum, item) => sum + (item.amount || 0), 0);

    // Unified data mapping
    const maxLength = Math.max(
      income.length,
      operatingExpenditure.length,
      capitalExpenditure.length
    );

    const tableBody = [];

    for (let i = 0; i < maxLength; i++) {
      const row = [
        income[i]?.headName?.headName || '',
        formatNumber(income[i]?.amount || 0),
        operatingExpenditure[i]?.headName?.headName || '',
        formatNumber(operatingExpenditure[i]?.amount || 0),
        capitalExpenditure[i]?.headName?.headName || '',
        formatNumber(capitalExpenditure[i]?.amount || 0)
      ];
      tableBody.push(row);
    }

    // Add Grand Total Row
    tableBody.push([
      {
        content: 'Grand Total',
        styles: { fontStyle: 'bold', halign: 'left' }
      },
      {
        content: formatNumber(totalIncome),
        styles: { fontStyle: 'bold', halign: 'right' }
      },
      {
        content: '',
        styles: { fillColor: [255, 255, 255] }
      },
      {
        content: formatNumber(totalOperating),
        styles: { fontStyle: 'bold', halign: 'right' }
      },
      {
        content: '',
        styles: { fillColor: [255, 255, 255] }
      },
      {
        content: formatNumber(totalCapital),
        styles: { fontStyle: 'bold', halign: 'right' }
      }
    ]);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    doc.text(`${index}.1 Actual Financial Status in Last F.Y: ${fiscalYear}`, leftMargin, yPosition);
    yPosition += 10;

    // Generate table
    autoTable(doc, {
      startY: yPosition,
      head: [
        [
          { content: 'Sources of Income', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Amount (Rs.)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Total Expenditures', colSpan: 4, styles: { halign: 'center' } }
        ],
        [
          { content: 'Operating Costs', styles: { halign: 'center' } },
          { content: 'Amount', styles: { halign: 'center' } },
          { content: 'Capital Expenditure', styles: { halign: 'center' } },
          { content: 'Amount', styles: { halign: 'center' } }
        ]
      ],
      body: tableBody,
      styles: {
        fontSize: 9,
        cellPadding: 2,
        cellWidth: 'wrap'
      },
      headStyles,
      theme: 'grid',
      tableWidth,
      margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Bank Account Details:', leftMargin, finalY);
    
    const bankLines = [
      `a) Bank Name: ${bankDetails?.name || ''}`,
      `b) Branch: ${bankDetails?.branch || ''}`,
      `c) Account No: ${bankDetails?.accountNo || ''}`,
      `d) Account Type: ${getAccountType(bankDetails)}`
    ];

    bankLines.forEach((line, idx) => {
      doc.setFont(undefined, 'normal');
      doc.text(line, leftMargin + 5, finalY + 7 + (idx * 6));
    });

    return finalY + bankLines.length * 6 + 10;
  } catch (error) {
    console.error('Error generating finance PDF:', error);
    return yPosition + 10;
  }
}

function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
}

function getAccountType(details) {
  if (details.accountType) return details.accountType;
  if (details.isCurrent) return 'Current';
  if (details.isSaving) return 'Saving';
  return 'Other';
}

export function transformAnnualData(apiResponse) {
  const result = {};
  apiResponse.counts.forEach((levelData) => {
    const { level, faculty, programs } = levelData;
    programs.forEach((program) => {
      const { programName, yearCategoryCounts } = program;
      const programKey = `${level}-${faculty}-${programName}`;
      const tableData = {
        programName,
        level,
        faculty,
        headers: apiResponse.categories,
        rows: [],
      };
      yearCategoryCounts.forEach((counts, index) => {
        const yearLabel = apiResponse.year[index] || `Year ${index + 1}`;
        tableData.rows.push({
          year: yearLabel,
          counts: counts,
        });
      });
      result[programKey] = tableData;
    });
  });
  return result;
}

export function transformSemesterData(apiResponse) {
  const result = {};
  apiResponse.counts.forEach((levelData) => {
    const { level, faculty, programs } = levelData;
    programs.forEach((program) => {
      const { programName, semesterCategoryCounts } = program;
      const programKey = `${level}-${faculty}-${programName}`;
      const tableData = {
        programName,
        level,
        faculty,
        headers: apiResponse.categories,
        rows: [],
      };
      semesterCategoryCounts.forEach((counts, index) => {
        const semesterLabel =
          apiResponse.semesters[index] || `Semester ${index + 1}`;
        tableData.rows.push({
          semester: semesterLabel,
          counts: counts,
        });
      });
      result[programKey] = tableData;
    });
  });
  return result;
}

export const useBulkIdPrint = ({ orientation, componentRef }) => {
  const handlePrint = () => {
    if (!componentRef?.current) return;

    const printArea = document.createElement("div");
    printArea.innerHTML = componentRef.current.innerHTML;
    printArea.classList.add("print-container");
    document.body.appendChild(printArea);

    const style = document.createElement("style");

    style.textContent = `
    @page {
      size: ${
        orientation === "landscape"
          ? "A4 landscape"
          : orientation === "jmcOriginal"
          ? "A4 portrait"
          : "A4 portrait"
      };
      margin: ${orientation === "landscape" ? "5mm 4mm" : "8mm 5mm"};
    }

    @media print {
      * {
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        margin: 0 !important;
        padding: 0 !important;
        font-family: 'Times New Roman', Times, serif !important;
        background: white !important;
      }

      body * {
        visibility: hidden;
      }

      .print-container,
      .print-container * {
        visibility: visible;
      }

      .print-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100% !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: ${orientation === "landscape" ? "10px" : "12px"} !important;
        justify-content: ${
          orientation === "portrait" ? "center" : "flex-start"
        } !important;
        background: white !important;
      }

      .id-card {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        flex: 0 0 auto !important;
      }

      ${
        orientation === "landscape"
          ? `
        .id-card {
          width: 86mm !important;
          height: 54mm !important;
          background-color: #dee8f2 !important;
          border-radius: 3mm !important;
          padding: 5px !important;
          border: 2px solid #2b6eb5 !important;
          margin: 3px !important;
        }
      `
          : ""
      }

      ${
        orientation === "portrait"
          ? `
        .id-card {
          width: 54mm !important;
          height: 86mm !important;
          border: 1px solid #2b6eb5 !important;
          margin: 5px !important;
        }
      `
          : ""
      }

      ${
        orientation === "jmcOriginal"
          ? `
        .id-card {
          width: 54mm !important;
          height: 86mm !important;
          border: 2px solid #2b6eb5 !important;
          border-radius: 8px !important;
          background-color: #ffdada !important;
          margin: 4px !important;
        }
      `
          : ""
      }

      img {
        max-width: 100% !important;
        height: auto !important;
      }

      .no-print {
        display: none !important;
      }
    }
    `;

    document.head.appendChild(style);
    window.print();

    window.onafterprint = () => {
      document.body.removeChild(printArea);
      document.head.removeChild(style);
    };
  };

  return handlePrint;
};

