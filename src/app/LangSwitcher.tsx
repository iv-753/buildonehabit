"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LangSwitcher() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (savedLang) setLang(savedLang);
  }, []);

  const handleLangSwitch = () => {
    const newLang = lang === "en" ? "zh" : "en";
    setLang(newLang);
    if (typeof window !== 'undefined') localStorage.setItem('lang', newLang);
  };

  return (
    <div className="flex gap-4 items-center">
      <Link href="/history" className="text-blue-600 hover:underline font-medium">
        {lang === "en" ? "History" : "历史"}
      </Link>
      <button
        className="text-gray-600 border px-2 py-1 rounded hover:bg-gray-100 ml-2"
        onClick={handleLangSwitch}
      >
        {lang === "en" ? "中文" : "EN"}
      </button>
    </div>
  );
} 