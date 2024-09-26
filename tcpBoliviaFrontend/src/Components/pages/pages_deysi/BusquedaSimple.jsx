import React, { useState } from 'react';
import '../../../Styles/Styles_deysi/dinamicas.css';
import '../../../Styles/Styles_deysi/busquedaSimple.css';

const preguntas = [
    "¿En qué departamentos y municipios se han registrado más casos?",
    "¿Qué casos están asociados a un departamento y municipio específicos?",
    "¿Cuáles son los casos relacionados con un tipo específico de acción constitucional?",
    "¿Qué subtipos de acción constitucional se han aplicado en casos específicos?",
    "¿Cuántos casos se han registrado en un período específico?",
    "¿Qué casos están asignados a una sala particular?",
    "¿Cuántos casos cumplen con una combinación específica de criterios?",
    "¿Qué resoluciones están asociadas a casos con combinación específica de criterios?",
    "¿Cuáles son los tipos y resultados de resoluciones más comunes?",
    "¿Cómo se distribuyen los resultados de las resoluciones en función de los filtros aplicados?"
];

const BusquedaSimple = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPreguntas, setFilteredPreguntas] = useState(preguntas);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = preguntas.filter(pregunta =>
            pregunta.toLowerCase().includes(term)
        );
        setFilteredPreguntas(filtered);
    };

    const handlePreguntaClick = (pregunta) => {
        // Llama a la función de búsqueda o realiza una acción al seleccionar una pregunta
        onSearch(pregunta);
    };

    return (
        <div className='fondo_Dinamica'>
            <div className='busqueda-simple-header'>
                <h3 className='letra'>Búsqueda Jurisprudencia Estadístico</h3>
                <div className='card-header bg-dorado d-flex align-items-center' role="tab">
                    <h5 className="font-weight-bold mb-0">
                        <i className="fa fa-filter"></i> Campos de Búsqueda Simple
                    </h5>
                    <a href="principal" className="btn btn-outline-dark font-weight-bold ml-auto">
                        <i className="fa fa-arrow-left"></i> Atrás
                    </a>
                </div>
            </div>

            <div className='busqueda-simple-content'>
                <input
                    type="text"
                    className="search-input form-control mb-3"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Filtra las preguntas..."
                />

                {filteredPreguntas.length > 0 ? (
                    <div className="preguntas-container">
                        {filteredPreguntas.map((pregunta, index) => (
                            <div
                                className="pregunta-card"
                                key={index}
                                onClick={() => handlePreguntaClick(pregunta)}
                            >
                                <div className="pregunta-icon">
                                    <i className="fa fa-question-circle"></i>
                                </div>
                                <div className="pregunta-content">
                                    <h6 className="pregunta-titulo">{pregunta}</h6>
                                    <p className="pregunta-descripcion">
                                        Haz clic para ver más detalles o realizar una búsqueda específica.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div className="alert alert-warning">
                        No se encontraron resultados para tu búsqueda.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusquedaSimple;
