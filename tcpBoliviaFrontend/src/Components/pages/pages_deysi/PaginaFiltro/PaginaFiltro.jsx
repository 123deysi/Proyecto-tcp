import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../../Styles/Styles_deysi/Inicio.css";
import "../../../../Styles/Styles_deysi/mapaBo.css";
import 'react-toastify/dist/ReactToastify.css';
import TableTemplate from './RenderTable/Table/TableTemplate';
import Table7 from './RenderTable/Table/Table7';
import FiltrosDeGraficos from './FiltrosDeGraficos';
import MyChartComponent from './ChartsTable/MyChartComponent';

const PaginaFiltro = () => {
  const [currentChart, setCurrentChart] = useState('chart1');
  const [chartType, setChartType] = useState('bar');
  const [chartData1, setChartData1] = useState({ labels: [], datasets: [] });
  const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });
  const [chartData3, setChartData3] = useState({ labels: [], datasets: [] });
  const [chartData4, setChartData4] = useState({ labels: [], datasets: [] });
  const [chartData5, setChartData5] = useState({ labels: [], datasets: [] });
  const [chartData6, setChartData6] = useState({ labels: [], datasets: [] });
  const [chartData7, setChartData7] = useState({ labels: [], datasets: [] });
  const [chartData8, setChartData8] = useState({ labels: [], datasets: [] });
  const [chartData9, setChartData9] = useState({ labels: [], datasets: [] }); // Estado para los datos del gráfico
  const [selectedRelator, setSelectedRelator] = useState(null);

  const [dataResRelator, setDataResRelator] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [yearsIngreso, setYearsIngreso] = useState([]); // Años únicos para el select

  const [selectedFechaIngreso, setSelectedFechaIngreso] = useState('');
  const [dataResFondoVoto, setDataResFondoVoto] = useState([]);
  const [selectedResFondoVoto, setSelectedResFondoVoto] = useState('');
  //const [resEmisor, setResEmisor]=useState([]);
  const [resEmisorOptions, setResEmisor] = useState([]); // Para almacenar las opciones de resEmisor
  const [selectedResEmisor, setSelectedResEmisor] = useState(''); // Para almacenar el resEmisor seleccionado

  const [selectedDepartment, setSelectedDepartment] = useState('');

  const [error, setError] = useState(null);
  const [accionConst2Options, setAccionConst2Options] = useState([]);
  const [selectedAccionConst2, setSelectedAccionConst2] = useState('');
  const [viewType, setViewType] = useState('chart');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [originalChartData4, setOriginalChartData4] = useState({ labels: [], datasets: [] });
  const [restipo2Options, setRestipo2Options] = useState([]);
  const [selectedRestipo2, setSelectedRestipo2] = useState('');
  const [originalChartData3, setOriginalChartData3] = useState([]);

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
        const resolucionesPorFechaResponse = await axios.get('http://localhost:8000/api/resoluciones/por-fecha');
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

        const tipoResolucionResponse = await axios.get('http://localhost:8000/api/resoluciones/tipo');
        const uniqueTipos = Array.from(new Set(tipoResolucionResponse.data.map(tipo => tipo.tipo_resolucion2)))
          .map(tipo => tipoResolucionResponse.data.find(t => t.tipo_resolucion2 == tipo));
        setRestipo2Options(uniqueTipos); // Solo tipos únicos

        // Obtener datos para resEmisor
        const resEmisorResponse = await axios.get('http://localhost:8000/api/resEmisor');
        setResEmisor(resEmisorResponse.data);

        // Obtener datos para casos por resEmisor
        const casosPorResEmisorResponse = await axios.get('http://localhost:8000/api/casosPorResEmisor');
        formatChartData6(casosPorResEmisorResponse.data); // Ajusta esta función si necesitas formatear los datos para `chartData6`


        // Solicita todos los casos agrupados por fecha de ingreso
        const casosPorFechaIngresoResponse = await axios.get('http://localhost:8000/api/casos/por-fecha');
        // Formatear datos para el gráfico, si es necesario
        formatChartData7(casosPorFechaIngresoResponse.data);
        // Obtener años únicos para el select
        const casosYears = [...new Set(casosPorFechaIngresoResponse.data.map(item => item.anio))];
        setYearsIngreso(casosYears);

        //obtener la cantidad de resoluiones por res_fondo_voto 
        const resolucionesPorResFondoVoto = await axios.get('http://localhost:8000/api/resolucionPorResFondo');
        setDataResFondoVoto(resolucionesPorResFondoVoto.data);
        formatChartData8(resolucionesPorResFondoVoto.data);

        // Realizar solicitud a la API
        const resolucionesPorRelator = await axios.get('http://localhost:8000/api/resolucionesPorRelator');

        // Almacenar los datos de los relatores en el estado
        setDataResRelator(resolucionesPorRelator.data);

        // Formatear los datos y actualizar el estado del gráfico
        formatChartData9(resolucionesPorRelator.data);

      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }

    };
    fetchData();
  }, []);


  // Función para manejar el cambio de relator
  const handleRelatorChange = async (e) => {
    const relatorId = e.target.value;
    setSelectedRelator(relatorId);

    try {
      // Realizar solicitud a la API para obtener los datos de los casos filtrados por el relator seleccionado
      const casesByRelatorResponse = await axios.get('http://localhost:8000/api/resolucionesPorRelator', {
        params: { relator_id: relatorId }
      });

      // Formatear los datos y actualizar el estado del gráfico
      formatChartData9(casesByRelatorResponse.data);
    } catch (error) {
      console.error('Error fetching data for relator', error);
      setError('Error fetching data for relator');
    }
  };

  const handleResFondoVotoChange = async (e) => {
    const resFondoVoto = e.target.value;
    setSelectedResFondoVoto(resFondoVoto);
    try {
      // Solicita los datos con el filtro res_fondo_voto
      const response = await axios.get('http://localhost:8000/api/resolucionPorResFondo', {
        params: { res_fondo_voto: resFondoVoto },
      });

      console.log(response.data); // Verifica los datos obtenidos

      // Llama a la función para formatear los datos y actualizar el gráfico
      formatChartData8(response.data);
    } catch (error) {
      console.error('Error al obtener datos para resFondoVoto', error);
    }
  };
  // Manejar el cambio de selección de año
  const handleFechaIngresoChange = async (e) => {
    const selectedYear = e.target.value;
    setSelectedFechaIngreso(selectedYear);

    try {
      // Si no se selecciona un año específico (es decir, seleccionamos la opción por defecto)
      if (selectedYear === '') {
        // Obtener todos los datos nuevamente
        const response = await axios.get('http://localhost:8000/api/casos/por-fecha');
        formatChartData7(response.data);
      } else {
        // Filtrar los datos para el año seleccionado
        const response = await axios.get('http://localhost:8000/api/casos/por-fecha');
        const filteredData = response.data.filter(caso => caso.anio === parseInt(selectedYear));
        formatChartData7(filteredData);
      }
    } catch (error) {
      console.error('Error al obtener datos para fecha de ingreso', error);
      setError('Error al obtener datos para fecha de ingreso');
    }
  };

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

  const handleResEmisorChange = async (e) => {
    const resEmisorId = e.target.value;
    setSelectedResEmisor(resEmisorId);

    try {
      // Solicitar datos de casos filtrados por el emisor seleccionado
      const casesByResEmisorResponse = await axios.get('http://localhost:8000/api/casosPorResEmisor', {
        params: { res_emisor_id: resEmisorId }
      });
      formatChartData6(casesByResEmisorResponse.data);

    } catch (error) {
      console.error('Error fetching data for resEmisor', error);
      setError('Error fetching data for resEmisor');
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (year) {
      // Filtrar etiquetas y datos para el año seleccionado
      const filteredLabels = originalChartData4.labels.filter(label => {
        // Extraer el año de la etiqueta, asumiendo que tiene formato "AAAA - Mes"
        const labelYear = label.split(' - ')[0];
        return labelYear === year; // Comparar con el año seleccionado
      });
      const filteredData = originalChartData4.datasets[0].data.filter((_, index) => {
        const labelYear = originalChartData4.labels[index].split(' - ')[0];
        return labelYear === year; // Filtrar solo los datos correspondientes al año
      });


      setChartData4({
        labels: filteredLabels,
        datasets: [
          {
            label: `Resoluciones del año ${year}`,
            data: filteredData,
            borderColor: 'rgba(255, 206, 86, 0.6)',
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            fill: true,
            tension: 0.4,
            maxBarThickness: 50,
          },
        ],
      });
    } else {
      setChartData4(originalChartData4);
    }
  };
  const handleRestipo2Change = (e) => {
    const tipoResolucion = e.target.value;
    console.log('Selected Resolucion Type:', tipoResolucion);
    setSelectedRestipo2(tipoResolucion);

    console.log('Original Data for Chart 3 before filtering:', originalChartData3);

    if (tipoResolucion === "") {
      // Restaurar todos los datos si se selecciona "todos"
      console.log('No Resolucion Type selected, restoring original data for Chart 3');
      formatChartData3(originalChartData3); // Formatea la gráfica con datos originales
    } else {
      // Filtrar los datos basados en el tipo de resolución seleccionado
      const filteredData = originalChartData3.filter(item => {
        const itemTipoResolucion = item.tipo_resolucion2.toString(); // Asegúrate de convertir a cadena
        console.log(`Comparing: ${itemTipoResolucion} with ${tipoResolucion}`);
        return itemTipoResolucion === tipoResolucion; // Comparación ajustada
      });

      if (filteredData.length === 0) {
        console.log('No data found for the selected Resolucion Type');
        setChartData3({ labels: [], datasets: [] });
        setError('No valid data for chart 3');
      } else {
        console.log('Filtered Data for Chart 3:', filteredData);
        formatChartData3(filteredData); // Llamada a la función para formatear los datos filtrados
      }
    }
  };
  const handleAccionConst2Change = async (e) => {
    const accionConst2Id = e.target.value;
    console.log('Selected Accion Const2 ID:', accionConst2Id); // Agregar esta línea
    setSelectedAccionConst2(accionConst2Id);
    try {
      let resolucionesResponse;
      if (accionConst2Id) {
        resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/accion-const', {
          params: { accion_const2_id: accionConst2Id, order: 'asc' }
        });
      } else {
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
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => item.departamento);
    const counts = data.map(item => item.cantidad_casos);

    setChartData1({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos',
          data: counts,
        },
      ],

    });
  };

  const formatChartData2 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError('Invalid data format');
      return;
    }

    // Modificar las etiquetas para cambiar 'Capital 1' a 'Capital-[Departamento]'
    const labels = data.map(item => {
      // Verificar si el municipio es 'Capital 1', 'Capital 2', ..., 'Capital 9'
      if (/^Capital [1-9]$/.test(item.municipio)) {
        return `Capital-${item.departamento}`; // Reemplazar por 'Capital-[Departamento]'
      }
      return item.municipio; // Si no es 'Capital', mantener el nombre original
    });

    // Mantener el conteo de casos tal cual como estaba
    const counts = data.map(item => item.cantidad_de_casos);

    // Actualizar el estado con los datos procesados
    setChartData2({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos por Municipio/Departamento',
          data: counts,
        },
      ],
    });
  };

  const formatChartData3 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format for Chart 3');
      setError('Invalid data format');
      return;
    }
    setOriginalChartData3(data);

    // Filtrar datos válidos para la gráfica
    const validData = data.filter(item =>
      item.departamento &&
      item.tipo_resolucion2 &&
      item.sub_tipo_resolucion &&
      item.cantidad_resoluciones !== null &&
      item.cantidad_resoluciones >= 0
    );

    if (validData.length === 0) {
      console.log('No valid data for chart 3');
      setChartData3({ labels: [], datasets: [] });
      setError('No valid data for chart 3');
      return;
    }

    const labels = validData.map(item => `${item.departamento} - ${item.tipo_resolucion2} - ${item.sub_tipo_resolucion}`);
    const counts = validData.map(item => item.cantidad_resoluciones);
    setChartData3({
      labels,  // Etiquetas del gráfico
      datasets: [
        {
          label: 'Cantidad de Resoluciones',
          data: counts,
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
        },
      ],
    });

    setChartData4({
      labels,  // Etiquetas de la gráfica
      datasets: [
        {
          label: 'Cantidad de Resoluciones por Fecha',
          data: counts,
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

        },
      ],
    });
  };


  const formatChartData6 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError('Invalid data format for resEmisor');
      return;
    }

    // Ajusta estos nombres de campos (`nombre_emisor` y `cantidad_casos`) según la estructura de tu respuesta `resEmisor`
    const labels = data.map(item => item.resEmisor);
    const counts = data.map(item => item.cantidad_casos_Emisor);

    setChartData6({
      labels,  // Etiquetas de la gráfica (por ejemplo, los emisores)
      datasets: [
        {
          label: 'Cantidad de Casos por Emisor',
          data: counts,  // Datos de la cantidad de casos
        },
      ],
    });
  };


  // Función para formatear datos agrupados por mes para el gráfico de líneas apiladas
  const formatChartData7 = (data) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const casosPorAnioYMes = {};

    // Agrupar los casos por año y mes
    data.forEach(item => {
      const year = item.anio;
      const month = item.mes - 1; // Ajustar el índice para que coincida con el array de meses
      const key = `${year}-${month}`;

      // Inicializar el conteo si la clave no existe en el objeto
      if (!casosPorAnioYMes[key]) {
        casosPorAnioYMes[key] = 0;
      }

      // Sumar los casos de ese mes y año
      casosPorAnioYMes[key] += item.cantidad_casos;
    });

    // Preparar las etiquetas y los datasets para el gráfico
    const labels = months;
    const datasets = [];

    // Obtener los años únicos a partir de los datos
    const years = [...new Set(data.map(item => item.anio))];

    // Inicializar datasets para cada año
    years.forEach(year => {
      const dataForYear = [];
      months.forEach((_, monthIndex) => {
        const key = `${year}-${monthIndex}`;
        dataForYear.push(casosPorAnioYMes[key] || 0);
      });

      // Agregar el dataset para este año con un color aleatorio
      datasets.push({
        label: year.toString(),
        data: dataForYear,
      });
    });

    // Configuración de datos para el gráfico
    setChartData7({
      labels: labels,
      datasets: datasets,
    });
  };

  const formatChartData8 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Formato de datos inválido para resFondoVoto:', data);
      return;
    }

    // Extrae las etiquetas y los datos de la respuesta
    const labels = data.map(item => `Fondo Voto ${item.res_fondo_voto}`);
    const counts = data.map(item => item.cantidad_resoluciones);

    // Actualiza el estado de chartData8 con los nuevos datos
    setChartData8({
      labels,  // Etiquetas de la gráfica, que se asignan desde las variables 'labels'
      datasets: [
        {
          label: 'Cantidad de Resoluciones por Fondo Voto',
          data: counts,  // Datos de las resoluciones
        },
      ],
    });
  };

  // Función para formatear los datos del relator para el gráfico
  const formatChartData9 = (data) => {
    // Extraer los labels (relator_id) y los datos de cantidad_resoluciones
    const labels = data.map(item => item.relator_id);
    const resolucionesData = data.map(item => item.cantidad_resoluciones);
    // Actualizar el estado chartData9 con los datos formateados
    setChartData9({
      labels,
      datasets: [
        {
          label: 'Cantidad de Resoluciones',
          data: resolucionesData,
        },
      ],
    });
  };

  const renderTable = () => {
    if (currentChart === 'chart1') {
      const headersChart1 = ['Departamento', 'Cantidad de Casos'];
      const chart1Th1 = "Departamento"
      const chart1Th2 = "Cantidad de casos"
      return (
        <TableTemplate
          headers={headersChart1}
          chartData={chartData1}
          th1={chart1Th1}
          th2={chart1Th2}
          currentChart={currentChart}

        />
      );
    } else if (currentChart === 'chart2') {
      const headersChart2 = ['Municipio', 'Cantidad de Casos'];
      const chart2Th1 = "Municipio"
      const chart2Th2 = "Cantidad de Casos"
      return (
        <TableTemplate
          headers={headersChart2}
          chartData={chartData2}
          th1={chart2Th1}
          th2={chart2Th2}
          currentChart={currentChart}
        />
      );

    } else if (currentChart === 'chart3') {
      const headersChart3 = ['Departamento-Tipo Resolución- Subtipo Resolución', 'Cantidad de Resoluciones'];
      const chart3Th1 = "Departamento - Tipo Resolución - Subtipo Resolución"
      const chart3Th2 = "Cantidad de Resoluciones"
      return (
        <TableTemplate
          headers={headersChart3}
          chartData={chartData3}
          th1={chart3Th1}
          th2={chart3Th2}
          currentChart={currentChart}
        />
      );

    } else if (currentChart === 'chart4') {
      const headersChart4 = ['Mes', 'Cantidad de Resoluciones'];
      const chart4Th1 = "Res Fondo Voto"
      const chart4Th2 = "Cantidad de Resoluciones"
      return (
        <TableTemplate
          headers={headersChart4}
          chartData={chartData4}
          th1={chart4Th1}
          th2={chart4Th2}
          currentChart={currentChart}
        />
      );
    } else if (currentChart === 'chart5') {
      const headersChart5 = ['Tipo de Acción Constitucional - Subtipo Accion Constitucional  ', 'Cantidad de REsoluciones'];
      const chart5Th1 = "Acción Constitucional 2 - Acción Constitucional"
      const chart5Th2 = "Cantidad de Resoluciones"
      return (
        <TableTemplate
          headers={headersChart5}
          chartData={chartData5}
          th1={chart5Th1}
          th2={chart5Th2}
          currentChart={currentChart}
        />
      );
    } else if (currentChart === 'chart6') {
      const headersChart6 = ['Emisor de Resolución ', 'Cantidad de Casos'];
      const chart6Th1 = "Emisor de Resolución"
      const chart6Th2 = "Cantidad de Casos"
      return (
        <TableTemplate
          headers={headersChart6}
          chartData={chartData6}
          th1={chart6Th1}
          th2={chart6Th2}
          currentChart={currentChart}
        />
      );
    }
    else if (currentChart === 'chart7') {
      const headersChart7 = ['Año - Mes', ...chartData7.datasets.map(dataset => dataset.label), 'Total'];
      return (
        <Table7
          headers={headersChart7}
          chartData={chartData7}
        />
      );
    }

    else if (currentChart === 'chart8') {
      const headersChart8 = ['Res Fondo Voto', 'Cantidad de Resoluciones'];
      const chart8Th1 = "Res Fondo Voto"
      const chart8Th2 = "Cantidad de Resoluciones"
      return (
        <TableTemplate
          headers={headersChart8}
          chartData={chartData8}
          th1={chart8Th1}
          th2={chart8Th2}
          currentChart={currentChart}
        />
      );
    }
    else if (currentChart === 'chart9') {
      const headersChart9 = ['Relator', 'Cantidad de Casos'];
      const chart9Th1 = "Relator"
      const chart9Th2 = "Cantidad de casos"

      return (
        <TableTemplate
          headers={headersChart9}
          chartData={chartData9}
          th1={chart9Th1}
          th2={chart9Th2}
          currentChart={currentChart}
        />
      );
    }
  };
  // En caso de error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h3 className="font-weight-bold mb-0"><i className="fa fa-filter"></i> Filtrar Resultado de casos y resoluciones</h3>
          <a href="/Dinamicas" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>
        <div className='flex flex-row flex-wrap justify-center py-3 gap-3'>
          <select onChange={(e) => setCurrentChart(e.target.value)} value={currentChart} className="bg-slate-100 p-3">
            <option value='chart1'>Gráfico por Departamento</option>
            <option value='chart2'>Gráfico por Municipio</option>
            <option value='chart7'>Gráfico Casos por Fecha  (Año-Mes)</option>
            <option value='chart6'>Gráfico por ResEmisor</option>
          </select>
          <select onChange={(e) => setCurrentChart(e.target.value)} value={currentChart} className="bg-slate-100 p-3">
            <option value='chart1'>selecione grafico por resoluciones</option>
            <option value='chart3'>Gráfico por tipo de Resoluciones</option>
            <option value='chart4'>Gráfico por Fecha (Año-Mes)</option>
            <option value='chart5'>Gráfico por Acción Constitucional</option>
            <option value='chart8'>Gráfico por Fondo Voto</option>
            <option value='chart9'>Gráfico por Relator</option>
          </select>
        </div>
        <div className='flex flex-row flex-wrap justify-center py-3 gap-3'>
          <div className="view-toggle">
            <button id='GraficoDatos' onClick={() => setViewType('chart')} className={viewType === 'chart' ? 'active' : ''}>Gráfica</button>
            <button id='TablaDatos' onClick={() => setViewType('table')} className={viewType === 'table' ? 'active' : ''}>Tabla</button>
          </div>
          <FiltrosDeGraficos
            viewType={viewType}
            currentChart={currentChart}
            chartType={chartType}
            setChartType={setChartType}
            setCurrentChart={setCurrentChart}
          />
          {currentChart !== 'chart4' && currentChart !== 'chart5' && currentChart !== 'chart6' && currentChart !== 'chart7' && currentChart !== 'chart8' && currentChart !== 'chart9' && (
            <select
              onChange={handleDepartmentChange}
              value={selectedDepartment}
              className="bg-slate-100 p-3">
              <option value=''>Todos los departamentos</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>{department.nombre}</option>
              ))}
            </select>)}
          {currentChart === 'chart3' && (
            <select id="restipo2"
              value={selectedRestipo2}
              onChange={handleRestipo2Change}
              className="bg-slate-100 p-3">
              <option value=''>Seleccione un tipo de resolución</option>
              {restipo2Options.map((tipo, index) => (
                <option key={tipo.id || index} value={tipo.tipo_resolucion2}>
                  {tipo.tipo_resolucion2}
                </option>
              ))}
            </select>)}
          {currentChart === 'chart4' && (
            <>
              <select
                onChange={handleYearChange}
                value={selectedYear}
                className="bg-slate-100 p-3">
                <option value=''>Selecciona un año</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </>)}
          {currentChart === 'chart5' && (
            <select
              onChange={handleAccionConst2Change}
              value={selectedAccionConst2}
              className="bg-slate-100 p-3">
              <option value=''>Selecciona Acción Constitucional 2</option>
              {accionConst2Options.map(option => (
                <option key={option.id} value={option.id}>{option.nombre}</option>
              ))}
            </select>)}
          <select
            onChange={handleAccionConst2Change}
            value={selectedAccionConst2}
            className="bg-slate-100 p-3">
            <option value=''>Años</option>
            <option value={2016}>2016</option>
            <option value={2017}>2017</option>
            <option value={2018}>2018</option>
            <option value={2019}>2019</option>
            <option value={2020}>2020</option>
          </select>
          {currentChart === 'chart6' && (
            <select
              onChange={handleResEmisorChange}
              value={selectedResEmisor}
              className="bg-slate-100 p-3">
              <option value=''>Selecciona Emisor</option>
              {resEmisorOptions.map(option => (
                <option key={option.id} value={option.id}>{option.nombre}</option>
              ))}
            </select>
          )}
          {currentChart === 'chart7' && (
            <select
              onChange={handleFechaIngresoChange}
              value={selectedFechaIngreso}
              className="bg-slate-100 p-3">
              <option value=''>Selecciona un año (fecha ingreso)</option>
              {yearsIngreso.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}

          {currentChart === 'chart8' && (
            <select
              onChange={handleResFondoVotoChange}
              value={selectedResFondoVoto}
              className="bg-slate-100 p-3"
            >
              <option value=''>Selecciona un Res Fondo Voto</option>
              {dataResFondoVoto.map(item => (
                <option key={item.res_fondo_voto} value={item.res_fondo_voto}>
                  {item.res_fondo_voto}
                </option>
              ))}
            </select>

          )}
          {currentChart === 'chart9' && (
            <select
              onChange={handleRelatorChange}
              value={selectedRelator}
              className="bg-slate-100 p-3"
            >
              <option value=''>Selecciona un Relator</option>
              {dataResRelator.map(item => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        {viewType === 'chart' ? (
          <div className='p-6 pb-16 outline-1 outline rounded-md outline-gray-400'>
            {currentChart === 'chart1' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData1?.labels || []}
                  counts={chartData1?.datasets[0]?.data || []}
                  title={chartData1?.datasets[0]?.label || "Cargando..."}
                />
                <p className="text-center text-break">
                  Total de las causas reportadas por cada departamento...
                </p>
                {console.log(chartData1?.labels)}
              </div>
            )}
            {currentChart === 'chart2' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData2?.labels || []}
                  counts={chartData2?.datasets[0]?.data || []}
                  title={chartData2?.datasets[0]?.label || "Cargando..."}
                />
                <p className="text-center py-10">"Gráfico de casos por municipio.</p>
                {console.log(chartData2?.labels)}
              </div>
            )}
            {currentChart === 'chart3' && (
              <div >
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData3?.labels || []}
                  counts={chartData3?.datasets[0]?.data || []}
                  title={chartData3?.datasets[0]?.label || "Cargando..."}
                />
                <p className="text-center py-10">Cantidad de Resoluciones por Departamento...</p>
              </div>
            )}
            {currentChart === 'chart4' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData4?.labels || []}
                  counts={chartData4?.datasets[0]?.data || []}
                  title={chartData4?.datasets[0]?.label || "Cargando..."}
                />
                <p className="text-center py-10">Cantidad de Resoluciones por Año y Mes...</p>
              </div>
            )}
            {currentChart === 'chart5' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData5?.labels || []}
                  counts={chartData5?.datasets[0]?.data || []}
                  title={chartData5?.datasets[0]?.label || "Cargando..."}
                />
                <p className="text-center py-10">Cantidad de Resoluciones por Acción Constitucional...</p>
              </div>
            )}
            {currentChart === 'chart6' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData6?.labels || []}
                  counts={chartData6?.datasets[0]?.data || []}
                  title={chartData6?.datasets[0]?.label || "Cargando..."}
                />
                <p className="text-center py-10">Cantidad de Casos por ResEmisor...</p>
              </div>
            )}

            {currentChart === 'chart7' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData7?.labels || []}
                  counts={chartData7?.datasets[0]?.data || []}
                  title={chartData7?.datasets[0]?.label || "Cargando..."}
                />
                <p className="text-center py-10">Cantidad de Casos por Año y mes...</p>
              </div>

            )}
            {currentChart === 'chart8' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData8?.labels || []}
                  counts={chartData8?.datasets[0]?.data || []}
                  title={chartData8?.datasets[0]?.label || "Cargando..."}
                />
                <div className="text-center py-10">
                  <p>Cantidad de Resoluciones por Fondo Voto:</p>
                  <ul>
                    <li>1 = Resolución unánime</li>
                    <li>2 = Resolución con disidencia o voto aclaratorio</li>
                  </ul>
                </div>
              </div>
            )}

            {currentChart === 'chart9' && (
              <div>
                <MyChartComponent
                  chartType={chartType}
                  labels={chartData9?.labels || []}
                  counts={chartData9?.datasets[0]?.data || []}
                  title={chartData9?.datasets[0]?.label || "Cargando..."}
                />
                {console.log(chartType,
                  chartData9?.labels,
                  chartData9?.datasets[0]?.data,
                  chartData9?.datasets[0]?.label)
                }
                <div className="text-center py-10">
                  <p>Cantidad de Resoluciones por Relator:</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          renderTable()
        )}
      </div>
    </div>
  );
};

export default PaginaFiltro; 