import api from "../api/api";


export const login = async (email, password) => {
  try {
    // 1. Hacer la petición al backend
    const response = await api.post('/user/login', {
      email: email.toLowerCase().trim(), // Normalizamos el email
      password
    });

    
    if (!response.data.token) {
      throw new Error('No se recibió token de autenticación');
    }

    
    localStorage.setItem('token', response.data.token);

    
    return {
      success: true,
      token: response.data.token
    };

  } catch (error) {
    
    let errorMessage = 'Error al iniciar sesión';
    
    if (error.response) {
      
      if (error.response.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      
      errorMessage = 'El servidor no respondió';
    } else {
      
      errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};

export const register = async (email, password) => {
  try {
    
    const response = await api.post('/user/register', {
      email: email.toLowerCase().trim(),
      password
    });

    
    if (!response.data || !response.data.email) {
      throw new Error('Error en el registro');
    }

    
    return {
      success: true,
      user: response.data
    };

  } catch (error) {
    
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