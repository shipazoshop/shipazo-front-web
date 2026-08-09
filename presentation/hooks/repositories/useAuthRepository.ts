import { getApiConfig, URL_DICTIONARY } from "@/infrastructure";
import { useAuthStore } from "@/application/stores/useAuthStore";
import { useApiMutation } from "../api/useApiMutation";
import { ExchangeCodeDto, ExchangeCodeResponse } from "@/domain/entities/auth.entity";

const SCRAPER_PRODUCT_URL = getApiConfig()

export function useAuthRepository() {
    const { clearAuth } = useAuthStore();

    const googleAuth = () => {
        const authUrl = SCRAPER_PRODUCT_URL.scrapper + URL_DICTIONARY.AUTH;
        globalThis.location.href = authUrl;
    }

    // Intercambia el código de un solo uso (?code=<uuid>) del callback por los
    // tokens de sesión. No requiere un accessToken previo: es el propio login.
    //
    // Snackbars desactivados a propósito: un 401 significa "código inválido o
    // expirado" y lo maneja la pantalla /callback (mostrar error → redirigir a
    // /login), no un toast genérico.
    const exchangeCode = () => {
        return useApiMutation<ExchangeCodeResponse, ExchangeCodeDto>({
            service: 'scrapper',
            endpoint: URL_DICTIONARY.AUTH_EXCHANGE,
            method: 'POST',
            showSuccessSnackbar: false,
            showErrorSnackbar: false,
        });
    }

    const logout = () => {
        clearAuth();
        // Redirigir al login
        if (globalThis.window !== undefined) {
            globalThis.location.href = '/login';
        }
    }

    return {
        // Actions
        googleAuth,
        logout,
        // Mutations
        exchangeCode,
    };
}