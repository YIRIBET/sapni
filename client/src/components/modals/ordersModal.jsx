import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createOrder, updateOrder } from "../../services/orderService";
import { fetchCampaingsActive } from "../../services/campaignService";
import { fetchChannels } from "../../services/channelsService";
import * as Yup from "yup";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  campaign_id: Yup.string().required("Selecciona una campaña"),
  media_channel_id: Yup.string().required("Selecciona un canal de difusión"),
  total_spots_ordered: Yup.number()
    .typeError("Debe ser un número")
    .min(1, "Mínimo 1 spot")
    .required("Los spots son obligatorios"),
  contract_amount: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "El monto no puede ser negativo")
    .required("El monto del contrato es obligatorio"),
});

const OrderModal = ({ order, onClose, onSuccess }) => {
  const isEdit = Boolean(order);
  const [campaigns, setCampaigns] = useState([]);
  const [mediaChannels, setMediaChannels] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [campaignData, mediaData] = await Promise.all([
          fetchCampaingsActive(),
          fetchChannels(),
        ]);
        setCampaigns(Array.isArray(campaignData) ? campaignData : campaignData.data);
        setMediaChannels(Array.isArray(mediaData) ? mediaData : mediaData.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const initialValues = {
    campaign_id: order?.campaign_id || "",
    media_channel_id: order?.media_channel_id || "",
    total_spots_ordered: order?.total_spots_ordered || "",
    contract_amount: order?.contract_amount || "",
  };

  const handleSubmit = async (values) => {
    const payload = {
      campaign_id: Number(values.campaign_id),
      media_channel_id: Number(values.media_channel_id),
      total_spots_ordered: Number(values.total_spots_ordered),
      contract_amount: String(values.contract_amount),
    };

    try {
      if (isEdit) {
        await updateOrder(order.id, payload);
        await Swal.fire({
          title: "Actualizada",
          text: "La orden fue actualizada correctamente",
          icon: "success",
        });
      } else {
        await createOrder(payload);
        await Swal.fire({
          title: "Creada",
          text: "La orden fue creada correctamente",
          icon: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la orden",
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
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">
          {isEdit ? "Editar orden" : "Crear orden"}
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
                  as="select"
                  name="campaign_id"
                  className={inputClass(errors.campaign_id, touched.campaign_id)}
                >
                  <option value="">Selecciona una campaña</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.campaign_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="campaign_id" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <Field
                  as="select"
                  name="media_channel_id"
                  className={inputClass(errors.media_channel_id, touched.media_channel_id)}
                >
                  <option value="">Selecciona un canal de difusión</option>
                  {mediaChannels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.channel_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="media_channel_id" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <Field
                    name="total_spots_ordered"
                    type="number"
                    placeholder="Spots"
                    min="1"
                    className={inputClass(errors.total_spots_ordered, touched.total_spots_ordered)}
                  />
                  <ErrorMessage name="total_spots_ordered" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="w-1/2">
                  <Field
                    name="contract_amount"
                    type="number"
                    placeholder="Monto contrato"
                    min="0"
                    step="0.01"
                    className={inputClass(errors.contract_amount, touched.contract_amount)}
                  />
                  <ErrorMessage name="contract_amount" component="p" className="text-red-500 text-sm mt-1" />
                </div>
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

export default OrderModal;