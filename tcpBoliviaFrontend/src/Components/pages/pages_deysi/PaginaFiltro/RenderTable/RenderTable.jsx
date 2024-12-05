const renderTable = () => {
    if (currentChart === 'chart1') {
      const headersChart1 = ['Departamento', 'Cantidad de Casos'];
      const chart1Th1 = "Departamento"
      const chart1Th2 = "Cantidad de casos"
      return (
        <ChartTemplate
          headers={headersChart1}
          chartData={currentChart}
          th1={chart1Th1}
          th2={chart1Th2}

        />
      );
    } else if (currentChart === 'chart2') {
      const headersChart2 = ['Municipio', 'Cantidad de Casos'];
      const chart2Th1 = "Municipio"
      const chart2Th2 = "Cantidad de Casos"
      return (
        <ChartTemplate
          headers={headersChart2}
          chartData={currentChart}
          th1={chart2Th1}
          th2={chart2Th2}
        />
      );

    } else if (currentChart === 'chart3') {
      const headersChart3 = ['Departamento-Tipo Resolución- Subtipo Resolución', 'Cantidad de Resoluciones'];
      const chart3Th1 = "Departamento - Tipo Resolución - Subtipo Resolución"
      const chart3Th2 = "Cantidad de Resoluciones"
      return (
        <ChartTemplate
          headers={headersChart3}
          chartData={currentChart}
          th1={chart3Th1}
          th2={chart3Th2}
        />
      ); chart9Th1
      chart9Th2
    } else if (currentChart === 'chart4') {
      const headersChart4 = ['Mes', 'Cantidad de Resoluciones'];
      const chart4Th1 = "Res Fondo Voto"
      const chart4Th2 = "Cantidad de Resoluciones"
      return (
        <ChartTemplate
          headers={headersChart4}
          chartData={currentChart}
          th1={chart4Th1}
          th2={chart4Th2}
        />
      );
    } else if (currentChart === 'chart5') {
      const headersChart5 = ['Tipo de Acción Constitucional - Subtipo Accion Constitucional  ', 'Cantidad de REsoluciones'];
      const chart5Th1 = "Acción Constitucional 2 - Acción Constitucional"
      const chart5Th2 = "Cantidad de Resoluciones"
      return (
        <ChartTemplate
          headers={headersChart5}
          chartData={currentChart}
          th1={chart5Th1}
          th2={chart5Th2}
        />
      );
    } else if (currentChart === 'chart6') {
      const headersChart6 = ['Emisor de Resolución ', 'Cantidad de Casos'];
      const chart6Th1 = "Emisor de Resolución"
      const chart6Th2 = "Cantidad de Casos"
      return (
        <ChartTemplate
          headers={headersChart6}
          chartData={currentChart}
          th1={chart6Th1}
          th2={chart6Th2}
        />
      );
    }
    else if (currentChart === 'chart7') {
      const headersChart7 = ['Año - Mes', ...chartData7.datasets.map(dataset => dataset.label), 'Total'];
      return (
        <Chart7
          headers={headersChart7}
          chartData={currentChart}
        />
      );
    }

    else if (currentChart === 'chart8') {
      const headersChart8 = ['Res Fondo Voto', 'Cantidad de Resoluciones'];
      const chart8Th1 = "Res Fondo Voto"
      const chart8Th2 = "Cantidad de Resoluciones"
      return (
        <ChartTemplate
          headers={headersChart8}
          chartData={currentChart}
          th1={chart8Th1}
          th2={chart8Th2}
        />
      );
    }
    else if (currentChart === 'chart9') {
      const headersChart9 = ['Relator', 'Cantidad de Casos'];
      const chart9Th1 = "Relator"
      const chart9Th2 = "Cantidad de casos"

      return (
        <ChartTemplate
          headers={headersChart9}
          chartData={currentChart}
          th1={chart9Th1}
          th2={chart9Th2}
        />
      );
    }
  };