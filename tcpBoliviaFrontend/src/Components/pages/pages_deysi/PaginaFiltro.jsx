import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import "../../../Styles/Styles_deysi/Inicio.css";
import "../../../Styles/Styles_deysi/mapaBo.css";
import Descargas from './Desgargas';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const PaginaFiltro = () => {
  const [chartData1, setChartData1] = useState({ labels: [], datasets: [] });
  const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [totalCases, setTotalCases] = useState(0);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('chart');
  const [chartType, setChartType] = useState('bar');
  const [currentChart, setCurrentChart] = useState('chart1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsResponse = await axios.get('http://localhost:8000/api/departamentos');
        setDepartments(departmentsResponse.data);

        const casesResponse = await axios.get('http://localhost:8000/api/casos', { params: { order: 'asc' } });
        formatChartData1(casesResponse.data);

      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    try {
      const response = await axios.get('http://localhost:8000/api/casos', {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartData1(response.data);

      const municipioResponse = await axios.get('http://localhost:8000/api/casos/municipios', {
        params: { departamento_id: departmentId }
      });
      formatChartData2(municipioResponse.data);

    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
  };

  const formatChartData1 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => item.departamento);
    const counts = data.map(item => item.cantidad_casos);
    const total = counts.reduce((acc, curr) => acc + curr, 0);

    setTotalCases(total);
    setChartData1({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });
  };

  const formatChartData2 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => item.municipio);
    const counts = data.map(item => item.cantidad_de_casos);

    setChartData2({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos por Municipio',
          data: counts,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    });
  };

  const renderTable = () => {
    if (currentChart === 'chart1') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Departamento</th>
              <th>Cantidad de Casos</th>
            </tr>
          </thead>
          <tbody>
            {chartData1.labels.map((label, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{chartData1.datasets[0]?.data[index] ?? 0}</td> {/* Usando el operador de encadenamiento opcional */}
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{totalCases}</strong></td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Municipio</th>
              <th>Cantidad de Casos</th>
            </tr>
          </thead>
          <tbody>
            {chartData2.labels.map((label, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{chartData2.datasets[0]?.data[index] ?? 0}</td> {/* Usando el operador de encadenamiento opcional */}
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{chartData2.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
            </tr>
          </tbody>
        </table>
      );
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h3 className="font-weight-bold mb-0"><i className="fa fa-filter"></i> Filtrar Resultado de casos y resoluciones</h3>
          <a href="/Inicio" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>

        <select onChange={handleDepartmentChange} value={selectedDepartment} className="select-departamento">
          <option value=''>Todos los departamentos</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>{department.nombre}</option>
          ))}
        </select>

        <div className="view-toggle">
          <button id='GraficoDatos' onClick={() => setViewType('chart')} className={viewType === 'chart' ? 'active' : ''}>Gráfica</button>
          <button id='TablaDatos' onClick={() => setViewType('table')} className={viewType === 'table' ? 'active' : ''}>Tabla</button>
        </div>

        <select onChange={(e) => setChartType(e.target.value)} value={chartType} className="select-grafico">
          <option value='bar'>Gráfico de Barras</option>
          <option value='line'>Gráfico de Líneas</option>
          <option value='pie'>Gráfico Circular</option>
        </select>

        <select onChange={(e) => setCurrentChart(e.target.value)} value={currentChart} className="select-grafico">
          <option value='chart1'>Gráfico por Departamento</option>
          <option value='chart2'>Gráfico por Municipio</option>
        </select>

        <div className="contenedor-dinamico-cuadro">
          {viewType === 'chart' ? (
            <div>
              <div className="chart-container">
                {currentChart === 'chart1' && (
                  <>
                    {chartType === 'bar' && <Bar data={chartData1} />}
                    {chartType === 'line' && <Line data={chartData1} />}
                    {chartType === 'pie' && <Pie data={chartData1} />}
                    <p className="chart-description">
                      "Este gráfico presenta la cantidad total de casos reportados por departamento..."
                    </p>
                  </>
                )}
                {currentChart === 'chart2' && (
                  <>
                    {chartType === 'bar' && <Bar data={chartData2} />}
                    {chartType === 'line' && <Line data={chartData2} />}
                    {chartType === 'pie' && <Pie data={chartData2} />}
                    <p className="chart-description">
                      "Gráfico de casos por municipio."
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            renderTable()
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaFiltro;
