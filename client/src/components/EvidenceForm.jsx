import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createEvidence } from "../services/EvidenceService";
import { getOrdersByMediaType } from "../services/orderService";

export default function EvidenceForm() {
  const [mediaType, setMediaType] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const mediaTypeId = localStorage.getItem("mediaTypeId");
    if (mediaTypeId) {
      setMediaType(Number(mediaTypeId));
    }
  }, []);

  useEffect(() => {
    if (!mediaType) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrdersByMediaType(mediaType);
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [mediaType]);

  const validationSchema = Yup.object({
    order_id: Yup.string().required("Debes seleccionar una orden"),
    status_id: Yup.string().required("Debes seleccionar un estado"),
    format_id: Yup.string().required("Debes seleccionar un formato"),
    evidence_date: Yup.string().required("La fecha es obligatoria"),
    evidence_time: Yup.string().required("La hora es obligatoria"),

    program_name:
      mediaType === 1
        ? Yup.string().required("El nombre del programa es obligatorio")
        : Yup.string(),

    publication_title:
      [2, 3, 4].includes(mediaType)
        ? Yup.string().required("El título es obligatorio")
        : Yup.string(),

    link:
      [2, 3].includes(mediaType)
        ? Yup.string()
            .url("Debe ser un enlace válido")
            .required("El enlace es obligatorio")
        : Yup.string(),
  });

  const initialValues = {
    order_id: "",
    user_id: localStorage.getItem("userId"),
    status_id: "",
    format_id: "",
    program_name: "",
    publication_title: "",
    evidence_date: "",
    evidence_time: "",
    link: "",
    internal_notes: "",
  };

  const inputClass = (error, touched) =>
    `w-full border rounded-lg p-2.5 ${
      touched
        ? error
          ? "border-red-500"
          : "border-green-500"
        : "border-gray-300"
    }`;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await createEvidence(values);

      Swal.fire({
        icon: "success",
        title: "Evidencia registrada",
        text: "La evidencia fue guardada correctamente",
        confirmButtonColor: "#1A6795",
      });

      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Registrar Evidencia
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                campaña de difusión
              </label>

              <Field
                as="select"
                name="order_id"
                className={inputClass(errors.order_id, touched.order_id)}
              >
                <option value="">Selecciona una orden</option>

                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.campaign_name} - {order.channel_name}
                  </option>
                ))}
              </Field>

              <ErrorMessage
                name="order_id"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {mediaType === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del programa
                </label>

                <Field
                  name="program_name"
                  className={inputClass(
                    errors.program_name,
                    touched.program_name
                  )}
                />

                <ErrorMessage
                  name="program_name"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            )}
            {[2, 3, 4].includes(mediaType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la publicación
                </label>

                <Field
                  name="publication_title"
                  className={inputClass(
                    errors.publication_title,
                    touched.publication_title
                  )}
                />

                <ErrorMessage
                  name="publication_title"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            )}

            {[2, 3].includes(mediaType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace
                </label>

                <Field
                  name="link"
                  className={inputClass(errors.link, touched.link)}
                />

                <ErrorMessage
                  name="link"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>

              <Field
                as="select"
                name="status_id"
                className={inputClass(errors.status_id, touched.status_id)}
              >
                <option value="">Selecciona</option>
                <option value="1">Positivo</option>
                <option value="2">Negativo</option>
                <option value="3">Neutral</option>
                <option value="4">Reporte</option>
              </Field>

              <ErrorMessage
                name="status_id"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* FORMATO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato
              </label>

              <Field
                as="select"
                name="format_id"
                className={inputClass(errors.format_id, touched.format_id)}
              >
                <option value="">Selecciona</option>
                <option value="1">Nota</option>
                <option value="2">Foto</option>
                <option value="3">Spot</option>
                <option value="4">Texto</option>
              </Field>

              <ErrorMessage
                name="format_id"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* FECHA Y HORA */}
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Fecha
                </label>

                <Field
                  type="date"
                  name="evidence_date"
                  className={inputClass(
                    errors.evidence_date,
                    touched.evidence_date
                  )}
                />

                <ErrorMessage
                  name="evidence_date"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Hora
                </label>

                <Field
                  type="time"
                  name="evidence_time"
                  className={inputClass(
                    errors.evidence_time,
                    touched.evidence_time
                  )}
                />

                <ErrorMessage
                  name="evidence_time"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

            </div>

            {/* NOTAS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas internas
              </label>

              <Field
                as="textarea"
                name="internal_notes"
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-2.5"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1A6795] text-white rounded-lg hover:bg-[#155a80]"
              >
                Guardar
              </button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}