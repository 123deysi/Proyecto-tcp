import React, { useState, useEffect } from "react";
import axios from "axios";
import TiposDeGraficos from "./TiposDeGraficos";
import RenderTable from "./RenderTable/RenderTable";
import ChartRender from "./ChartsTable/ChartRender";
const MemoizedChartRender = React.memo(ChartRender);

const PaginaFiltro = () => {
  const [viewType, setViewType] = useState("chart");
  const [chartType, setChartType] = useState("bar");
  const [currentChart, setCurrentChart] = useState("chart1");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const [primerFiltro, setPrimerFiltro] = useState("");
  const [segundoFiltro, setSegundoFiltro] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading || chartData.labels.length > 0) return;
    const fillChart1 = async () => {
      const casesResponse = await axios.get("http://localhost:8000/api/casos");
      setChartData(formatChartData1(casesResponse.data));
      console.log("how many times?");
    };
    fillChart1();
  }, []);

  const formatCurrentChart = async (chart) => {
    setLoading(true);
    if (chart == "chart1") {
      const casesResponse = await axios.get("http://localhost:8000/api/casos");
      setChartData(formatChartData1(casesResponse.data));
    } else if (chart == "chart2") {
      const municipioResponse = await axios.get(
        "http://localhost:8000/api/casos/municipios"
      );
      setChartData(formatChartData2(municipioResponse.data));
    } else if (chart == "chart3") {
      const resolucionesResponse = await axios.get(
        "http://localhost:8000/api/resoluciones/departamento-tipo"
      );
      setChartData(formatChartData3(resolucionesResponse.data));
    } else if (chart == "chart4") {
      const resolucionesPorFechaResponse = await axios.get(
        "http://localhost:8000/api/resoluciones/por-fecha"
      );
      setChartData(formatChartData4(resolucionesPorFechaResponse.data));
    } else if (chart == "chart5") {
      const resolucionesPorAccionConstResponse = await axios.get(
        "http://localhost:8000/api/resoluciones/por-accion-constitucional"
      );
      setChartData(formatChartData5(resolucionesPorAccionConstResponse.data));
    } else if (chart == "chart6") {
      const casosPorResEmisorResponse = await axios.get(
        "http://localhost:8000/api/casosPorResEmisor"
      );
      setChartData(formatChartData6(casosPorResEmisorResponse.data));
    } else if (chart == "chart7") {
      const casosPorFechaIngresoResponse = await axios.get(
        "http://localhost:8000/api/casos/por-fecha"
      );
      setChartData(formatChartData7(casosPorFechaIngresoResponse.data));
    } else if (chart == "chart8") {
      const resolucionesPorResFondoVoto = await axios.get(
        "http://localhost:8000/api/resolucionPorResFondo"
      );
      setChartData(formatChartData8(resolucionesPorResFondoVoto.data));
    } else if (chart == "chart9") {
      const resolucionesPorRelator = await axios.get(
        "http://localhost:8000/api/resolucionesPorRelator"
      );
      setChartData(formatChartData9(resolucionesPorRelator.data));
    }
    setCurrentChart(chart);
    setLoading(false);
  };

  const formatChartData1 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data format");
      setError("Invalid data format");
      return;
    }
    const labels = data.map((item) => item.departamento);
    const counts = data.map((item) => item.cantidad_casos);
    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Casos",
          data: counts,
        },
      ],
    };
  };

  const formatChartData2 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError("Invalid data format");
      return;
    }
    const labels = data.map((item) => {
      if (/^Capital [1-9]$/.test(item.municipio)) {
        return `Capital-${item.departamento}`;
      }
      return item.municipio;
    });
    const counts = data.map((item) => item.cantidad_de_casos);
    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Casos por Municipio/Departamento",
          data: counts,
        },
      ],
    };
  };

  const formatChartData3 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data format for Chart 3");
      setError("Invalid data format");
      return;
    }
    const validData = data.filter(
      (item) =>
        item.departamento &&
        item.tipo_resolucion2 &&
        item.sub_tipo_resolucion &&
        item.cantidad_resoluciones !== null &&
        item.cantidad_resoluciones >= 0
    );
    if (validData.length === 0) {
      return { labels: [], datasets: [] };
    }
    const labels = validData.map(
      (item) =>
        `${item.departamento} - ${item.tipo_resolucion2} - ${item.sub_tipo_resolucion}`
    );
    const counts = validData.map((item) => item.cantidad_resoluciones);
    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Resoluciones",
          data: counts,
        },
      ],
    };
  };

  const formatChartData4 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError("Invalid data format");
      return;
    }
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const labels = data.map(
      (item) => `${item.anio} - ${monthNames[item.mes - 1]}`
    );
    const counts = data.map((item) => item.cantidad_resoluciones);

    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Resoluciones por Fecha",
          data: counts,
        },
      ],
    };
  };

  const formatChartData5 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError("Invalid data format");
      return;
    }
    const labels = data.map(
      (item) => `${item.accion_const2_nombre} - ${item.accion_const_nombre}`
    );
    const counts = data.map((item) => item.cantidad_resoluciones);
    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Resoluciones por Acción Constitucional",
          data: counts,
        },
      ],
    };
  };

  const formatChartData6 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError("Invalid data format for resEmisor");
      return;
    }
    const labels = data.map((item) => item.resEmisor);
    const counts = data.map((item) => item.cantidad_casos_Emisor);
    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Casos por Emisor",
          data: counts,
        },
      ],
    };
  };

  const formatChartData7 = (data) => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const casosPorAnioYMes = {};
    data.forEach((item) => {
      const year = item.anio;
      const month = item.mes - 1;
      const key = `${year}-${month}`;
      if (!casosPorAnioYMes[key]) {
        casosPorAnioYMes[key] = 0;
      }
      casosPorAnioYMes[key] += item.cantidad_casos;
    });
    const labels = months;
    const datasets = [];
    const years = [...new Set(data.map((item) => item.anio))];
    years.forEach((year) => {
      const dataForYear = [];
      months.forEach((_, monthIndex) => {
        const key = `${year}-${monthIndex}`;
        dataForYear.push(casosPorAnioYMes[key] || 0);
      });
      datasets.push({
        label: year.toString(),
        data: dataForYear,
      });
    });
    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const formatChartData8 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error("Formato de datos inválido para resFondoVoto:", data);
      return;
    }
    const labels = data.map((item) => `Fondo Voto ${item.res_fondo_voto}`);
    const counts = data.map((item) => item.cantidad_resoluciones);
    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Resoluciones por Fondo Voto",
          data: counts,
        },
      ],
    };
  };

  const formatChartData9 = (data) => {
    const labels = data.map((item) => item.relator_id);
    const resolucionesData = data.map((item) => item.cantidad_resoluciones);
    return {
      labels,
      datasets: [
        {
          label: "Cantidad de Resoluciones",
          data: resolucionesData,
        },
      ],
    };
  };

  // En caso de error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div
          className="card-header bg-dorado d-flex align-items-center"
          role="tab"
        >
          <h3 className="font-weight-bold mb-0">
            <i className="fa fa-filter"></i> Filtrar Resultado de casos y
            resoluciones
          </h3>
          <a
            href="/Dinamicas"
            className="btn btn-outline-dark font-weight-bold ml-auto p-2 rounded-md"
          >
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>
        <div className="flex flex-row flex-wrap justify-center py-3 gap-3">
          <select
            onChange={(e) => formatCurrentChart(e.target.value)}
            value={currentChart}
            className="bg-slate-100 p-3"
          >
            <option value="chart1">Gráfico por Departamento</option>
            <option value="chart2">Gráfico por Municipio</option>
            <option value="chart7">Gráfico Casos por Fecha (Año-Mes)</option>
            <option value="chart6">Gráfico por ResEmisor</option>
          </select>
          <select
            onChange={(e) => formatCurrentChart(e.target.value)}
            value={currentChart}
            className="bg-slate-100 p-3"
          >
            <option value="chart1">selecione grafico por resoluciones</option>
            <option value="chart3">Gráfico por tipo de Resoluciones</option>
            <option value="chart4">Gráfico por Fecha (Año-Mes)</option>
            <option value="chart5">Gráfico por Acción Constitucional</option>
            <option value="chart8">Gráfico por Fondo Voto</option>
            <option value="chart9">Gráfico por Relator</option>
          </select>
        </div>
        <div className="flex flex-row flex-wrap justify-center py-3 gap-3">
          <div className="view-toggle">
            <button
              id="GraficoDatos"
              onClick={() => setViewType("chart")}
              className={viewType === "chart" ? "active" : ""}
            >
              Gráfica
            </button>
            <button
              id="TablaDatos"
              onClick={() => setViewType("table")}
              className={viewType === "table" ? "active" : ""}
            >
              Tabla
            </button>
          </div>
          <TiposDeGraficos
            viewType={viewType}
            currentChart={currentChart}
            chartType={chartType}
            setChartType={setChartType}
            setCurrentChart={setCurrentChart}
          />
          <select
            onChange={() => setPrimerFiltro}
            value={primerFiltro}
            className="bg-slate-100 p-3"
          >
            <option value="">Filtro 1</option>
          </select>
          <select
            onChange={() => setSegundoFiltro}
            value={segundoFiltro}
            className="bg-slate-100 p-3"
          >
            <option value="">Filtro 2</option>
          </select>
        </div>
        {viewType === "chart" ? (
          <MemoizedChartRender
            chartType={chartType}
            chartData={chartData}
            currentChart={currentChart}
            loading={loading}
          />
        ) : (
          <RenderTable currentChart={currentChart} chartData={chartData} />
        )}
      </div>
    </div>
  );
};

export default PaginaFiltro;
