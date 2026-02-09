import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { requestPayment, confirmPayment } from "../../api/epayco_backend";

type Step = "REQUEST" | "CONFIRM";

export const PaymentView = () => {
  const [step, setStep] = useState<Step>("REQUEST");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [requestData, setRequestData] = useState({
    documento: "",
    celular: "",
    valor: "",
  });
  const [sessionId, setSessionId] = useState("");
  const [token, setToken] = useState("");

  const handleRequest = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await requestPayment({
        ...requestData,
        valor: Number(requestData.valor),
      });

      if (response.success && response.data) {
        console.log(response.data)
        setSessionId(response.data.sessionId);
        setMessage({ type: "success", text: response.message });
        setStep("CONFIRM");
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al solicitar el pago." });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await confirmPayment({
        sessionId,
        token,
      });

      if (response.success) {
        setMessage({ type: "success", text: response.message });
        // Reset flow after success delay
        setTimeout(() => {
          setStep("REQUEST");
          setRequestData({ documento: "", celular: "", valor: "" });
          setToken("");
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al confirmar pago." });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("REQUEST");
    setMessage(null);
    setToken("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Realizar Pago
      </h2>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-6">
        <div
          className={`h-2 w-16 rounded mr-2 ${step === "REQUEST" ? "bg-orange-500" : "bg-green-500"}`}
        ></div>
        <div
          className={`h-2 w-16 rounded ${step === "CONFIRM" ? "bg-orange-500" : "bg-gray-200"}`}
        ></div>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm whitespace-pre-line ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      {step === "REQUEST" ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">
            Ingresa los datos para iniciar la compra.
          </p>
          <Input
            label="Documento ID"
            value={requestData.documento}
            onChange={(e) =>
              setRequestData({ ...requestData, documento: e.target.value })
            }
            required
          />
          <Input
            label="Celular"
            type="tel"
            value={requestData.celular}
            onChange={(e) =>
              setRequestData({ ...requestData, celular: e.target.value })
            }
            required
          />
          <Input
            label="Valor de la compra ($)"
            type="number"
            min="1"
            value={requestData.valor}
            onChange={(e) =>
              setRequestData({ ...requestData, valor: e.target.value })
            }
            required
          />
          <Button type="submit" isLoading={loading} className="mt-4">
            Continuar
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">
            Hemos enviado un código de 6 dígitos a tu correo. Ingrésalo para
            confirmar.
          </p>
          <div className="p-3 bg-gray-50 rounded border border-gray-200 mb-2 text-xs text-gray-500 break-all">
            Session ID: {sessionId}
          </div>
          <Input
            label="Token de 6 dígitos"
            value={token}
            maxLength={6}
            onChange={(e) => setToken(e.target.value)}
            placeholder="000000"
            className="text-center text-xl tracking-widest"
            required
          />
          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={loading}
            >
              Atrás
            </Button>
            <Button type="submit" isLoading={loading}>
              Confirmar Pago
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
