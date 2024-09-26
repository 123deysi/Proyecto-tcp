import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import "../../../Styles/Styles_deysi/Grafico.css";

// Registrar todos los componentes necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const GraficoCasos = () => {
  const [tipoGrafico, setTipoGrafico] = useState('bar'); // Estado para el tipo de gráfico

  // Datos simulados
  const datosFiltrados = Array.from({ length: 10 }, (_, index) => ({
    año: 2018 + index,
    cantidad_casos: Math.floor(Math.random() * 500), // Genera un número aleatorio de casos entre 0 y 500
    cantidad_resoluciones: Math.floor(Math.random() * 300), // Genera un número aleatorio de resoluciones entre 0 y 300
  }));
  
  // Arrays de colores personalizados para las barras y líneas
  const coloresCasos = ['#77bab5'];
  const coloresResoluciones = ['#a0425e']; //guindo

  const datosGrafico = {
    labels: datosFiltrados.map((item) => item.año),
    datasets: [
      {
        label: 'Cantidad de Casos',
        backgroundColor: tipoGrafico === 'bar' ? coloresCasos : 'transparent',
        borderColor: coloresCasos,
        borderWidth: tipoGrafico === 'bar' ? 1 : 2,
        hoverBackgroundColor: coloresCasos,
        hoverBorderColor: coloresCasos,
        data: datosFiltrados.map((item) => item.cantidad_casos),
        type: tipoGrafico === 'bar' ? 'bar' : 'line', // Cambia el tipo de gráfico según el estado
      },
      {
        label: 'Cantidad de Resoluciones',
        backgroundColor: tipoGrafico === 'bar' ? coloresResoluciones : 'transparent',
        borderColor: coloresResoluciones,
        borderWidth: tipoGrafico === 'bar' ? 1 : 2,
        hoverBackgroundColor: coloresResoluciones,
        hoverBorderColor: coloresResoluciones,
        data: datosFiltrados.map((item) => item.cantidad_resoluciones),
        type: tipoGrafico === 'bar' ? 'bar' : 'line', // Cambia el tipo de gráfico según el estado
      },
    ],
  };

  const opcionesGrafico = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: '#f8f9fa',
        titleColor: '#333',
        bodyColor: '#333',
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 14,
          },
          padding: 10,
        },
        title: {
          display: true,
          text: 'Año',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
      y: {
        ticks: {
          color: '#333',
          font: {
            size: 14,
          },
          padding: 10,
        },
        title: {
          display: true,
          text: 'Cantidad',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
    },
    barThickness: tipoGrafico === 'bar' ? 20 : undefined,
  };

  return (
    <div className="container-grafico">
      <button 
        className="change-chart-type"
        onClick={() => setTipoGrafico(tipoGrafico === 'bar' ? 'line' : 'bar')}
      >
        Cambiar a {tipoGrafico === 'bar' ? 'Gráfico de Líneas' : 'Gráfico de Barras'}
      </button>

      <div style={{ width: '100%', maxWidth: '1000px', height: '400px' }}>
        {tipoGrafico === 'bar' ? (
          <Bar data={datosGrafico} options={opcionesGrafico} />
        ) : (
          <Line data={datosGrafico} options={opcionesGrafico} />
        )}
      </div>

      <div className="graph-description">
        <p className="description-text">Casos y resoluciones por año.</p>
        <p className="source-text">Fuente: Tribunal Constitucional Plurinacional de Bolivia.</p>
      </div>
    </div>
  );
};

export default GraficoCasos;
