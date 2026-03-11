import React from "react";
import { useRef, useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../../services/userService";
import UsersModal from "../../components/modals/usersModal";
import Swal from "sweetalert2";
import ExportPDFButton from "../../components/ExportPDFButton";
import FilterDropdown from "../../components/FilterDropdown";

function Users() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [filtroMedio, setFiltroMedio] = useState("Todos");

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(userId);
      await Swal.fire({
        title: "Eliminado",
        text: "El usuario fue eliminado correctamente",
        icon: "success",
      });
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el usuario",
        icon: "error",
      });
    }
  };

  const mediosDisponibles = [
    "Todos",
    ...new Set(users.map((u) => u.type_name).filter(Boolean)),
  ];

  const filteredUsers = users.filter((user) => {
    const matchSearch = `${user.nombre} ${user.apellidos} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchMedio =
      filtroMedio === "Todos" || user.type_name === filtroMedio;
    return matchSearch && matchMedio;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
      <div className="flex justify-end items-center mb-4 mr-4">
        <ExportPDFButton
          title="Reporte de Usuarios"
          filename="usuarios.pdf"
          columns={[
            { label: "Nombre", key: "nombre" },
            { label: "Correo", key: "email" },
            { label: "Medio", key: "type_name" },
          ]}
          rows={filteredUsers}
          filters={{ Medio: filtroMedio, Búsqueda: search }}
        />

        <button
          className="bg-[#1A6795] text-white px-4 py-2 rounded-md ml-2"
          onClick={openCreateModal}
        >
          Agregar
        </button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-3 mb-4 lg:justify-between lg:items-center">
          <div className="relative w-full lg:w-1/3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <FilterDropdown
              label="Medio"
              options={mediosDisponibles}
              value={filtroMedio}
              onChange={setFiltroMedio}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Medio</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{user.nombre}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.type_name}</td>
                <td className="py-2 px-4">
                  <button
                    className="hover:text-blue-700 mr-2"
                    onClick={() => openModal(user)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(user.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {isModalOpen && (
          <UsersModal
            user={selectedUser}
            onClose={closeModal}
            onSuccess={loadUsers}
          />
        )}
      </div>
    </div>
  );
}
export default Users;
