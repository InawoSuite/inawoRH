import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";


import translationENG from "./locales/en.json";

import translationFR from "./locales/fr.json";

const normalizeLanguageCode = (value) => {
  const lang = String(value || "").trim().toLowerCase();

  if (lang.startsWith("en")) {
    return "en";
  }

  if (lang.startsWith("fr")) {
    return "fr";
  }

  return null;
};

const persistedLanguage =
  localStorage.getItem("I18N_LANGUAGE") || localStorage.getItem("i18nextLng");
const initialLanguage = normalizeLanguageCode(persistedLanguage);

// the translations
const resources = {


  en: {
    translation: translationENG,
  },

  fr: {
    translation: translationFR,
  },
};

// const language = localStorage.getItem("I18N_LANGUAGE");
// if (language) {
//   localStorage.setItem("I18N_LANGUAGE", "fr");
// }

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    ...(initialLanguage ? { lng: initialLanguage } : {}),
    fallbackLng: "fr", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
