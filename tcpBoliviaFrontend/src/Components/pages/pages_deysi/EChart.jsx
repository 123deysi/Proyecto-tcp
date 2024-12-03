import React, { useEffect, useState } from "react";
import boliviaJson from "./Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import axios from "axios";

const EChart = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentosConPorcentaje, setDepartamentosConPorcentaje] = useState([]);
  const [datosOriginales, setDatosOriginales] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/resoluciones/departamento');
      setDepartamentos(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (departamentos.length > 0) {
      const nuevosDepartamentosConPorcentaje = boliviaJson.features.map(departamento => {
        const departamentoData = departamentos.find(item => item.departamento_nombre === departamento.properties.name);
        return {
          name: departamento.properties.name,
          value: departamentoData ? departamentoData.cantidad_resoluciones : 0,
          percentage: departamentoData ? departamentoData.porcentaje : 0
        };
      });

      setDepartamentosConPorcentaje(nuevosDepartamentosConPorcentaje);
      setDatosOriginales(nuevosDepartamentosConPorcentaje); // Almacenar los datos originales
    }
  }, [departamentos]);

  // Registrar el mapa de Bolivia
  registerMap("Bolivia", boliviaJson);
  const projection = geoMercator();

  // Manejar eventos del gráfico
  const onChartEvent = (event) => {
    if (event.type === 'restore') {
      // Restablecer a los datos originales al restaurar
      setDepartamentosConPorcentaje(datosOriginales);
    }
  };

  return (
    <ReactECharts
      option={{
        title: {
          text: "Cantidad y porcentaje de resoluciones por departamento",
          subtext: "Datos de TCP Bolivia",
          left: "right",
          top: "5%",
          textStyle: {
            fontSize: 14,
          },
          subtextStyle: {
            fontSize: 12,
            left: "right",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            const { name, value, data } = params;
            return `${name}<br/>Resoluciones: ${value}<br/>Porcentaje: ${data?.percentage}%`;
          },
        },
        visualMap: {
          left: "right",
          min: 0,
          max: 100,
          inRange: {
            color: [
              "#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8",
              "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026",
            ],
          },
          text: ["Alto", "Bajo"],
          calculable: true,
        },
        toolbox: {
          show: true,
          left: "left",
          top: "top",
          feature: {
            dataView: { readOnly: false },
            restore: {},  // El botón de restaurar está habilitado
            saveAsImage: {},
          },
        },
        series: [
          {
            name: "Resoluciones",
            type: "map",
            roam: true,
            map: "Bolivia",
            projection: {
              project: function (point) {
                return projection(point);
              },
              unproject: function (point) {
                return projection.invert(point);
              },
            },
            label: {
              show: true,
              formatter: (params) => {
                return `${params.name}\n${params.data?.percentage || 0}%`;
              },
              color: "#000",
              fontSize: 10,
            },
            emphasis: {
              itemStyle: {
                areaColor: "rgba(255, 215, 0, 0.4)",
              },
              label: {
                show: true,
                color: "#333",
              },
            },
            data: departamentosConPorcentaje,
          },
        ],
      }}
      style={{ height: "100%", width: "100%" }}
      onChartEvent={onChartEvent} 
    />
  );
};

export default EChart;
