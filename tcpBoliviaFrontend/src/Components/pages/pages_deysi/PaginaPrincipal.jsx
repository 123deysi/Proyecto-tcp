import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../Styles/Styles_deysi/Inicio.css";
//import "../../../Styles/Styles_deysi/mapaBo.css";
import "../../../Styles/Styles_deysi/GraficoEchart.css";
import Descargas from './Desgargas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Estadisticas from './Estadisticas';
import GraficoCasos from './GraficoCasos';
import MapaBolivia from './MapaBolivia';
import "../../../Styles/Styles_deysi/Grafico.css";

import EChart from './EChart';
const PaginaPrincipal = () => {
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
            <span>Explorar Resultados de Casos y Resoluciones</span>
          </button>

          <button
            className="btn-retroceder font-weight-bold d-flex align-items-center"
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="icono-retroceder" />
            <span>Retroceder</span>
          </button>
        </div>

        <div className="contenedor-dinamico-cuadro">
          <Estadisticas />
          <Descargas targetId="contenedor-dinamico" />

          <div className='contenedor_GraficoCasos_Echart'>
            <div className="grafico-casos-container">
              <GraficoCasos />
            </div>
            <div className="echart-container">
            <div className="container-grafico">
              <EChart/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipal;
