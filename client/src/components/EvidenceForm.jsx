import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createEvidence } from "../services/EvidenceService";
import { getOrdersbyCampaignActive } from "../services/orderService";
import { fetchChannels } from "../services/channelsService";

export default function EvidenceForm() {
  const [mediaType, setMediaType] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersbyCampaignActive();
        setOrders(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    const loadChannels = async () => {
      try {
        const data = await fetchChannels();
        setChannels(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
    loadChannels();
  }, []);

  const validationSchema = Yup.object({
    order_id: Yup.string().required("Debes seleccionar una orden"),
    media_channel_id: Yup.string().required("Debes seleccionar un canal de difusión"),
    status_id: Yup.string().required("Debes seleccionar un estado"),
    format_id: Yup.string().required("Debes seleccionar un formato"),
    evidence_date: Yup.string().required("La fecha es obligatoria"),
    evidence_time: Yup.string().required("La hora es obligatoria"),

    program_name:
      mediaType === 1
        ? Yup.string().required("El nombre del programa es obligatorio")
        : Yup.string(),

    publication_title: [2, 3, 4].includes(mediaType)
      ? Yup.string().required("El título es obligatorio")
      : Yup.string(),

    link: [2, 3].includes(mediaType)
      ? Yup.string()
          .url("Debe ser un enlace válido")
          .required("El enlace es obligatorio")
      : Yup.string(),
  });

  const initialValues = {
    order_id: "",
    media_channel_id: "",
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

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await createEvidence(values);

      Toast.fire({
        icon: "success",
        title: "Evidencia registrada correctamente",
      });

      resetForm();
      setMediaType(null);
      setSelectedOrder(null);
    } catch (error) {
      const errData = error.response?.data;

      if (errData?.errors) {
        const mensajes = Object.values(errData.errors).join(", ");
        Toast.fire({
          icon: "error",
          title: mensajes,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Ocurrió un error al guardar la evidencia",
        });
      }
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
        {({ errors, touched, setFieldValue }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaña de difusión
              </label>
              <Field
                as="select"
                name="order_id"
                className={inputClass(errors.order_id, touched.order_id)}
                onChange={(e) => {
                  const orderId = e.target.value;
                  setFieldValue("order_id", orderId);
                  const order = orders.find((o) => o.id == orderId);
                  setSelectedOrder(order);
                }}
              >
                <option value="">Selecciona una orden</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.campaign_name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="order_id"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de difusión
              </label>
              <Field
                as="select"
                name="media_channel_id"
                className={inputClass(errors.media_channel_id, touched.media_channel_id)}
                onChange={(e) => {
                  const channelId = e.target.value;
                  setFieldValue("media_channel_id", channelId);
                  const channel = channels.find((c) => c.id == channelId);
                  setMediaType(channel?.media_type_id || null);
                }}
              >
                <option value="">Selecciona un canal</option>
                {channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.channel_name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="media_channel_id"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            {[1, 3].includes(mediaType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del programa
                </label>
                <Field
                  name="program_name"
                  className={inputClass(errors.program_name, touched.program_name)}
                />
                <ErrorMessage
                  name="program_name"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            )}
            {[1,2, 3, 4].includes(mediaType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la publicación
                </label>
                <Field
                  name="publication_title"
                  className={inputClass(errors.publication_title, touched.publication_title)}
                />
                <ErrorMessage
                  name="publication_title"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            )}

            {[2, 4].includes(mediaType) && (
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
            </div>
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
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <Field
                  type="date"
                  name="evidence_date"
                  className={inputClass(errors.evidence_date, touched.evidence_date)}
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
                  className={inputClass(errors.evidence_time, touched.evidence_time)}
                />
                <ErrorMessage
                  name="evidence_time"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas internas
              </label>
              <Field
                as="textarea"
                name="internal_notes"
                rows="4"
                className={inputClass(errors.internal_notes, touched.internal_notes)}
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