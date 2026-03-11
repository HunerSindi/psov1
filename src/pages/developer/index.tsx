"use client";

import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";
import {
    ArrowLeft, Mail, Phone, Instagram, Code2,
    Smartphone, Layers, BrainCircuit, ShieldCheck, Globe
} from "lucide-react";

export default function DeveloperPage() {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Header / Nav */}
            <div className="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 hover:text-gray-300 transition-colors uppercase font-bold text-sm"
                    >
                        {dir === 'rtl' ? <>&rarr;</> : <ArrowLeft size={18} />}
                        {t("developer.back")}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

                {/* --- 1. PROFILE HEADER --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">

                    {/* Image Area */}
                    <div className="shrink-0 relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-100 shadow-inner">
                            {/* Put your image in public/profile.jpg */}
                            <img
                                src="/pro.JPG"
                                alt="Huner"
                                width={160}
                                height={160}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.currentTarget.src = "https://ui-avatars.com/api/?name=Huner+Sindi&background=0D8ABC&color=fff&size=160";
                                }}
                            />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white" title="Available"></div>
                    </div>

                    {/* Intro Text */}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                            Huner Sindi
                        </h1>
                        <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                            {t("developer.role")}
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {t("developer.bio")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- 2. SKILLS & TECH --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4 text-blue-700">
                            <Code2 size={24} />
                            <h2 className="text-xl font-bold uppercase">{t("developer.sections.skills")}</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">{t("developer.items.languages")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Go (Golang)", "TypeScript", "Dart (Flutter)", "SQL"].map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">{t("developer.items.frameworks")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Flutter", "Next.js", "React", "React Native", "Vite", "Tailwind"].map(tool => (
                                        <span key={tool} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <div className="flex items-start gap-2 mt-2">
                                    <Layers className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <span className="font-bold text-sm block">{t("developer.sections.specialty")}</span>
                                        <span className="text-sm text-gray-600">{t("developer.sections.specialty_desc")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 3. PROBLEM SOLVING & INTERESTS --- */}
                    <div className="space-y-6">
                        {/* Philosophy */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-3 text-purple-700">
                                <BrainCircuit size={24} />
                                <h2 className="text-xl font-bold uppercase">{t("developer.sections.philosophy")}</h2>
                            </div>
                            <p className="text-gray-600 italic border-l-4 border-purple-200 pl-4 py-1">
                                "{t("developer.sections.philosophy_desc")}"
                            </p>
                        </div>

                        {/* Interests */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-3 text-red-600">
                                <ShieldCheck size={24} />
                                <h2 className="text-xl font-bold uppercase">{t("developer.sections.interests")}</h2>
                            </div>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {t("developer.items.interest_1")}
                                </li>
                                <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {t("developer.items.interest_2")}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- 4. PROJECTS --- */}
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl shadow-lg p-6 md:p-8 text-white">
                    <div className="flex items-center gap-2 mb-6">
                        <Smartphone size={24} className="text-blue-300" />
                        <h2 className="text-2xl font-bold uppercase tracking-wide">{t("developer.sections.projects")}</h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-blue-200 mb-2">
                                    {t("developer.items.duen_title")}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {t("developer.items.duen_desc")}
                                </p>
                            </div>
                            <div className="bg-blue-500/20 p-3 rounded-full text-blue-200 hidden md:block">
                                <Globe size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 5. CONTACT --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <h2 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">
                        {t("developer.sections.contact")}
                    </h2>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
                        <a href="mailto:hunersindia@gmail.com" className="group flex flex-col items-center gap-2 hover:scale-105 transition-transform">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <Mail size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">hunersindia@gmail.com</span>
                        </a>

                        <a href="tel:+9647504948861" className="group flex flex-col items-center gap-2 hover:scale-105 transition-transform">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Phone size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">+964 750 494 8861</span>
                        </a>

                        <a href="https://instagram.com/hunersindi" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 hover:scale-105 transition-transform">
                            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                <Instagram size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">@hunersindi</span>
                        </a>
                    </div>
                </div>

                {/* Footer Signature */}
                <div className="text-center text-xs text-gray-400 font-mono py-4">
                    © {new Date().getFullYear()} Built with ❤️ by Huner Sindi
                </div>

            </div>
        </div>
    );
}