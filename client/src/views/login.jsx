import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { loginService } from "../services/AuthServices.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const inputClass = (error, touched) =>
    `w-full border rounded-lg p-2 bg-gray-100 ${
      error && touched ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#E6EAF3] px-4">

      <img
        src="/src/assets/logoIncognita.png"
        alt="Incognita Logo"
        className="w-40 sm:w-52 object-contain"
      />

      <h1 className="mb-8 font-bold text-xl sm:text-2xl text-center">
        Sistema de Auditoría Publicitaria
      </h1>

      <div className="rounded-lg p-8 bg-white shadow-lg w-full max-w-md">

        <p className="font-bold text-xl text-center mb-6">
          Iniciar sesión
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {

            try {

              const { token, role } = await loginService(
                values.email,
                values.password
              );

              login(token);

              await Swal.fire({
                title: "¡Bienvenido!",
                text: "Has iniciado sesión correctamente",
                icon: "success",
                confirmButtonColor: "#1A6795",
              });

              if (role === "SUPER_ADMIN") {
                navigate("/dashboard");
              } else if (role === "AUDITOR") {
                navigate("/auditor/home");
              }

            } catch (err) {

              setStatus("Correo o contraseña incorrectos");

            } finally {

              setSubmitting(false);

            }

          }}
        >
          {({ errors, touched, isSubmitting, status }) => (

            <Form className="space-y-4">

              {status && (
                <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
                  {status}
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Correo</label>

                <Field
                  name="email"
                  type="email"
                  placeholder="usuario@laboratorio.com"
                  className={inputClass(errors.email, touched.email)}
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contraseña</label>

                <div className="relative">

                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className={`${inputClass(errors.password, touched.password)} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>

                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-2 text-white py-2 rounded-lg transition-colors
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#1A6795] hover:bg-[#0F1F28]"
                }`}
              >
                {isSubmitting ? "Cargando..." : "Iniciar sesión"}
              </button>

            </Form>

          )}
        </Formik>

      </div>
    </div>
  );
}

export default Login;