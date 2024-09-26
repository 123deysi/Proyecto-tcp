import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "../../../Styles/Styles_deysi/Inicio.css";
import "../../../Styles/Styles_deysi/mapaBo.css";

import GraficoCasos from './GraficoCasos';
import Estadisticas from './Estadisticas';
import InformacionGrafico from './InformacionGrafico';
import MapaBolivia from './MapaBolivia';
import CardBusqueda from './CardBusqueda';

import Descargas from './Desgargas';
const datos = {
  "Id2": [19, 20, 23],
  "id": [19, 20, 23],
  "num2": [1, 2, 5],
  "numres": ["0001/2018-S1", "0001/2018-S3", "0004/2018-S3"],
  "exp": ["21168-2017-43-AL", "21194-2017-43-AL", "21185-2017-43-AL"],
  "fecha": ["14/2/2018", "14/2/2018", "27/2/2018"],
  "ref": [
    "Bernardo Carguani Pairo c/ Wiat Belzu Carvajal, Juez de Instrucción Penal Segundo del departamento de La Paz",
    "Yeli Belén Cabrera c/ Ivón Basilio Lazo y otras, Juezas Técnicas del Tribunal de Sentencia Penal Primero de Uyuni",
    "Yimy José Urzagaste Zabala c/ Carlos Gustavo Romero Bonifaz, Ministro de Gobierno y otros"
  ],
  "descar": ["", "", ""],
  "dis": ["", "", ""],
  "numres2": ["0001/2018-S1", "0001/2018-S3", "0004/2018-S3"],
  "exp2": ["21168", "21194", "21185"],
  "exp-repet": [1, 1, 1],
  "exp-año": [2017, 2017, 2017, 2020, 2021, 2021, 2022, 2022, 2022, 2021, 2021, 2023, 2023, 2023, 2023, 2025, 2025, 2026, 2027, 2028, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029, 2029],
  "res-año": [2018, 2018, 2018],
  "res-mes": [2, 2, 2],
  "res-mes-año": ["1/2/2018", "1/2/2018", "1/2/2018"],
  "rezago": [1, 1, 1],
  "acción-const": ["AL", "AL", "AL"],
  "acción-const2": ["", "", ""],
  "res-tipo": ["SP1", "SP3", "SP3"],
  "res-tipo2": [1, 1, 1],
  "res-fondo-voto": ["Sin disidencia", "Sin disidencia", "Con disidencia"],
  "disprin": [0, 0, 1],
  "codificador": ["galen", "galen", "galen"],
  "añocodif": [2018, 2018, 2018],
  "observaciones": ["", "", ""],
  "obsdirector": ["", "", ""],
  "sala": ["Juzgado de sentencia Nro. 6", "Juzgado de Instrucción en lo penal Nro. 1", "Tribunal de Sentencia Penal Nro. 8"],
  "resresul": ["Parcial", "Parcial", "Deniega"],
  "revresul": ["Confirma", "Confirma", "Confirma"],
  "resfinal": ["Parcial", "Concede", "Deniega"],
  "relator": ["Karem Lorena Gallardo Sejas", "Brígida Celia Vargas Barañado", "Orlando Ceballos Acuña"],
  "fechaingr": ["5/10/2017", "9/10/2017", "6/10/2017"],
  "fechaingr2": ["2/10/2017", "", ""],
  "departamento": ["La Paz", "Potosí", "La Paz"],
  "municipio": ["Capital", "Uyuni", "Capital"],
  "restiempo": [4.40, 4.27, 4.80],
  "codificador2": ["", "", ""],
  "observaciones2": ["", "", ""],
  "obsdirector2": ["", "", ""],
  "variable2": ["", "", ""],
  "variable3": ["", "", ""],
  "variable4": ["", "", ""],
  "variable5": ["", "", ""]
};

const Dinamicas = () => {
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [casosPorDepartamento, setCasosPorDepartamento] = useState({});

  useEffect(() => {
    // Agrupar por año y contar casos
    const casosPorAño = datos['exp-año'].reduce((acc, año, index) => {
      if (!acc[año]) {
        acc[año] = 0;
      }
      acc[año]++;
      return acc;
    }, {});

    const datosFiltrados = Object.keys(casosPorAño).map((año) => ({
      año,
      cantidadCasos: casosPorAño[año],
    }));

    setDatosFiltrados(datosFiltrados);

    // Contar casos por departamento
    const casosPorDepto = datos['departamento'].reduce((acc, departamento, index) => {
      if (!acc[departamento]) {
        acc[departamento] = 0;
      }
      acc[departamento]++;
      return acc;
    }, {});

    setCasosPorDepartamento(casosPorDepto);
  }, []);
  const handleDownload = () => {
    const input = document.getElementById('contenedor-dinamico');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('dinamicas.pdf');
      });
  };

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
          <div className="contenedor-dinamico" id="contenedor-dinamico">
            <div className="columna">
              <GraficoCasos datosFiltrados={datosFiltrados} />
            </div>
           
            <div className="columna">
              <InformacionGrafico className="informacion-grafico" />
              <div className="fila-lado-a-lado">
                <MapaBolivia datos={datos} className="mapa-bolivia" />
                <Estadisticas datos={datos} className="estadisticas-container" />
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dinamicas;
