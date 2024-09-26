import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Componente para manejar filtros select
const SelectInput = ({ label, options, value, onChange, disabled = false }) => (
  <FormControl variant="outlined" style={{ flex: 1, marginRight: '10px', minWidth: '200px' }} disabled={disabled}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={onChange}
      label={label}
      IconComponent={ArrowDropDown}
      style={{ backgroundColor:'#fff'}}
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value || option}>
          {option.label || option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const FiltroBusquedaAvanzada = () => {
  const [datosIniciales, setDatosIniciales] = useState({
    departamentos: [],
    salas: [],
    acciones: [],
    periodos: [],
    subtipos: []
  });
  const [accionSeleccionada, setAccionSeleccionada] = useState('');
  const [subtipoSeleccionado, setSubtipoSeleccionado] = useState('');
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');
  const [salaSeleccionada, setSalaSeleccionada] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Llama a la API para obtener los datos iniciales
  useEffect(() => {
    const fetchDatosIniciales = async () => {
      try {
        const response = await axios.get('/api/obtenerDatosIniciales', {
          params: {
            accionSeleccionada
          }
        });
        setDatosIniciales(response.data);
      } catch (error) {
        console.error('Error al obtener los datos iniciales:', error);
      }
    };

    fetchDatosIniciales();
  }, [accionSeleccionada]);

  // Llama a la API para contar los casos
  const fetchConteoCasos = async () => {
    try {
        const response = await axios.get('/api/contarCasos', {
            params: {
                departamento_id: departamentoSeleccionado !== 'todos' ? departamentoSeleccionado : '',
                sala_id: salaSeleccionada !== 'todos' ? salaSeleccionada : '',
                periodo: periodoSeleccionado !== 'todos' ? periodoSeleccionado : '',
                accion_id: accionSeleccionada !== 'todos' ? accionSeleccionada : '',
                subtipo_id: subtipoSeleccionado !== 'todos' ? subtipoSeleccionado : ''
            }
        });

        // Accede a los datos de la respuesta
        console.log('Conteo de casos:', response.data.conteo);
        actualizarGrafica(response.data.conteo);
    } catch (error) {
        console.error('Error al contar los casos:', error);
    }
};


  // Actualiza la gráfica con los datos de conteo de casos
  const actualizarGrafica = (conteo) => {
    let labels = [];
    let data = [];

    switch (opcionSeleccionada) {
      case 'departamento':
        labels = datosIniciales.departamentos.map(departamento => departamento?.nombre || 'Desconocido');
        data = labels.map(departamento => {
          const count = conteo.filter(caso => 
            caso.departamento_id === datosIniciales.departamentos.find(d => d.nombre === departamento)?.id
          ).length;
          return count;
        });
        break;

      case 'sala':
        labels = datosIniciales.salas.map(sala => sala?.nombre || 'Desconocido');
        data = labels.map(sala => {
          const count = conteo.filter(caso => 
            caso.sala_id === datosIniciales.salas.find(s => s.nombre === sala)?.id
          ).length;
          return count;
        });
        break;

      case 'periodo':
        labels = [...new Set(datosIniciales.periodos)];
        data = labels.map(periodo =>
          conteo.filter(caso => 
            new Date(caso?.fecha_ingreso).getFullYear() === periodo
          ).length
        );
        break;

      case 'accionConstitucional':
        labels = datosIniciales.subtipos.map(subtipo => subtipo?.label || 'Desconocido');
        data = labels.map(subtipo => {
          const count = conteo.filter(caso =>
            caso.subtipo_accion_id === datosIniciales.subtipos.find(st => st.label === subtipo)?.value
          ).length;
          return count;
        });
        break;

      default:
        console.log("Opción seleccionada no válida.");
        break;
    }

    setChartData({
      labels,
      datasets: [{
        label: 'Cantidad de Casos',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    });
  };

  // Llamar a fetchConteoCasos cuando los filtros cambian
  useEffect(() => {
    fetchConteoCasos();
  }, [departamentoSeleccionado, salaSeleccionada, periodoSeleccionado, opcionSeleccionada, accionSeleccionada, subtipoSeleccionado]);

  return (
    <div className="busqueda-avanzada" style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Filtro de Casos</h3>

      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px' }}>
        <SelectInput
          label="Seleccionar Por"
          options={[
            { value: '', label: 'Seleccionar' },
            { value: 'departamento', label: 'Departamento' },
            { value: 'sala', label: 'Sala' },
            { value: 'periodo', label: 'Periodo' },
            { value: 'accionConstitucional', label: 'Acción Constitucional' }
          ]}
          value={opcionSeleccionada}
          onChange={(e) => setOpcionSeleccionada(e.target.value)}
        />

        {opcionSeleccionada === 'accionConstitucional' && (
          <>
            <SelectInput
              label="Acción Constitucional"
              options={datosIniciales.acciones.map(accion => ({ value: accion.id, label: accion.nombre }))}
              value={accionSeleccionada}
              onChange={(e) => setAccionSeleccionada(e.target.value)}
            />
            
            {accionSeleccionada && (
              <SelectInput
                label="Subtipo de Acción"
                options={datosIniciales.subtipos.map(subtipo => ({ value: subtipo.value, label: subtipo.label }))}
                value={subtipoSeleccionado}
                onChange={(e) => setSubtipoSeleccionado(e.target.value)}
              />
            )}
          </>
        )}

        {opcionSeleccionada === 'departamento' && (
          <SelectInput
            label="Departamento"
            options={datosIniciales.departamentos.map(depto => ({ value: depto.id, label: depto.nombre }))}
            value={departamentoSeleccionado}
            onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
          />
        )}

        {opcionSeleccionada === 'sala' && (
          <SelectInput
            label="Sala"
            options={datosIniciales.salas.map(sala => ({ value: sala.id, label: sala.nombre }))}
            value={salaSeleccionada}
            onChange={(e) => setSalaSeleccionada(e.target.value)}
          />
        )}

        {opcionSeleccionada === 'periodo' && (
          <SelectInput
            label="Periodo"
            options={datosIniciales.periodos.map(periodo => ({ value: periodo, label: periodo }))}
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          />
        )}
      </div>

      <Divider style={{ margin: '20px 0' }} />
 
      <div>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Cantidad de Casos por Categoría',
              },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default FiltroBusquedaAvanzada;
