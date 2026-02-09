import axios from 'axios';

export const registerClient = async (data: {
  documento: string;
  nombres: string;
  email: string;
  celular: string;
}) => {
  try {
    const response = await axios.post(`${import.meta.env.BASE_URL}/clients/registroCliente`, {
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