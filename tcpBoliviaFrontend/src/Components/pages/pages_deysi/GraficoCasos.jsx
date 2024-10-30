import React from 'react';
import ReactECharts from 'echarts-for-react';

const GraficoCasos = () => {
  const datosFiltrados = Array.from({ length: 10 }, (_, index) => ({
    año: 2018 + index,
    cantidad_casos: Math.floor(Math.random() * 500),
    cantidad_resoluciones: Math.floor(Math.random() * 300),
  }));

  const opcionesGrafico = {
    title: {
      text: 'Casos y Resoluciones por Año',
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

  return (
    <div className="container-grafico">
      <div style={{ width: '100%', maxWidth: '1000px', height: '500px' }}>
        <ReactECharts option={opcionesGrafico} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default GraficoCasos;
