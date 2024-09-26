import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Button, Input, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Papa from 'papaparse';

const FormularioExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now()); // Clave para reiniciar el input

  // Manejar el cambio de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsFileUploaded(false); // Resetear el estado para permitir nuevos archivos

    // Verificar el tipo de archivo y procesar
    if (file) {
      if (file.type.includes('csv')) {
        handleCSV(file);
      } else if (file.type.includes('sheet') || file.type.includes('excel')) {
        handleExcel(file);
      } else {
        alert('Formato de archivo no soportado. Seleccione un archivo CSV o Excel.');
      }
    }
  };

  // Procesar archivo CSV
  const handleCSV = (file) => {
    Papa.parse(file, {
      complete: (results) => {
        console.log('CSV Data:', results.data); // Debugging
        setFileData(results.data);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  // Procesar archivo Excel
  const handleExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('Excel Data:', jsonData); // Debugging
      setFileData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Enviar archivo a la base de datos
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsFileUploaded(true);
      alert('Archivo subido exitosamente.');
      console.log(response.data);

      // Limpiar campos después de la carga exitosa
      setSelectedFile(null);
      setFileData([]);
      setIsFileUploaded(false);
      setInputKey(Date.now()); // Actualizar la clave del input
    } catch (error) {
      console.error('Error subiendo el archivo:', error);
      alert(`Error al subir el archivo: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Subir Archivo Excel o CSV
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Input
            key={inputKey} // Clave única para reiniciar el input
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: '.xls, .xlsx, .csv' }}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            disabled={!selectedFile || isFileUploaded}
            sx={{
              backgroundColor: '#6c1b30', // Color primario
              '&:hover': {
                backgroundColor: '#4a1b24', // Color más oscuro para hover
              },
            }}
          >
            Subir Archivo
          </Button>
        </Box>
      </Box>

      {/* Previsualización de datos */}
      {fileData.length > 0 && (
        <Box sx={{ flex: 1, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ p: 1 }}>
            Vista Previa del Archivo:
          </Typography>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {fileData[0].map((col, index) => (
                  <TableCell 
                    key={`header-${index}`} 
                    sx={{ 
                      backgroundColor: '#f5f5f5', 
                      fontWeight: 'bold', 
                      border: '1px solid #ddd' 
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {fileData.slice(1).map((row, rowIndex) => (
                <TableRow 
                  key={`row-${rowIndex}`} 
                  sx={{ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } }}
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell 
                      key={`cell-${rowIndex}-${cellIndex}`} 
                      sx={{ border: '1px solid #ddd' }}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default FormularioExcel;
