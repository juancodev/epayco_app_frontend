export interface Client {
  documento: string;
  nombres: string;
  email: string;
  celular: string;
  valor: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaymentSession {
  sessionId: string;
  documento: string;
  monto: number;
  token: string;
  expiresAt: number;
}

export enum ViewState {
  REGISTER = 'REGISTER',
  RECHARGE = 'RECHARGE',
  PAY = 'PAY',
  BALANCE = 'BALANCE'
}