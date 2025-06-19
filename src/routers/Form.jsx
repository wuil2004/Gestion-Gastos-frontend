import { useState } from "react";
import InputForm from "../components/InputForm";
import Button from "../components/Button";
import { login, register } from "../js/formularioLogin";

const Form = ({ ruta, setIsAuthenticated }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const manejarFormulario = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true
    });

    // Validación de campos
    if (!formData.email || !formData.password) {
      setError("Todos los campos son requeridos");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData.email, formData.password);
        alert("¡Registro exitoso! Ahora puedes iniciar sesión");
        setIsRegister(false);
        setFormData({ email: "", password: "" });
        setTouched({ email: false, password: false });
      } else {
        await login(formData.email, formData.password);
        setIsAuthenticated(true);
        ruta("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar si hay errores de validación
  const getFieldError = (field) => {
    return touched[field] && !formData[field] ? "Este campo es requerido" : "";
  };

  return (
    <form onSubmit={manejarFormulario} className="h-fit my-auto shadow-lg p-4 rounded bg-gray-700 flex flex-col items-center gap-5">
      <h1 className="text-emerald-200 text-3xl text-center font-bold">
        {isRegister ? "Regístrate" : "Iniciar Sesión"}
      </h1>

      {error && (
        <div className="w-full p-2 bg-red-100 text-red-700 rounded text-center text-sm">
          {error}
        </div>
      )}

      <div className="text-white bg-gray-600 rounded shadow w-full h-auto flex flex-col p-4 gap-2">
        <div>
          <label>Email:</label>
          <InputForm
            type="email"
            name="email"
            placeHolder="correo@ejemplo.com"
            isRequired={true}
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
          />
          {getFieldError("email") && (
            <p className="text-red-300 text-xs mt-1">{getFieldError("email")}</p>
          )}
        </div>
        
        <div>
          <label>Contraseña:</label>
          <InputForm
            type="password"
            name="password"
            placeHolder=""
            isRequired={true}
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
          />
          {getFieldError("password") && (
            <p className="text-red-300 text-xs mt-1">{getFieldError("password")}</p>
          )}
        </div>
        
        <Button 
          text={loading 
            ? (isRegister ? "Registrando..." : "Iniciando...") 
            : (isRegister ? "Crear cuenta" : "Ingresar")} 
          disabled={loading}
        />
      </div>

      <p className="text-xs text-center text-white">
        {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
        <button
          type="button"
          className="text-emerald-300 ml-1 focus:outline-none"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setTouched({ email: false, password: false });
          }}
        >
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </button>
      </p>
    </form>
  );
};

export default Form;