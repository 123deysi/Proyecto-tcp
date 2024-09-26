import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const data = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
      {
        type: 'bar',
        label: 'Grupo O',
        data: [50, 30, 40, 60],
        backgroundColor: '#FF553D',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: 'accion de defensa',
        data: [30, 20, 50, 30],
        backgroundColor: '#A5FF67',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: 'Accion de inconstitucional',
        data: [20, 40, 30, 50],
        backgroundColor: '#40D2FF',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: 'Accion de consulta',
        data: [10, 10, 20, 15],
        backgroundColor: '#FFDB5C',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: 'Accion de conflicto',
        data: [10, 10, 20, 15],
        backgroundColor: '#FFDB5C',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: 'Accion de recursos',
        data: [10, 10, 20, 15],
        backgroundColor: '#FFDB5C',
        stack: 'Stack 0',
      },
      {
        type: 'line',
        label: 'Promedio Prevalencia',
        data: [40, 25, 35, 45],
        borderColor: '#000000',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        title: {
          display: true,
          text: 'Prevalencia',
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Promedio Prevalencia',
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'top',
      },
    },
    responsive: true,
  };

  return (
    <div>
      <h2>Gráfico de Barras Apiladas y Línea</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
