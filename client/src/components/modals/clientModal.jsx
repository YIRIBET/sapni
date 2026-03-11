import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createClient, updateClient } from "../../services/clientService";
import * as Yup from "yup";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  company_name: Yup.string().required("El nombre de la empresa es obligatorio"),
  tax_id: Yup.string().required("El RFC es obligatorio"),
  contact_person: Yup.string().required("El contacto es obligatorio"),
});

const ClientModal = ({ user: client, onClose, onSuccess }) => {
  const isEdit = Boolean(client);

  const initialValues = {
    company_name: client?.company_name || "",
    tax_id: client?.tax_id || "",
    contact_person: client?.contact_person || "",
  };

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateClient(client.id, values);
        await Swal.fire({
          title: "Actualizado",
          text: "El cliente fue actualizado correctamente",
          icon: "success",
        });
      } else {
        await createClient(values);
        await Swal.fire({
          title: "Creado",
          text: "El cliente fue creado correctamente",
          icon: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving client:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el cliente",
        icon: "error",
      });
    }
  };

  const inputClass = (error, touched) =>
    `w-full border p-2 rounded-md bg-gray-50 ${
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">
          {isEdit ? "Editar cliente" : "Crear cliente"}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="company_name"
                  placeholder="Nombre de la empresa"
                  className={inputClass(errors.company_name, touched.company_name)}
                />
                <ErrorMessage
                  name="company_name"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  name="tax_id"
                  placeholder="RFC"
                  className={inputClass(errors.tax_id, touched.tax_id)}
                />
                <ErrorMessage
                  name="tax_id"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  name="contact_person"
                  placeholder="Persona de contacto"
                  className={inputClass(errors.contact_person, touched.contact_person)}
                />
                <ErrorMessage
                  name="contact_person"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
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

export default ClientModal;