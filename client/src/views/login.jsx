import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { loginService } from '../services/AuthServices.js';
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, role } = await loginService(email, password);
      login(token);
      Swal.fire({
        title: "¡Bienvenido!",
        text: "Has iniciado sesión correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#E30713",
      }).then(() => {
  if (role === "SUPER_ADMIN") {
    navigate("/dashboard");
  } else if (role === "AUDITOR") {
    navigate("/auditor/home");
  }
});
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Correo o contraseña incorrectos",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#E30713",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-[#E6EAF3]">
        <img
          src="/src/assets/logoIncognita.png"
          alt="Incognita Logo"
          className="w-52 h-52 object-contain"
        />
        <h1 className="mb-10 font-bold text-2xl justify-center items-center">
          Sistema de Auditoría Publicitaria
        </h1>
        <div className="mb-15 rounded-lg p-8 bg-white shadow-lg w-99 justify-center items-center">
          <p className="font-bold text-xl text-center mb-9 ">Iniciar sesión</p>
          <form  onSubmit={handleSubmit}  action="" className="">
            <label htmlFor="">Correo:</label>
            <input
              type="text"
              className="border-1 border-gray-300 bg-gray-100 rounded-lg p-1 mb-4 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@laboratorio.com"
            />
            <label htmlFor="">Contraseña:</label>
            <input
              type="password"
              className="border-1 border-gray-300 bg-gray-100 rounded-lg p-1 mb-4 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            <div className="flex justify-center w-full mb-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-4 bg-[#1A6795] flex flex-col items-center text-white rounded-lg px-4 py-2 hover:bg-[#0F1F28] transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Cargando..." : "Iniciar sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
