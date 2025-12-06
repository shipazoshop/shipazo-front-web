import CryptoJS from 'crypto-js';

/**
 * Servicio de encriptación/desencriptación de datos
 * Utiliza AES (Advanced Encryption Standard) para proteger información sensible
 */
class EncryptionService {
  private readonly secretKey: string;

  constructor() {
    // Usar variable de entorno o clave por defecto
    // En producción, SIEMPRE usar una variable de entorno
    this.secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'shipazo-default-secret-key-change-in-production';

    if (!process.env.NEXT_PUBLIC_ENCRYPTION_KEY) {
      console.warn('⚠️ NEXT_PUBLIC_ENCRYPTION_KEY no está definida. Usando clave por defecto. Configúrala en producción.');
    }
  }

  /**
   * Encripta un string usando AES
   * @param data - Dato a encriptar
   * @returns String encriptado en formato Base64
   */
  encrypt(data: string): string {
    if (!data) return '';

    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.secretKey);
      return encrypted.toString();
    } catch (error) {
      console.error('Error al encriptar:', error);
      return data; // Fallback: retornar dato sin encriptar
    }
  }

  /**
   * Desencripta un string encriptado con AES
   * @param encryptedData - Dato encriptado en formato Base64
   * @returns String desencriptado
   */
  decrypt(encryptedData: string): string {
    if (!encryptedData) return '';

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      // Si la desencriptación falla, retorna string vacío
      if (!decryptedText) {
        console.warn('Fallo en la desencriptación - dato corrupto o clave incorrecta');
        return '';
      }

      return decryptedText;
    } catch (error) {
      console.error('Error al desencriptar:', error);
      return ''; // Fallback: retornar vacío si hay error
    }
  }

  /**
   * Encripta un objeto convirtiéndolo a JSON primero
   * @param data - Objeto a encriptar
   * @returns String encriptado
   */
  encryptObject<T>(data: T): string {
    try {
      const jsonString = JSON.stringify(data);
      return this.encrypt(jsonString);
    } catch (error) {
      console.error('Error al encriptar objeto:', error);
      return '';
    }
  }

  /**
   * Desencripta un string y lo convierte de JSON a objeto
   * @param encryptedData - Dato encriptado
   * @returns Objeto desencriptado
   */
  decryptObject<T>(encryptedData: string): T | null {
    try {
      const decryptedString = this.decrypt(encryptedData);
      if (!decryptedString) return null;

      return JSON.parse(decryptedString) as T;
    } catch (error) {
      console.error('Error al desencriptar objeto:', error);
      return null;
    }
  }

  /**
   * Genera un hash SHA256 de un string (útil para passwords)
   * @param data - Dato a hashear
   * @returns Hash en formato hexadecimal
   */
  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}

// Exportar instancia singleton
export const encryptionService = new EncryptionService();
