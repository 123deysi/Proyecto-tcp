import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import "../../../Styles/Styles_deysi/Inicio.css";
import "../../../Styles/Styles_deysi/mapaBo.css";

const PaginaFiltros2 = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('departamento');
  const [error, setError] = useState(null);
  const [chartType1, setChartType1] = useState('bar'); // Tipo de gráfico para chart1
  const [chartType2, setChartType2] = useState('bar'); // Tipo de gráfico para chart2
  const [viewType, setViewType] = useState('chart'); // Visualización de gráfico o tabla
  const [colorScheme, setColorScheme] = useState('default'); // Esquema de colores
  const [showLegend, setShowLegend] = useState(true); // Leyenda visible

  useEffect(() => {
    const fetchData = async () => {
      try {

        /* 
        
        dataApi
        headerTitle
        label
        AtributeData
        titleLegend
        titleX
        titleY
        */
        if(selectedChartType === "departamento")
        {
            const departmentsResponse = await axios.get('http://localhost:8000/api/departamentos');
            formatChartOptions(
                departmentsResponse.data, //dataApi
                'Distribución de Casos por Departamento', //headerTitle
                'nombre', //label
                'id',//AtributeData
                'Cantidad de departamentos', //titleLegend
                'cantidad casos ', //titleY 
            ); 
        }

      

        if(selectedChartType === "municipio") {
            const municipioResponse = await axios.get('http://localhost:8000/api/casos/municipios', { params: { order: 'asc' } });
            console.log(municipioResponse)
            formatChartOptions(
                municipioResponse.data, //dataApi
                'Municipios', //headerTitle
                'municipio', //label
                'cantidad_de_casos', //AtributeData
                'Ids departamentos', //titleLegend
                'Cantidad de casos', //titleY 
            ); 
        }
                
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }
    };
    fetchData();
  }, [selectedChartType]); // Cargar los datos solo al montar el componente

  console.log(selectedChartType)
  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);

    try {
      // Para Chart 1
      const casesResponse = await axios.get('http://localhost:8000/api/casos', {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartOptions(casesResponse.data);

      // Para Chart 2
      const municipioResponse = await axios.get('http://localhost:8000/api/casos/municipios', {
        params: { departamento_id: departmentId }
      });
      formatChartOptions2(municipioResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
  };

  const handleChartTypeChange = (e) => {
    setSelectedChartType(e.target.value);
  };

  // Formatear las opciones para el gráfico 1 (por departamento)
  const formatChartOptions = (dataApi, headerTitle, label, AtributeData, titleLegend, titleY) => {
    if (!dataApi || !Array.isArray(dataApi)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    console.log(dataApi)

    const labels = dataApi.map(item => item[label]);
    const data = dataApi.map(item => item[AtributeData]);

    
      setChartOptions({
        title: {
          text: headerTitle,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
          subtextStyle: {
            fontSize: 12,
            color: '#666',
          },
          top: '10%', // Añade un margen superior al título
        },
        grid: {
          top: '25%', // Aumenta el margen superior para evitar solapamientos
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: { color: '#999' },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'pie'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          show: true,
          data: labels,
          
          
          top: '15%', // Mueve la leyenda hacia abajo para evitar superposición
        },
        xAxis: {
          type: 'category',
          data: labels,
          axisPointer: { type: 'shadow' },
        },
        yAxis: {
          type: 'value',
          name: titleY,
          axisLabel: { formatter: '{value}' },
        },
        series: [
          {
            name: labels,
            type: 'bar',
            data,
            label: {
                show: true,
                position: 'top',
                formatter: '{c}', 
                fontSize: 12,
                fontWeight: 'bold',
                color: '#333', 
              },
            itemStyle: { color: getColorBasedOnScheme(colorScheme) },
            smooth: 'bar',
          },
        ],
      });
    };
    

  // Formatear las opciones para el gráfico 2 (por municipio)
  const formatChartOptions2 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => item.municipio);
    const counts = data.map(item => item.cantidad_de_casos);

    setChartOptions({
      title: {
        text: 'Distribución de Casos por Municipios',
        
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        subtextStyle: {
          fontSize: 12,
          color: '#666',
        },
        top: '5%', // Añade un margen superior al título
      },
      grid: {
        top: '25%', // Aumenta el margen superior para evitar solapamientos
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'pie'] }, // Se añadió 'pie' al tipo de gráfico
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        show: showLegend,
        data: labels
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          rotate: 45, // Esto rotará las etiquetas 45 grados
          interval: 0, // Asegura que todas las etiquetas se muestren
          formatter: (value) => value, // Esto asegura que el valor se muestre correctamente
        }
      },
      yAxis: {
        type: 'value',
        name: 'Cantidad de Casos',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Casos',
          type: chartType2,
          data: counts,
          itemStyle: { color: getColorBasedOnScheme(colorScheme) },
          smooth: chartType2 === 'line',
        }
      ]
    });
  };

  // Función para determinar el color según el esquema seleccionado
  const getColorBasedOnScheme = (scheme) => {
    switch (scheme) {
      case 'dark':
        return 'rgba(0, 0, 0, 0.6)';
      case 'default':
      default:
        return 'rgba(75, 192, 192, 0.6)';
    }
  };

  const formatChartData3 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format for period data');
      setError('Invalid data format for period data');
      return;
    }
  
    // Agrupar datos por año
    const groupedData = data.reduce((acc, item) => {
      const year = item.anio; // Suponiendo que el año viene en la propiedad 'anio'
      if (!acc[year]) acc[year] = 0;
      acc[year] += item.cantidad_casos;
      return acc;
    }, {});
  
    // Extraer años y cantidades para el gráfico
    const labels = Object.keys(groupedData).sort(); // Ordenar los años
    const counts = labels.map(year => groupedData[year]);
  
    setChartOptions({
      title: {
        text: 'Distribución de Casos por Año',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
          dataView: { show: true, readOnly: false },
        },
      },
      xAxis: {
        type: 'category',
        data: labels,
        name: 'Años',
      },
      yAxis: {
        type: 'value',
        name: 'Cantidad de Casos',
      },
      series: [
        {
          name: 'Casos',
          type: 'bar',
          data: counts,
          itemStyle: { color: '#6c1b30' }, // Color principal
        },
      ],
    });
  };
  

  // Renderizar la tabla de datos
  const renderTable = () => {
    const chartData = selectedChartType === 'departamento' ? chartOptions.series[0].data : chartOptions2.series[0].data;
    const labels = selectedChartType === 'departamento' ? chartOptions.xAxis?.data : chartOptions2.xAxis?.data;
    
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>{selectedChartType === 'departamento' ? 'Departamento' : 'Municipio'}</th>
            <th>Cantidad de Casos</th>
          </tr>
        </thead>
        <tbody>
          {labels?.map((label, index) => (
            <tr key={index}>
              <td>{label}</td>
              <td>{chartData[index] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
       
        {/* Selector de Departamento */}
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

        {/* Selector para cambiar entre gráfico de Departamento y Municipio */}
        <select onChange={handleChartTypeChange} value={selectedChartType} className="select-chart-type">
          <option value="departamento">Gráfico por Departamento</option>
          <option value="municipio">Gráfico por Municipio</option>
          <option value="periodo">Grafico por periodo</option>
        </select>

        <div className="contenedor-dinamico-cuadro">
  {viewType === 'chart' ? (
    <>
      {/* Renderizar gráfica */}
      <ReactECharts
        option={chartOptions}
        style={{ height: '400px', width: '100%' }}
      />
      
      {/* Descripción debajo */}
      <p className="descripcion-grafica">
        {selectedChartType === 'departamento'
          ? 'Este gráfico muestra la distribución de casos por departamento en un período determinado.'
          : 'Este gráfico muestra la cantidad de casos por municipio asociados a cada departamento.'}
      </p> 
    </>
  ) : (
    renderTable()
        )}

</div>
      </div>
    </div>
  );
};

export default PaginaFiltros2;