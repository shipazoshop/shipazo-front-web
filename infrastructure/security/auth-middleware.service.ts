import CryptoJS from 'crypto-js';

/**
 * Servicio de autenticación para Middleware
 * Compatible con Edge Runtime de Next.js
 */
export class AuthMiddlewareService {
  private readonly secretKey: string;
  private readonly adminRoleId: string;

  constructor() {
    this.secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'shipazo-default-secret-key-change-in-production';
    this.adminRoleId = process.env.NEXT_PUBLIC_ADMIN_ID || '';

    if (!process.env.NEXT_PUBLIC_ADMIN_ID) {
      console.warn('⚠️ NEXT_PUBLIC_ADMIN_ID no está definida.');
    }
  }

  /**
   * Desencripta un string encriptado con AES (mismo método que EncryptionService)
   */
  private decrypt(encryptedData: string): string {
    if (!encryptedData) return '';

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        console.warn('Fallo en la desencriptación del storage');
        return '';
      }

      return decryptedText;
    } catch (error) {
      console.error('Error al desencriptar storage:', error);
      return '';
    }
  }

  /**
   * Decodifica un JWT sin verificar la firma
   * Solo extrae el payload para leer el role
   */
  private decodeJWT(token: string): Record<string, any> | null {
    try {
      // JWT tiene formato: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Token no tiene formato JWT válido');
        return null;
      }

      // Decodificar el payload (segunda parte)
      const payload = parts[1];
      const decoded = Buffer.from(payload, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      return null;
    }
  }

  /**
   * Verifica si un usuario es administrador
   * @param encryptedStorage - Storage encriptado de la cookie 'auth-storage'
   * @returns true si el usuario tiene rol de admin
   */
  isAdmin(encryptedStorage: string): boolean {
    try {
      // 1. Desencriptar el storage
      const decryptedStorage = this.decrypt(encryptedStorage);
      if (!decryptedStorage) {
        console.log('Storage vacío o corrupto');
        return false;
      }

      // 2. Parsear el JSON del storage
      const storageData = JSON.parse(decryptedStorage);

      // El storage tiene estructura: { state: { accessToken, isAuthenticated } }
      const accessToken = storageData?.state?.accessToken;
      if (!accessToken) {
        //('No se encontró accessToken en el storage');
        return false;
      }

      // 3. Decodificar el JWT para obtener el payload
      const payload = this.decodeJWT(accessToken);
      if (!payload) {
        //('No se pudo decodificar el JWT');
        return false;
      }

      // 4. Verificar el role
      const userRole = payload.roleId;
      if (!userRole) {
        //('No se encontró role en el token');
        return false;
      }

      // 5. Comparar con NEXT_PUBLIC_ADMIN_ID
      const isAdmin = userRole === this.adminRoleId;

      if (!isAdmin) {
        //(Role no coincide con admin ID);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al verificar admin:', error);
      return false;
    }
  }

  /**
   * Verifica si existe un token de autenticación válido
   */
  isAuthenticated(encryptedStorage: string): boolean {
    try {
      const decryptedStorage = this.decrypt(encryptedStorage);
      if (!decryptedStorage) return false;

      const storageData = JSON.parse(decryptedStorage);
      return storageData?.state?.isAuthenticated === true;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const authMiddlewareService = new AuthMiddlewareService();
