import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { checkBalance } from "../../api/epayco_backend";

export const BalanceView = () => {
  const [formData, setFormData] = useState({ documento: "", celular: "" });
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBalance(null);

    try {
      const response = await checkBalance(formData);
      if (response.success && response.data) {
        setBalance(response.data.saldo);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Error al consultar saldo.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Consultar Saldo
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {balance !== null && (
        <div className="mb-6 p-6 bg-blue-50 border border-blue-100 rounded-xl text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">
            Saldo Disponible
          </p>
          <p className="text-4xl font-bold text-blue-900 mt-2">
            ${balance?.toLocaleString()}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Documento ID"
          value={formData.documento}
          onChange={(e) =>
            setFormData({ ...formData, documento: e.target.value })
          }
          required
        />
        <Input
          label="Celular"
          type="tel"
          value={formData.celular}
          onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
          required
        />

        <Button
          type="submit"
          isLoading={loading}
          variant="secondary"
          className="mt-6"
        >
          Consultar
        </Button>
      </form>
    </div>
  );
};
