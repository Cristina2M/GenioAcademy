import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

// 1. Creamos el portal mágico (El Contexto de React)
const AuthContext = createContext();

// 2. Creamos la nave nodriza que proveerá ese portal a toda la app
export const AuthProvider = ({ children }) => {
    // ESTADO: La caja de memoria RAM
    // Comprobamos si hay tokens antiguos al encender la app
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    
    // Si hay un token, lo decodificamos (jwtDecode extrae el usuario sin preguntar al servidor)
    const [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
    );
    
    // Un simple booleano para no pintar la UI hasta que los tokens se han leído de disco
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ==========================================
    // FUNCIÓN: INICIAR SESIÓN (Acceso)
    // ==========================================
    const loginUser = async (username, password) => {
        try {
            // Hacemos un disparo POST hacia SimpleJWT en Django
            const response = await axiosInstance.post('token/', {
                username,
                password
            });

            if (response.status === 200) {
                const data = response.data;
                // Guardarlo en Memoria RAM
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                // Guardarlo en Disco Duro Persistente (localStorage)
                localStorage.setItem('authTokens', JSON.stringify(data));
                
                // Redirigir como un campeón al espacio exterior
                navigate('/dashboard');
                return { success: true };
            }
        } catch (error) {
            console.error("Error al iniciar sesión", error);
            // Intentar desenterrar el motivo del error que mandó Django (ej. Contraseña incorrecta)
            const msg = error.response?.data?.detail || "Fallo en los motores. Servidor inaccesible.";
            return { success: false, error: msg };
        }
    };

    // ==========================================
    // FUNCIÓN: MATRICULARSE (Registro)
    // ==========================================
    const registerUser = async (userData) => {
        try {
            // Utilizamos el endpoint que creamos en Phase 5
            const response = await axiosInstance.post('users/register/', userData);
            
            if (response.status === 201) {
                // Registro Exitoso: Hacemos auto-login para que no tenga que meter la pass otra vez
                await loginUser(userData.username, userData.password);
                return { success: true };
            }
        } catch (error) {
            console.error("Error en inscripción", error);
            const errors = error.response?.data || {};
            // DRF devuelve arrays por cada campo malo. Ej: {username: ["Ese usuario ya existe"]}
            const firstErrorKey = Object.keys(errors)[0];
            const msg = firstErrorKey 
                ? `${firstErrorKey}: ${errors[firstErrorKey][0]}` 
                : "Se detectó una anomalía gravitacional al crear la cuenta.";
            return { success: false, error: msg };
        }
    };

    // ==========================================
    // FUNCIÓN: DESCONECTARSE (Logout)
    // ==========================================
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/'); // Eyectamos al inicio!
    };

    // ==========================================
    // FUNCIÓN: CAMBIAR AVATAR DE BÚHO
    // ==========================================
    const updateAvatar = async (avatarId) => {
        try {
            const response = await axiosInstance.post('users/management/update_avatar/', {
                selected_avatar: avatarId
            });
            if (response.status === 200) {
                const data = response.data;
                // Sustituimos los JWT antiguos porque el nuevo viene con la skin inyectada
                const newAuthTokens = { access: data.access, refresh: data.refresh };
                setAuthTokens(newAuthTokens);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(newAuthTokens));
                return { success: true };
            }
        } catch (error) {
            console.error("Error cambiando avatar", error);
            return { success: false };
        }
    };

    // Empaquetamos todo lo que queremos exponer de forma global
    const contextData = {
        user,
        authTokens,
        loginUser,
        registerUser,
        logoutUser,
        updateAvatar
    };

    // Solo se ejecuta 1 vez cuando la página arranca
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
