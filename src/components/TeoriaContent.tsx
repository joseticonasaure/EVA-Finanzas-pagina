/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import manualImage from '../assets/images/Manual.jpeg';
import { jsPDF } from 'jspdf';
import { 
  ArrowLeft,
  BookOpen, 
  TrendingUp, 
  Scale, 
  Briefcase, 
  Brain, 
  CheckCircle2, 
  ChevronRight, 
  DownloadCloud, 
  Coins, 
  Award, 
  DollarSign, 
  Percent, 
  Calculator,
  Users,
  TrendingDown,
  ShieldAlert,
  ArrowRightLeft,
  Activity
} from 'lucide-react';

interface TeoriaContentProps {
  user: User;
  onAddPoints: (points: number) => void;
}

export default function TeoriaContent({ user, onAddPoints }: TeoriaContentProps) {
  // State to manage entering a specific module or staying on the selector desk
  // selectedModule: null (selector view) or 1, 2, 3, 4, 5 (detailed content view)
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  
  // Interactive tools states
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  
  // Completed theory modules list to avoid double claiming rewards
  const [completedTheoryModules, setCompletedTheoryModules] = useState<number[]>([]);

  // Load completed modules from storage
  useEffect(() => {
    const saved = localStorage.getItem(`completed_theory_modules_${user.email.toLowerCase().trim()}`);
    if (saved) {
      try {
        setCompletedTheoryModules(JSON.parse(saved));
      } catch (e) {
        // Safe fallback
      }
    }
  }, [user.email]);

  // Handle module reward
  const handleClaimReward = (modId: number) => {
    if (completedTheoryModules.includes(modId)) {
      alert(`Estimado(a) ${user.username}, ya has acreditado el Módulo 0${modId}. ¡Excelente trabajo continuo!`);
      return;
    }

    const updated = [...completedTheoryModules, modId];
    setCompletedTheoryModules(updated);
    localStorage.setItem(
      `completed_theory_modules_${user.email.toLowerCase().trim()}`,
      JSON.stringify(updated)
    );

    // Grant 40 XP for robust reading
    onAddPoints(40);
    alert(`🎉 ¡Lectura Acreditada! Has dominado el Módulo 0${modId}. Se han sumado +40 XP a tu Perfil Académico.`);
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    
    const img = new Image();
    img.src = manualImage;
    
    img.onload = () => {
      setDownloading(false);
      setDownloadSuccess(true);
      onAddPoints(20);
      
      try {
        const width = img.naturalWidth || 1200;
        const height = img.naturalHeight || 850;
        const doc = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height]
        });
        doc.addImage(img, 'JPEG', 0, 0, width, height);
        doc.save('Manual_Finanzas.pdf');
        
        alert('📚 ¡Se ha descargado el Manual de Finanzas en formato PDF con éxito! Ganaste +20 XP de investigación corporativa.');
      } catch (error) {
        console.error('Error generating PDF:', error);
        fallbackDownload();
      }
    };

    img.onerror = () => {
      console.error('Error loading manual image');
      fallbackDownload();
    };

    const fallbackDownload = () => {
      setDownloading(false);
      setDownloadSuccess(true);
      onAddPoints(20);
      const link = document.createElement('a');
      link.href = manualImage;
      link.download = 'Manual.jpeg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('📚 ¡Se ha descargado el Manual de Finanzas (Manual.jpeg) con éxito! Ganaste +20 XP de investigación corporativa.');
    };
  };

  // --- INTERACTIVE CALCULATOR ENGINE STATES ---
  // Simulator 1: Cash Flow Desfase
  const [recaudadoM1, setRecaudadoM1] = useState<number>(12000);
  const [plazoCobroM1, setPlazoCobroM1] = useState<number>(90); // en días
  const [gastosFijosM1, setGastosFijosM1] = useState<number>(5000);

  // Simulator 2: Live Balance Equation
  const [bgActivosInt, setBgActivosInt] = useState<number>(20000); // Caja + Eq
  const [bgPasivoProv, setBgPasivoProv] = useState<number>(8000);  // Deuda
  
  // Simulator 3: VAN Project
  const [inversionInicial, setInversionInicial] = useState<number>(15000);
  const [tasaDescuento, setTasaDescuento] = useState<number>(12); // %
  const [flujoAnual, setFlujoAnual] = useState<number>(6500);

  // Simulator 4: Portafolio Asset Allocation
  const [perfilRiesgo, setPerfilRiesgo] = useState<'conservador' | 'moderado' | 'alto-riesgo'>('moderado');

  // Simulator 5: Break-even analysis (Q = CF / (P - CVU)) (THE SUPREME COMPENDIO)
  const [eqCostosFijos, setEqCostosFijos] = useState<number>(4500);
  const [eqPrecioVenta, setEqPrecioVenta] = useState<number>(75);
  const [eqCostoVarUnit, setEqCostoVarUnit] = useState<number>(25);

  const calculatedQ = eqPrecioVenta > eqCostoVarUnit 
    ? Math.round(eqCostosFijos / (eqPrecioVenta - eqCostoVarUnit)) 
    : 0;

  // Calculador para el Módulo 5 (CAC vs LTV)
  const [cacCost, setCacCost] = useState<number>(35);
  const [ltvValue, setLtvValue] = useState<number>(150);

  // Computed values
  const cajaM1Disponible = plazoCobroM1 > 60 ? recaudadoM1 * 0.25 : recaudadoM1 * 0.85;
  const balanceCajaM1 = cajaM1Disponible - gastosFijosM1;

  // --- MODULE METADATA LIST ---
  const modulesList = [
    {
      id: 5,
      title: "Compendio Teórico de Finanzas Fundamentales",
      subtitle: "Guía de Conocimientos Técnicos para la Gestión de Negocios y Simulación Empresarial",
      shortDesc: "El núcleo teórico y pilar más importante de tu formación. Cubre liquidez extrema, punto de equilibrio operativo, arquitectura de precios de mercado y disciplina fiscal.",
      colorClass: "from-amber-500/10 to-emerald-500/15 border-amber-300 shadow bg-gradient-to-tr",
      icon: Award,
      badgeText: "★ EXTREMADAMENTE IMPORTANTE",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200"
    },
    {
      id: 1,
      title: "El Motor del Negocio",
      subtitle: "Finanzas Corporativas Básicas",
      shortDesc: "Introducción a los flujos operativos, el colchón mínimo de reserva de caja y deconstrucción de la fatídica Falacia del Costo Hundido.",
      colorClass: "bg-white border-slate-200",
      icon: TrendingUp,
      badgeText: "MÓDULO 01",
      badgeColor: "bg-slate-100 text-slate-700"
    },
    {
      id: 2,
      title: "Contabilidad y Evaluación Financiera",
      subtitle: "Los Tres Estados Claves",
      shortDesc: "Aprende a interpretar el Balance General, el Estado de de Resultados (P&G) e introduce prudencia frente a las provisiones del IVA.",
      colorClass: "bg-white border-slate-200",
      icon: Scale,
      badgeText: "MÓDULO 02",
      badgeColor: "bg-slate-100 text-slate-700"
    },
    {
      id: 3,
      title: "Estrategia Avanzada de Capital",
      subtitle: "Financiamiento y Viabilidad",
      shortDesc: "Uso del apalancamiento inteligente, fijación del salario de fundadores y algoritmos de descuento para la evaluación con VAN y TIR.",
      colorClass: "bg-white border-slate-200",
      icon: Briefcase,
      badgeText: "MÓDULO 03",
      badgeColor: "bg-slate-100 text-slate-700"
    },
    {
      id: 4,
      title: "Entorno Macroeconómico y Mercados",
      subtitle: "Variables Globales y de Conducta",
      shortDesc: "Comportamiento ante subas de tipos de interés de los bancos centrales, asignación táctica de activos y sesgos conductuales del dinero.",
      colorClass: "bg-white border-slate-200",
      icon: Brain,
      badgeText: "MÓDULO 04",
      badgeColor: "bg-slate-100 text-slate-700"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="academic-theory-workspace">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-105 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-brand-secondary uppercase tracking-widest block mb-1">
            BIBLIOTECA ACADÉMICA VLE
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans">
            Manual Completo de Finanzas
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Domina los principios del análisis empresarial y asiste a simulaciones de control financiero interactivo formuladas con total rigor científico.
          </p>
        </div>

        {/* Action Button: Download Compilation */}
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition focus:outline-none cursor-pointer"
        >
          {downloading ? (
            <>Generando manual...</>
          ) : downloadSuccess ? (
            <>✓ Manual descargado (+20 XP)</>
          ) : (
            <>
              <DownloadCloud className="w-4 h-4 text-emerald-400" />
              <span>Descargar Manual Completo</span>
            </>
          )}
        </button>
      </section>

      {/* RENDER THE SELECTOR DESK - IF NOT INSIDE A MODULE */}
      {selectedModule === null ? (
        <div className="space-y-6" id="module-selector-desk">
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-secondary" />
                <span>Escritorio de Aprendizaje</span>
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona una lección para ingresar a su estudio analítico. Ganarás créditos académicos XP al finalizar cada lectura.
              </p>
            </div>
            <div className="flex gap-2 text-[11px] font-mono font-bold text-slate-600 bg-white border px-3 py-1.5 rounded-lg shadow-sm">
              <span>Acreditado:</span>
              <span className="text-brand-secondary">{completedTheoryModules.length} / 5 Módulos</span>
            </div>
          </div>

          {/* GRID DE MÓDULOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="modules-grid-display">
            
            {/* 1. THE 4 INITIAL MODULES (2 COLUMNS LAYOUT) */}
            {modulesList.filter(m => m.id !== 5).map((m) => {
              const Icon = m.icon;
              const isAcredited = completedTheoryModules.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModule(m.id)}
                  className="p-5 rounded-xl border bg-white border-slate-200 hover:border-slate-350 hover:shadow transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {m.badgeText}
                      </span>
                      {isAcredited && (
                        <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-150 flex items-center gap-0.5">
                          ✔ Listo (+40 XP)
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <div className="p-3 bg-slate-50 border text-slate-600 rounded-lg h-fit group-hover:bg-slate-100 transition">
                        <Icon className="w-5.5 h-5.5 text-slate-700" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-secondary transition truncate">
                          {m.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono italic">
                          {m.subtitle}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                          {m.shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-sans font-bold">
                    <span className="text-slate-400 font-mono text-[10px]">Lectura interactiva</span>
                    <span className="text-slate-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Comenzar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 2. COMPENDIO TEÓRICO DE FINANZAS FUNDAMENTALES (THE MOST IMPORTANT - SPAN FULL ROW & LOCATED AT THE END) */}
            {modulesList.filter(m => m.id === 5).map((m) => {
              const Icon = m.icon;
              const isAcredited = completedTheoryModules.includes(5);
              return (
                <div 
                  key={m.id}
                  onClick={() => setSelectedModule(5)}
                  className={`col-span-1 md:col-span-2 p-6 md:p-8 rounded-xl border border-amber-250/80 bg-gradient-to-r from-amber-50/20 via-slate-50/40 to-emerald-50/10 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 relative group`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border ${m.badgeColor}`}>
                        {m.badgeText}
                      </span>
                      {isAcredited && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETADO & XP GANADO
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="p-4 bg-amber-500/10 text-amber-900 rounded-lg h-fit group-hover:scale-105 transition-transform border border-amber-200/50">
                        <Icon className="w-8 h-8 text-amber-600" />
                      </div>
                      <div className="space-y-1 max-w-3xl">
                        <h2 className="text-lg md:text-xl font-black text-slate-1000 font-sans tracking-tight">
                          {m.title}
                        </h2>
                        <p className="text-xs text-amber-800 font-mono font-bold leading-none">
                          {m.subtitle}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                          {m.shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/30">
                    <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                      <span>✦ 4 Pilares Fundamentales</span>
                      <span>✦ Fórmulas e Interactivos</span>
                      <span>✦ Valoración Profesional (+40 XP)</span>
                    </div>
                    <span className="text-xs font-bold font-sans text-amber-800 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Ingresar al Compendio de Finanzas</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Sunk Cost / Quick psychology alert at bottom */}
          <div className="bg-amber-50/40 border border-amber-250 p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-amber-950 font-sans">Recuerda: Ley Suprema de Supervivencia Corporativa</span>
              <p className="text-slate-600 leading-relaxed">
                "Las utilidades atraen inversionistas, pero el efectivo y la liquidez diaria mantienen abiertas las puertas del negocio entera." No dejes para mañana lo que puedes simular en vivo hoy.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* INNER MODULE READING SPACE WITH BACK BUTTON */
        <div className="space-y-6" id={`module-reader-${selectedModule}`}>
          
          {/* Back navigational bar */}
          <div className="flex items-center justify-between bg-slate-50 border p-3 rounded-lg">
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-brand-secondary" />
              <span>Regresar a los Módulos Académicos</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
              LEYENDO MÓDULO {selectedModule === 5 ? 'VITAL (★)' : `0${selectedModule}`}
            </span>
          </div>

          {/* ACTIVE CONTENT RENDERING */}
          <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8 space-y-8">
            
            {/* ====== MODULE 5: COMPENDIO TEÓRICO DE FINANZAS FUNDAMENTALES (THE MOST IMPORTANT) ====== */}
            {selectedModule === 5 && (
              <div className="space-y-8 animate-fade-in" id="compendio-fundamentals-rich-reading">
                
                {/* Academic Header Banner */}
                <div className="border-b border-amber-300 pb-5 bg-amber-50/20 p-5 rounded-lg border">
                  <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest block mb-0.5">
                    ★ COMPENDIO CIENTÍFICO PRIORITARIO
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                    Compendio Teórico de Finanzas Fundamentales
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                    Sustentado científicamente como la guía definitiva para la gestión cuantitativa de negocios y simulación empresarial. 
                    El éxito operativo no se basa en conjeturas subjetivas: se determina por el dominio de variables precisas.
                  </p>
                </div>

                {/* Sub-item 1 */}
                <section className="space-y-3.5 border-l-4 border-amber-400 pl-4">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    1. Administración Absoluta de la Liquidez y Flujo de Caja
                  </h3>
                  <div className="text-sm text-slate-650 leading-relaxed space-y-3">
                    <p>
                      La viabilidad y supervivencia a largo plazo de una corporación dependen directamente de la disponibilidad inmediata de efectivo líquido, entendiéndose este como el único recurso capaz de extinguir obligaciones financieras exigibles en el corto plazo.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="bg-slate-50 border p-4 rounded-lg space-y-1">
                        <span className="font-bold text-xs text-slate-900 block font-sans">
                          El Flujo de Caja (Cash Flow) vs. Estado de Resultados
                        </span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Existe una asimetría estructural entre la utilidad contable (el beneficio reflejado en el papel) y la liquidez real en bancos. Un negocio puede registrar un volumen de ventas sin precedentes y figurar como altamente rentable; no obstante, si las cuentas por cobrar se difieren a 60, 90 o 120 días, la empresa puede enfrentar una quiebra técnica por insolvencia inmediata.
                        </p>
                      </div>

                      <div className="bg-slate-50 border p-4 rounded-lg space-y-1">
                        <span className="font-bold text-xs text-slate-900 block font-sans">
                          Fondo de Reserva Líquida e Inmovilización de Capital
                        </span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          El efectivo en caja actúa como el principal amortiguador frente a volatilidades del mercado macroeconómico. La asignación óptima del capital exige la constitución de un fondo de reserva de alta disponibilidad antes de realizar inversiones accesorias o de carácter puramente estético. La descapitalización debilita gravemente la maniobra.
                        </p>
                      </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 text-rose-955 p-3.5 rounded-lg text-xs leading-relaxed space-y-1">
                      <span className="font-bold text-rose-900 block">La Falacia del Costo Hundido</span>
                      <p>
                        Representa el error cognitivo y financiero de continuar asignando recursos a un activo ineficiente, o de retenerlo en el Balance General, basándose en el capital que ya fue invertido en él en el pasado. La teoría financiera estipula que el costo histórico es irrelevante para la toma de decisiones presentes. Si un activo no genera el rendimiento proyectado se debe liquidar inmediatamente a valor de mercado para recuperar capital útil.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Sub-item 2 */}
                <section className="space-y-3.5 border-l-4 border-amber-400 pl-4 pt-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    2. Anatomía de los Costos y Apalancamiento Operativo
                  </h3>
                  <div className="text-sm text-slate-650 leading-relaxed space-y-3">
                    <p>
                      La correcta categorización y análisis de las salidas de dinero permiten determinar la estructura óptima de una organización y fijar umbrales mínimos de operación.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-4 rounded-lg font-sans">
                        <span className="font-bold text-xs text-slate-900 block mb-1">Costos Fijos vs. Costos Variables</span>
                        <ul className="space-y-1.5 text-xs text-slate-500">
                          <li>
                            • <strong className="text-slate-800">Costos Fijos:</strong> Gastos estructurales constantes e independientes del volumen de producción (ej. alquileres, nóminas administrativas). Conllevan un riesgo inherente elevado si no se mitigan.
                          </li>
                          <li>
                            • <strong className="text-slate-800">Costos Variables / COGS:</strong> Costos directamente indexados al nivel de ventas (materia prima, comisiones directas, pasarelas). Cero ventas implica cero costos variables.
                          </li>
                        </ul>
                      </div>

                      <div className="border p-4 rounded-lg font-sans">
                        <span className="font-bold text-xs text-slate-900 block mb-1">El Margen de Seguridad y Riesgo Logístico</span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          El margen neto constituye la crucial diferencia entre el precio final y los costes variables unitarios. Operar con márgenes excesivamente reducidos (bajo margen y bajo volumen) arruina tu resiliencia ante cualquier disrupción operativa mínima o inflación en insumos logísticos.
                        </p>
                      </div>
                    </div>

                    {/* INTERACTIVE BREAK EVEN CALCULATOR CHART */}
                    <div className="bg-slate-900 text-white p-5 rounded-lg space-y-3.5 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                          <Calculator className="w-4 h-4 text-emerald-400" />
                          <span>SIMULADOR DINÁMICO: EL PUNTO DE EQUILIBRIO (BREAK-EVEN POINT)</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">Fórmula Q = CF / (P - CVU)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block pb-1 font-mono">Costos Fijos Totales (CF):</label>
                          <input 
                            type="number" 
                            value={eqCostosFijos} 
                            onChange={(e) => setEqCostosFijos(Math.max(0, Number(e.target.value)))}
                            className="w-full bg-slate-800 border-0 text-white rounded p-1.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block pb-1 font-mono">Precio de Venta Unitario (P):</label>
                          <input 
                            type="number" 
                            value={eqPrecioVenta} 
                            onChange={(e) => setEqPrecioVenta(Math.max(eqCostoVarUnit + 1, Number(e.target.value)))}
                            className="w-full bg-slate-800 border-0 text-white rounded p-1.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block pb-1 font-mono">Costo Variable Unitario (CVU):</label>
                          <input 
                            type="number" 
                            value={eqCostoVarUnit} 
                            onChange={(e) => setEqCostoVarUnit(Math.max(0, Number(e.target.value)))}
                            className="w-full bg-slate-800 border-0 text-white rounded p-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>

                      {/* Result of the equilibrium */}
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center md:text-left">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Unidades Requeridas</span>
                          <span className="text-2xl font-black text-emerald-400 font-mono">{calculatedQ} unidades</span>
                          <span className="text-[11px] text-slate-400 block">Toda unidad por encima aporta utilidad neta.</span>
                        </div>

                        {/* Interactive bar showing equilibrium safety */}
                        <div className="w-full md:w-64 space-y-1.5 text-xs">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-rose-400">Pérdida &lt; {calculatedQ}</span>
                            <span className="text-emerald-400">Ganancia &gt; {calculatedQ}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                            <div className="bg-rose-500 h-full w-1/2"></div>
                            <div className="bg-emerald-500 h-full w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Sub-item 3 */}
                <section className="space-y-3.5 border-l-4 border-amber-400 pl-4 pt-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    3. Estrategias de Precios y Arquitectura Comercial
                  </h3>
                  <div className="text-sm text-slate-650 leading-relaxed space-y-3 font-sans">
                    <p>
                      La fijación de precios (Pricing) constituye una variable estratégica vinculada directamente a la percepción de valor y a la sustentabilidad del modelo de negocios.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                      <div className="bg-slate-50 border p-4 rounded-lg space-y-1">
                        <span className="font-bold text-slate-900 block">Guerra de Precios e Inducción a la Quiebra</span>
                        <p className="text-slate-500 leading-relaxed">
                          La igualación de precios a la baja sin un análisis profundo suele ser destructiva. Competir únicamente por precio erosiona el margen e induce a la quiebra. Maximiza la diferenciación por valor percibido (garantías ampliadas, servicios postventa de alto nivel).
                        </p>
                      </div>

                      <div className="bg-slate-50 border p-4 rounded-lg space-y-1">
                        <span className="font-bold text-slate-900 block">Costo de Adquisición de Clientes (CAC) y Margen</span>
                        <p className="text-slate-500 leading-relaxed">
                          Para asegurar la viabilidad comercial, el valor del ciclo de vida del cliente (LTV) debe superar ampliamente al costo de captar a dicho cliente (CAC). Multiplica la revisión de canales publicitarios ante cualquier incremento de costos de pauta.
                        </p>
                      </div>

                      <div className="bg-slate-50 border p-4 rounded-lg space-y-1">
                        <span className="font-bold text-slate-900 block">Uso Palancado de la Logística de Envío</span>
                        <p className="text-slate-500 leading-relaxed">
                          Cobrar o absorber uniformemente costes logísticos reduce enormemente el beneficio neto. Establecer en cambio un umbral mínimo de compra para acceder a envío gratuito incrementa el ticket promedio y diluye el costo fijo de flete.
                        </p>
                      </div>
                    </div>

                    {/* Interactive CAC Checker */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2.5">
                      <span className="text-[11px] font-mono font-bold text-amber-800 block uppercase">
                        MEDIDOR DE SALUD: RATIO LTV A CAC
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-xs">
                          <label className="block text-slate-600 font-bold">Costo de Adquisición de Cliente (CAC):</label>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={cacCost} 
                            onChange={(e) => setCacCost(Number(e.target.value))} 
                            className="w-full accent-amber-600"
                          />
                          <span className="font-mono text-slate-700 block">${cacCost} por cliente</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <label className="block text-slate-600 font-bold">Valor de Vida de Cliente (LTV):</label>
                          <input 
                            type="range" 
                            min="50" 
                            max="300" 
                            value={ltvValue} 
                            onChange={(e) => setLtvValue(Number(e.target.value))} 
                            className="w-full accent-amber-600"
                          />
                          <span className="font-mono text-slate-700 block">${ltvValue} total neto</span>
                        </div>
                      </div>

                      <div className="bg-white border rounded p-3 text-xs flex justify-between items-center font-mono">
                        <span>Relación de Retorno (LTV / CAC):</span>
                        <span className={`font-black tracking-tight text-sm ${
                          (ltvValue / cacCost) >= 3 ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {(ltvValue / cacCost).toFixed(1)}x {(ltvValue / cacCost) >= 3 ? '(EXCELENTE)' : '(MEJORABLE)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Sub-item 4 */}
                <section className="space-y-3.5 border-l-4 border-amber-400 pl-4 pt-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    4. Gestión Financiera Interna, Fiscalidad y Gobierno Corporativo
                  </h3>
                  <div className="text-sm text-slate-650 leading-relaxed space-y-3">
                    <p>
                      Las decisiones de los directores deben estar siempre alineadas con las normativas legales vigentes y principios prudenciales de contabilidad empresarial.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                      <div className="border p-4 rounded-lg space-y-1.5 bg-white shadow-sm border-slate-200">
                        <strong className="text-slate-900 block font-mono">Provisión y Disciplina Fiscal</strong>
                        <p className="text-slate-500">
                          Los tributos indirectos (como el IVA) jamás constituyen ingresos de la empresa. Corresponden en su totalidad a un pasivo del Estado. Su inobservancia o uso inmediato operativo causa quiebras impositivas fulminantes.
                        </p>
                      </div>

                      <div className="border p-4 rounded-lg space-y-1.5 bg-white shadow-sm border-slate-200">
                        <strong className="text-slate-900 block font-mono">Apalancamiento Bancario Eficiente</strong>
                        <p className="text-slate-500">
                          La deuda bancaria o los pasivos son herramientas de aceleración de capital operativo, no un subsidio pasivo para cubrir ineficiencias de costes. Es viable de contraer únicamente si el ROI proyectado sobrepasa el interés de la deuda.
                        </p>
                      </div>

                      <div className="border p-4 rounded-lg space-y-1.5 bg-white shadow-sm border-slate-200">
                        <strong className="text-slate-900 block font-mono">Gobierno Corporativo y Salarios</strong>
                        <p className="text-slate-500">
                          Establece una barrera irrevocable entre tus bienes personales y las cuentas corrientes corporativas. Fijarte un sueldo nominal de mercado sustenta un balance real y garantiza solvencia estructural a la firma.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Ultimate Supervivencia Quote Banner */}
                <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-2 text-center animate-pulse">
                  <div className="flex justify-center text-amber-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-mono font-bold tracking-widest text-brand-secondary">
                    MÁXIMA GENERAL DE SUPERVIVENCIA CORPORATIVA
                  </h4>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto italic leading-relaxed">
                    "Las utilidades atraen inversionistas, pero el efectivo y la liquidez diaria mantienen abiertas las puertas del negocio. Toda decisión estratégica debe evaluarse bajo la métrica del Retorno de Inversión (ROI) y su impacto neto en el flujo de caja operativo."
                  </p>
                </div>

                {/* Action Claim reward */}
                <div className="pt-4 flex justify-center border-t">
                  <button
                    onClick={() => handleClaimReward(5)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition focus:outline-none"
                  >
                    <Coins className="w-5 h-5 text-amber-300" />
                    <span>Acreditar Compendio Fundamental (+40 XP)</span>
                  </button>
                </div>

              </div>
            )}

            {/* ====== MODULE 1: EL MOTOR DEL NEGOCIO ====== */}
            {selectedModule === 1 && (
              <div className="space-y-6 animate-fade-in" id="mod1-reading-space">
                <div className="border-b pb-4">
                  <span className="text-xs font-mono font-bold text-brand-secondary uppercase">Módulo 01</span>
                  <h2 className="text-xl font-bold font-sans text-slate-900">
                    El Motor del Negocio y Análisis de Viabilidad
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    Comprender a fondo la liquidez de caja diaria representa el umbral esencial de la teoría corporativa. Muchos negocios que gozan de buenas utilidades en el papel quiebran en la realidad por estrangulamiento de su flujo circulante.
                  </p>

                  <h4 className="font-bold text-slate-900 pt-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand-secondary" />
                    1.1 Ventas vs. Cobros Efectivos
                  </h4>
                  <p>
                    Un negocio exitoso pacta cobros ágiles. Si vendes mercancías pero concedes plazos irracionales de hasta 90 y 120 días a tus distribuidores, tus gastos (tales como nóminas de personal y suministros) te obligarán a cerrar por asfixia financiera.
                  </p>

                  {/* Simulator Box */}
                  <div className="bg-slate-900 text-white p-5 rounded-lg space-y-4 shadow-sm font-mono text-xs">
                    <span className="text-[10px] text-brand-secondary font-bold block bg-slate-800 px-2 py-0.5 rounded w-fit">
                      SIMULADOR TÁCTICO DE COBRO Y CAJA
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <label className="block text-slate-400">Total Recaudado Bruto ($):</label>
                        <input 
                          type="range" 
                          min="3000" 
                          max="20000" 
                          step="1000"
                          value={recaudadoM1}
                          onChange={(e) => setRecaudadoM1(Number(e.target.value))}
                          className="w-full accent-brand-secondary"
                        />
                        <span className="block text-right font-black font-mono text-emerald-400">${recaudadoM1.toLocaleString()}</span>

                        <label className="block text-slate-400">Plazo Comercial de Cobros (días):</label>
                        <input 
                          type="range" 
                          min="15" 
                          max="120" 
                          step="15"
                          value={plazoCobroM1}
                          onChange={(e) => setPlazoCobroM1(Number(e.target.value))}
                          className="w-full accent-brand-secondary"
                        />
                        <span className="block text-right font-black font-mono text-white">{plazoCobroM1} días</span>
                      </div>

                      <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2.5 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold text-slate-400">Efectivo en Caja Real</span>
                          <span className="text-lg font-black text-emerald-400 block">${cajaM1Disponible.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-400 block">(Restante se encuentra inmovilizado en cuentas por cobrar)</span>
                        </div>

                        <div className={`p-2 rounded text-[11px] font-sans ${
                          plazoCobroM1 > 60 
                            ? 'bg-rose-950/40 text-rose-300 border border-rose-900/50' 
                            : 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/50'
                        }`}>
                          {plazoCobroM1 > 60 
                            ? '⚠️ Tu ciclo de liquidez es alarmante. Necesitas facturación de cobro en menor plazo.' 
                            : '✓ Ciclo de cobranza impecable. Sostienes capital circulante para tus obligaciones.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claim reward */}
                <div className="pt-4 flex justify-center border-t">
                  <button
                    onClick={() => handleClaimReward(1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition focus:outline-none cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>Acreditar Módulo 1 (+40 XP)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ====== MODULE 2: CONTABILIDAD Y EVALUACIÓN FINANCIERA ====== */}
            {selectedModule === 2 && (
              <div className="space-y-6 animate-fade-in" id="mod2-reading-space">
                <div className="border-b pb-4">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Módulo 02</span>
                  <h2 className="text-xl font-bold font-sans text-slate-900">
                    Contabilidad y Evaluación Financiera
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                  <p>
                    La disciplina contable no consiste en 'apilar registros fiscales'. Corresponde a la evaluación objetiva sobre de dónde partió el capital operativo de la firma y hacia dónde fluyó de forma metódica.
                  </p>

                  <h4 className="font-bold text-slate-900 pt-2 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-indigo-600" />
                    2.1 La Ecuación Contable del Balance
                  </h4>
                  <p>
                    Un Balance de Saldos se divide siempre en tres bloques inequívocos: Activos (recursos que posee la firma), Pasivos (las deudas contraídas en el mercado) y Patrimonio (el capital neto que es propiedad accionaria).
                  </p>

                  {/* Simulator Panel */}
                  <div className="bg-slate-50 border p-5 rounded-lg space-y-4">
                    <span className="text-xs font-mono font-bold text-indigo-805 block uppercase">
                      CUADRO LIVE: BALANCE GENERAL DE SIMULACIÓN
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 border rounded text-xs space-y-2">
                        <span className="font-bold text-slate-800 block">Total de Activos Estimados:</span>
                        <input 
                          type="number" 
                          value={bgActivosInt} 
                          onChange={(e) => setBgActivosInt(Math.max(0, Number(e.target.value)))}
                          className="w-full border px-2 py-1 font-mono text-xs rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 block italic">Incluye maquinaria, cuentas bancarias corrientes e inventario de simulación.</span>
                      </div>

                      <div className="bg-white p-3 border rounded text-xs space-y-2">
                        <span className="font-bold text-slate-800 block">Total Pasivos (Deuda a Terceros):</span>
                        <input 
                          type="number" 
                          value={bgPasivoProv} 
                          onChange={(e) => setBgPasivoProv(Math.max(0, Number(e.target.value)))}
                          className="w-full border px-2 py-1 font-mono text-xs rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 block italic">Contratos comerciales pendientes y préstamos bancarios.</span>
                      </div>
                    </div>

                    <div className="bg-indigo-900 text-white p-3 rounded font-mono text-xs flex justify-between items-center">
                      <span>Patrimonio Calculado (Activos - Pasivos):</span>
                      <span className="font-black text-amber-300 text-sm">${(bgActivosInt - bgPasivoProv).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Claim reward */}
                <div className="pt-4 flex justify-center border-t">
                  <button
                    onClick={() => handleClaimReward(2)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition focus:outline-none cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>Acreditar Módulo 2 (+40 XP)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ====== MODULE 3: ESTRATEGIA AVANZADA DE CAPITAL ====== */}
            {selectedModule === 3 && (
              <div className="space-y-6 animate-fade-in" id="mod3-reading-space">
                <div className="border-b pb-4">
                  <span className="text-xs font-mono font-bold text-amber-700 uppercase">Módulo 03</span>
                  <h2 className="text-xl font-bold font-sans text-slate-900">
                    Estrategia Avanzada de Capital y Valoración
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                  <p>
                    Identificar si conviene financiar un nuevo desarrollo mediante deuda bancaria o admitiendo nuevos inversionistas, conociendo la rentabilidad esperada real.
                  </p>

                  <h4 className="font-bold text-slate-900 pt-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    3.1 Flujo Descontado: VAN y TIR
                  </h4>
                  <p>
                    Un billete hoy vale más que el mismo billete en cinco años. El Valor Actual Neto (VAN) descuenta flujos futuros a una tasa específica para ver si recuperamos el capital de lanzamiento.
                  </p>

                  <div className="bg-slate-900 text-white p-5 rounded-lg space-y-4 shadow-sm font-mono text-xs">
                    <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">
                      VALUADOR DE INVERSIÓN (Fórmula VAN)
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400">Desembolso Inicial ($):</label>
                        <input 
                          type="number" 
                          value={inversionInicial} 
                          onChange={(e) => setInversionInicial(Math.max(0, Number(e.target.value)))}
                          className="w-full mt-1 bg-slate-800 text-white p-1 text-xs border-0 rounded font-mono"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-400 font-sans">Tasa de Descuento (%):</label>
                        <input 
                          type="number" 
                          value={tasaDescuento} 
                          onChange={(e) => setTasaDescuento(Math.max(1, Number(e.target.value)))}
                          className="w-full mt-1 bg-slate-800 text-white p-1 text-xs border-0 rounded font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400">Flujo Anual Promedio ($):</label>
                        <input 
                          type="number" 
                          value={flujoAnual} 
                          onChange={(e) => setFlujoAnual(Math.max(0, Number(e.target.value)))}
                          className="w-full mt-1 bg-slate-800 text-white p-1 text-xs border-0 rounded font-mono"
                        />
                      </div>
                    </div>

                    {/* Simple 3-year VAN approximation */}
                    {(() => {
                      const v1 = flujoAnual / Math.pow(1 + tasaDescuento / 100, 1);
                      const v2 = flujoAnual / Math.pow(1 + tasaDescuento / 100, 2);
                      const v3 = flujoAnual / Math.pow(1 + tasaDescuento / 100, 3);
                      const vanSimulado = v1 + v2 + v3 - inversionInicial;

                      return (
                        <div className="bg-slate-950 p-3.5 border border-slate-800 rounded flex items-center justify-between">
                          <span>VAN Estimado a 3 años:</span>
                          <span className={`font-black text-sm font-mono ${vanSimulado >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${Math.round(vanSimulado).toLocaleString()} {vanSimulado >= 0 ? '(RENTABLE)' : '(RECHAZADO)'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Claim reward */}
                <div className="pt-4 flex justify-center border-t">
                  <button
                    onClick={() => handleClaimReward(3)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition focus:outline-none cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>Acreditar Módulo 3 (+40 XP)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ====== MODULE 4: ENTORNO MACROECONÓMICO ====== */}
            {selectedModule === 4 && (
              <div className="space-y-6 animate-fade-in" id="mod4-reading-space">
                <div className="border-b pb-4">
                  <span className="text-xs font-mono font-bold text-rose-650 uppercase">Módulo 04</span>
                  <h2 className="text-xl font-bold font-sans text-slate-900">
                    Entorno Macroeconómico y Finanzas Conductuales
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                  <p>
                    Las variables externas gobernadas por bancos centrales imponen el ritmo monetario del mercado. Paralelamente, los sesgos conductuales rigen por qué compramos u omitimos activos valiosos.
                  </p>

                  <h4 className="font-bold text-slate-900 pt-2 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-rose-600" />
                    4.1 Finanzas Conductuales: Sesgo de Aversión a Pérdidas
                  </h4>
                  <p>
                    Psicológicamente, perder $500 en bolsa causa un dolor emocional el doble de duradero que gozar de un rendimiento idéntico de $500. Ello genera que los ahorristas congelen posiciones ineficientes en vez de diversificar razonablemente su portafolio.
                  </p>

                  {/* Simulator Interactive Grid */}
                  <div className="bg-slate-50 border p-5 rounded-lg space-y-4 font-sans">
                    <span className="text-xs font-mono font-bold text-slate-500 block">ASIGNACIÓN ADAPTABLE (PERFIL DE RIESGO)</span>
                    
                    <div className="flex gap-2 justify-center">
                      {(['conservador', 'moderado', 'alto-riesgo'] as const).map((perfil) => (
                        <button
                          key={perfil}
                          onClick={() => setPerfilRiesgo(perfil)}
                          className={`px-3 py-1.5 rounded text-xs font-bold font-mono border transition ${
                            perfilRiesgo === perfil 
                              ? 'bg-rose-900 text-white border-rose-950' 
                              : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {perfil.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="bg-white p-4 border rounded space-y-2 text-xs">
                      {perfilRiesgo === 'conservador' && (
                        <p className="text-slate-500 leading-relaxed font-mono">
                          🛡️ <strong>Portafolio Conservador:</strong> 75% Renta Fija (Bonos del Tesoro), 15% Liquidez de Caja, 10% Acciones Seguras. Pensado para proteger capital pasivo de la erosión generada por la inflación.
                        </p>
                      )}
                      {perfilRiesgo === 'moderado' && (
                        <p className="text-slate-500 leading-relaxed font-mono">
                          ⚖️ <strong>Portafolio Moderado:</strong> 50% Fondos Indexados de Renta Variable, 40% Bonos, 10% Bienes Raíces. Equilibrio sólido para crecimiento exponencial de mediano plazo.
                        </p>
                      )}
                      {perfilRiesgo === 'alto-riesgo' && (
                        <p className="text-slate-500 leading-relaxed font-mono">
                          🚀 <strong>Portafolio Alto Riesgo:</strong> 80% Renta Variable / Acciones del Sector Tecnológico, 20% Divisas y Commodities. Alta volatilidad de precios a cambio de rendimientos significativamente altos.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Claim reward */}
                <div className="pt-4 flex justify-center border-t">
                  <button
                    onClick={() => handleClaimReward(4)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition focus:outline-none cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>Acreditar Módulo 4 (+40 XP)</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
      
    </div>
  );
}
