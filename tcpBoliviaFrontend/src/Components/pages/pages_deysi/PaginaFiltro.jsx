import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import "../../../Styles/Styles_deysi/Inicio.css";
import "../../../Styles/Styles_deysi/mapaBo.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const PaginaFiltro = () => {
  const [chartData1, setChartData1] = useState({ labels: [], datasets: [] });
  const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });
  const [chartData3, setChartData3] = useState({ labels: [], datasets: [] });
  const [chartData4, setChartData4] = useState({ labels: [], datasets: [] });
  const [chartData5, setChartData5] = useState({ labels: [], datasets: [] });

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [totalCases, setTotalCases] = useState(0);
  const [error, setError] = useState(null);
  const [accionConst2Options, setAccionConst2Options] = useState([]);
  const [selectedAccionConst2, setSelectedAccionConst2] = useState('');
  const [viewType, setViewType] = useState('chart');
  const [chartType, setChartType] = useState('bar');
  const [currentChart, setCurrentChart] = useState('chart1');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [originalChartData4, setOriginalChartData4] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener departamentos y casos
        const departmentsResponse = await axios.get('http://localhost:8000/api/departamentos');
        setDepartments(departmentsResponse.data);
        const casesResponse = await axios.get('http://localhost:8000/api/casos', { params: { order: 'asc' } });
        formatChartData1(casesResponse.data);
        const municipioResponse = await axios.get('http://localhost:8000/api/casos/municipios', { params: { order: 'asc' } });
        formatChartData2(municipioResponse.data);
        // Obtener resoluciones por departamento y tipo
        const resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/departamento-tipo');
        formatChartData3(resolucionesResponse.data);
        // Obtener cantidad de resoluciones por año y mes
        const resolucionesPorFechaResponse = await axios.get('http://localhost:8000/api/resoluciones/por-fecha'); // Cambia la URL según sea necesario
        formatChartData4(resolucionesPorFechaResponse.data);

        // Obtener años únicos para el select de años
        const uniqueYears = [...new Set(resolucionesPorFechaResponse.data.map(item => item.anio))];
        setYears(uniqueYears);
        // Obtener resoluciones por accion_const y accion_const2
        const resolucionesPorAccionConstResponse = await axios.get('http://localhost:8000/api/resoluciones/por-accion-constitucional');
        formatChartData5(resolucionesPorAccionConstResponse.data);
        // Cargar opciones para el select de acción constitucional 2
        const accionConst2Response = await axios.get('http://localhost:8000/api/acciones-constitucionales'); // Asegúrate de que esta URL sea correcta
        setAccionConst2Options(accionConst2Response.data);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }
    };
  
    fetchData();
  }, []);
  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    // console.log('Selected Department:', departmentId);
    setSelectedDepartment(departmentId);
    try {
      // Filtrar casos por departamento
      const casesResponse = await axios.get('http://localhost:8000/api/casos', {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartData1(casesResponse.data);
      // Filtrar municipios por departamento
      const municipioResponse = await axios.get('http://localhost:8000/api/casos/municipios', {
        params: { departamento_id: departmentId }
      });
      formatChartData2(municipioResponse.data);
        // Obtener resoluciones por departamento para el gráfico 3
        const resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/departamento-tipo', {
          params: departmentId ? { departamento_id: departmentId } : {}
      });
      console.log('Resoluciones Response Data:', resolucionesResponse.data);
      formatChartData3(resolucionesResponse.data);
      // console.log('Resoluciones Response Data:', resolucionesResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
  };
  const handleYearChange = (e) => {
      const year = e.target.value;
      setSelectedYear(year);
      if (year) {
          // Filtrar datos de resoluciones por fecha según el año seleccionado
          const filteredData = chartData4.datasets[0].data.filter((item, index) => {
              const labelYear = chartData4.labels[index].split(' - ')[0]; // Obtiene el año de la etiqueta
              return labelYear === year; // Compara con el año seleccionado
          });
          const filteredLabels = chartData4.labels.filter((label) => label.startsWith(year));
          setChartData4({
              labels: filteredLabels,
              datasets: [
                  {
                      label: 'Cantidad de Resoluciones por Fecha',
                      data: filteredData,
                      backgroundColor: 'rgba(255, 206, 86, 0.6)',
                  },
              ],
          });
      } else {
          // Si se seleccionan "Todos los años", restablecer chartData4 a su estado original
          setChartData4(originalChartData4); // originalChartData4 debe contener todos los datos originales
      }
  };
  const handleAccionConst2Change = async (e) => {
      const accionConst2Id = e.target.value;
      console.log('Selected Accion Const2 ID:', accionConst2Id); // Agregar esta línea
      setSelectedAccionConst2(accionConst2Id);
      try {
          let resolucionesResponse;

          if (accionConst2Id) {
              // Si hay un ID seleccionado, filtra por él
              resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/accion-const', {
                  params: { accion_const2_id: accionConst2Id, order: 'asc' }
              });
          } else {
              // Si no hay ID seleccionado, obtiene todas las resoluciones
              resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/accion-const', {
                  params: { order: 'asc' } // O solo omite el ID
              });
          }
          formatChartData5(resolucionesResponse.data);
      } catch (error) {
          console.error('Error fetching data', error);
          setError('Error fetching data');
      }
  };
  const formatChartData1 = (data) => {
    if (!data || !Array.isArray(data)) {
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
  const formatChartData3 = (data) => {
    if (!data || !Array.isArray(data)) {
        setError('Invalid data format');
        return;
    }
    const filteredData = data.filter(item => 
        item.departamento && item.tipo_resolucion2 && item.sub_tipo_resolucion && item.cantidad_resoluciones
    );
    if (filteredData.length === 0) {
        // Here, instead of setting an error, you can set the chart data to be empty
        console.log('No valid data for chart 3'); // Log the situation
        setChartData3({ labels: [], datasets: [] }); // Clear data
        return; 
    }
    const labels = filteredData.map(item => `${item.departamento} - ${item.tipo_resolucion2} - ${item.sub_tipo_resolucion}`);
    const counts = filteredData.map(item => item.cantidad_resoluciones);
    if (labels.length !== counts.length) {
        setError('Data length mismatch in chart 3');
        return;
    }
    setChartData3({
        labels,
        datasets: [
            {
                label: 'Cantidad de Resoluciones',
                data: counts,
                backgroundColor: 'rgba(153, 102, 255, 0.6)', // Color personalizable
            },
        ],
    });
};
  const formatChartData4 = (data) => {
      if (!data || !Array.isArray(data)) {
          setError('Invalid data format');
          return;
      }
      const monthNames = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      const labels = data.map(item => `${item.anio} - ${monthNames[item.mes - 1]}`); // Ajustamos aquí
      const counts = data.map(item => item.cantidad_resoluciones);
      setOriginalChartData4({
          labels,
          datasets: [
              {
                  label: 'Cantidad de Resoluciones por Fecha',
                  data: counts,
                  backgroundColor: 'rgba(255, 206, 86, 0.6)', // Color personalizable
              },
          ],
      });
      setChartData4({
          labels,
          datasets: [
              {
                  label: 'Cantidad de Resoluciones por Fecha',
                  data: counts,
                  backgroundColor: 'rgba(255, 206, 86, 0.6)', // Color personalizable
              },
          ],
      });
  };
    const formatChartData5 = (data) => {
      if (!data || !Array.isArray(data)) {
        setError('Invalid data format');
        return;
      }
      const labels = data.map(item => `${item.accion_const2_nombre} - ${item.accion_const_nombre}`);
      const counts = data.map(item => item.cantidad_resoluciones);
      setChartData5({
        labels,
        datasets: [
          {
            label: 'Cantidad de Resoluciones por Acción Constitucional',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
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
                <td>{chartData1.datasets[0]?.data[index] ?? 0}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{totalCases}</strong></td>
            </tr>
          </tbody>
        </table>
      );
    } else if (currentChart === 'chart2') {
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
                <td>{chartData2.datasets[0]?.data[index] ?? 0}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{chartData2.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
            </tr>
          </tbody>
        </table>
      );
    } else if (currentChart === 'chart3') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Departamento - Tipo Resolución - Subtipo Resolución</th>
              <th>Cantidad de Resoluciones</th>
            </tr>
          </thead>
          <tbody>
            {chartData3.labels.map((label, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{chartData3.datasets[0]?.data[index] ?? 0}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{chartData3.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
            </tr>
          </tbody>
        </table>
      );
    } else if (currentChart === 'chart4') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Cantidad de Resoluciones</th>
            </tr>
          </thead>
          <tbody>
            {chartData4.labels.map((label, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{chartData4.datasets[0]?.data[index] ?? 0}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{chartData4.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
            </tr>
          </tbody>
        </table>
      );
    } else if (currentChart === 'chart5') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Acción Constitucional 2 - Acción Constitucional</th>
              <th>Cantidad de Resoluciones</th>
            </tr>
          </thead>
          <tbody>
            {chartData5.labels.map((label, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{chartData5.datasets[0]?.data[index] ?? 0}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{chartData5.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
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
        <select onChange={handleAccionConst2Change} value={selectedAccionConst2} className="select-accion-const2 select-departamento">
          <option value=''>Selecciona Acción Constitucional 2</option>
          {accionConst2Options.map(option => (
            <option key={option.id} value={option.id}>{option.nombre}</option>
          ))}
        </select>
        <select onChange={handleYearChange} value={selectedYear} className="select-year select-departamento">
          <option value=''>Selecciona un año</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
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
          <option value='chart3'>Gráfico por Resoluciones</option>
          <option value='chart4'>Gráfico por Fecha (Año-Mes)</option> 
          <option value='chart5'>Gráfico por Acción Constitucional</option> 
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
                    <p className="chart-description">"Este gráfico presenta la cantidad total de casos reportados por departamento..."</p>
                  </>
                )}
                {currentChart === 'chart2' && (
                  <>
                    {chartType === 'bar' && <Bar data={chartData2} />}
                    {chartType === 'line' && <Line data={chartData2} />}
                    {chartType === 'pie' && <Pie data={chartData2} />}
                    <p className="chart-description">"Gráfico de casos por municipio."</p>
                  </>
                )}
                {currentChart === 'chart3' && (
                <>
                  {chartType === 'bar' && <Bar data={chartData3} />}
                  {chartType === 'line' && <Line data={chartData3} />}
                  {chartType === 'pie' && <Pie data={chartData3} />}
                  <p className="chart-description">"Cantidad de Resoluciones por Departamento..."</p>
                </>
              )}
              {currentChart === 'chart4' && (
                <>
                  {chartType === 'bar' && <Bar data={chartData4} />}
                  {chartType === 'line' && <Line data={chartData4} />}
                  {chartType === 'pie' && <Pie data={chartData4} />}
                  <p className="chart-description">"Cantidad de Resoluciones por Año y Mes..."</p>
                </>
              )}
              {currentChart === 'chart5' && (
                <>
                  {chartType === 'bar' && <Bar data={chartData5} />}
                  {chartType === 'line' && <Line data={chartData5} />}
                  {chartType === 'pie' && <Pie data={chartData5} />}
                  <p className="chart-description">"Cantidad de Resoluciones por Acción Constitucional..."</p>
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
