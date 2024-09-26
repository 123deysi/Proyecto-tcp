import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "../../../Styles/Styles_deysi/Inicio.css";
import "../../../Styles/Styles_deysi/mapaBo.css";

import Descargas from './Desgargas';

  
const PaginaFiltro = () => {
  

    
  

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h3 className="font-weight-bold mb-0"><i className="fa fa-filter"></i> Filtrar Resultado de casos y resoluciones</h3>
          <a href="/Inicio" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>
        <div className="contenedor-dinamico-cuadro">
          <Descargas targetId="contenedor-dinamico" />
          
        </div>
      </div>
    </div>
  );
};

export default PaginaFiltro;
