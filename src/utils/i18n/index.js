import en from "./locales/en.json";
import es from "./locales/es.json";

const translations = {
  en,
  es,
};

/**
 * Get current language (default to English)
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  return localStorage.getItem("language") || "en";
};

/**
 * Translate a key
 * @param {string} key - The translation key (can use dot notation for nested keys)
 * @param {Object} params - Optional parameters to replace in the translation
 * @returns {string} Translated text
 */
export const translate = (key, params = {}) => {
  const language = getCurrentLanguage();

  const keys = key.split(".");
  let translation = translations[language];

  for (const k of keys) {
    if (!translation[k]) {
      translation = translations["en"];
      for (const fallbackK of keys) {
        if (!translation[fallbackK]) {
          return key;
        }
        translation = translation[fallbackK];
      }
      break;
    }
    translation = translation[k];
  }

  if (typeof translation === "string" && Object.keys(params).length) {
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
  }

  return translation || key;
};

/**
 * Set language
 * @param {string} language - Language code to set
 */
export const setLanguage = (language) => {
  if (translations[language]) {
    localStorage.setItem("language", language);
  }
};

/**
 * Map error codes to translation keys
 * @param {string} errorCode - The error code from API
 * @returns {string} The translation key
 */
const mapErrorCodeToTranslationKey = (errorCode) => {
  if (errorCode.startsWith("error_")) {
    return `auth.${errorCode}`;
  }

  switch (errorCode) {
    case "server_error":
      return "error.server";
    case "rate_limit_exceeded":
      return "error.too_many_requests";
    default:
      return "error.unknown";
  }
};

/**
 * Get translated error message from error object
 * @param {Object} error - Error object with code, message, and status
 * @returns {string} Translated error message
 */
export const getErrorMessage = (error) => {
  if (error.code) {
    const translationKey = mapErrorCodeToTranslationKey(error.code);
    const translated = translate(translationKey);
    if (translated !== translationKey) {
      return translated;
    }
  }

  if (error.status === 429) {
    return translate("error.too_many_requests");
  } else if (error.status === 500) {
    return translate("error.server");
  }

  return error.message || translate("error.unknown");
};

export default {
  translate,
  setLanguage,
  getCurrentLanguage,
  getErrorMessage,
};
