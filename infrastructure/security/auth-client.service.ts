import { encryptionService } from './encryption.service';

/**
 * Servicio de autenticación para el lado del cliente
 * Maneja la decodificación de JWT y verificación de roles
 */
export class AuthClientService {
  private readonly adminRoleId: string;

  constructor() {
    this.adminRoleId = process.env.NEXT_PUBLIC_ADMIN_ID || '';

    if (!process.env.NEXT_PUBLIC_ADMIN_ID) {
      console.warn('⚠️ NEXT_PUBLIC_ADMIN_ID no está definida.');
    }
  }

  /**
   * Decodifica un JWT sin verificar la firma
   * Solo extrae el payload para leer información del usuario
   */
  decodeJWT(token: string): Record<string, any> | null {
    try {
      // JWT tiene formato: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Token no tiene formato JWT válido');
        return null;
      }

      // Decodificar el payload (segunda parte)
      const payload = parts[1];
      const decoded = atob(payload); // Base64 decode (compatible con navegador)
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      return null;
    }
  }

  /**
   * Verifica si un token JWT corresponde a un usuario administrador
   */
  isAdminFromToken(token: string): boolean {
    try {
      const payload = this.decodeJWT(token);
      if (!payload) {
        return false;
      }

      const userRole = payload.role;
      if (!userRole) {
        console.log('No se encontró role en el token');
        return false;
      }

      return userRole === this.adminRoleId;
    } catch (error) {
      console.error('Error al verificar admin desde token:', error);
      return false;
    }
  }

  /**
   * Verifica si un usuario es administrador desde el storage encriptado
   * @param encryptedStorage - Storage encriptado de localStorage
   * @returns true si el usuario tiene rol de admin
   */
  isAdminFromStorage(encryptedStorage: string): boolean {
    try {
      // 1. Desencriptar el storage
      const decryptedStorage = encryptionService.decrypt(encryptedStorage);
      if (!decryptedStorage) {
        return false;
      }

      // 2. Parsear el JSON del storage
      const storageData = JSON.parse(decryptedStorage);

      // El storage tiene estructura: { state: { accessToken, isAuthenticated } }
      const accessToken = storageData?.state?.accessToken;
      if (!accessToken) {
        return false;
      }

      // 3. Verificar el rol del token
      return this.isAdminFromToken(accessToken);
    } catch (error) {
      console.error('Error al verificar admin desde storage:', error);
      return false;
    }
  }

  /**
   * Obtiene el payload completo desde el storage encriptado
   */
  getPayloadFromStorage(encryptedStorage: string): Record<string, any> | null {
    try {
      const decryptedStorage = encryptionService.decrypt(encryptedStorage);
      if (!decryptedStorage) {
        return null;
      }

      const storageData = JSON.parse(decryptedStorage);
      const accessToken = storageData?.state?.accessToken;
      if (!accessToken) {
        return null;
      }

      return this.decodeJWT(accessToken);
    } catch (error) {
      console.error('Error al obtener payload desde storage:', error);
      return null;
    }
  }

  /**
   * Verifica si existe un token de autenticación válido en el storage
   */
  isAuthenticated(encryptedStorage: string): boolean {
    try {
      const decryptedStorage = encryptionService.decrypt(encryptedStorage);
      if (!decryptedStorage) {
        return false;
      }

      const storageData = JSON.parse(decryptedStorage);
      return storageData?.state?.isAuthenticated === true;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const authClientService = new AuthClientService();
