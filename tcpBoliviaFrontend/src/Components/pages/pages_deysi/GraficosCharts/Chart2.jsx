import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

const Chart2 = ({ chartData, chartType }) => {
  return (
    <div className="chart-container">
      {chartType === 'bar' && <Bar data={chartData} />}
      {chartType === 'line' && <Line data={chartData} />}
      {chartType === 'pie' && <Pie data={chartData} />}
      <p className="chart-description">"Gráfico de casos por municipio."</p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Municipio</th>
            <th>Cantidad de Casos</th>
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

export default Chart2;
