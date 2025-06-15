"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  lang: "en" | "zh";
  setLang: (lang: "en" | "zh") => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<"en" | "zh">("en");

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (savedLang === "en" || savedLang === "zh") setLang(savedLang);
  }, []);

  const handleSetLang = (l: "en" | "zh") => {
    setLang(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  );
} 