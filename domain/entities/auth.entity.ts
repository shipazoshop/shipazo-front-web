// Usuario autenticado devuelto por el backend tras el intercambio del código.
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  roleId: string;
}

// Par de tokens emitidos por el backend en el login.
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Body del POST /auth/exchange: el código de un solo uso recibido en el callback
// (?code=<uuid>). Es canjeable una única vez.
export interface ExchangeCodeDto {
  code: string;
}

// Contenido de `data` en una respuesta exitosa del intercambio.
export interface ExchangeCodeData {
  user: AuthUser;
  tokens: AuthTokens;
}

// Respuesta 200 del POST /auth/exchange.
// El token de sesión se toma de `data.tokens.accessToken`.
export interface ExchangeCodeResponse {
  success: boolean;
  data: ExchangeCodeData;
}

// Body del POST /auth/refresh: el refreshToken vigente guardado en el store.
export interface RefreshTokenDto {
  refreshToken: string;
}

// Respuesta 200 del POST /auth/refresh.
// El backend ROTA el refresh: devuelve un par nuevo y hay que guardar ambos.
export interface RefreshTokenResponse {
  success: boolean;
  data: AuthTokens;
}
