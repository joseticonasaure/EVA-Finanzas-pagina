/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { 
  Award, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Timer, 
  Info,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

interface QuizContentProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export default function QuizContent({ user, onUpdateUser }: QuizContentProps) {
  const [redirectCount, setRedirectCount] = useState(3);
  const [autoRedirected, setAutoRedirected] = useState(false);

  useEffect(() => {
    // Attempt automatic open once on mount
    const timer = setTimeout(() => {
      window.open('https://eva-finanzas-1.onrender.com/', '_blank');
      setAutoRedirected(true);
    }, 1200);

    // Countdown effect for visual feedback
    const interval = setInterval(() => {
      setRedirectCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleManualRedirect = () => {
    window.open('https://eva-finanzas-1.onrender.com/', '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in" id="quiz-external-redirect-workspace">
      
      {/* HEADER SECTION */}
      <section className="border-b border-slate-100 pb-5 text-left">
        <span className="text-xs font-mono font-bold text-brand-secondary uppercase tracking-widest block mb-1">
          SISTEMA DE EVALUACIÓN MULTI-MODULAR
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans">
          Ponte a Prueba
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Accede a nuestra plataforma académica centralizada e integrada para revalidar tus competencias financieras mediante simulaciones interactivas de toma de decisiones.
        </p>
      </section>

      {/* RENDER REDIRECT CARD INTERFACE */}
      <div className="max-w-2xl mx-auto" id="evaluador-portal-card">
        <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 md:p-10 shadow-sm text-center space-y-6 relative overflow-hidden">
          
          {/* Subtle grid background overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px] opacity-15 z-0"></div>

          <div className="relative z-10 space-y-6">
            
            {/* Visual Icon Badge */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary animate-pulse">
                  <Award className="w-10 h-10" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-full border-2 border-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                </span>
              </div>
            </div>

            {/* Portal Title */}
            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-block px-3 py-1 bg-slate-100 border text-slate-600 font-mono text-[10px] font-bold rounded-full">
                PLATAFORMA EXTERNA OFICIAL
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 font-sans tracking-tight">
                Laboratorio de Evaluación Integrado
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                Estás siendo redirigido de forma segura a nuestro evaluador avanzado en Render para verificar tu escala de aptitudes empresariales.
              </p>
            </div>

            {/* Redirection Status Banner */}
            <div className="bg-white border rounded-xl p-4 max-w-sm mx-auto shadow-sm flex items-center justify-center gap-3">
              <Timer className="w-5 h-5 text-brand-secondary animate-spin-slow flex-shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-700">
                {redirectCount > 0 
                  ? `Redireccionando en ${redirectCount} segundos...` 
                  : 'Listo. Redirección iniciada.'}
              </span>
            </div>

            {/* Action Main Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleManualRedirect}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-secondary hover:bg-[#005236] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>Acceder al Evaluador Ahora</span>
                <ExternalLink className="w-4 h-4 text-emerald-300" />
              </button>

              <p className="text-[10px] text-slate-400 font-mono">
                ¿La ventana no se abrió de forma automática? Presiona el botón de acceso correspondiente para saltar los bloqueadores de pop-ups de tu navegador.
              </p>
            </div>

            {/* Divider line */}
            <div className="border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-xs text-slate-500">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encriptación Académica SSL Activa</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <span>eva-finanzas-1.onrender.com</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* HELPFUL INFOGRAPHIC CARD LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="assessment-details-row">
        
        <div className="bg-white border p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-50 border rounded-lg text-slate-600">
              <Activity className="w-4 h-4 text-slate-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              ¿Qué evalúa la plataforma?
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consólida cuestionarios interactivos estructurados sobre los 4 pilares financieros clave: liquidez de caja, estructuras contables, apalancamientos y presupuestos familiares de contingencia.
          </p>
        </div>

        <div className="bg-white border p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-50 border rounded-lg text-slate-600">
              <TrendingUp className="w-4 h-4 text-slate-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Acreditación y Progreso XP
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Al completar tus marcas y revalidaciones en el portal evaluador externo, mantendrás tus XP consolidados para acreditar que estás listo para la simulación avanzada.
          </p>
        </div>

      </div>

    </div>
  );
}
