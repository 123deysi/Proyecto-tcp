import React, { useState, useEffect } from 'react';
import '../../Styles/dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Dashboard = () => {
  const [user, setUser] = useState(null); // El usuario actual (autenticado)
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' }); // Nuevo usuario para agregar
  const [editUser, setEditUser] = useState(null); // Usuario que se está editando
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    // Obtiene el token y los datos del usuario del localStorage
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!token) {
      // Si no hay token, redirige al inicio de sesión
      navigate('/login');
      return;
    }

    setUser(storedUser);

    // Configura los headers con el token para autenticación
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Obtener los usuarios del backend
    axios.get('http://localhost:8000/api/users', config)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, [navigate]);

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      const token = localStorage.getItem('token');

      // Configura los headers con el token para autenticación
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      axios.post('http://localhost:8000/api/register', newUser, config)
        .then(response => {
          setUsers([...users, response.data.user]);
          setNewUser({ name: '', email: '', password: '' }); // Limpiar el formulario
        })
        .catch(error => console.error('Error al registrar usuario:', error));
    }
  };

  const handleDeleteUser = (id) => {
    const token = localStorage.getItem('token');

    // Configura los headers con el token para autenticación
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.delete(`http://localhost:8000/api/users/${id}`, config)
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
      })
      .catch(error => console.error('Error al eliminar usuario:', error));
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleUpdateUser = () => {
    const token = localStorage.getItem('token');

    // Configura los headers con el token para autenticación
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.put(`http://localhost:8000/api/users/${editUser.id}`, editUser, config)
      .then((response) => {
        const updatedUsers = users.map((u) => (u.id === editUser.id ? response.data.user : u));
        setUsers(updatedUsers);
        setEditUser(null); // Limpiar el formulario de edición
      })
      .catch((error) => {
        console.error('Error al actualizar usuario:', error.response ? error.response.data : error.message);
      });
  };

  const closeEditModal = () => {
    setEditUser(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {user ? (
          <div className="dashboard-card">
            <h2 className="dashboard-title">Bienvenido, {user.name}</h2>
            <p className="dashboard-email">Email: {user.email}</p>
            <button className="dashboard-button">Ir a Perfil</button>
          </div>
        ) : (
          <p className="loading-text">Cargando datos...</p>
        )}
      </div>

      <div className="crud-container">
        <h1>Gestión de Usuarios</h1>

        {/* Formulario para agregar nuevo usuario */}
        <div className="form-container">
          <h2>Registrar Usuario</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Correo"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <button className="crud-button" onClick={handleAddUser}>
            Agregar Usuario
          </button>
        </div>

        {/* Mostrar usuarios en una tabla */}
        <h1>Usuarios Registrados</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className='buton-edit-delete'>
                  <button className="edit-button" onClick={() => handleEditUser(user)}>Editar</button>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para editar un usuario */}
        {editUser && (
          <div className="modal-overlay" onClick={closeEditModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeEditModal}>✕</button>
              <h2>Editar Usuario</h2>
              <input
                type="text"
                placeholder="Nombre"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Correo"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
              />
              <button className="crud-button" onClick={handleUpdateUser}>
                Actualizar Usuario
              </button>
              <button className="crud-button cancel" onClick={() => setEditUser(null)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
