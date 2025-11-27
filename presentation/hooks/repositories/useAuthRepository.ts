import { getApiConfig, URL_DICTIONARY } from "@/infrastructure";
import { useAuthStore } from "@/application/stores/useAuthStore";

const SCRAPER_PRODUCT_URL = getApiConfig()

export function useAuthRepository() {
    const { clearAuth } = useAuthStore();

    const googleAuth = () => {
        const authUrl = SCRAPER_PRODUCT_URL.scrapper + URL_DICTIONARY.AUTH;
        console.log("🚀 ~ googleAuth ~ authUrl:", authUrl)
        globalThis.location.href = authUrl;
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
        logout
    };
}