import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../Styles/Styles_deysi/Inicio.css";
import "../../../Styles/Styles_deysi/GraficoEchart.css";
import "../../../Styles/Styles_deysi/Grafico.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Estadisticas from './Estadisticas';
import GraficoCasos from './GraficoCasos';
import EChart from './EChart';
import MapaBolivia from './MapaBolivia';
import Descargas from '../pages_deysi/Desgargas';

const PaginaPrincipal = () => {
  const handleDownloadEstadisticas = () => {
    const input = document.getElementById('estadisticas-container');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'estadisticas.png';
        link.click();
      });
    }
  };

  const handleDownloadGraficoCasos = () => {
    const input = document.getElementById('grafico-casos-container');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'grafico_casos.png';
        link.click();
      });
    }
  };

  const handleDownloadEChart = () => {
    const input = document.getElementById('echart-container');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'echart.png';
        link.click();
      });
    }
  };
  const navigate = useNavigate();

  const handleFilterClick = () => {
    navigate('/Dinamicas/Filtro');
  };

  const handleBackClick = () => {
    navigate('/Inicio');
  };

  return (
    <div className="fondo_Dinamica">
      <div className="contenedor_principal">
        <div className="contenedor-opciones">
          <button
            className="btn-explorar font-weight-bold d-flex align-items-center"
            onClick={handleFilterClick}
          >
            <FontAwesomeIcon icon={faFilter} className="icono-filtro" />
            <span>Explorar Resultados de Causas y Resoluciones</span>
          </button>

          <button
            className="btn-retroceder font-weight-bold d-flex align-items-center"
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="icono-retroceder" />
            <span>Retroceder</span>
          </button>
        </div>
        
        <div className='descarga'>
        <Descargas targetId="contenedor-dinamico-cuadro" />
        </div>

        {/* Contenedor principal que se descargará en diferentes formatos */}
        <div id="contenedor-dinamico-cuadro" className="contenedor-dinamico-cuadro">
       
          <div className="estadisticas-container">
            <Estadisticas />
          </div>
          <div className="contenedor_GraficoCasos_Echart">
            <div className="grafico-casos-container">
              <GraficoCasos />
            </div>
            <div className="echart-container">
              <div className="container-grafico">
                <EChart />
            
            </div>
          </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaginaPrincipal;
