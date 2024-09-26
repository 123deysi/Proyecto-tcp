import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement } from 'chart.js';

import "../../../Styles/Styles_deysi/dinamicas.css";
import Filtros from './Filtros';
import TablaFiltrada from './TablaFiltrada';
import BotonDesplegable from './BotonDesplegable';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement
);

const Dinamica = () => {
  const [datos, setDatos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [accionesConstitucionales, setAccionesConstitucionales] = useState([]);
  const [subtiposAccionConstitucional, setSubtiposAccionConstitucional] = useState([]);
  const [filtroDepartamento, setFiltroDepartamento] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroAccionConstitucional, setFiltroAccionConstitucional] = useState('');
  const [filtroSubtipoAccionConstitucional, setFiltroSubtipoAccionConstitucional] = useState('');
  const [tipoGrafico, setTipoGrafico] = useState('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casosResponse, accionesResponse, periodosResponse, departamentosResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/lista/Casos'),
          axios.get('http://localhost:8000/api/accionConstitucional'),
          axios.get('http://localhost:8000/api/unicoGestion'),
          axios.get('http://localhost:8000/api/departamentos')
        ]);
        setDatos(casosResponse.data);
        setAccionesConstitucionales(accionesResponse.data.map(accion => ({ id: accion.id, nombre: accion.nombre })));
        setPeriodos(periodosResponse.data);
        setDepartamentos(departamentosResponse.data.map(depto => ({ id: depto.id, nombre: depto.nombre })));
      } catch (error) {
        console.error('Error al obtener datos', error);
      }
    };

    fetchData();
  }, []);

  const fetchSubtiposAccionConstitucional = async (accionId) => {
    try {
      const response = await axios.get(`/api/subtiposAccion/${accionId}`);
      setSubtiposAccionConstitucional(response.data);
    } catch (error) {
      console.error('Error al obtener subtipos de acción constitucional', error);
    }
  };

  useEffect(() => {
    if (filtroAccionConstitucional) {
      const accionSeleccionada = accionesConstitucionales.find(accion => accion.nombre === filtroAccionConstitucional);
      if (accionSeleccionada) {
        fetchSubtiposAccionConstitucional(accionSeleccionada.id);
      }
    } else {
      setSubtiposAccionConstitucional([]);
    }
  }, [filtroAccionConstitucional]);

  const contarAccionesConstitucionales = (departamentoId, accionConstitucional, subtipoAccionConstitucional) => {
    return datos.filter(dato =>
      dato.departamento_id === departamentoId &&
      dato.subtipo_accion_id === accionConstitucional &&
      (!subtipoAccionConstitucional || dato.subtipo_accion_id === subtipoAccionConstitucional)
    ).length;
  };

  
  const transformarDatosParaGrafico = () => {
  const etiquetas = departamentos.map(depto => depto.nombre);

  // Aplicar filtros a los datos
  const datosFiltrados = datos.filter(dato =>
    (!filtroDepartamento || dato.departamento_id === filtroDepartamento) &&
    (!filtroPeriodo || dato.año_codif === filtroPeriodo) &&
    (!filtroAccionConstitucional || dato.subtipo_accion_id === filtroAccionConstitucional) &&
    (!filtroSubtipoAccionConstitucional || dato.subtipo_accion_id === filtroSubtipoAccionConstitucional)
  );

  console.log("Datos después de aplicar filtros:", datosFiltrados);

  const datosPorDepartamento = etiquetas.map(departamento => {
    const departamentoId = departamentos.find(depto => depto.nombre === departamento)?.id;
    return departamentoId ? datosFiltrados.filter(dato =>
      dato.departamento_id === departamentoId
    ).length : 0;
  });

  const datasetsBarras = accionesConstitucionales.map(accion => ({
    label: accion.nombre,
    data: etiquetas.map(departamento => {
      const departamentoId = departamentos.find(depto => depto.nombre === departamento)?.id;
      return departamentoId ? contarAccionesConstitucionales(departamentoId, accion.id, filtroSubtipoAccionConstitucional) : 0;
    }),
    backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1
  }));

  const datasetsLineas = [{
    label: 'Cantidad de Casos',
    data: datosPorDepartamento,
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: false
  }];

  return {
    bar: { labels: etiquetas, datasets: datasetsBarras },
    line: { labels: etiquetas, datasets: datasetsLineas }
  };
};


  const opcionesGrafico = (tipo) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: tipo === 'bar' ? 'Acciones Constitucionales por Departamento' : `Casos por Departamento en ${filtroPeriodo}`,
        font: { size: 18, weight: 'bold' }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Departamentos',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de Casos',
          font: { size: 14, weight: 'bold' }
        }
      }
    }
  });

  const { bar, line } = transformarDatosParaGrafico();

  return (
    <div className='fondo_Dinamica'>
      <h3 className='letra'>Busqueda jurisprudencia estadístico</h3>
      <div className='contenedor_principal'>
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h5 className="font-weight-bold mb-0"><i className="fa fa-filter"></i> Campos de Búsqueda Avanzada</h5>
          <a href="principal" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>

        <Filtros
          departamentos={departamentos}
          periodos={periodos}
          accionesConstitucionales={accionesConstitucionales}
          filtroDepartamento={filtroDepartamento}
          setFiltroDepartamento={setFiltroDepartamento}
          filtroPeriodo={filtroPeriodo}
          setFiltroPeriodo={setFiltroPeriodo}
          filtroAccionConstitucional={filtroAccionConstitucional}
          setFiltroAccionConstitucional={setFiltroAccionConstitucional}
          filtroSubtipoAccionConstitucional={filtroSubtipoAccionConstitucional}
          setFiltroSubtipoAccionConstitucional={setFiltroSubtipoAccionConstitucional}
          subtiposAccionConstitucional={subtiposAccionConstitucional}
        />
        <div className='contenedor_grafico'>
          {tipoGrafico === 'bar' ? (
            <Bar data={bar} options={opcionesGrafico('bar')} />
          ) : (
            <Line data={line} options={opcionesGrafico('line')} />
          )}
        </div>
  
        <TablaFiltrada
          datos={datos}
          filtroDepartamento={filtroDepartamento}
          filtroPeriodo={filtroPeriodo}
          filtroAccionConstitucional={filtroAccionConstitucional}
          filtroSubtipoAccionConstitucional={filtroSubtipoAccionConstitucional}
          contarAccionesConstitucionales={contarAccionesConstitucionales}
        />

        <div className="contenido_desplegable">
          <BotonDesplegable />
        </div>
      </div>
    </div>
  );
};

export default Dinamica;
