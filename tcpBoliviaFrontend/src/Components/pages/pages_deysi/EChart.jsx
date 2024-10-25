import React, { useEffect, useState } from "react";
import boliviaJson from "./Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";

const EChart = ({ data }) => {
  const [departamentos, setDepartamentos] = useState([]);

  // Actualiza el estado cuando cambia 'data'
  useEffect(() => {
    if (data) {
      const filteredData = data.filter(item => !isNaN(item.value)); // Filtrar datos válidos
      setDepartamentos(filteredData);
    }
  }, [data]);

  // Registrar el mapa de Bolivia
  registerMap("Bolivia", boliviaJson);

  // Proyección geográfica para el mapa
  const projection = geoMercator();

  return (
    <ReactECharts
      option={{
        title: {
          text: "Cantidad de resoluciones por departamento",
          subtext: "Datos de TSJ Bolivia",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
        },
        visualMap: {
          left: "right",
          min: 0,
          max: 500,
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
            emphasis: {
              itemStyle: {
                areaColor: "rgba(255, 215, 0, 0.4)", // Color al pasar el ratón
              },
              label: {
                show: true,
              },
            },
            data: departamentos, // Pasar los datos filtrados al mapa
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
