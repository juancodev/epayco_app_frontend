import React, { useState } from 'react';
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { rechargeWallet } from "../../api/epayco_backend";

export const RechargeView = () => {
  const [formData, setFormData] = useState({
    documento: "",
    celular: "",
    valor: "",
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
      const response = await rechargeWallet({
        ...formData,
        valor: Number(formData.valor),
      });

      if (response.success) {
        setMessage({ type: "success", text: response.message });
        setFormData({ documento: "", celular: "", valor: "" });
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error inesperado." });
      console.log(error);
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
        Recargar Billetera
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
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          required
        />
        <Input
          label="Celular"
          name="celular"
          type="tel"
          value={formData.celular}
          onChange={handleChange}
          required
        />
        <Input
          label="Monto a recargar ($)"
          name="valor"
          type="number"
          min="1"
          value={formData.valor}
          onChange={handleChange}
          required
        />

        <Button type="submit" isLoading={loading} className="mt-6">
          Recargar Saldo
        </Button>
      </form>
    </div>
  );
}
