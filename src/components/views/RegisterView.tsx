import React, {useState} from 'react'
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { registerClient } from "../../api/epayco_backend";

export const RegisterView = () => {

  const [formData, setFormData] = useState({
    documento: "",
    nombres: "",
    email: "",
    celular: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await registerClient(formData);
      if (response.success) {
        setMessage({ type: "success", text: response.message });
        setFormData({ documento: "", nombres: "", email: "", celular: "" });
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión." });
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Registrar Cliente
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Documento ID"
          name="document"
          type="text"
          required
          placeholder="Ej: 123456789"
          value={formData.documento}
          onChange={handleChange}
        />
        <Input
          label="Nombres Completos"
          name="names"
          type="text"
          required
          placeholder="Ej: Pepito Pérez"
          value={formData.nombres}
          onChange={handleChange}
        />
        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          required
          placeholder="ejemplo@email.com"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Celular"
          name="phone"
          type="tel"
          required
          placeholder="Ej: 3001234567"
          value={formData.celular}
          onChange={handleChange}
        />

        <Button type="submit" isLoading={loading} className="mt-6">
          Registrarme
        </Button>
      </form>
    </div>
  );
}
