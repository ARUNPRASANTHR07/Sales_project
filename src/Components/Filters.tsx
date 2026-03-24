import React from "react";
import { Grid, TextField, MenuItem, Button, Box, Typography, Paper } from "@mui/material";

export default function Filters() {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <Grid container spacing={2}>
        <Grid >
          <TextField fullWidth label="From Date" type="date" InputLabelProps={{ shrink: true }} />
        </Grid>

        <Grid >
          <TextField fullWidth label="To Date" type="date" InputLabelProps={{ shrink: true }} />
        </Grid>

        <Grid >
          <TextField select fullWidth label="Channel" defaultValue="CEMENT">
            <MenuItem value="CEMENT">CEMENT</MenuItem>
            <MenuItem value="DRYMIX">DRYMIX</MenuItem>
            <MenuItem value="CCD">CCD</MenuItem>
          </TextField>
        </Grid>

        <Grid >
          <TextField select fullWidth label="State" defaultValue="%">
            <MenuItem value="%">All</MenuItem>
            <MenuItem value="TAMIL NADU">Tamil Nadu</MenuItem>
            <MenuItem value="KERALA">Kerala</MenuItem>
          </TextField>
        </Grid>

        <Grid >
          <TextField select fullWidth label="Trade Type" defaultValue="%">
            <MenuItem value="%">All</MenuItem>
            <MenuItem value="EXCL">Excl</MenuItem>
            <MenuItem value="INCL">Incl</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box mt={3} textAlign="right">
        <Button variant="contained" color="primary">
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
}
