import React from 'react';

const Filtros = ({
  departamentos,
  periodos,
  accionesConstitucionales,
  filtroDepartamento,
  setFiltroDepartamento,
  filtroPeriodo,
  setFiltroPeriodo,
  filtroAccionConstitucional,
  setFiltroAccionConstitucional,
  filtroSubtipoAccionConstitucional,
  setFiltroSubtipoAccionConstitucional,
  subtiposAccionConstitucional = []
}) => (
  <div className='contenido_cajas_filtro'>
    <label htmlFor="departamento">Filtrar por Departamento:</label>
    <select
      id="departamento"
      value={filtroDepartamento}
      onChange={e => setFiltroDepartamento(e.target.value)}
    >
      <option value=''>Todos</option>
      {departamentos.map(depto => (
        <option key={depto.id} value={depto.id}>{depto.nombre}</option>
      ))}
    </select>

    <label htmlFor="periodo">Filtrar por Periodo:</label>
    <select
      id="periodo"
      value={filtroPeriodo}
      onChange={e => setFiltroPeriodo(e.target.value)}
    >
      <option value=''>Todos</option>
      {periodos.map(periodo => (
        <option key={periodo} value={periodo}>{periodo}</option>
      ))}
    </select>

    <label htmlFor="accionConstitucional">Filtrar por Acción Constitucional:</label>
    <select
      id="accionConstitucional"
      value={filtroAccionConstitucional}
      onChange={e => setFiltroAccionConstitucional(e.target.value)}
    >
      <option value=''>Todos</option>
      {accionesConstitucionales.map(accion => (
        <option key={accion.id} value={accion.id}>{accion.nombre}</option>
      ))}
    </select>

    {filtroAccionConstitucional && subtiposAccionConstitucional.length > 0 && (
      <>
        <label htmlFor="subtipoAccionConstitucional">Filtrar por Subtipo de Acción Constitucional:</label>
        <select
          id="subtipoAccionConstitucional"
          value={filtroSubtipoAccionConstitucional}
          onChange={e => setFiltroSubtipoAccionConstitucional(e.target.value)}
        >
          <option value=''>Todos</option>
          {subtiposAccionConstitucional.map(subtipo => (
            <option key={subtipo.id} value={subtipo.id}>{subtipo.nombre}</option>
          ))}
        </select>
      </>
    )}
  </div>
);

export default Filtros;
