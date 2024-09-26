import React from 'react';
import "../../../Styles/Styles_deysi/Inicio.css";
const InformacionGrafico = () => {
  return (
    <div className="informacion-grafico">
      <h3>Información del Gráfico</h3>
      <p>
        Este gráfico muestra la cantidad de casos de la Jurisprudencia del Tribunal Constitucional Plurinacional de Bolivia agrupados por año.
      </p>
      <p>
        A medida que los datos cambien en la base de datos, este gráfico se actualizará automáticamente para reflejar los nuevos datos.
      </p>
    </div>
  );
};

export default InformacionGrafico;
