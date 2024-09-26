import React from 'react';
import { List, ListItem, ListItemText, Drawer, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';  // Importa useLocation
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileUploadIcon from '@mui/icons-material/Upload';
import '../../../Styles/Styles_administrador/Sidebar.css';

const Sidebar = ({ className }) => {
  const location = useLocation();  // Obtiene la ruta actual

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
      className={className}
    >
      <Toolbar className="sidebar-toolbar">
        <Typography variant="h6"  className="sidebar-title">
          Admin Menu
        </Typography>
      </Toolbar>
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/Administrador/Dashboard" 
          className={`sidebar-list-item ${location.pathname === '/Administrador/Dashboard' ? 'active' : ''}`}
        >
          <DashboardIcon sx={{ mr: 1 }} className="sidebar-icon" />
          <ListItemText primary="Dashboard" className={`sidebar-list-item-text ${location.pathname === '/Administrador/Dashboard' ? 'active' : ''}`} />
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/Administrador/Subir/Excel" 
          className={`sidebar-list-item ${location.pathname === '/Administrador/Subir/Excel' ? 'active' : ''}`}
        >
          <FileUploadIcon sx={{ mr: 1 }} className="sidebar-icon" />
          <ListItemText primary="Subir Excel" className={`sidebar-list-item-text ${location.pathname === '/Administrador/Subir/Excel' ? 'active' : ''}`} />
        </ListItem>

        <ListItem 
          button 
          component={Link} 
          to="/Administrador/cerrarsesion" 
          className={`sidebar-list-item ${location.pathname === '/Administrador/cerrarsesion' ? 'active' : ''}`}
        >
          <ExitToAppIcon sx={{ mr: 1 }} className="sidebar-icon" />
          <ListItemText primary="Cerrar Sesión" className={`sidebar-list-item-text ${location.pathname === '/Administrador/cerrarsesion' ? 'active' : ''}`} />
        </ListItem>

        {/* Agrega otros elementos del menú aquí */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
