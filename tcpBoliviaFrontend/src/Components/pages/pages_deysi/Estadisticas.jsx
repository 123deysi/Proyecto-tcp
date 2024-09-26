import React from 'react';
import "../../../Styles/Styles_deysi/estadisticas.css";
import { Card, CardContent, Typography } from '@mui/material';

const Estadisticas = ({ datos }) => {
  return (
    <div className="card-container-estadisticas">

  <div className="card-estadisticas">
    <div className="card-header-estadisticas">Total casos</div>
    <div className="card-body-estadisticas">20000000000000000</div>
  </div>

  <div className="card-estadisticas">
    <div className="card-header-estadisticas">Casos resueltos</div>
    <div className="card-body-estadisticas">1000000000000000</div>
  </div>
   
  <div className="card-estadisticas">
    <div className="card-header-estadisticas">Casos no resueltos</div>
    <div className="card-body-estadisticas">10000000000000000</div>
  </div>
</div>

  );
};

export default Estadisticas;
