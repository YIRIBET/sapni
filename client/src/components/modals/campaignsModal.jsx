import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createCampaing, updateCampaing } from "../../services/campaignService";
import { fetchClients } from "../../services/clientService";
import * as Yup from "yup";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  campaign_name: Yup.string().required("El nombre de la campaña es obligatorio"),
  client_id: Yup.string().required("Selecciona un cliente"),
  start_date: Yup.string().required("La fecha de inicio es obligatoria"),
  end_date: Yup.string()
    .required("La fecha de fin es obligatoria")
    .test("is-after", "La fecha de fin debe ser posterior a la de inicio", function (value) {
      const { start_date } = this.parent;
      if (!start_date || !value) return true;
      return new Date(value) >= new Date(start_date);
    }),
});

const CampaignModal = ({ campaign, onClose, onSuccess }) => {
  const isEdit = Boolean(campaign);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(Array.isArray(data) ? data : data.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    loadClients();
  }, []);

  const toDateInput = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const initialValues = {
    campaign_name: campaign?.campaign_name || "",
    client_id: campaign?.client_id || "",
    start_date: toDateInput(campaign?.start_date),
    end_date: toDateInput(campaign?.end_date),
  };

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCampaing(campaign.id, values);
        await Swal.fire({
          title: "Actualizada",
          text: "La campaña fue actualizada correctamente",
          icon: "success",
        });
      } else {
        await createCampaing(values);
        await Swal.fire({
          title: "Creada",
          text: "La campaña fue creada correctamente",
          icon: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving campaign:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la campaña",
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
          {isEdit ? "Editar campaña" : "Crear campaña"}
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
                  name="campaign_name"
                  placeholder="Nombre de la campaña"
                  className={inputClass(errors.campaign_name, touched.campaign_name)}
                />
                <ErrorMessage name="campaign_name" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <Field
                  as="select"
                  name="client_id"
                  className={inputClass(errors.client_id, touched.client_id)}
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="client_id" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs text-gray-500 mb-1 block">Fecha de inicio</label>
                  <Field
                    name="start_date"
                    type="date"
                    className={inputClass(errors.start_date, touched.start_date)}
                  />
                  <ErrorMessage name="start_date" component="p" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="w-1/2">
                  <label className="text-xs text-gray-500 mb-1 block">Fecha de fin</label>
                  <Field
                    name="end_date"
                    type="date"
                    className={inputClass(errors.end_date, touched.end_date)}
                  />
                  <ErrorMessage name="end_date" component="p" className="text-red-500 text-sm mt-1" />
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

export default CampaignModal;