import React from 'react';
import '../../../Styles/Styles_deysi/dinamicas.css'
import FiltroBusquedaAvanzada from './FiltroBusquedaAvanzada';
import ChartComponent from './graficaApilada'; 

const BusquedaAvanzada = () => {

  return (
    <div className='fondo_Dinamica'>
      <h3 className='letra'>Busqueda jurisprudencia estadístico</h3>
      <div className='contenedor_principal'>
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h5 className="font-weight-bold mb-0">
            <i className="fa fa-filter"></i> Campos de Búsqueda Avanzada
          </h5>
          <a href="principal" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>
     
        <FiltroBusquedaAvanzada/>
        <ChartComponent/>
        
      </div>
    </div>
  );
}

export default BusquedaAvanzada;
