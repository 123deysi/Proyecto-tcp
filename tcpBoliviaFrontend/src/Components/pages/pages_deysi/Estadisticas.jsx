import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../../Styles/Styles_deysi/estadisticas.css";

const Estadisticas = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contar/casos/resoluciones'); 
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    
    <div className="card-container-estadisticas">
      <div className="card-estadisticas">
        <div className="card-header-estadisticas">Total causas</div>
        <div className="card-body-estadisticas">{data.total_casos}</div>
      </div>

      <div className="card-estadisticas">
        <div className="card-header-estadisticas">Causas resueltos</div>
        <div className="card-body-estadisticas">{data.total_resoluciones}</div>
      </div>

      <div className="card-estadisticas">
        <div className="card-header-estadisticas">Causas no resueltos</div>
        <div className="card-body-estadisticas">{data.casos_no_resueltos}</div>
      </div>

      

    </div>
    
  );
};

export default Estadisticas;
