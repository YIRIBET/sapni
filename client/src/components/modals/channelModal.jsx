import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createChannel, updateChannel } from "../../services/channelsService";
import * as Yup from "yup";
import Swal from "sweetalert2";

const MEDIA_TYPES = [
  { value: "1", label: "Radio" },
  { value: "2", label: "Redes Sociales" },
  { value: "3", label: "TV" },
  { value: "4", label: "Periodico" },
  { value: "5", label: "Otro" },
];

const getValidationSchema = (mediaTypeId) =>
  Yup.object({
    channel_name: Yup.string().required("El nombre del medio es obligatorio"),
    media_type_id: Yup.string().required("Selecciona un tipo de medio"),
    razon_social: Yup.string().required("El nombre de contacto es obligatorio"),
    frequency: mediaTypeId === "1"
      ? Yup.string().required("La frecuencia es obligatoria para Radio")
      : Yup.string().nullable(),
    social_network: mediaTypeId === "2"
      ? Yup.string().url("Ingresa una URL válida").required("El link es obligatorio")
      : Yup.string().nullable(),
  });

const ChannelModal = ({ channel, onClose, onSuccess }) => {
  const isEdit = Boolean(channel);

  const initialValues = {
    channel_name: channel?.channel_name || "",
    media_type_id: channel?.media_type_id ? String(channel.media_type_id) : "",
    razon_social: channel?.razon_social || "",
    frequency: channel?.frequency || "",
    social_network: channel?.social_network || "",
  };

  const handleSubmit = async (values) => {
    const payload = {
      channel_name: values.channel_name,
      media_type_id: Number(values.media_type_id),
      razon_social: values.razon_social,
      ...(values.media_type_id === "1" && { frequency: values.frequency }),
      ...(values.media_type_id === "2" && { social_network: values.social_network }),
    };

    try {
      if (isEdit) {
        await updateChannel(channel.id, payload);
        await Swal.fire({ title: "Actualizado", text: "El medio fue actualizado correctamente", icon: "success" });
      } else {
        await createChannel(payload);
        await Swal.fire({ title: "Creado", text: "El medio fue creado correctamente", icon: "success" });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving channel:", error);
      Swal.fire({ title: "Error", text: "No se pudo guardar el medio", icon: "error" });
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
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">
          {isEdit ? "Editar medio" : "Crear medio"}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(initialValues.media_type_id)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="channel_name"
                  placeholder="Nombre del medio"
                  className={inputClass(errors.channel_name, touched.channel_name)}
                />
                <ErrorMessage name="channel_name" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <Field as="select" name="media_type_id" className={inputClass(errors.media_type_id, touched.media_type_id)}>
                  <option value="">Selecciona un tipo de medio</option>
                  {MEDIA_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Field>
                <ErrorMessage name="media_type_id" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="razon_social"
                  placeholder="Nombre de contacto"
                  className={inputClass(errors.razon_social, touched.razon_social)}
                />
                <ErrorMessage name="razon_social" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {values.media_type_id === "1" && (
                <div>
                  <Field
                    name="frequency"
                    placeholder="Frecuencia (ej. 98.5 FM)"
                    className={inputClass(errors.frequency, touched.frequency)}
                  />
                  <ErrorMessage name="frequency" component="p" className="text-red-500 text-sm mt-1" />
                </div>
              )}

              {values.media_type_id === "2" && (
                <div>
                  <Field
                    name="social_network"
                    placeholder="Link (ej. https://instagram.com/...)"
                    className={inputClass(errors.social_network, touched.social_network)}
                  />
                  <ErrorMessage name="social_network" component="p" className="text-red-500 text-sm mt-1" />
                </div>
              )}

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

export default ChannelModal;