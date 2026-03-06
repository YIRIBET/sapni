import React, { useState, useEffect } from "react";
import { createEvidence } from "../services/EvidenceService";
import { getOrdersByMediaType } from "../services/OrderService";

export default function EvidenceForm() {
  const [mediaType, setMediaType] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    order_id: "",
    user_id: "",
    status_id: "",
    format_id: "",
    program_name: "",
    publication_title: "",
    evidence_date: "",
    evidence_time: "",
    link: "",
    internal_notes: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const mediaTypeId = localStorage.getItem("mediaTypeId");

    if (userId) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId,
      }));
    }

    if (mediaTypeId) {
      setMediaType(Number(mediaTypeId));
    }
  }, []);

  useEffect(() => {
    if (!mediaType) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrdersByMediaType(mediaType);

        console.log("Ordenes recibidas:", data);

        setOrders(data);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      }
    };

    fetchOrders();
  }, [mediaType]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvidence(formData);

      alert("Evidencia registrada correctamente");

      setFormData((prev) => ({
        ...prev,
        order_id: "",
        status_id: "",
        format_id: "",
        program_name: "",
        publication_title: "",
        evidence_date: "",
        evidence_time: "",
        link: "",
        internal_notes: "",
      }));
    } catch (error) {
      console.error(error);
      alert("Error al registrar evidencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Registrar Evidencia
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orden de difusión
          </label>
          <select
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5"
            required
          >
            <option value="">Selecciona una orden</option>

            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.campaign_name} - {order.channel_name}
              </option>
            ))}
          </select>
        </div>
        {mediaType === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del programa
            </label>
            <input
              type="text"
              name="program_name"
              value={formData.program_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5"
              required
            />
          </div>
        )}
        {[2, 3, 4].includes(mediaType) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la publicación
            </label>
            <input
              type="text"
              name="publication_title"
              value={formData.publication_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5"
              required
            />
          </div>
        )}
        {[2, 3].includes(mediaType) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enlace
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>

          <select
            name="status_id"
            value={formData.status_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5"
            required
          >
            <option value="">Selecciona</option>
            <option value="1">Positivo</option>
            <option value="2">Negativo</option>
            <option value="3">Neutral</option>
            <option value="4">Reporte</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato
          </label>

          <select
            name="format_id"
            value={formData.format_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5"
            required
          >
            <option value="">Selecciona</option>
            <option value="1">Nota</option>
            <option value="2">Foto</option>
            <option value="3">Spot</option>
            <option value="4">Texto</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              name="evidence_date"
              value={formData.evidence_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Hora
            </label>
            <input
              type="time"
              name="evidence_time"
              value={formData.evidence_time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Internas
          </label>

          <textarea
            name="internal_notes"
            rows="4"
            value={formData.internal_notes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#1A6795] text-white rounded-lg hover:bg-[#1A6798] disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
