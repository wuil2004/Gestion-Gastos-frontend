import api from "../api/api";


export const login = async (email, password) => {
  try {
    // 1. Hacer la petición al backend
    const response = await api.post('/user/login', {
      email: email.toLowerCase().trim(), // Normalizamos el email
      password
    });

    // 2. Verificar que recibimos un token
    if (!response.data.token) {
      throw new Error('No se recibió token de autenticación');
    }

    // 3. Guardar el token en localStorage
    localStorage.setItem('token', response.data.token);

    // 4. Retornar los datos relevantes
    return {
      success: true,
      token: response.data.token
    };

  } catch (error) {
    // 5. Manejo de errores mejorado
    let errorMessage = 'Error al iniciar sesión';
    
    if (error.response) {
      // Error del servidor (400, 500, etc.)
      if (error.response.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      errorMessage = 'El servidor no respondió';
    } else {
      // Error al configurar la petición
      errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};

export const register = async (email, password) => {
  try {
    // 1. Hacer la petición al backend
    const response = await api.post('/user/register', {
      email: email.toLowerCase().trim(),
      password
    });

    // 2. Verificar la respuesta
    if (!response.data || !response.data.email) {
      throw new Error('Error en el registro');
    }

    // 3. Retornar los datos del usuario
    return {
      success: true,
      user: response.data
    };

  } catch (error) {
    // 4. Manejo de errores
    let errorMessage = 'Error al registrar';
    
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = 'El email ya está registrado';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }
    
    throw new Error(errorMessage);
  }
};