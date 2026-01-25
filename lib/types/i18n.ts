/**
 * Types pour le multi-langue
 */

export type SupportedLanguage = "fr" | "en";

export interface TranslatedText {
  fr: string;
  en: string;
}

export interface I18nConfig {
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
}
