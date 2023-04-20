import React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";


export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  minWidth: "100px",
  textAlignLast: "center",
  [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding:"16px 0"
  }
}));