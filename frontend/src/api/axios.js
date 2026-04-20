import axios from 'axios';

// ==========================================
// CLIENTE HTTP (AXIOS) CONFIGURADO GLOBALMENTE
// ==========================================
// La URL base viene de la variable de entorno VITE_API_URL:
//   - En desarrollo local (.env.local): http://127.0.0.1:8000/api/
//   - En producción (Vercel):           https://api.cristina2daw.es/api/
// Vite inyecta las variables VITE_* en tiempo de compilación.

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

const axiosInstance = axios.create({
    baseURL: API_URL,
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

// Interceptor de Respuestas: El Centinela de los JWT
// Protege al usuario de los "401 Unauthorized" si el Token de Acceso principal se desgasta.
axiosInstance.interceptors.response.use(
    (response) => response, // Dejamos pasar las respuestas válidas (HTTP 200, 201)
    async (error) => {
        const interceptada = error.config; // Guardamos un clon de la petición original
        const url = interceptada?.url || '';
        
        // Si el error viene del propio endpoint de refresco, evitamos bucles infinitos
        // y limpiamos la sesión directamente
        if (url.includes('token/refresh/')) {
            console.error("Sesión inválida detectada en refresh. Forzando deslogueo.");
            localStorage.removeItem('authTokens');
            window.location.href = '/login';
            return Promise.reject(error);
        }
        
        // Si Django grita 401 (Prohibido) y NO estábamos ya intentando renovar un token...
        if (error.response && error.response.status === 401 && !interceptada._retry) {
            interceptada._retry = true; // Marcamos que estamos en proceso de reintento para evitar bucles infinitos
            
            try {
                const authTokens = localStorage.getItem('authTokens') 
                    ? JSON.parse(localStorage.getItem('authTokens')) 
                    : null;
                    
                // Si el alumno tiene en su mochila un Refresh Token válido
                if (authTokens?.refresh) {
                    // ⚠️ ATENCIÓN: Usamos "axios.post" estándar, NO "axiosInstance.post" 
                    // Si usamos la instancia, su propio interceptor chocaría consigo mismo.
                    const respuestaRefresco = await axios.post(`${API_URL}token/refresh/`, {
                        refresh: authTokens.refresh
                    });
                    
                    // El Backend nos da una llave nueva, la empaquetamos con todo lo demas intacto
                    const nuevosTokens = {
                        ...authTokens,
                        access: respuestaRefresco.data.access
                    };
                    
                    // Sobrescribimos el localStorage para que el AuthContext lo lea después
                    localStorage.setItem('authTokens', JSON.stringify(nuevosTokens));
                    
                    // Le ponemos a la petición secuestrada la llave recién forjada
                    interceptada.headers.Authorization = `Bearer ${nuevosTokens.access}`;
                    
                    // Volvemos a enviar la petición rebelde, ahora con permisos, como si nada hubiera pasado.
                    return axiosInstance(interceptada);
                }
            } catch (err) {
                // EXCEPCIÓN LETAL: El Refresh Token también ha muerto o el usuario ya no existe.
                // En cualquier caso, borramos la sesión y mandamos al login.
                console.error("Sesión Expirada por completo. Forzando deslogueo.");
                localStorage.removeItem('authTokens');
                window.location.href = '/login'; 
                return Promise.reject(err);
            }
        }
        
        // Si es cualquier otro error (Ej: 404, 500) lo dejamos caer y lo maneja el catch() del componente
        return Promise.reject(error);
    }
);

export default axiosInstance;
