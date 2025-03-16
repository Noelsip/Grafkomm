import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, number) {
    return { name, number };
}

export default function BasicTable(props) {
    const jarakBenda = props.jarakBenda
    const tinggiBenda = props.tinggiBenda
    const titikFokus = props.titikFokus
    const jarakBayangan = props.jarakBayangan
    const tinggiBayangan = props.tinggiBayangan

    const rows = [
        createData('Ukuran Benda', tinggiBenda),
        createData('Jarak Benda', jarakBenda),
        createData('Titik Fokus Lensa', titikFokus),
        createData('Ukuran Bayangan', jarakBayangan),
        createData('Jarak Bayangan', tinggiBayangan),
    ];

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Data</TableCell>
                <TableCell align="right"></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.number}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}