import React, { useEffect, useState } from "react";
import boliviaJson from "./Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import axios from "axios"; // Asegúrate de importar axios

const EChart = ({ data }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentosConPorcentaje, setDepartamentosConPorcentaje] = useState([]); // Agregado para almacenar los datos procesados

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/resoluciones/departamento'); // Asegúrate de que esta es la ruta correcta
        setDepartamentos(response.data); // Establecer los datos en el estado
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData(); // Llamar a la función para obtener los datos
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  useEffect(() => {
    if (departamentos.length > 0) {
      // Calcular el total de resoluciones
      const totalResoluciones = departamentos.reduce((total, item) => total + item.cantidad_resoluciones, 0);

      // Mapeo de departamentos
      const nuevosDepartamentosConPorcentaje = boliviaJson.features.map(departamento => {
        const departamentoData = departamentos.find(item => item.departamento_nombre === departamento.properties.name); // Verifica el nombre del departamento
        return {
          name: departamento.properties.name, // Nombre del departamento
          value: departamentoData ? departamentoData.cantidad_resoluciones : 0, // Asigna el valor o 0 si no hay datos
          percentage: departamentoData ? ((departamentoData.cantidad_resoluciones / totalResoluciones) * 100).toFixed(2) : 0 // Calcular y formatear el porcentaje
        };
      });

      setDepartamentosConPorcentaje(nuevosDepartamentosConPorcentaje); // Actualiza el estado con los nuevos datos procesados
    }
  }, [departamentos]);

  // Registrar el mapa de Bolivia
  registerMap("Bolivia", boliviaJson);

  // Proyección geográfica para el mapa
  const projection = geoMercator();

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
            return `${name}<br/>Resoluiones: ${value}<br/>Porcentaje: ${data?.percentage}%`;
          },
        },
        visualMap: {
          left: "right",
          min: 0,
          max: 100, // Ajusta este valor según tus datos
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
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
            restore: {},
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
                areaColor: "rgba(255, 215, 0, 0.4)", // Color al pasar el ratón
              },
              label: {
                show: true,
                color: "#333",
              },
            },
            data: departamentosConPorcentaje, // Pasar los datos con porcentaje al mapa
          },
        ],
      }}
      style={{
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default EChart;
