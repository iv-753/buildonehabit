"use client";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function Header() {
  const { lang, setLang } = useLanguage();

  const handleLangSwitch = () => {
    setLang(lang === "en" ? "zh" : "en");
  };

  return (
    <header className="w-full flex justify-end p-4 bg-white shadow-sm gap-4">
      <Link href="/history" className="text-blue-600 hover:underline font-medium">
        {lang === "en" ? "History" : "历史"}
      </Link>
      <button
        className="text-gray-600 border px-2 py-1 rounded hover:bg-gray-100 ml-2"
        onClick={handleLangSwitch}
      >
        {lang === "en" ? "中文" : "EN"}
      </button>
    </header>
  );
} 