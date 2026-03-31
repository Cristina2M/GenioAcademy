import axios from 'axios';

// ==========================================
// CLIENTE HTTP (AXIOS) CONFIGURADO GLOBALMENTE
// ==========================================
// Todo el tráfico web hacia Django debe usar esta instancia.

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // El puerto de tu Backend en Docker
    headers: {
        'Content-Type': 'application/json',
    }
});

// INTERCEPTOR DE PETICIONES (Caballo de Troya)
// Antes de que cualquier petición abandone el navegador hacia Django,
// interceptamos la nave y le acoplamos el JWT Token si el alumno está logueado.
axiosInstance.interceptors.request.use(
    (config) => {
        // Miramos si en el cajón local (localStorage) hay tokens
        const authTokens = localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')) 
            : null;
            
        // Si sí hay un pase VIP, lo pegamos en los Headers HTTP
        if (authTokens) {
            config.headers.Authorization = `Bearer ${authTokens.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Respuestas (Automáticamente renueva la sesión si caduca, OPCIONAL PARA FUTURO)
// Por ahora devolvemos el error limpio para gestionarlo en el frontend
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
