import React, { useState } from "react";
import InputForm from "../Checkouts/Components/InputForm";

const ComplaintStech = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dni: "",
        type: "queja",
        incident_date: "",
        order_number: "",

        priority: "media",
        description: "",
        files: [],
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, files: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear un objeto FormData
        const data = new FormData();
        for (const key in formData) {
            if (key === "files") {
                for (let i = 0; i < formData.files.length; i++) {
                    data.append("files[]", formData.files[i]);
                }
            } else {
                data.append(key, formData[key]);
            }
        }

        // Enviar el formulario usando fetch
        try {
            const response = await fetch("/api/complaints", {
                method: "POST",
                body: data,
                // No es necesario agregar headers para FormData, fetch lo maneja automáticamente
            });

            if (!response.ok) {
                throw new Error("Error al registrar el reclamo");
            }

            const result = await response.json();
            setMessage("Reclamo registrado con éxito");
            console.log(result); // Respuesta del servidor
        } catch (error) {
            setMessage("Error al registrar el reclamo: " + error.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg customtext-neutral-dark">
            <h1 className="text-2xl font-bold mb-6 text-center uppercase">
                Libro de Reclamaciones
            </h1>
            <form onSubmit={handleSubmit} className="gap-4 grid grid-cols-2">
                {/* Campo: Nombre */}
                <InputForm
                    label="Nombre Completo *"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Apellidos y Nombres"
                />

                {/* Campo: Correo */}
                <InputForm
                    label="Email *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hola@mail.com"
                />

                {/* Campo: Teléfono */}
                <InputForm
                    label="Teléfono *"
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="hola@mail.com"
                />

                {/* Campo: DNI */}
                <InputForm
                    label="DNI *"
                    type="number"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="DNI"
                />

                {/* Campo: Tipo de Reclamo */}
                <div>
                    <label className="block text-sm mb-1 customtext-neutral-dark ">
                        Tipo de Reclamo *
                    </label>
                    <select
                        name="type"
                        onChange={handleChange}
                        required
                        defaultValue={formData.type}
                        className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                    >
                        <option value="queja">Queja</option>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="reclamo técnico">Reclamo Técnico</option>
                    </select>
                </div>

                {/* Campo: Fecha del Incidente */}
                <InputForm
                    label=" Fecha del Incidente *"
                    type="date"
                    name="incident_date"
                    value={formData.incident_date}
                    onChange={handleChange}
                    placeholder="Fecha del Incidente"
                />

                {/* Campo: Número de Pedido */}
                <InputForm
                    label="Número de Pedido *"
                    type="text"
                    name="order_number"
                    value={formData.order_number}
                    onChange={handleChange}
                    placeholder="Número de Pedido"
                />

                {/* Campo: Prioridad */}
                <div>
                    <label className="block text-sm mb-1 customtext-neutral-dark">
                        Prioridad *
                    </label>
                    <select
                        name="priority"
                        onChange={handleChange}
                        required
                        defaultValue={formData.priority}
                        className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>

                {/* Campo: Descripción */}
                <div>
                    <label className="block text-sm mb-1 customtext-neutral-dark">
                        Descripción *
                    </label>
                    <textarea
                        name="description"
                        placeholder="Descripción"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                    />
                </div>

                {/* Campo: Archivos Adjuntos */}
                <div>
                    <label className="block text-sm mb-1 customtext-neutral-dark">
                        Archivos Adjuntos
                    </label>
                    <input
                        type="file"
                        name="files"
                        multiple
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300"
                    />
                </div>

                {/* Botón de Envío */}
                <div>
                    <button
                        type="submit"
                        className="w-full rounded-xl font-semibold  bg-primary px-4 py-3 text-white hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300"
                    >
                        Enviar Reclamo
                    </button>
                </div>

                {/* Mensaje de Respuesta */}
                {message && (
                    <div
                        className={`mt-4 p-4 rounded-md ${
                            message.includes("éxito")
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ComplaintStech;
