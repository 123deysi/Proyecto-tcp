import React from 'react';

const TablaFiltrada = ({
  datos,
  filtroDepartamento,
  filtroPeriodo,
  filtroAccionConstitucional,
  filtroSubtipoAccionConstitucional,
  contarAccionesConstitucionales
}) => {
  const datosFiltrados = datos.filter(dato =>
    (!filtroDepartamento || dato.departamento_id === filtroDepartamento) &&
    (!filtroPeriodo || dato.año_codif === filtroPeriodo) &&
    (!filtroAccionConstitucional || dato.subtipo_accion_id === filtroAccionConstitucional) &&
    (!filtroSubtipoAccionConstitucional || dato.subtipo_accion_id === filtroSubtipoAccionConstitucional)
  );

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Expediente</th>
          <th>Referencia</th>
          <th>Departamento</th>
          <th>Año</th>
          <th>Acción Constitucional</th>
        </tr>
      </thead>
      <tbody>
        {datosFiltrados.map(dato => (
          <tr key={dato.id}>
            <td>{dato.exp}</td>
            <td>{dato.ref}</td>
            <td>{dato.departamento_id}</td> {/* Considera reemplazar esto con el nombre del departamento */}
            <td>{dato.año_codif}</td>
            <td>{dato.subtipo_accion_id}</td> {/* Considera reemplazar esto con el nombre del subtipo */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaFiltrada;
