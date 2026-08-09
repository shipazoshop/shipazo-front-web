export interface SupportedCountry {
  /** Código ISO 3166-1 alpha-2 (2 letras). */
  code: string;
  /** Nombre mostrado al usuario. */
  name: string;
}

/**
 * Países en los que operamos actualmente.
 *
 * Para habilitar entregas en un nuevo país basta con añadir una entrada aquí:
 * el selector de país en el formulario de direcciones se habilita
 * automáticamente cuando esta lista tiene más de un país.
 */
export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: "GT", name: "Guatemala" },
];

/** País preseleccionado por defecto en los formularios. */
export const DEFAULT_COUNTRY_CODE = "GT";
