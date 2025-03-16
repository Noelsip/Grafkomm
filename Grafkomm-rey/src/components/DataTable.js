import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';

export default function DataTable({ 
  tinggiBenda, setTinggiBenda, 
  jarakBenda, setJarakBenda, 
  titikFokus, setTitikFokus, 
  tinggiBayangan, jarakBayangan 
}) {
  const rows = [
    { label: 'Ukuran Benda (cm)', value: tinggiBenda, setValue: setTinggiBenda, min: 0, max: 300 },
    { label: 'Jarak Benda (cm)', value: jarakBenda, setValue: setJarakBenda, min: 0, max: 300 },
    { label: 'Titik Fokus Lensa (cm)', value: titikFokus, setValue: setTitikFokus, min: -100, max: 100 },
    { label: 'Ukuran Bayangan (cm)', value: tinggiBayangan },
    { label: 'Jarak Bayangan (cm)', value: jarakBayangan },
  ];

  return (
    <TableContainer component={Paper} sx={{ p: 2, maxWidth: 1000, height: 400, backgroundColor: 'black' }}>
      <Table aria-label="data table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'white' }}><strong>Data</strong></TableCell>
            <TableCell sx={{ color: 'white', textAlign: 'center' }}><strong>Value</strong></TableCell>
            <TableCell sx={{ color: 'white', textAlign: 'center' }}><strong>Adjust</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ color: 'white' }}>{row.label}</TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>{row.value}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {row.setValue ? (
                  <Slider
                    value={row.value}
                    onChange={(e, newValue) => row.setValue(newValue)}
                    min={row.min}
                    max={row.max}
                    sx={{ width: 120, color: 'red' }}
                  />
                ) : ('-')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
