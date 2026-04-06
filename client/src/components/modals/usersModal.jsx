import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUser, updateUser } from "../../services/userService";
import * as Yup from "yup";
import Swal from "sweetalert2";

const getValidationSchema = (isEdit) =>
  Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellidos: Yup.string().required("Los apellidos son obligatorios"),
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    password: isEdit
      ? Yup.string()
      : Yup.string()
          .min(6, "Mínimo 6 caracteres")
          .required("La contraseña es obligatoria"),
  });

const UsersModal = ({ user, onClose, onSuccess }) => {
  const isEdit = Boolean(user);

  const initialValues = {
    nombre: user?.nombre || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateUser(user.id, values);
        await Swal.fire({
          title: "Actualizado",
          text: "El usuario fue actualizado correctamente",
          icon: "success",
        });
      } else {
        await createUser(values);
        await Swal.fire({
          title: "Creado",
          text: "El usuario fue creado correctamente",
          icon: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el usuario",
        icon: "error",
      });
    }
  };

  const inputClass = (error, touched) =>
    `w-full border p-2 rounded-md bg-gray-50 
   ${
     touched
       ? error
         ? "border-red-500 focus:ring-red-500"
         : "border-green-500 focus:ring-green-500"
       : "border-gray-300"
   }`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-end items-center">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">
          {isEdit ? "Editar usuario" : "Crear usuario"}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(isEdit)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <Field
                    name="nombre"
                    placeholder="Nombre"
                    className={inputClass(errors.nombre, touched.nombre)}
                  />
                  <ErrorMessage name="nombre" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex flex-col w-1/2">
                  <Field
                    name="apellidos"
                    placeholder="Apellidos"
                    className={inputClass(errors.apellidos, touched.apellidos)}
                  />
                  <ErrorMessage name="apellidos" component="p" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* ❌ Eliminado el select de media_type_id */}

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className={inputClass(errors.email, touched.email)}
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  className={inputClass(errors.password, touched.password)}
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#1A6795] text-white rounded"
                >
                  {isEdit ? "Guardar" : "Crear"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UsersModal;