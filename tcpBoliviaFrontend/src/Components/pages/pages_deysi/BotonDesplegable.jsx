import React, { useState } from 'react';

const BotonDesplegable = ({ onButtonClick }) => {
  const [desplegado, setDesplegado] = useState(false);

  const toggleDesplegado = () => {
    setDesplegado(!desplegado);
  };

  return (
    <div>
      <button onClick={toggleDesplegado}>
        {desplegado ? 'Ocultar Resoluciones' : 'Ver Resolución del Caso'}
      </button>
      {desplegado && (
        <div className="dropdown-buttons">
          <button onClick={() => onButtonClick('relator')}>Ver Relator</button>
          <button onClick={() => onButtonClick('tipoResolucion')}>Tipo de Resolución</button>
          <button onClick={() => onButtonClick('fondoVoto')}>Fondo Voto</button>
          <button onClick={() => onButtonClick('frecuenciaTiempo')}>Frecuencia de Tiempo</button>
        </div>
      )}
    </div>
  );
};

export default BotonDesplegable;
