import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// ==========================================
// COMPONENTE: RUTAS PRIVADAS
// ==========================================
// Actúa como un guardaespaldas para las URL que no deben ser públicas.
// Uso en App.jsx: <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

const PrivateRoute = ({ children }) => {
    // Pedimos al Contexto Global el estado actual del usuario
    const { user } = useContext(AuthContext);
    
    // Si NO hay usuario autenticado...
    if (!user) {
        // Redirigimos forzosamente y de forma secreta al Login (replace borra el historial previo)
        return <Navigate to="/login" replace />;
    }
    
    // Si sí hay usuario, le dejamos pasar y renderizarse
    return children;
};

export default PrivateRoute;
