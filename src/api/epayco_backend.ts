import axios from 'axios';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  status?: number;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function handleAxiosError(error: unknown): ApiResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err: any = error;
  if (axios.isAxiosError(err)) {
    if (err.response && err.response.data) {
      // Si el backend devuelve una estructura, la delegamos al frontend
      return {
        success: err.response.data.success ?? false,
        message: err.response.data.message ?? 'Error en la respuesta del servidor',
        data: err.response.data.data ?? undefined,
        error: err.response.data.error ?? undefined,
        status: err.response.status,
      };
    }
    return {
      success: false,
      message: err.message || 'Error de red al comunicarse con el servidor',
      error: 'NETWORK_ERROR',
      status: err.response?.status,
    };
  }
  return {
    success: false,
    message: 'Error inesperado',
    error: 'UNKNOWN_ERROR',
  };
}

function validateDocumento(documento?: string) {
  if (!documento || documento.trim().length === 0) {
    return { ok: false, payload: { success: false, message: 'El documento es requerido.', error: 'MISSING_DOCUMENTO' } };
  }
  return { ok: true };
}

function validateCelular(celular?: string) {
  if (!celular || celular.trim().length === 0) {
    return { ok: false, payload: { success: false, message: 'El celular es requerido.', error: 'MISSING_CELULAR' } };
  }
  return { ok: true };
}

export const registerClient = async (data: {
  documento: string;
  nombres: string;
  email: string;
  celular: string;
}): Promise<ApiResponse> => {
  if (!data) return { success: false, message: 'Datos de cliente faltantes', error: 'MISSING_PAYLOAD' };
  const docVal = validateDocumento(data.documento);
  if (!docVal.ok) return docVal.payload as ApiResponse;
  if (!data.nombres || data.nombres.trim().length === 0) {
    return { success: false, message: 'Los nombres son requeridos.', error: 'MISSING_NOMBRES' };
  }
  if (!data.email || !emailRegex.test(data.email)) {
    return { success: false, message: 'Email inválido.', error: 'INVALID_EMAIL' };
  }
  const celVal = validateCelular(data.celular);
  if (!celVal.ok) return celVal.payload as ApiResponse;

  try {
    const url = `${import.meta.env.VITE_API_URL}/clients/registroCliente`;
    const response = await axios.post(url, {
      documento: data.documento,
      nombres: data.nombres,
      email: data.email,
      celular: data.celular,
    }, {
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
    });
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Error creating client:', error);
    return handleAxiosError(error);
  }
};

export const rechargeWallet = async (data: {
  documento: string;
  celular: string;
  valor: number;
}): Promise<ApiResponse> => {
  if (!data) return { success: false, message: 'Datos faltantes', error: 'MISSING_PAYLOAD' };
  const docVal = validateDocumento(data.documento);
  if (!docVal.ok) return docVal.payload as ApiResponse;
  const celVal = validateCelular(data.celular);
  if (!celVal.ok) return celVal.payload as ApiResponse;
  if (typeof data.valor !== 'number' || isNaN(data.valor) || data.valor <= 0) {
    return { success: false, message: 'El valor a recargar debe ser mayor a cero.', error: 'INVALID_AMOUNT' };
  }

  try {
    const url = `${import.meta.env.VITE_API_URL}/wallet/recargarBilletera`;
    const response = await axios.post(url, {
      documento: data.documento,
      celular: data.celular,
      valor: data.valor,
    }, {
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
    });
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Error al recargar billetera:', error);
    return handleAxiosError(error);
  }
};

export const requestPayment = async (data: {
  documento: string;
  celular: string;
  valor: number;
}): Promise<ApiResponse> => {
  if (!data) return { success: false, message: 'Datos faltantes', error: 'MISSING_PAYLOAD' };
  const docVal = validateDocumento(data.documento);
  if (!docVal.ok) return docVal.payload as ApiResponse;
  const celVal = validateCelular(data.celular);
  if (!celVal.ok) return celVal.payload as ApiResponse;
  if (typeof data.valor !== 'number' || isNaN(data.valor) || data.valor <= 0) {
    return { success: false, message: 'El valor a pagar debe ser mayor a cero.', error: 'INVALID_AMOUNT' };
  }

  try {
    const url = `${import.meta.env.VITE_API_URL}/wallet/solicitarPago`;
    const response = await axios.post(url, {
      documento: data.documento,
      celular: data.celular,
      valor: data.valor,
    }, {
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
    });
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Error al solicitar pago:', error);
    return handleAxiosError(error);
  }
};

export const confirmPayment = async (data: {
  sessionId: string;
  token: string;
}): Promise<ApiResponse> => {
  if (!data || !data.sessionId || !data.token) {
    return { success: false, message: 'sessionId y token son requeridos.', error: 'MISSING_PARAMS' };
  }
  try {
    const url = `${import.meta.env.VITE_API_URL}/wallet/confirmarPago`;
    const response = await axios.post(url, {
      sessionId: data.sessionId,
      token: data.token,
    }, {
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
    });
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    return handleAxiosError(error);
  }
};

export const checkBalance = async (data: {
  documento: string;
  celular?: string;
}): Promise<ApiResponse> => {
  const docVal = validateDocumento(data?.documento);
  if (!docVal.ok) return docVal.payload as ApiResponse;

  try {
    // Algunos endpoints sólo usan `documento`; incluimos `celular` sólo si está presente
    const params = new URLSearchParams();
    params.append('documento', data.documento);
    if (data.celular) params.append('celular', data.celular);
    const url = `${import.meta.env.VITE_API_URL}/wallet/consultarSaldo?${params.toString()}`;
    const response = await axios.get(url);
    console.log('checkbalance', response.data);
    return response.data as ApiResponse;
  } catch (error) {
    console.error('Error al consultar saldo:', error);
    return handleAxiosError(error);
  }
};
