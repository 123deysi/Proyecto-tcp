import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoAvanzada = () => {
  // Estado para seleccionar el filtro y los datos dinámicos
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('departamento');
  const [datosGrafico, setDatosGrafico] = useState({ labels: [], data: [] });

  // Simulación de datos según las opciones seleccionadas
  const dataPorDepartamento = {
    labels: ['Dept 1', 'Dept 2', 'Dept 3', 'Dept 4'],
    data: [15, 30, 45, 20] // Cantidad de casos
  };

  const dataPorSala = {
    labels: ['Sala 1', 'Sala 2', 'Sala 3'],
    data: [20, 25, 50]
  };

  const dataPorPeriodo = {
    labels: ['2019', '2020', '2021', '2022'],
    data: [10, 35, 40, 30]
  };

  // Actualiza los datos según la opción seleccionada
  useEffect(() => {
    switch (opcionSeleccionada) {
      case 'departamento':
        setDatosGrafico(dataPorDepartamento);
        break;
      case 'sala':
        setDatosGrafico(dataPorSala);
        break;
      case 'periodo':
        setDatosGrafico(dataPorPeriodo);
        break;
      default:
        setDatosGrafico({ labels: [], data: [] });
    }
  }, [opcionSeleccionada]);

  const data = {
    labels: datosGrafico.labels, // Etiquetas dinámicas para eje X
    datasets: [
      {
        label: 'Cantidad de Casos',
        data: datosGrafico.data, // Datos dinámicos para eje Y
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Cantidad de Casos por ' + opcionSeleccionada.charAt(0).toUpperCase() + opcionSeleccionada.slice(1)
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de Casos'
        }
      },
      x: {
        title: {
          display: true,
          text: opcionSeleccionada.charAt(0).toUpperCase() + opcionSeleccionada.slice(1)
        }
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <FormControl variant="outlined" style={{ marginBottom: '20px' }}>
        <InputLabel>Seleccionar Por</InputLabel>
        <Select
          value={opcionSeleccionada}
          onChange={(e) => setOpcionSeleccionada(e.target.value)}
          label="Seleccionar Por"
        >
          <MenuItem value="departamento">Departamento</MenuItem>
          <MenuItem value="sala">Sala</MenuItem>
          <MenuItem value="periodo">Periodo</MenuItem>
        </Select>
      </FormControl>

      {/* Renderizar gráfico de barras */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default GraficoAvanzada;
