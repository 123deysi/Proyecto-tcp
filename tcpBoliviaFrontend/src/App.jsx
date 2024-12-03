import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Sidebar from "./Components/pages/pages_administrador/Sidebar";
import Analisis from "./Components/pages/Preguntas";
import Novedades from "./Components/pages/Novedades";
import Inicio from "./Components/pages/Inicio";
import Preguntas from "./Components/pages/Preguntas";
import Login from "./Components/pages/Login";
import Dashboard from "./Components/pages/Dashboard";
import Jurisprudencia from "./Components/pages/pages_randy/Jurisprudencia";
import JurisprudenciaBusqueda from "./Components/pages/pages_randy/JurisprudenciaBusqueda";
import AnalisisMateria from "./Components/pages/pages_randy/AnalisisMateria";
import JurisprudenciaCronologia from "./Components/pages/pages_randy/JurisprudenciaCronologia";
import ResultadoAnalisis from "./Components/pages/pages_randy/ResultadoAnalisis";
import ResolucionTSJ from "./Components/pages/pages_randy/resoluciones/ResolucionTSJ";
import CronologiasResultados from "./Components/pages/pages_randy/CronologiasResultados";
import JurisprudenciaLista from "./Components/pages/pages_randy/JurisprudenciaLista";
import AnalisisMagistrados from "./Components/pages/pages_randy/AnalisisMagistrados";
import MagistradoTSJ from "./Components/pages/pages_randy/magistrados/MagistradoTSJ";


import AdminLayout from "./Components/pages/pages_administrador/AdminLayout";
import FormularioCaso from "./Components/pages/pages_administrador/FormularioCaso";
import FormularioResolucion from "./Components/pages/pages_administrador/FormularioResolucion";
import Formulario from "./Components/pages/pages_administrador/Formulario";
import FormularioExcel from "./Components/pages/pages_administrador/FormularioExcel";
import BusquedaSimple from "./Components/pages/pages_deysi/BusquedaSimple";
import { ThemeProvider } from "./Components/ThemeProvider";
import CerrarLogin from './Components/pages/CerrarLogin';
import PaginaPrincipal from './Components/pages/pages_deysi/PaginaPrincipal';
import PaginaFiltro from './Components/pages/pages_deysi/PaginaFiltro';
import PaginaFiltros2 from './Components/pages/pages_deysi/PaginaFiltros2';

function App() {
  const location = useLocation();
  const noNavbarRoutes = ['/Jurisprudencia/Resolucion/:id'];
  const noFooterRoutes = ['/Jurisprudencia/Resolucion/:id', '/Jurisprudencia/Busqueda', '/Jurisprudencia/Cronologias'];
  const isAdminRoute = location.pathname.startsWith('/Administrador');

  const shouldShowNavbar = !noNavbarRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );

  const shouldShowFooter = !noFooterRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );

  return (
    <ThemeProvider>
      <main>
        {shouldShowNavbar && !isAdminRoute && <Navbar />}
        {isAdminRoute && <Sidebar />}
        <Routes>
          <Route path="/" element={<Navigate to="/Inicio" />} />
          <Route path="/Analisis" element={<Analisis />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Novedades" element={<Novedades />} />
          <Route path="/Preguntas" element={<Preguntas />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />

          <Route path="/Jurisprudencia" element={<Jurisprudencia />} />
          <Route path="/Jurisprudencia/Analisis-Materia" element={<AnalisisMateria />} />
          <Route path="/Jurisprudencia/Analisis-Magistrados" element={<AnalisisMagistrados />} />
          <Route path="/Jurisprudencia/Lista-de-analisis" element={<JurisprudenciaLista />} />
          <Route path="/Jurisprudencia/Resultados" element={<ResultadoAnalisis />} />
          <Route path="/Jurisprudencia/Busqueda" element={<JurisprudenciaBusqueda />} />
          <Route path="/Jurisprudencia/Cronologias" element={<JurisprudenciaCronologia />} />
          <Route path="/Jurisprudencia/Magistrado/:id" element={<MagistradoTSJ />} />
          <Route path="/Jurisprudencia/Resolucion/:id" element={<ResolucionTSJ />} />
          <Route path="/Jurisprudencia/Cronologias/Resultados" element={<CronologiasResultados />} />
          

        
          <Route path="/Dinamicas/Busqueda/Simple" element={<BusquedaSimple />} />
          <Route path="/Formulario/Datos" element={<FormularioCaso />} />
          <Route path="/Formulario/Casos" element={<FormularioCaso />} />
          <Route path="/Formulario/Resoluciones" element={<FormularioResolucion />} />
          <Route path="/Subir/Excel" element={<FormularioExcel />} />
          
          <Route path="/Dinamicas" element={<PaginaPrincipal />} />
          <Route path="/Dinamicas/Filtro" element={<PaginaFiltro />} />
          <Route path="/Dinamicas/Filtro2" element={<PaginaFiltros2 />} />
          
          
          <Route path="/Administrador" element={<AdminLayout />}>
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="Formulario/Casos" element={<FormularioCaso />} />
            <Route path="Formulario/Resoluciones" element={<FormularioResolucion />} />
            <Route path="Formulario" element={<Formulario />} />
            <Route path="Subir/Excel" element={<FormularioExcel />} />
            <Route path="cerrarsesion" element={<CerrarLogin />} />
          </Route>
        </Routes>
        {shouldShowFooter && !isAdminRoute && <Footer />}
      </main>
    </ThemeProvider>
  );
}

export default App;
