/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from '../types';
import { Info, ArrowRight, BookOpen, Wallet, Sparkles, TrendingUp, Compass, Award, Play } from 'lucide-react';

interface InicioContentProps {
  user: User;
  onNavigate: (tab: 'inicio' | 'teoria' | 'practica' | 'quiz' | 'configuracion') => void;
}

export default function InicioContent({ user, onNavigate }: InicioContentProps) {
  // Compute overall completion stats
  const completedCount = user.progress.completedModules.length;
  const percentage = Math.round((completedCount / 4) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Header Section */}
      <section className="relative rounded-xl overflow-hidden bg-brand-primary text-white min-h-[380px] flex items-center p-6 md:p-10 shadow-sm border border-slate-900">
        <div className="absolute inset-0 z-0 opacity-45 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/60 via-slate-950 to-black"></div>
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 z-0"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block py-1 px-3 bg-brand-secondary text-white font-mono font-bold text-xs uppercase tracking-widest rounded-full">
            Aula de Ingress
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Bienvenidos a Finanzas para la vida
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Hola, <strong className="text-white">{user.username}</strong>. Transformamos la relación que tienes con el dinero a través de una metodología estructurada, científica y moderna. Aprende a gestionar tus recursos con la confianza y maestría de un directivo financiero.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => onNavigate('practica')}
              className="px-6 py-3 bg-brand-secondary text-white font-bold text-sm rounded shadow-sm hover:bg-[#005236] active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              Empezar Simulaciones <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('teoria')}
              className="px-6 py-3 bg-transparent border border-white/30 text-white font-bold text-sm rounded hover:bg-white/10 active:scale-95 transition cursor-pointer"
            >
              Consultar Teoría
            </button>
          </div>
        </div>
      </section>

      {/* Stats Highlight Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-brand-secondary">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 capitalize">Puntos de Aprendizaje</p>
            <p className="text-2xl font-black text-slate-900">{user.progress.points} XP</p>
          </div>
        </div>
        
        <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-brand-tertiary">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Progreso del VLE</p>
            <p className="text-2xl font-black text-slate-900">{percentage}% Completado</p>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Módulos Logrados</p>
            <p className="text-2xl font-black text-slate-900">{completedCount} de 4 Prácticas</p>
          </div>
        </div>
      </div>

      {/* Learning Path Header */}
      <div className="space-y-1">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">Tu Ruta de Aprendizaje Personalizada</h3>
        <p className="text-sm text-slate-500">Explora los pilares fundamentales estructurados hacia tu absoluta libertad financiera.</p>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Module 1 Card (Savings) */}
        <div className="col-span-12 md:col-span-8 bg-white border border-slate-200 p-6 rounded-lg hover:shadow-sm transition group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg text-brand-tertiary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-brand-secondary font-mono tracking-wide">Módulo Práctico</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-secondary transition">
            Ahorro Inteligente e Interés Compuesto
          </h4>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Aprende técnicas avanzadas para optimizar tus flujos de escape de capital y simular cómo el interés compuesto capitaliza pequeños depósitos constantes para forjar patrimonios sólidos en el tiempo.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-brand-secondary h-full transition-all duration-500" 
                style={{ width: `${user.progress.completedModules.includes('ahorro') ? '100%' : '15%'}` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {user.progress.completedModules.includes('ahorro') ? '100% Completado' : 'Pendiente por Práctica'}
            </span>
          </div>
        </div>

        {/* Module 2 Card (Budgeting) */}
        <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-6 rounded-lg hover:shadow-sm transition">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-brand-secondary mb-4 inline-block">
            <Wallet className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">Presupuesto 50/30/20</h4>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Aprende a distribuir tus ingresos usando la regla empírica 50% Necesidades, 30% Deseos y 20% Ahorro.
          </p>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>25 mins de lectura teórica</span>
            <button
              onClick={() => onNavigate('teoria')}
              className="text-brand-secondary font-bold hover:underline cursor-pointer"
            >
              Estudiar
            </button>
          </div>
        </div>

        {/* Video: Transforma tu relación con el dinero */}
        <div className="col-span-12 bg-white border border-slate-200 p-6 rounded-lg hover:shadow-sm transition space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-brand-secondary rounded-lg">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Lección Destacada: Transforma tu relación con el dinero</h4>
                <p className="text-xs text-slate-500">Video oficial de inducción y mentalidad financiera</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Recomendado
            </span>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-video max-w-4xl mx-auto shadow-md border border-slate-800">
            <video 
              src="https://bind-study-05487976.figma.site/_components/v2/0cefbed3368aa8901d7f4f8193ff8488cdef0569/Transforma_tu_relacin_con_el_dinero_0p.e96fc88a.mp4" 
              controls 
              preload="metadata"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600 border border-slate-100 leading-relaxed max-w-4xl mx-auto">
            <p className="font-semibold text-slate-800 mb-1">💡 ¿Qué aprenderás en este video?</p>
            <p>Descubre los fundamentos para reconfigurar tus hábitos de consumo, identificar sesgos de comportamiento al gastar, y dar el primer paso para programar tu mente hacia la abundancia y la estabilidad financiera a través de simulación activa.</p>
          </div>
        </div>

        {/* Module 3 Card (Investment) */}
        <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-6 rounded-lg hover:shadow-sm transition">
          <div className="p-2.5 bg-violet-50 rounded-lg text-violet-600 mb-4 inline-block">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">Deuda y Puntuación Crediticia</h4>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Aprende la diferencia entre deuda buena y perjudicial, apalancamientos sanos, y la disciplina para erradicar las deudas usureras.
          </p>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Simulador habilitado</span>
            <button
              onClick={() => onNavigate('practica')}
              className="text-brand-secondary font-bold hover:underline cursor-pointer"
            >
              Simular
            </button>
          </div>
        </div>

        {/* Pro Tip/Callout Module matching Fiscal Equilibrium spec */}
        <div className="col-span-12 md:col-span-8 bg-[#EFF6FF] border-l-4 border-slate-900 p-6 rounded-r-lg">
          <div className="flex gap-4 items-start">
            <Info className="w-5 h-5 text-brand-tertiary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-widest leading-none">
                Nota Financiera del Consultor
              </h5>
              <p className="text-sm text-slate-700 leading-relaxed">
                El verdadero capital no es el dinero acumulado de forma inerte, sino la destreza intelectual que posees para automatizar que cada moneda que ingresas trabaje sin descanso por tus objetivos a largo plazo. Invierte primero en tu educación.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
