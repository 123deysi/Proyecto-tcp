import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

const GraficoCasos = () => {
  const [datosFiltrados, setDatosFiltrados] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [casosResponse, resolucionesResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/casosPorAnio'),
          axios.get('http://localhost:8000/api/resolucionesPorAnio')
        ]);

        const casosData = casosResponse.data;
        const resolucionesData = resolucionesResponse.data;

        const todosAnios = Array.from(new Set([
          ...casosData.map(caso => caso.anio),
          ...resolucionesData.map(resolucion => resolucion.anio)
        ])).sort();

        const datosCombinados = todosAnios.map(anio => {
          const caso = casosData.find(caso => caso.anio === anio);
          const resolucion = resolucionesData.find(res => res.anio === anio);

          return {
            año: anio,
            cantidad_casos: caso ? caso.cantidad_casos : 0,
            cantidad_resoluciones: resolucion ? resolucion.cantidad_resoluciones : 0
          };
        });

        setDatosFiltrados(datosCombinados);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  const opcionesGrafico = {
    title: {
      text: 'Causas y Resoluciones por Año',
      left: 'center',
      top: '2%',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['Causas', 'Resoluciones'],
      top: '8%'
    },
    xAxis: {
      type: 'category',
      data: datosFiltrados.map((item) => item.año),
      axisPointer: { type: 'shadow' }
    },
    yAxis: {
      type: 'value',
      name: 'Cantidad',
      min: 0,
      axisLabel: { formatter: '{value}' }
    },
    series: [
      {
        name: 'Causas',
        type: 'bar',
        data: datosFiltrados.map((item) => item.cantidad_casos),
        itemStyle: { color: '#77bab5' }
      },
      {
        name: 'Resoluciones',
        type: 'bar',
        data: datosFiltrados.map((item) => item.cantidad_resoluciones),
        itemStyle: { color: '#a0425e' }
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      bottom: '5%',
      style: {
        text: 'Fuente: Tribunal Constitucional Plurinacional de Bolivia',
        fontSize: 12,
        color: '#555'
      }
    }
  };

  // Función para recargar los datos al hacer restore
  const onChartEvent = {
    restore: () => {
      setDatosFiltrados((prevData) => [...prevData]);
    }
  };

  return (
    <div className="container-grafico">
      <div style={{ width: '100%', maxWidth: '1000px', height: '500px' }}>
        <ReactECharts
          option={opcionesGrafico}
          onEvents={onChartEvent}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default GraficoCasos;
