import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from "@mui/material";

export default function SalesTable() {
  const rows = [
    { customer: "M03639", qty: 120.5, value: 250000, month: "Apr-25", day: 10, product: "DRY MIX" },
    { customer: "M01234", qty: 90.2, value: 185000, month: "Apr-25", day: 11, product: "CEMENT" },
  ];

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Sales Trend Results
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="center">Month</TableCell>
              <TableCell align="center">Day</TableCell>
              <TableCell>Product</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i} hover>
                <TableCell>{r.customer}</TableCell>
                <TableCell align="right">{r.qty}</TableCell>
                <TableCell align="right">{r.value.toLocaleString()}</TableCell>
                <TableCell align="center">{r.month}</TableCell>
                <TableCell align="center">{r.day}</TableCell>
                <TableCell>{r.product}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
