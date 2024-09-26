import React from 'react';

import '../../../Styles/Styles_deysi/cardBusqueda.css'
const CardBusqueda = () => {
  return (
    <div className="row  text-center d-flex justify-content-between">
       <div className="col-2  col-sm-6 py-2 mx-5">
          <a href="/Dinamicas/Busqueda/Simple" className="link-options text-white">
            <div className="card bg-rojo card-options h-100 mb-0">
              <div className="card-body">
                <div className="h1 text-muted mb-4">
                  <i className="fa fa-search"></i>
                </div>
                <h5 className="card-title font-weight-bold text-white">BÚSQUEDA SIMPLE</h5>
                <p>Permite buscar Jurisprudencia de una manera fácil y sencilla a sola palabra ingresada.</p>
              </div>
            </div>
          </a>
        </div>
        <div className='col-4'>
        </div>
        <div className="col-2 col-sm-6 py-2 mx-5">
          <a href="/Dinamicas/Busqueda-Avanzada" className="link-options text-white">
            <div className="card bg-amarillo card-options h-100 mb-0">
              <div className="card-body">
                <div className="h1 text-muted mb-4">
                  <i className="fa fa-search-plus"></i>
                </div>
                <h5 className="card-title font-weight-bold text-white">BÚSQUEDA AVANZADA</h5>
                <p className="text-white">Permite buscar Jurisprudencia de una manera más precisa a través de diferentes campos opcionales.</p>
              </div>
            </div>
          </a>
        </div>
    </div>
  );
};

export default CardBusqueda;
