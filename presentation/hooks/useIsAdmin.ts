import { useState, useEffect } from 'react';
import { authClientService } from '@/infrastructure/security';

/**
 * Hook para detectar si el usuario actual es administrador
 * Lee del localStorage la cookie de autenticación y verifica el rol
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      try {
        // Leer el valor encriptado del localStorage
        const encryptedStorage = localStorage.getItem('auth-storage');

        if (!encryptedStorage) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Verificar si es admin usando el servicio
        const isAdminUser = authClientService.isAdminFromStorage(encryptedStorage);

        if (!isAdminUser) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setIsAdmin(true);
        setIsLoading(false);
      } catch (error) {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdmin();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkAdmin();
    };

    globalThis.addEventListener('storage', handleStorageChange);

    return () => {
      globalThis.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isAdmin, isLoading };
}
