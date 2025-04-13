import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Slider
} from '@mui/material';

export default function DataTable({
  tinggiBenda, setTinggiBenda,
  jarakBenda, setJarakBenda,
  titikFokus, setTitikFokus,
  tinggiBayangan, jarakBayangan
}) {
  const adjustableRows = [
    {
      label: 'Ukuran Benda (cm)',
      value: tinggiBenda,
      setValue: setTinggiBenda,
      min: 0,
      max: 300,
    },
    {
      label: 'Jarak Benda (cm)',
      value: jarakBenda,
      setValue: setJarakBenda,
      min: 1, // prevent division by 0
      max: 300,
    },
    {
      label: 'Titik Fokus Lensa (cm)',
      value: titikFokus,
      setValue: setTitikFokus,
      min: -100,
      max: 100,
    }
  ];

  const resultRows = [
    { label: 'Ukuran Bayangan (cm)', value: tinggiBayangan },
    { label: 'Jarak Bayangan (cm)', value: jarakBayangan },
  ];

  const renderSlider = ({ value, setValue, min, max }) => (
    <Slider
      value={value}
      onChange={(e, newVal) => setValue(newVal)}
      min={min}
      max={max}
      valueLabelDisplay="auto"
      sx={{ width: 150, color: 'red' }}
    />
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        p: 2,
        maxWidth: 1000,
        height: 400,
        backgroundColor: 'black',
        overflowY: 'auto'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Value</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Adjust</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...adjustableRows, ...resultRows].map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ color: 'white' }}>{row.label}</TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                {typeof row.value === 'number'
                  ? isFinite(row.value)
                    ? row.value.toFixed(2)
                    : '∞'
                  : row.value}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {row.setValue ? renderSlider(row) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
