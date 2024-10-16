import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

const Chart3 = ({ chartData }) => {
  return (
    <div className="chart-container">
      {chartType === 'bar' && <Bar data={chartData} />}
      {chartType === 'line' && <Line data={chartData} />}
      {chartType === 'pie' && <Pie data={chartData} />}
      <p className="chart-description">"Cantidad de Resoluciones por Departamento..."</p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Departamento - Tipo Resolución - Subtipo Resolución</th>
            <th>Cantidad de Resoluciones</th>
          </tr>
        </thead>
        <tbody>
          {chartData.labels.map((label, index) => (
            <tr key={index}>
              <td>{label}</td>
              <td>{chartData.datasets[0]?.data[index] ?? 0}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>{chartData.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Chart3;
