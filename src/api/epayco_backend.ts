import axios from 'axios';

export const registerClient = async (data: {
  documento: string;
  nombres: string;
  email: string;
  celular: string;
}) => {
  try {
    console.log(`${import.meta.env.VITE_API_URL}/clients/registroCliente`)
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/clients/registroCliente`, {
      documento: data.documento,
      nombres: data.nombres,
      email: data.email,
      celular: data.celular,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    })
    return response.data;
  }catch (error) {
    console.error("Error creating client:", error);
    return {
      success: false,
      message: "Error al crear el cliente."
    }
  }
}

export const rechargeWallet = async (data: {
  documento: string;
  celular: string;
  valor: number;
}) => {
  try {

    if (data.valor <= 0) {
      return {
        success: false,
        message: "El valor a recargar debe ser mayor a cero.",
        error: "INVALID_AMOUNT"
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/wallet/recargarBilletera`, {
      documento: data.documento,
      celular: data.celular,
      valor: data.valor,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    })
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error al recargar billetera:", error);
    return {
      success: false,
      message: "Error al recargar la billetera."
    }
  }
}