/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  Calculator, 
  CheckCircle, 
  ArrowLeft, 
  Award, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  RefreshCw, 
  ChevronRight, 
  Layers, 
  ThumbsUp, 
  ThumbsDown, 
  HeartCrack, 
  Users, 
  Activity, 
  Workflow,
  HelpCircle,
  Coins
} from 'lucide-react';

interface PracticaContentProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export default function PracticaContent({ user, onUpdateUser }: PracticaContentProps) {
  // Active simulator: null indicates the dashboard selector view
  // 'desierto' (Caso 1), 'auditor' (Caso 2), 'descarte' (Caso 3), 'humano' (Caso 4)
  const [activeSimulator, setActiveSimulator] = useState<'desierto' | 'auditor' | 'descarte' | 'humano' | null>(null);
  
  // State for recording completed practical simulations locally to avoid double counting XP
  const [completedPracticas, setCompletedPracticas] = useState<string[]>([]);

  // Load completed practices from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem(`completed_practicas_${user.email.toLowerCase().trim()}`);
    if (saved) {
      try {
        setCompletedPracticas(JSON.parse(saved));
      } catch (e) {
        // Safe fallback
      }
    }
  }, [user.email]);

  const awardPoints = (points: number, practiceId: string) => {
    const isAlreadyCompleted = completedPracticas.includes(practiceId);
    let updatedPoints = user.progress.points;
    
    if (!isAlreadyCompleted) {
      updatedPoints += points;
      const updatedList = [...completedPracticas, practiceId];
      setCompletedPracticas(updatedList);
      localStorage.setItem(`completed_practicas_${user.email.toLowerCase().trim()}`, JSON.stringify(updatedList));
    }

    const updatedUser: User = {
      ...user,
      progress: {
        ...user.progress,
        points: updatedPoints,
        completedModules: user.progress.completedModules.includes(practiceId) 
          ? user.progress.completedModules 
          : [...user.progress.completedModules, practiceId]
      }
    };

    // Save back to master users storage
    const rawUsers = localStorage.getItem('finanzas_users');
    const users = rawUsers ? JSON.parse(rawUsers) : {};
    users[user.email.toLowerCase().trim()] = updatedUser;
    localStorage.setItem('finanzas_users', JSON.stringify(users));

    // Props trigger to update header XP across VLE
    onUpdateUser(updatedUser);
  };

  // ==========================================
  // --- STATE FOR CASE 1: EL CRUCE DEL DESIERTO FINANCIERO ---
  // ==========================================
  const [c1Plazo, setC1Plazo] = useState<number>(30); // Slider values: 0 (Liquido), 30 (Equilibrio), 90 (Expansión)
  const [c1Suministro, setC1Suministro] = useState<'local' | 'internacional'>('local');
  const [c1Fiscal, setC1Fiscal] = useState<'operativo' | 'segregado'>('segregado');
  const [c1ShowResults, setC1ShowResults] = useState(false);

  // States to lock Caso 1 choices and defer feedback visually
  const [c1PlazoDecidido, setC1PlazoDecidido] = useState<boolean>(false);
  const [c1SuministroDecidido, setC1SuministroDecidido] = useState<boolean>(false);
  const [c1FiscalDecidido, setC1FiscalDecidido] = useState<boolean>(false);
  const [c1SuministroElegido, setC1SuministroElegido] = useState<'local' | 'internacional' | null>(null);
  const [c1FiscalElegido, setC1FiscalElegido] = useState<'operativo' | 'segregado' | null>(null);

  const resetCaso1 = () => {
    setC1Plazo(30);
    setC1Suministro('local');
    setC1Fiscal('segregado');
    setC1ShowResults(false);
    setC1PlazoDecidido(false);
    setC1SuministroDecidido(false);
    setC1FiscalDecidido(false);
    setC1SuministroElegido(null);
    setC1FiscalElegido(null);
  };

  // Computed math for Case 1
  const calculateCase1 = () => {
    const cajaInicial = 12000;
    const costosFijos = 10000;
    
    let facturacionPotencial = 50000;
    let recaudacionMes = 0;
    let cuentasPorCobrar = 0;
    let descFase1 = '';

    if (c1Plazo <= 15) {
      // 0 a 15 dias
      facturacionPotencial = 30000;
      recaudacionMes = 30000; // 100% collect
      cuentasPorCobrar = 0;
      descFase1 = 'Modelo Líquido: Ventas bajan por rigidez de crédito corporativo, pero el efectivo ingresa 100%.';
    } else if (c1Plazo > 15 && c1Plazo <= 45) {
      // 30 a 45 dias
      facturacionPotencial = 50000;
      recaudacionMes = 25000; // 50% collect pronto pago clauses
      cuentasPorCobrar = 25000;
      descFase1 = 'Modelo de Equilibrio: Tracción comercial estable. Cláusulas de pronto pago recuperan 50% líquido.';
    } else {
      // 60 a 90 dias
      facturacionPotencial = 75000;
      recaudacionMes = 0; // 0% collect inside the cycle
      cuentasPorCobrar = 75000;
      descFase1 = 'Modelo de Expansión de Papel: Alta utilidad reflejada, pero 100% inmovilizado. Caja operativa en cero.';
    }

    let costoInventario = 0;
    let descFase2 = '';
    if (c1Suministro === 'local') {
      costoInventario = 3000; // Fast local delivery, higher unit cost
      descFase2 = 'Abastecimiento Local: Suministro inmediato. No inmoviliza anticipos. Costo de caja controlado.';
    } else {
      costoInventario = 6000; // 100% advance pay, customs locks for 45 days
      descFase2 = 'Abastecimiento Internacional: Retención logística por 45 días en aduanas. Capital prepagado congelado.';
    }

    let ivaEnCaja = 0;
    let multaFiscal = 0;
    let descFase3 = '';
    if (c1Fiscal === 'operativo') {
      ivaEnCaja = 8000; // Artificial boost
      multaFiscal = 8000; // Heavy penalty for using state taxes
      descFase3 = 'Uso Comercial del IVA: Fusión indebida de pasivos. Causa penalización equivalente completa al cierre.';
    } else {
      ivaEnCaja = 0; // correctly placed in a restricted vault
      multaFiscal = 0;
      descFase3 = 'Segregación Técnica del IVA: Reservas aisladas. Inmunidad absoluta contra auditorías del fisco.';
    }

    const cajaDisponibleFinal = (cajaInicial + recaudacionMes + ivaEnCaja) - costosFijos - costoInventario - multaFiscal;

    let semaforo = 'ROJO';
    let dictamen = 'Quiebra técnica por incapacidad de absorción de costos fijos estructurales';
    let dictamenColor = 'text-red-650 bg-red-50 border-red-200';

    if (cajaDisponibleFinal >= 20000) {
      semaforo = 'VERDE';
      dictamen = 'Estable / Solvente: Estructura de plazos óptima y flujo neto positivo con cobertura de reservas.';
      dictamenColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (cajaDisponibleFinal >= 10000 && cajaDisponibleFinal < 20000) {
      semaforo = 'AMARILLO';
      dictamen = 'Vulnerable: Supervivencia extrema. Tu negocio requiere reestructurar plazos comerciales urgentemente.';
      dictamenColor = 'text-amber-700 bg-amber-50 border-amber-200';
    }

    return {
      cajaInicial,
      costosFijos,
      facturacionPotencial,
      recaudacionMes,
      cuentasPorCobrar,
      costoInventario,
      ivaEnCaja,
      multaFiscal,
      cajaDisponibleFinal,
      semaforo,
      dictamen,
      dictamenColor,
      descFase1,
      descFase2,
      descFase3
    };
  };

  const c1Data = calculateCase1();

  // ==========================================
  // --- STATE FOR CASE 2: EL TABLERO DEL AUDITOR FINANCIERO ---
  // ==========================================
  const [auditorNivel, setAuditorNivel] = useState<1 | 2 | 3>(1);
  const [auditorRebotes, setAuditorRebotes] = useState(0);
  const [auditorExitos, setAuditorExitos] = useState(0);
  const [auditorFeedback, setAuditorFeedback] = useState<{ msg: string; type: 'success' | 'error' | null }>({ msg: '', type: null });
  
  // Custom board state to prevent state reset triggers
  const [c2Completado, setC2Completado] = useState(false);
  const [c2ChosenAnswer, setC2ChosenAnswer] = useState<string | null>(null);

  // Cards definitions for Auditor Level 1
  const level1Cards = [
    { id: 'l1_1', text: 'Suscripción de Software Operativo', target: 'fijo' },
    { id: 'l1_2', text: 'Comisiones de Pasarela de Pagos (%)', target: 'variable' },
    { id: 'l1_3', text: 'Arrendamiento de Almacén', target: 'fijo' },
    { id: 'l1_4', text: 'Materia Prima Base (COGS)', target: 'variable' },
    { id: 'l1_5', text: 'Nómina Fija de Planta', target: 'fijo' },
    { id: 'l1_6', text: 'Empaques de Distribución', target: 'variable' },
  ];

  // Cards for Level 2
  const level2Cards = [
    { id: 'l2_1', text: 'Factura Corporativa a 90 Días', target: 'cobrar' },
    { id: 'l2_2', text: 'Impuesto Recaudado (IVA)', target: 'custodia' },
    { id: 'l2_3', text: 'Liquidación Inmediata Débito', target: 'disponible' },
    { id: 'l2_4', text: 'Pagaré Comercial de Distribuidor', target: 'cobrar' },
  ];

  // Cards for Level 3
  const level3Cards = [
    { id: 'l3_1', text: 'Servidores de Producción Activos', target: 'conservar' },
    { id: 'l3_2', text: 'Maquinaria Ociosa sin Uso (2 Meses)', target: 'liquidar' },
    { id: 'l3_3', text: 'Inventario Defectuoso Rechazado', target: 'liquidar' },
    { id: 'l3_4', text: 'Herramientas con ROI Verificable', target: 'conservar' },
  ];

  const [classifiedIds, setClassifiedIds] = useState<string[]>([]);
  const activeLevelCards = auditorNivel === 1 
    ? level1Cards 
    : auditorNivel === 2 
      ? level2Cards 
      : level3Cards;

  const currentLevelCardsRemaining = activeLevelCards.filter(c => !classifiedIds.includes(c.id));

  const handleClassify = (cardId: string, choice: string) => {
    const card = activeLevelCards.find(c => c.id === cardId);
    if (!card) return;

    setC2ChosenAnswer(choice);

    if (card.target === choice) {
      setAuditorExitos(prev => prev + 1);
      setAuditorFeedback({
        msg: '¡Clasificación Correcta! Cuenta contable registrada adecuadamente.',
        type: 'success'
      });
    } else {
      setAuditorRebotes(prev => prev + 1);
      
      // Determine the precise financial trap to warn based on the card
      let customWarn = 'Asignación incorrecta. Revisa el comportamiento de la cuenta.';
      if (card.id === 'l2_1' || card.id === 'l2_4') {
        customWarn = '❌ ERROR: TRAMPA DE LA ILUSIÓN LÍQUIDA. Confundir derechos de cobro a largo plazo con liquidez inmediata induce a la quiebra técnica.';
      } else if (card.id === 'l2_2') {
        customWarn = '❌ ERROR: FINANCIAMIENTO CON PASIVOS ESTATALES. El IVA recaudado es dinero ajeno (pasivo fiscal). Desviarlo para capital de trabajo causa quiebra fiscal.';
      } else if (card.id === 'l3_2' || card.id === 'l3_3') {
        customWarn = '❌ ERROR: FALACIA DEL COSTO HUNDIDO. No intentes retener activos improductivos en el balance activo. Liquidar a valor de mercado reconvierte recursos a capital de trabajo.';
      } else if (auditorNivel === 1) {
        customWarn = '❌ ERROR: REBOTE DE TARJETA. No asignes costos fijos obligatorios a variables. La inactividad comercial no extingue estas obligaciones recurrentes.';
      }

      setAuditorFeedback({
        msg: customWarn,
        type: 'error'
      });
    }
  };

  const advanceLevel = () => {
    setAuditorFeedback({ msg: '', type: null });
    setClassifiedIds([]);
    setC2ChosenAnswer(null);
    if (auditorNivel === 1) {
      setAuditorNivel(2);
    } else if (auditorNivel === 2) {
      setAuditorNivel(3);
    } else {
      setC2Completado(true);
    }
  };

  const getAuditorGrade = () => {
    const total = auditorExitos + auditorRebotes;
    if (total === 0) return { title: 'No Calificado', color: 'text-slate-500' };
    const pct = (auditorExitos / total) * 100;
    if (pct >= 90) return { title: 'Auditor Externo Experto', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (pct >= 70) return { title: 'Administrador Vulnerable', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { title: 'Riesgo de Insolvencia / Desestimado', color: 'text-rose-700 bg-rose-50 border-rose-250' };
  };

  const resetAuditor = () => {
    setAuditorNivel(1);
    setAuditorRebotes(0);
    setAuditorExitos(0);
    setClassifiedIds([]);
    setC2Completado(false);
    setC2ChosenAnswer(null);
    setAuditorFeedback({ msg: '', type: null });
  };

  // ==========================================
  // --- STATE FOR CASE 3: SIMULADOR DE DESCARTE PATRIMONIAL ---
  // ==========================================
  const [c3CardIndex, setC3CardIndex] = useState(0);
  const [c3CajaActual, setC3CajaActual] = useState(2000);
  const [c3CostosFijos, setC3CostosFijos] = useState(15000);
  const [c3ShowResults, setC3ShowResults] = useState(false);
  const [c3Log, setC3Log] = useState<{ text: string; correct: boolean }[]>([]);
  const [c3ChosenDirection, setC3ChosenDirection] = useState<'left' | 'right' | null>(null);

  const tinderCards = [
    {
      id: 1,
      title: 'Contrato de Oficina Corporativa Premium',
      context: 'Inmueble de lujo subutilizado debido a un esquema laboral donde el 85% del personal opera bajo teletrabajo. Costo fijo recurrente: $4,000 USD mensuales.',
      leftAction: 'Desincorporar / Cancelar Contrato',
      rightAction: 'Mantener / Conservar',
      correctDirection: 'left',
      successMsg: 'Mitiga la salida de $4,000 USD de costos fijos. Prioriza la liquidez sobre la estética corporativa.',
      failMsg: 'Mantiene un gasto inerte. No necesitas oficinas monumentales vacías bajo insolvencia de choque.'
    },
    {
      id: 2,
      title: 'Unidad de Transporte Logístico Obsolescente',
      context: 'Vehículo de distribución que requirió $8,000 USD en reparaciones el año pasado, pero actualmente se encuentra parado por fallas mecánicas severas. Un competidor de la región ofrece una compra inmediata por $3,000 USD en efectivo.',
      leftAction: 'Desincorporar / Vender ya',
      rightAction: 'Mantener / Reparar en Taller',
      correctDirection: 'left',
      successMsg: 'Inyección directa de +$3,000 USD limpios a caja. Rompe con la Falacia de Costo Hundido; el gasto histórico es irrelevante.',
      failMsg: 'Insistes en reparar activos ociosos. Tropiezas con el sesgo cognitivo del desembolso histórico irrecuperable.'
    },
    {
      id: 3,
      title: 'Licencias de Diseño "Enterprise"',
      context: 'Software especializado con renovación automática obligatoria en 5 días por un monto de $1,500 USD. Utilizado muy esporádicamente por personal junior; existen alternativas robustas de código abierto sin costo.',
      leftAction: 'Cancelar Renovación',
      rightAction: 'Renovar Automáticamente',
      correctDirection: 'left',
      successMsg: 'Elimina un gasto de software prescindible, forzando la migración rápida hacia herramientas libres.',
      failMsg: 'Asumes $1,500 de costo evitable de forma pasiva por omisión táctica.'
    },
    {
      id: 4,
      title: 'Servidores e Infraestructura de Datos Cloud Core',
      context: 'Servidor central donde se aloja exclusivamente la plataforma de los clientes y el motor de facturación recurrente vital de la firma. Costo: $800 USD al mes.',
      leftAction: 'Apagar Servidor / Liquidar',
      rightAction: 'Retener Activo Sanador',
      correctDirection: 'right',
      successMsg: 'Consérvalo. Confundir reducción de costos superfluos con el desmantelamiento de activos críticos que sostienen la facturación detendría el negocio.',
      failMsg: '¡ERROR DE RECORTE CRÍTICO! Interrumpiste la estructura de servidores de los clientes. El negocio se frena en seco.'
    },
    {
      id: 5,
      title: 'Stock de Producto Muerto (Lote Obsoleto)',
      context: '1,000 unidades de indumentaria de temporada anterior almacenadas en bodega que generaron un costo histórico de producción de $5,000 USD. Un liquidador ofrece $1,500 USD en efectivo por la totalidad del lote.',
      leftAction: 'Liquidar a Pérdida',
      rightAction: 'Almacenar / Esperar Venta Full Price',
      correctDirection: 'left',
      successMsg: 'Excelente. Conversión de inventario ilíquido e improductivo en dinero cash de alta disponibilidad.',
      failMsg: 'Dejas bloqueado capital útil en inventarios zombies esperando un comprador imaginario al precio de lista original.'
    },
    {
      id: 6,
      title: 'Campaña Masiva de Branding de Marca',
      context: 'Propuesta de marketing tradicional sin conversión indexada a corto plazo por un costo de $3,000 USD. Promete "mejorar la presencia visual en el mercado".',
      leftAction: 'Rechazar Campaña',
      rightAction: 'Aprobar Gasto de Branding',
      correctDirection: 'left',
      successMsg: 'Bien rechazado. Todo flujo asignado bajo crisis debe responder exclusivamente a conversiones o CAC.',
      failMsg: 'Asignas recursos de supervivencia a branding abstracto. Incurres en un despilfarro sin retorno medible.'
    }
  ];

  const handleTinderSwipe = (direction: 'left' | 'right') => {
    setC3ChosenDirection(direction);
  };

  const nextTinderCard = () => {
    if (c3ChosenDirection === null) return;
    const card = tinderCards[c3CardIndex];
    const isCorrect = c3ChosenDirection === card.correctDirection;

    // Apply exact visual updates and accounting rules
    if (isCorrect) {
      // Dynamic adjustments based on card specifics
      if (card.id === 1) {
        setC3CostosFijos(prev => prev - 4000);
      } else if (card.id === 2) {
        setC3CajaActual(prev => prev + 3000);
      } else if (card.id === 5) {
        setC3CajaActual(prev => prev + 1500);
      }
      setC3Log(prev => [...prev, { text: `✓ ${card.title}: ${card.successMsg}`, correct: true }]);
    } else {
      // Penalty or loss of opportunity
      if (card.id === 4) {
        // critical error
        setC3CajaActual(prev => Math.max(0, prev - 1500));
      } else if (card.id === 1) {
        // keeps office expense
        setC3CajaActual(prev => Math.max(0, prev - 2000));
      }
      setC3Log(prev => [...prev, { text: `✗ ${card.title}: ${card.failMsg}`, correct: false }]);
    }

    setC3ChosenDirection(null);

    if (c3CardIndex + 1 < tinderCards.length) {
      setC3CardIndex(prev => prev + 1);
    } else {
      setC3ShowResults(true);
    }
  };

  const getTinderReport = () => {
    if (c3CajaActual >= 6500) {
      return {
        title: 'CFO ESTRATÉGICO',
        style: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        body: 'Depuración óptima del balance. Logró salvar la entidad mediante liquidez real y un descarte frío de activos inservibles.'
      };
    } else if (c3CajaActual >= 3000) {
      return {
        title: 'CFO REACTIVO',
        style: 'text-amber-700 bg-amber-50 border-amber-200',
        body: 'Reestructuración incompleta por sesgos históricos. La empresa sobrevive de inmediato pero arrastra costosas ineficiencias.'
      };
    }
    return {
      title: 'QUIEBRA TÉCNICA',
      style: 'text-red-700 bg-red-50 border-red-200',
      body: 'Incapacidad absoluta para desincorporar el estatus o los costos históricos inservibles. Balance insolvente y deudas vencidas.'
    };
  };

  const resetTinder = () => {
    setC3CardIndex(0);
    setC3CajaActual(2000);
    setC3CostosFijos(15000);
    setC3ShowResults(false);
    setC3Log([]);
    setC3ChosenDirection(null);
  };

  // ==========================================
  // --- STATE FOR CASE 4: EL ALGORITMO HUMANO ---
  // ==========================================
  const [c4Fase, setC4Fase] = useState<1 | 2 | 3 | 4>(1);
  const [c4Capital, setC4Capital] = useState(10000);
  const [c4FOMO, setC4FOMO] = useState(15); // Percentage
  const [c4Decisions, setC4Decisions] = useState<{ title: string; type: 'reactiva' | 'analitica'; impact: string }[]>([]);
  const [c4Finished, setC4Finished] = useState(false);
  const [c4StagedType, setC4StagedType] = useState<'reactiva' | 'analitica' | null>(null);

  // Handle cognitive decisions
  const handleC4Choice = (type: 'reactiva' | 'analitica') => {
    setC4StagedType(type);
  };

  const applyC4Choice = () => {
    if (c4StagedType === null) return;
    const type = c4StagedType;

    let fomoChange = 0;
    let capitalChange = 0;
    let descImpact = '';

    if (c4Fase === 1) {
      if (type === 'reactiva') {
        fomoChange = 25;
        capitalChange = 1200; // temporary illusion gain
        descImpact = 'Entrada tardía guiada por euforia de redes (+25% Ansiedad). Obtienes retorno ilusorio de papel.';
      } else {
        fomoChange = -5;
        capitalChange = 0;
        descImpact = 'Abscisión racional por ausencia de flujos reales. Conservas capital bajo control analítico.';
      }
    } else if (c4Fase === 2) {
      if (type === 'reactiva') {
        fomoChange = 45;
        capitalChange = -3500; // heavy loss due to averaging down a dying asset
        descImpact = 'Promediar a la baja un activo quebrado por dolor de realizar pérdidas (+45% Ansiedad). Pérdidas brutas agravadas.';
      } else {
        fomoChange = -10;
        capitalChange = -1000; // clean cut stop loss
        descImpact = 'Ejecución de stop-loss inmediato. Reduces pérdidas, asumes golpe en balance y recuperas tracción líquida.';
      }
    } else if (c4Fase === 3) {
      if (type === 'reactiva') {
        fomoChange = 15;
        capitalChange = -500;
        descImpact = 'Sesgo de confirmación defensiva. Lees solo fuentes que afianzan tu pánico intelectual, paralizando capital.';
      } else {
        fomoChange = -5;
        capitalChange = 1000;
        descImpact = 'Evaluación sobre estadísticas macroeconómicas e informes auditados. Desbloqueas utilidades sólidas.';
      }
    } else if (c4Fase === 4) {
      if (type === 'reactiva') {
        fomoChange = 30;
        capitalChange = -4000; // bubble burst leverages down
        descImpact = 'Apalancamiento descontrolado por exceso de confianza (Hubris). El mercado corrige ordinariamente vaciando tus fondos.';
      } else {
        fomoChange = -10;
        capitalChange = 1500;
        descImpact = 'Política estricta del 5% de riesgo máximo de cartera. Consolidas ganancias récord ante tormentas de cierre.';
      }
    }

    // Accumulate values
    const nextFomo = Math.min(100, Math.max(0, c4FOMO + fomoChange));
    const nextCapital = Math.max(0, c4Capital + capitalChange);

    setC4FOMO(nextFomo);
    setC4Capital(nextCapital);
    setC4Decisions(prev => [...prev, {
      title: `Fase ${c4Fase}`,
      type,
      impact: descImpact
    }]);

    setC4StagedType(null);

    // Go to next stage or process panic takeover
    if (nextFomo >= 100) {
      // TRIGGER AUTOMATIZED OVERLOAD PANIC ACTION
      setC4Finished(true);
      return;
    }

    if (c4Fase < 4) {
      setC4Fase((prev => prev + 1) as any);
    } else {
      setC4Finished(true);
    }
  };

  const getC4Feedback = () => {
    if (c4FOMO >= 100) {
      return {
        profile: 'Especulador por Impulso (Pánico Emocional)',
        style: 'text-red-700 bg-red-50 border-red-200',
        body: 'El termómetro de FOMO tocó el 100%. El algoritmo del pánico tomó el control del simulador de forma automatizada por desborde irracional y confusión destructiva.'
      };
    }
    
    // Calculate rationality ratio
    const analiticas = c4Decisions.filter(d => d.type === 'analitica').length;
    const ratio = (analiticas / 4) * 100;

    if (ratio >= 85) {
      return {
        profile: 'Operador de Mente Fría (Inmunidad al Entorno)',
        style: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        body: 'Gestión íntegra e impecable del riesgo. Has demostrado madurez psicológica sin ceder a la presión mediática en balances.'
      };
    } else if (ratio >= 50) {
      return {
        profile: 'Inversor Reactivo Moderado',
        style: 'text-amber-700 bg-amber-50 border-amber-200',
        body: 'Sensible al ruido ambiental y la aversión a la pérdida. Mantienes balances vivos pero incurres en ineficiencias de costo hundido.'
      };
    }
    return {
      profile: 'Especulador por Impulso',
      style: 'text-red-700 bg-red-50 border-red-200',
      body: 'Absolutamente dominado por sesgos cognitivos. Te dejas guiar por los instintos gregarios de euforia, incurriendo en descapitalización acelerada.'
    };
  };

  const resetC4 = () => {
    setC4Fase(1);
    setC4Capital(10000);
    setC4FOMO(15);
    setC4Decisions([]);
    setC4Finished(false);
    setC4StagedType(null);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left" id="academic-practical-simulations-workspace">
      
      {/* HEADER BAR AND ACCREDITATION STATS */}
      {activeSimulator === null && (
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b pb-5">
          <div>
            <span className="text-xs font-mono font-bold text-brand-secondary tracking-widest uppercase block mb-1">
              SANDBOX PRACTICO PROFESIONAL
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans">
              Laboratorio de Simulación de Escenarios
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed font-medium">
              Aplica los principios matemáticos y de gobierno corporativo extraídos del compendio teórico. Selecciona una de las 4 dinámicas evaluativas para iniciar tu simulación operativa en tiempo real.
            </p>
          </div>

          {/* XP progress panel display */}
          <div className="flex gap-4 items-center bg-slate-50 border p-3 rounded-xl">
            <Award className="w-10 h-10 text-emerald-600 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">EJERCICIOS COMPLETADOS</span>
              <span className="text-sm font-black text-slate-900 block font-mono">{completedPracticas.length} / 4 Listos</span>
              <div className="w-24 bg-slate-250 h-2.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-brand-secondary h-full transition-all duration-300"
                  style={{ width: `${(completedPracticas.length / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DASHBOARD SELECTOR GRID */}
      {activeSimulator === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dashboard-practical-grid">
          
          {/* SIMULATION 1: EL CRUCE DEL DESIERTO FINANCIERO */}
          <div 
            onClick={() => setActiveSimulator('desierto')}
            className="flex flex-col justify-between border hover:border-brand-secondary hover:shadow-md transition bg-white p-5 rounded-2xl cursor-pointer group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-slate-100 font-bold border rounded px-2 py-0.5 text-slate-500 font-mono">
                  DEX #01 • SIMULADOR DE COBRO
                </span>
                {completedPracticas.includes('desierto') && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-150 px-2 rounded font-mono">✓ ACREDITADO</span>
                )}
              </div>
              <div className="flex gap-3">
                <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary group-hover:scale-110 transition h-fit">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 group-hover:text-brand-secondary transition">
                    El Cruce del Desierto Financiero
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Navega duras restricciones de liquidez y flujos reales. Equilibra plazos crediticios a clientes, custodia fiscal y abastecimiento internacional sin caer en insolvencia de choque.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs pt-3 border-t font-bold">
              <span className="text-slate-400 font-mono font-medium text-[10px]">Toma interactiva con Sliders</span>
              <span className="text-brand-secondary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                <span>Ejecutar Simulación</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* SIMULATION 2: EL TABLERO DEL AUDITOR FINANCIERO */}
          <div 
            onClick={() => setActiveSimulator('auditor')}
            className="flex flex-col justify-between border hover:border-brand-secondary hover:shadow-md transition bg-white p-5 rounded-2xl cursor-pointer group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-slate-100 font-bold border rounded px-2 py-0.5 text-slate-500 font-mono">
                  DEX #02 • CLASIFICACIÓN CONTABLE
                </span>
                {completedPracticas.includes('auditor') && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-150 px-2 rounded font-mono">✓ ACREDITADO</span>
                )}
              </div>
              <div className="flex gap-3">
                <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary group-hover:scale-110 transition h-fit">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 group-hover:text-brand-secondary transition">
                    El Tablero del Auditor Financiero
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Audita las cuentas de la corporación. Segrega correctamente costos fijos obligatorios, custodia fiscal del IVA y activos improductivos evitando trampas destructivas del balance.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs pt-3 border-t font-bold">
              <span className="text-slate-400 font-mono font-medium text-[10px]">Pizarra Interactiva Multicapas</span>
              <span className="text-brand-secondary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                <span>Ejecutar Simulación</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* SIMULATION 3: SIMULADOR DE DESCARTE PATRIMONIAL */}
          <div 
            onClick={() => setActiveSimulator('descarte')}
            className="flex flex-col justify-between border hover:border-brand-secondary hover:shadow-md transition bg-white p-5 rounded-2xl cursor-pointer group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-slate-100 font-bold border rounded px-2 py-0.5 text-slate-500 font-mono">
                  DEX #03 • TINDER COGNITIVO
                </span>
                {completedPracticas.includes('descarte') && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-150 px-2 rounded font-mono">✓ ACREDITADO</span>
                )}
              </div>
              <div className="flex gap-3">
                <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary group-hover:scale-110 transition h-fit">
                  <Workflow className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 group-hover:text-brand-secondary transition">
                    Simulador de Descarte Patrimonial
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Actúa como CFO externo bajo riesgo inminente de quiebra. Toma decisiones inmediatas sobre contratos de oficina, activos ociosos, stock muerto y deudas de branding mediante dirección binaria.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs pt-3 border-t font-bold">
              <span className="text-slate-400 font-mono font-medium text-[10px]">Swipe Binario de Alivio Directo</span>
              <span className="text-brand-secondary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                <span>Ejecutar Simulación</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* SIMULATION 4: EL ALGORITMO HUMANO */}
          <div 
            onClick={() => setActiveSimulator('humano')}
            className="flex flex-col justify-between border hover:border-brand-secondary hover:shadow-md transition bg-white p-5 rounded-2xl cursor-pointer group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-slate-100 font-bold border rounded px-2 py-0.5 text-slate-500 font-mono">
                  DEX #04 • FINANZAS CONDUCTUALES
                </span>
                {completedPracticas.includes('humano') && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-150 px-2 rounded font-mono">✓ ACREDITADO</span>
                )}
              </div>
              <div className="flex gap-3">
                <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary group-hover:scale-110 transition h-fit">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 group-hover:text-brand-secondary transition">
                    El Algoritmo Humano
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Verifica tu templanza psicológica ante volatilidades extremas del mercado. Domina los sesgos irracionales como la aversión a la pérdida, el efecto rebaño y el exceso de confianza.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs pt-3 border-t font-bold">
              <span className="text-slate-400 font-mono font-medium text-[10px]">Métricas con Termómetro de Ansiedad</span>
              <span className="text-brand-secondary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                <span>Ejecutar Simulación</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* INNER INTERACTIVE SIMULATION CONTAINER */
        <div className="space-y-6">
          
          {/* Back navigational bar */}
          <div className="flex items-center justify-between bg-slate-50 border p-3.5 rounded-xl">
            <button
              onClick={() => setActiveSimulator(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-brand-secondary" />
              <span>Regresar al Panel de Prácticas</span>
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              SIMULACIÓN ACTIVA EN VIVO
            </span>
          </div>

          {/* ACTIVE EXERCISE VIEWPORT */}
          <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
            
            {/* ============================================================ */}
            {/* ====== RENDER SIMULATION 1: EL CRUCE DEL DESIERTO ====== */}
            {/* ============================================================ */}
            {activeSimulator === 'desierto' && (
              <div className="space-y-6 animate-fade-in" id="desierto-simulation-workspace">
                
                <div className="border-b pb-4 text-left">
                  <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold rounded">
                    CASO 1: ANÁLISIS DE FLUJO Y SUPERVIVENCIA
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
                    El Cruce del Desierto Financiero
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                    Operas una empresa con $12,000 iniciales, enfrentando obligaciones operativas ineludibles de $10,000 en 30 días. Balancea las variables deslizantes para consolidar solvencia real.
                  </p>
                </div>

                {/* INITIAL METRIC SHEET ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-150 py-5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Caja Disponible inicial</span>
                    <span className="font-mono text-base font-bold text-slate-900">$12,000 USD</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Costos Fijos Mensuales</span>
                    <span className="font-mono text-base font-bold text-rose-600">-$10,000 USD</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Facturación Potencial</span>
                    <span className="font-mono text-base font-bold text-slate-700">$50,000 USD</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-emerald-700 font-mono font-bold block">Meta de Resguardo</span>
                    <span className="font-mono text-base font-bold text-emerald-700">&gt;= $20,000 USD</span>
                  </div>
                </div>

                {/* DYNAMIC INTERLOCKING CONTROLS SLIDERS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  
                  {/* FASE 1: CLIENTES CREDIT SLIDER */}
                  <div className="bg-white border rounded-xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-brand-secondary font-bold">FASE 1</span>
                        <h4 className="text-sm font-extrabold text-slate-900">Plazos y Crédito Comercial</h4>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <label className="text-xs text-slate-600 font-mono font-bold block">
                          Plazo de Cobro: <span className="text-brand-secondary text-sm">{c1Plazo} Días</span>
                        </label>
                        <input 
                          type="range"
                          min="0"
                          max="90"
                          step="45"
                          value={c1Plazo}
                          disabled={c1PlazoDecidido}
                          onChange={(e) => {
                            setC1Plazo(Number(e.target.value));
                            setC1ShowResults(false);
                          }}
                          className={`w-full accent-brand-secondary ${c1PlazoDecidido ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold">
                          <span>0 d (Líquido)</span>
                          <span>45 d (Equilibrio)</span>
                          <span>90 d (Expansión)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {!c1PlazoDecidido ? (
                        <div className="space-y-3">
                          <p className="text-[11px] text-slate-500 leading-relaxed italic">
                            Desliza y selecciona un plazo óptimo de cobro para tus clientes corporativos.
                          </p>
                          <button
                            onClick={() => setC1PlazoDecidido(true)}
                            className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Fijar Plazo de Cobro
                          </button>
                        </div>
                      ) : (
                        <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          c1Plazo <= 45 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                          <span className="font-mono font-bold block">
                            {c1Plazo <= 45 ? '✓ PLAZO VIABLE' : '❌ ALERTA DE COBRO'}
                          </span>
                          <p className="leading-relaxed text-[11px] font-medium">
                            {c1Data.descFase1}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FASE 2: SUMINISTRO SUPPLY SELECTOR */}
                  <div className="bg-white border rounded-xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-brand-secondary font-bold">FASE 2</span>
                        <h4 className="text-sm font-extrabold text-slate-900">Abastecimiento de Inventarios</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          disabled={c1SuministroDecidido}
                          onClick={() => {
                            setC1Suministro('local');
                            setC1SuministroElegido('local');
                            setC1SuministroDecidido(true);
                            setC1ShowResults(false);
                          }}
                          className={`p-3 rounded-lg border text-xs font-bold transition text-center ${
                            c1SuministroDecidido
                              ? c1SuministroElegido === 'local'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                              : c1Suministro === 'local'
                                ? 'bg-slate-905 border-slate-900 text-slate-900 bg-slate-100'
                                : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          Nivel Local
                          <span className="block text-[9px] font-mono text-slate-400 mt-1">Suministro Rápido</span>
                        </button>
                        <button
                          disabled={c1SuministroDecidido}
                          onClick={() => {
                            setC1Suministro('internacional');
                            setC1SuministroElegido('internacional');
                            setC1SuministroDecidido(true);
                            setC1ShowResults(false);
                          }}
                          className={`p-3 rounded-lg border text-xs font-bold transition text-center ${
                            c1SuministroDecidido
                              ? c1SuministroElegido === 'internacional'
                                ? 'bg-rose-50 border-rose-550 text-rose-800'
                                : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                              : c1Suministro === 'internacional'
                                ? 'bg-slate-905 border-slate-900 text-slate-900 bg-slate-100'
                                : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          Internacional
                          <span className="block text-[9px] font-mono text-slate-400 mt-1">45 Días aduanas</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {!c1SuministroDecidido ? (
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          Selecciona la procedencia para tus inventarios. Elige con prudencia de capital.
                        </p>
                      ) : (
                        <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          c1SuministroElegido === 'local' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                          <span className="font-mono font-bold block">
                            {c1SuministroElegido === 'local' ? '✓ LOGÍSTICA SANA' : '❌ TRAMPA DE CONGELADO'}
                          </span>
                          <p className="leading-relaxed text-[11px] font-medium">
                            {c1Data.descFase2}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FASE 3: IVA DISCIPLINE CHECK */}
                  <div className="bg-white border rounded-xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-brand-secondary font-bold">FASE 3</span>
                        <h4 className="text-sm font-extrabold text-slate-900">Custodia Fiscal del IVA</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          disabled={c1FiscalDecidido}
                          onClick={() => {
                            setC1Fiscal('operativo');
                            setC1FiscalElegido('operativo');
                            setC1FiscalDecidido(true);
                            setC1ShowResults(false);
                          }}
                          className={`p-3 rounded-lg border text-xs font-bold transition text-center ${
                            c1FiscalDecidido
                              ? c1FiscalElegido === 'operativo'
                                ? 'bg-rose-50 border-rose-550 text-rose-800'
                                : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                              : c1Fiscal === 'operativo'
                                ? 'bg-slate-905 border-slate-900 text-slate-900 bg-slate-100'
                                : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          Uso Comercial
                          <span className="block text-[9px] font-mono text-slate-400 mt-1">Mezclar fondos</span>
                        </button>
                        <button
                          disabled={c1FiscalDecidido}
                          onClick={() => {
                            setC1Fiscal('segregado');
                            setC1FiscalElegido('segregado');
                            setC1FiscalDecidido(true);
                            setC1ShowResults(false);
                          }}
                          className={`p-3 rounded-lg border text-xs font-bold transition text-center ${
                            c1FiscalDecidido
                              ? c1FiscalElegido === 'segregado'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                              : c1Fiscal === 'segregado'
                                ? 'bg-slate-905 border-slate-900 text-slate-900 bg-slate-100'
                                : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          Segregado
                          <span className="block text-[9px] font-mono text-slate-400 mt-1">Fondo Bloqueado</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {!c1FiscalDecidido ? (
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          Toma postura frente al IVA recaudado. Mezclarlo otorga liquidez falsa.
                        </p>
                      ) : (
                        <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          c1FiscalElegido === 'segregado' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                          <span className="font-mono font-bold block">
                            {c1FiscalElegido === 'segregado' ? '✓ CUSTODIA ÍNTEGRA' : '❌ TRAMPA FISCAL'}
                          </span>
                          <p className="leading-relaxed text-[11px] font-medium">
                            {c1Data.descFase3}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* RUN MATHEMATICAL CONSOLIDATION TRIGGER */}
                <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t">
                  <div className="text-left">
                    <p className="text-xs text-slate-550 font-bold block">
                      Requisito de Simulación:
                    </p>
                    <p className="text-xs text-slate-400">
                      {!c1PlazoDecidido || !c1SuministroDecidido || !c1FiscalDecidido
                        ? 'Establece y fija las 3 decisiones antes de ejecutar el Cierre Contable.'
                        : '¡Excelente! Decisiones de escenario consolidadas. Listo para ver balance final.'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    {(c1PlazoDecidido || c1SuministroDecidido || c1FiscalDecidido) && (
                      <button
                        onClick={resetCaso1}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                      >
                        Reiniciar
                      </button>
                    )}
                    <button
                      disabled={!c1PlazoDecidido || !c1SuministroDecidido || !c1FiscalDecidido}
                      onClick={() => {
                        setC1ShowResults(true);
                        awardPoints(30, 'desierto');
                      }}
                      className={`px-6 py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-1.5 w-full md:w-auto ${
                        (!c1PlazoDecidido || !c1SuministroDecidido || !c1FiscalDecidido)
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-brand-secondary hover:bg-[#005236] text-white cursor-pointer'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>Ejecutar Cierre de Simulación (+30 XP)</span>
                    </button>
                  </div>
                </div>

                {/* RESULTS OUTPUT SHEET */}
                {c1ShowResults && (
                  <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6 animate-fade-in text-left">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-widest">
                        BALANCE DE SALDOS CONSOLIDADOS
                      </span>
                      <h3 className="text-xl font-bold font-sans mt-1">Cierre de Caja Operativa</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono border-b border-slate-800 pb-5">
                      <div className="space-y-1">
                        <span className="text-slate-400 block">Facturación Bruta:</span>
                        <span className="font-bold text-white text-sm">${c1Data.facturacionPotencial.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 block">Recaudado en Caja:</span>
                        <span className="font-bold text-emerald-400 text-sm">+${c1Data.recaudacionMes.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 block">Cuentas por Cobrar:</span>
                        <span className="font-bold text-slate-350 text-sm">${c1Data.cuentasPorCobrar.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 block">Inventario/Anticipos:</span>
                        <span className="font-bold text-rose-400 text-sm">-$ {c1Data.costoInventario}</span>
                      </div>
                    </div>

                    {/* Final state gauge block */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-950 p-5 rounded-xl border border-slate-800 gap-4">
                      <div className="space-y-1 text-center md:text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Líquido Neto Disponible</span>
                        <span className="text-3xl font-black text-white font-mono">${c1Data.cajaDisponibleFinal.toLocaleString()} USD</span>
                      </div>

                      <div className="space-y-1.5 w-full md:w-72">
                        <div className="flex justify-between text-[11px] font-mono font-bold">
                          <span className="text-rose-400">Insolvencia (&lt;$10K)</span>
                          <span className="text-emerald-400">Solvencia (&gt;=$20K)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                          <div className={`h-full ${
                            c1Data.semaforo === 'ROJO' ? 'bg-red-500 w-1/3' : 
                            c1Data.semaforo === 'AMARILLO' ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full'
                          } transition-all duration-300`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Corporate Decision Verdict */}
                    <div className={`border p-4 rounded-xl text-xs space-y-1 ${c1Data.dictamenColor}`}>
                      <span className="font-mono font-black block">VERDICTO TÉCNICO VLE DICTAMEN:</span>
                      <p className="leading-relaxed font-bold">
                        {c1Data.dictamen}
                      </p>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* ============================================================ */}
            {/* ====== RENDER SIMULATION 2: EL TABLERO DEL AUDITOR ====== */}
            {/* ============================================================ */}
            {activeSimulator === 'auditor' && (
              <div className="space-y-6 animate-fade-in" id="auditor-simulation-workspace">
                
                <div className="border-b pb-4 text-left">
                  <span className="px-2 py-0.5 text-[10px] font-mono text-indigo-805 bg-indigo-50 border border-indigo-200 font-bold rounded">
                    CASO 2: ASIGNACIÓN DE SALDOS Y AUDITORÍA
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
                    El Tablero del Auditor Financiero
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                    Como Auditor Externo VLE corporativo, debes organizar las cuentas del balance desordenadas. Cada nivel evalúa un pilar crítico. ¡Un desvío equivocado disparará la alerta de insolvencia!
                  </p>
                </div>

                {/* Score indicators */}
                <div className="flex justify-between items-center bg-slate-50 border p-3 rounded-xl flex-wrap gap-2 text-xs font-mono">
                  <div className="flex gap-4">
                    <span>Aciertos: <strong className="text-emerald-600 font-bold">{auditorExitos}</strong></span>
                    <span>Rebotes / Errores: <strong className="text-rose-500 font-bold">{auditorRebotes}</strong></span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-brand-secondary/15 text-brand-secondary font-bold font-sans">
                    NIVEL EN CURSO {auditorNivel} de 3
                  </span>
                </div>

                {!c2Completado ? (
                  <div className="space-y-6" id="level-gameboard-viewport">
                    
                    {/* Header level context */}
                    <div className="bg-indigo-900 text-white p-4 rounded-xl space-y-1">
                      <span className="font-mono text-[9px] font-bold text-amber-300 block uppercase tracking-wider">
                        Nivel {auditorNivel}: 
                        {auditorNivel === 1 && ' Clasificación de Estructuras de Costo y Palancamiento'}
                        {auditorNivel === 2 && ' Segregación del Flujo de Caja Real vs Derechos Financieros'}
                        {auditorNivel === 3 && ' Optimización Patrimonial y Desincorporación de Activos Ociosos'}
                      </span>
                      <p className="text-xs text-slate-200">
                        {auditorNivel === 1 && 'Clasifica las cuentas según su variabilidad. No catalogues costos fijos estructurales como variables.'}
                        {auditorNivel === 2 && 'Discrimina el efectivo disponible del crédito comercial o cuentas en pasivos impositivos.'}
                        {auditorNivel === 3 && 'Consolida la productividad de los activos. Liquidar bienes improductivos es imperioso.'}
                      </p>
                    </div>

                    {/* CARD DISCORDANT SELECTOR GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[220px]">
                      
                      {/* Left Side: Outstanding Cards */}
                      <div className="border border-slate-200 rounded-xl p-5 space-y-3.5 bg-slate-50/50 flex flex-col justify-center">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block text-center mb-1">
                          MAZO DE CUENTAS POR CLASIFICAR
                        </span>

                        {currentLevelCardsRemaining.length === 0 ? (
                          <div className="space-y-4 text-center py-6">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                            <p className="text-sm font-bold text-slate-900 font-sans">
                              ¡Nivel {auditorNivel} depurado con éxito!
                            </p>
                            <button
                              onClick={advanceLevel}
                              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition"
                            >
                              Siguiente Nivel / Consolidar
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white border text-left p-5 rounded-xl shadow-sm space-y-4 font-sans animate-fade-in border-slate-200/80">
                            <span className="inline-block px-1.5 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 text-[9px] font-mono font-bold rounded">
                              Cuenta Académica
                            </span>
                            <h4 className="text-base font-bold text-slate-900">
                              {currentLevelCardsRemaining[0].text}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Selecciona la partida o destino contable correcto para este concepto para registrarlo en el VLE.
                            </p>

                            {/* Options depending on the active level */}
                            <div className="grid grid-cols-2 gap-2.5 pt-2">
                              {auditorNivel === 1 && (
                                <>
                                  <button
                                    disabled={c2ChosenAnswer !== null}
                                    onClick={() => handleClassify(currentLevelCardsRemaining[0].id, 'fijo')}
                                    className={`p-2.5 rounded border text-xs font-bold transition text-center ${
                                      c2ChosenAnswer === null
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
                                        : c2ChosenAnswer === 'fijo'
                                          ? currentLevelCardsRemaining[0].target === 'fijo'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                            : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                          : 'bg-slate-55 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    Caja de Costos Fijos
                                  </button>
                                  <button
                                    disabled={c2ChosenAnswer !== null}
                                    onClick={() => handleClassify(currentLevelCardsRemaining[0].id, 'variable')}
                                    className={`p-2.5 rounded border text-xs font-bold transition text-center ${
                                      c2ChosenAnswer === null
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
                                        : c2ChosenAnswer === 'variable'
                                          ? currentLevelCardsRemaining[0].target === 'variable'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                            : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                          : 'bg-slate-55 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    Caja de Costos Variables
                                  </button>
                                </>
                              )}

                              {auditorNivel === 2 && (
                                <>
                                  <button
                                    disabled={c2ChosenAnswer !== null}
                                    onClick={() => handleClassify(currentLevelCardsRemaining[0].id, 'disponible')}
                                    className={`p-2 rounded border text-xs font-bold transition text-center ${
                                      c2ChosenAnswer === null
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
                                        : c2ChosenAnswer === 'disponible'
                                          ? currentLevelCardsRemaining[0].target === 'disponible'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                            : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                          : 'bg-slate-55 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    Efectivo Disponible
                                  </button>
                                  <button
                                    disabled={c2ChosenAnswer !== null}
                                    onClick={() => handleClassify(currentLevelCardsRemaining[0].id, 'cobrar')}
                                    className={`p-2 rounded border text-xs font-bold transition text-center ${
                                      c2ChosenAnswer === null
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
                                        : c2ChosenAnswer === 'cobrar'
                                          ? currentLevelCardsRemaining[0].target === 'cobrar'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                            : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                          : 'bg-slate-55 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    Cuentas por Cobrar
                                  </button>
                                  <button
                                    disabled={c2ChosenAnswer !== null}
                                    onClick={() => handleClassify(currentLevelCardsRemaining[0].id, 'custodia')}
                                    className={`p-2 col-span-2 rounded border text-xs font-bold transition text-center ${
                                      c2ChosenAnswer === null
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
                                        : c2ChosenAnswer === 'custodia'
                                          ? currentLevelCardsRemaining[0].target === 'custodia'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                            : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                          : 'bg-slate-55 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    Custodia Fiscal - Pasivos Estatales
                                  </button>
                                </>
                              )}

                              {auditorNivel === 3 && (
                                <>
                                  <button
                                    disabled={c2ChosenAnswer !== null}
                                    onClick={() => handleClassify(currentLevelCardsRemaining[0].id, 'conservar')}
                                    className={`p-2 rounded border text-xs font-bold transition text-center ${
                                      c2ChosenAnswer === null
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
                                        : c2ChosenAnswer === 'conservar'
                                          ? currentLevelCardsRemaining[0].target === 'conservar'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                            : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                          : 'bg-slate-55 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    Conservar en Balance
                                  </button>
                                  <button
                                    disabled={c2ChosenAnswer !== null}
                                    onClick={() => handleClassify(currentLevelCardsRemaining[0].id, 'liquidar')}
                                    className={`p-2 rounded border text-xs font-bold transition text-center ${
                                      c2ChosenAnswer === null
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 cursor-pointer'
                                        : c2ChosenAnswer === 'liquidar'
                                          ? currentLevelCardsRemaining[0].target === 'liquidar'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                            : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                          : 'bg-slate-55 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    Liquidar / Recuperación
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Right Side: Real-time dynamic visual feedback log */}
                      <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between bg-white">
                        <div className="space-y-3.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block text-left">
                            REGISTRO DE RESPUESTAS & FEEDBACK TÉCNICO
                          </span>
                          
                          {auditorFeedback.msg ? (
                            <div className={`p-4 rounded-xl border text-xs text-left leading-relaxed space-y-1.5 ${
                              auditorFeedback.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                              <span className="font-mono font-bold block">
                                {auditorFeedback.type === 'success' ? '✓ LOGRO ACADÉMICO' : '⚠️ ALERTA CONTABLE DETECTADA'}
                              </span>
                              <p className="font-sans font-medium">{auditorFeedback.msg}</p>
                            </div>
                          ) : (
                            <div className="text-center py-10">
                              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                              <p className="text-xs text-slate-400 mt-2 font-mono text-center">
                                Clasifica la primera partida para ver el análisis de impacto.
                              </p>
                            </div>
                          )}

                          {c2ChosenAnswer !== null && currentLevelCardsRemaining.length > 0 && (
                            <button
                              onClick={() => {
                                setClassifiedIds(prev => [...prev, currentLevelCardsRemaining[0].id]);
                                setC2ChosenAnswer(null);
                                setAuditorFeedback({ msg: '', type: null });
                              }}
                              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                            >
                              <span>Siguiente Cuenta en Mazo →</span>
                            </button>
                          )}
                        </div>

                        {/* Summary Progress levels */}
                        <div className="border-t pt-4 font-mono text-[10px] text-slate-400 flex justify-between">
                          <span>Aciertos: {auditorExitos}</span>
                          <span>Precisión: {auditorExitos + auditorRebotes > 0 ? Math.round((auditorExitos / (auditorExitos + auditorRebotes)) * 100) : 0}%</span>
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  /* FINAL AUDIT VERDICT CARD */
                  <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 text-center animate-pulse">
                    <Award className="w-16 h-16 text-amber-400 mx-auto" />
                    
                    <div className="space-y-2 max-w-xl mx-auto">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        ESTADÍSTICAS SÓLIDAS DE AUDITORÍA COMPACTA
                      </span>
                      <h3 className="text-2xl font-black font-sans leading-none">
                        Dictamen del Comité Evaluador
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
                        El sistema analítico ha consolidado tu informe integral de salarios e inmovilizaciones basándose en una precisión académica estricta.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto font-mono text-xs">
                      <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <span className="text-slate-500 block">Total Aciertos</span>
                        <strong className="text-emerald-400 font-bold block text-base mt-0.5">{auditorExitos}</strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <span className="text-slate-500 block">Total Rebotes</span>
                        <strong className="text-rose-450 font-bold block text-base mt-0.5">{auditorRebotes}</strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded border border-slate-800 col-span-2 md:col-span-1">
                        <span className="text-slate-500 block">Precisión</span>
                        <strong className="text-white font-bold block text-base mt-0.5">
                          {Math.round((auditorExitos / (auditorExitos + auditorRebotes)) * 100)}%
                        </strong>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border max-w-lg mx-auto text-xs text-left leading-relaxed ${getAuditorGrade().color}`}>
                      <strong className="block font-mono uppercase font-black tracking-tight text-[11px] mb-1">
                        PERFIL CONTABLE CALIFICADO:
                      </strong>
                      <span className="font-sans font-extrabold text-sm block">
                        {getAuditorGrade().title}
                      </span>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={resetAuditor}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Volver a Intentar</span>
                      </button>
                      <button
                        onClick={() => {
                          awardPoints(25, 'auditor');
                          setActiveSimulator(null);
                          alert('¡Excelente! Has registrado el Caso 2 como aprobado en tu biblioteca académica.');
                        }}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Acreditar y Finalizar (+25 XP)</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* ============================================================ */}
            {/* ====== RENDER SIMULATION 3: EL SIMULADOR DE DESCARTE ====== */}
            {/* ============================================================ */}
            {activeSimulator === 'descarte' && (
              <div className="space-y-6 animate-fade-in" id="descarte-simulation-workspace">
                
                <div className="border-b pb-4 text-left">
                  <span className="px-2 py-0.5 text-[10px] font-mono text-amber-805 bg-amber-50 border border-amber-200 font-bold rounded">
                    CASO 3: REESTRUCTURACIÓN DE ACTIVOS EN CHOQUE (TINDER FINANCIERO)
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
                    Simulador de Descarte Patrimoniales
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                    Cuentas con solo $2,000 iniciales y costos fijos abrumadores de $15,000 en 30 días. Haz swipe / decide de forma pragmática para desincorporar activos ociosos y evitar la quiebra técnica.
                  </p>
                </div>

                {/* GAME METRICS STATS BAR */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 border rounded-xl font-mono text-xs text-left">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block pb-0.5">Caja Disponible Actual</span>
                    <span className={`text-base font-black ${c3CajaActual >= 3000 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      ${c3CajaActual.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block pb-0.5">Costos Fijos Mensuales</span>
                    <span className="text-base font-bold text-slate-900">
                      ${c3CostosFijos.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="space-y-0.5 col-span-2 md:col-span-1">
                    <span className="text-slate-400 block pb-0.5">Tarjeta Evaluativa</span>
                    <span className="text-base font-bold text-brand-secondary font-sans leading-none">
                      {c3CardIndex + 1} de {tinderCards.length} en mazo
                    </span>
                  </div>
                </div>

                {!c3ShowResults ? (
                  <div className="max-w-xl mx-auto space-y-6 pt-2" id="tinder-active-stack">
                    
                    {/* The Active Swipe Card */}
                    <div className="bg-gradient-to-b from-white to-slate-50 border-2 border-amber-200/80 rounded-2xl p-6 md:p-8 space-y-5 text-center relative shadow-sm overflow-hidden min-h-[290px] flex flex-col justify-between">
                      
                      {/* Subtle branding layer */}
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500/10 text-amber-700 text-[9px] font-bold font-mono rounded">
                        TARJETA ACTIVA ACADÉMICA {tinderCards[c3CardIndex].id}
                      </span>

                      <div className="space-y-4 pt-4">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight font-sans">
                          {tinderCards[c3CardIndex].title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                          {tinderCards[c3CardIndex].context}
                        </p>
                      </div>

                      {/* Direction choices preview details */}
                      <div className="border-t border-slate-200/50 pt-4 flex justify-between gap-4 font-mono text-[10px] font-bold text-slate-400">
                        <div className="text-left">
                          <span className="text-rose-500 block">◀ OPCIÓN IZQUIERDA</span>
                          <span>{tinderCards[c3CardIndex].leftAction}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-600 block">OPCIÓN DERECHA ▶</span>
                          <span>{tinderCards[c3CardIndex].rightAction}</span>
                        </div>
                      </div>

                    </div>

                    {/* Interactive Gameplay Buttons - Unbiased & Lockable */}
                    <div className="flex flex-col gap-4 items-center">
                      <div className="flex justify-center gap-4 w-full">
                        <button
                          disabled={c3ChosenDirection !== null}
                          onClick={() => handleTinderSwipe('left')}
                          className={`p-4 rounded-full border transition-all flex items-center gap-1.5 font-bold text-xs uppercase w-1/2 justify-center ${
                            c3ChosenDirection === null
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 cursor-pointer'
                              : c3ChosenDirection === 'left'
                                ? tinderCards[c3CardIndex].correctDirection === 'left'
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                  : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                : 'opacity-40 bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                          }`}
                          title="Desincorporar"
                        >
                          <ThumbsDown className="w-5 h-5" />
                          <span>Desincorporar (Left)</span>
                        </button>
                        
                        <button
                          disabled={c3ChosenDirection !== null}
                          onClick={() => handleTinderSwipe('right')}
                          className={`p-4 rounded-full border transition-all flex items-center gap-1.5 font-bold text-xs uppercase w-1/2 justify-center ${
                            c3ChosenDirection === null
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 cursor-pointer'
                              : c3ChosenDirection === 'right'
                                ? tinderCards[c3CardIndex].correctDirection === 'right'
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold'
                                  : 'bg-rose-100 border-rose-500 text-rose-800 font-extrabold'
                                : 'opacity-40 bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                          }`}
                          title="Mantener"
                        >
                          <span>Mantener (Right)</span>
                          <ThumbsUp className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Immediate feedback block and manual Next button */}
                      {c3ChosenDirection !== null && (
                        <div className="w-full space-y-4 animate-fade-in">
                          <div className={`p-4 rounded-xl border text-xs text-left leading-relaxed space-y-1.5 ${
                            c3ChosenDirection === tinderCards[c3CardIndex].correctDirection 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}>
                            <span className="font-mono font-bold block">
                              {c3ChosenDirection === tinderCards[c3CardIndex].correctDirection 
                                ? '✓ DECISIÓN ESTRATÉGICA REGISTRADA' 
                                : '⚠️ ADVERTENCIA EVALUATIVE CON CONTENIDO'}
                            </span>
                            <p className="font-sans font-medium">
                              {c3ChosenDirection === tinderCards[c3CardIndex].correctDirection 
                                ? tinderCards[c3CardIndex].successMsg 
                                : tinderCards[c3CardIndex].failMsg}
                            </p>
                          </div>

                          <button
                            onClick={nextTinderCard}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                          >
                            <span>Siguiente Activo en Cuenta →</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Real-time reactive card audit diagnostics list */}
                    {c3Log.length > 0 && (
                      <div className="bg-slate-50 border rounded-xl p-4 text-[11px] font-mono text-left space-y-1 max-h-[140px] overflow-y-auto">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase pb-1 border-b">
                          REGISTRO AUDITABLE COMPACTO:
                        </span>
                        {c3Log.slice().reverse().map((entry, idx) => (
                          <div 
                            key={idx} 
                            className={`p-1.5 rounded ${entry.correct ? 'text-emerald-700 font-bold' : 'text-rose-600'}`}
                          >
                            {entry.text}
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ) : (
                  /* FINAL TINDER STATISTICS */
                  <div className="bg-slate-900 border border-slate-950 text-white p-6 md:p-8 rounded-2xl text-center space-y-6">
                    <Workflow className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
                    
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <span className="text-[10px] text-brand-secondary font-bold font-mono uppercase tracking-widest block">
                        ANÁLISIS DE EFICIENCIA DE DESCARTE COMPLETA
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-white font-sans tracking-tight leading-none">
                        Dictamen del Comité Directivo
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        Se han consolidado las métricas del balance depurado para certificar tus destrezas frente a las salidas de fondos.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto font-mono text-xs">
                      <div className="bg-slate-950 p-3.5 rounded border border-slate-800">
                        <span className="text-slate-500 block pb-0.5">Caja Recuperada</span>
                        <strong className="text-emerald-400 font-bold block text-base mt-0.5">
                          ${c3CajaActual.toLocaleString()} USD
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded border border-slate-800">
                        <span className="text-slate-500 block pb-0.5">Costos Depurados</span>
                        <strong className="text-slate-200 font-bold block text-base mt-0.5">
                          ${c3CostosFijos.toLocaleString()} USD
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded border border-slate-800 col-span-2 md:col-span-1">
                        <span className="text-slate-500 block pb-0.5">Eficiencia</span>
                        <strong className="text-white font-bold block text-base mt-0.5">
                          {c3Log.filter(e => e.correct).length * 16.6}%
                        </strong>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl text-xs text-left max-w-lg mx-auto leading-relaxed border ${getTinderReport().style}`}>
                      <strong className="font-mono font-black text-[11px] uppercase block mb-1">
                        DICTAMEN DEL COMITÉ DIRECTIVO:
                      </strong>
                      <span className="font-sans font-black text-sm block mb-1">
                        {getTinderReport().title}
                      </span>
                      <span className="font-sans text-slate-650 leading-relaxed font-medium block">
                        {getTinderReport().body}
                      </span>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={resetTinder}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Volver a Intentar</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          awardPoints(35, 'descarte');
                          setActiveSimulator(null);
                          alert('🎉 ¡Simulación de Activos aprobada! Has ganado +35 XP en tu Perfil Académico.');
                        }}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-amber-300" />
                        <span>Acreditar Descarte (+35 XP)</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* ============================================================ */}
            {/* ====== RENDER SIMULATION 4: EL ALGORITMO HUMANO ====== */}
            {/* ============================================================ */}
            {activeSimulator === 'humano' && (
              <div className="space-y-6 animate-fade-in text-left" id="humano-simulation-workspace">
                
                <div className="border-b pb-4 text-left">
                  <span className="px-2 py-0.5 text-[10px] font-mono text-purple-800 bg-purple-50 border border-purple-200 font-bold rounded">
                    CASO 4: SIMULACIÓN DE SESGOS Y PSICOLOGÍA
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
                    El Algoritmo Humano
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">
                    Controla tus impulsos en un mercado con extrema volatilidad de precios. Si tu termómetro acumulativo de FOMO / Ansiedad toca el 100%, desbordarás pánico irracional liquidando tu capital de forma automatizada.
                  </p>
                </div>

                {/* DOUBLE GAUGE PANEL ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Capital Gauge */}
                  <div className="bg-slate-50 border rounded-xl p-4 flex justify-between items-center text-xs font-mono text-left">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block uppercase">Capital de Trabajo Circulante</span>
                      <strong className="text-2xl font-black text-slate-900 block font-mono">
                        ${c4Capital.toLocaleString()} USD
                      </strong>
                    </div>
                    <div className="p-3 bg-brand-secondary/15 text-brand-secondary rounded-lg">
                      <TrendingUp className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>

                  {/* Anxiety FOMO Thermometer */}
                  <div className="bg-slate-50 border rounded-xl p-4 space-y-2 text-xs font-mono text-left">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-400 uppercase">Termómetro de Ansiedad</span>
                      <span className={c4FOMO >= 70 ? 'text-rose-600 animate-pulse font-black' : 'text-amber-700'}>
                        {c4FOMO}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          c4FOMO >= 80 ? 'bg-red-600' : c4FOMO >= 50 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${c4FOMO}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-none">
                      (A los 100%, el automatismo ejecuta pánico irrecuperable de venta).
                    </span>
                  </div>

                </div>

                {!c4Finished ? (
                  <div className="bg-white border rounded-2xl p-5 space-y-6" id="conductual-wizard-viewport">
                    
                    {/* Level banner */}
                    <div className="bg-purple-900 text-white p-4 rounded-xl space-y-2 text-left">
                      <span className="font-mono text-[9px] text-amber-300 font-bold uppercase tracking-wider block">
                        Fase {c4Fase} de 4 Activada: 
                        {c4Fase === 1 && ' El Despegue Parabólico (Hype y FOMO)'}
                        {c4Fase === 2 && ' El Descalabro del Mercado (Costo Hundido)'}
                        {c4Fase === 3 && ' La Trampa del Retrovisor (Sesgo de Confirmación)'}
                        {c4Fase === 4 && ' La Euforia del Ganador (Hubris)'}
                      </span>
                      
                      <p className="text-xs text-slate-250 leading-relaxed font-sans">
                        {c4Fase === 1 && 'Un activo se valoriza 40% en un par de horas por rumores informales en foros de mensajería.'}
                        {c4Fase === 2 && 'Una noticia institucional desmiente rumores y provoca un inmediato desplome masivo del 50%.'}
                        {c4Fase === 3 && 'Aparece una opción de baja volatilidad. Tus miedos persisten y buscas opiniones en la red.'}
                        {c4Fase === 4 && 'Tras tres aciertos analíticos consecutivos que incrementaron capital, surge opción altamente apalancada.'}
                      </p>
                    </div>

                    {/* TWO OPTION PATHWAYS FOR DECISION-MAKING */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
                        
                        {/* Reactive / Psychological Choice */}
                        <button 
                          disabled={c4StagedType !== null}
                          onClick={() => handleC4Choice('reactiva')}
                          className={`border rounded-2xl p-5 transition text-left flex flex-col justify-between space-y-4 group cursor-pointer ${
                            c4StagedType === null
                              ? 'border-slate-200 bg-rose-50/10 hover:border-rose-300 hover:shadow-sm'
                              : c4StagedType === 'reactiva'
                                ? 'border-rose-500 bg-rose-100/60 ring-2 ring-rose-250 text-rose-900'
                                : 'opacity-40 border-slate-100 bg-slate-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-rose-600 font-bold uppercase block text-left">
                              Opción Reactiva / Sensorial
                            </span>
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition text-left">
                              {c4Fase === 1 && 'Comprar de inmediato para evitar costo de oportunidad'}
                              {c4Fase === 2 && 'Inyectar más fondos para promediar la pérdida histórica'}
                              {c4Fase === 3 && 'Validar blogs de aficionados extremistas en la red'}
                              {c4Fase === 4 && 'Apalancar 80% creyendo en racha infalible'}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed pt-1 text-left">
                              {c4Fase === 1 && 'Asignas 40% de capital disponible intentando atrapar el despegue inmediato.'}
                              {c4Fase === 2 && 'Asignas capital útil persiguiendo mitigar un costo hundido contable.'}
                              {c4Fase === 3 && 'Le das exclusividad crediticia a informantes informales de pánico.'}
                              {c4Fase === 4 && 'Arriesgas casi todo el balance bajo premisas individuales egoístas.'}
                            </p>
                          </div>
                          <div className="pt-2 flex justify-end font-mono text-[10px] text-rose-500 font-bold group-hover:translate-x-1 transition-transform w-full">
                            <span>Tomar esta Ruta ◀</span>
                          </div>
                        </button>

                        {/* RATIONAL ANALYTICAL PATHWAY */}
                        <button 
                          disabled={c4StagedType !== null}
                          onClick={() => handleC4Choice('analitica')}
                          className={`border rounded-2xl p-5 transition text-left flex flex-col justify-between space-y-4 group cursor-pointer ${
                            c4StagedType === null
                              ? 'border-slate-200 bg-emerald-50/5 hover:border-emerald-300 hover:shadow-sm'
                              : c4StagedType === 'analitica'
                                ? 'border-emerald-500 bg-emerald-100/60 ring-2 ring-emerald-250 text-emerald-900'
                                : 'opacity-40 border-slate-100 bg-slate-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block text-left">
                              Opción Analítica / Prudencial
                            </span>
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition text-left">
                              {c4Fase === 1 && 'Ignorar el activo por falta de flujos o fundamentos'}
                              {c4Fase === 2 && 'Ejecutar Stop-Loss inmediato limitando golpe a caja'}
                              {c4Fase === 3 && 'Auditar estadísticas macroeconómicas y balances oficiales'}
                              {c4Fase === 4 && 'Aclimatarse a política estricta de riesgo limitado del 5%'}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed pt-1 text-left">
                              {c4Fase === 1 && 'Abscisión racional para evitar especulación estéril flotante.'}
                              {c4Fase === 2 && 'Asumes pérdida contable real reteniendo capital de trabajo útil.'}
                              {c4Fase === 3 && 'Ignoras ruidos del chat basándote en estadísticas reales.'}
                              {c4Fase === 4 && 'Ancla tu balance conservador impidiendo pérdidas estructurales.'}
                            </p>
                          </div>
                          <div className="pt-2 flex justify-end font-mono text-[10px] text-emerald-600 font-bold group-hover:translate-x-1 transition-transform w-full">
                            <span>Tomar esta Ruta ▶</span>
                          </div>
                        </button>

                      </div>

                      {/* Manual Progression Flow with immediate non-biased warnings */}
                      {c4StagedType !== null && (
                        <div className="w-full space-y-4 animate-fade-in pt-4">
                          <div className={`p-4 rounded-xl border text-xs text-left leading-relaxed space-y-1.5 ${
                            c4StagedType === 'analitica' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}>
                            <span className="font-mono font-bold block">
                              {c4StagedType === 'analitica' ? '✓ PROPUESTA ANÁLITICA SELECCIONADA' : '⚠️ ALERTA CONTRA SESGO DETECTADA'}
                            </span>
                            <p className="font-sans font-medium">
                              {c4Fase === 1 && (
                                c4StagedType === 'analitica'
                                  ? 'Prudente decisión. Evitas especular sin fundamentos tangibles, reteniendo el 100% de capital intacto contra burbujas de mercado.'
                                  : 'Incurres en Sesgo gregario (FOMO). Consigues un retorno ilusorio de papel pero comprometes activos reales que no podrás liquidar fácilmente.'
                              )}
                              {c4Fase === 2 && (
                                c4StagedType === 'analitica'
                                  ? 'Ejecución rigurosa del límite de pérdidas. Asumes una pérdida controlada pero dejas de inyectar recursos en un abismo irreversible.'
                                  : 'Trampa del Costo Hundido. Promedias a la baja esperando una recuperación imaginaria, perdiendo el triple de tu caja.'
                              )}
                              {c4Fase === 3 && (
                                c4StagedType === 'analitica'
                                  ? 'Abastecimiento de datos basados en balances auditados y analítica macro. Actitud empírica que blinda tu balance contra pánico comercial.'
                                  : 'Sesgo de confirmación pasivo. Decides buscar solo información de foros afines que alimentan la parálisis operativa, descapitalizando.'
                              )}
                              {c4Fase === 4 && (
                                c4StagedType === 'analitica'
                                  ? 'Seguimiento estricto del 5% de riesgo máximo de cartera. Te proteges contra una caída inminente, consolidando un balance ganador récord.'
                                  : 'Arrogancia del Ganador (Hubris). El apalancamiento excesivo impulsado por éxitos anteriores expone tu negocio al vaciado integral durante la corrección regular.'
                              )}
                            </p>
                          </div>

                          <button
                            onClick={applyC4Choice}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                          >
                            <span>Avanzar a la Siguiente Fase del Algoritmo →</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Timeline decisions log */}
                    {c4Decisions.length > 0 && (
                      <div className="border-t pt-4 space-y-2 text-left">
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">
                          Efectos Históricos del Operador:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed font-mono">
                          {c4Decisions.map((dec, idx) => (
                            <div key={idx} className="p-2 border rounded-xl bg-slate-50 space-y-1">
                              <span className="font-extrabold uppercase text-[10px] text-brand-secondary block">
                                {dec.title} ({dec.type})
                              </span>
                              <p className="text-slate-600 font-sans">{dec.impact}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  /* FINAL DISCORDANT REPORT ON BEHAVIOR */
                  <div className="bg-slate-900 border border-slate-950 text-white p-6 md:p-8 rounded-2xl text-center space-y-6">
                    <Activity className="w-16 h-16 text-amber-405 mx-auto animate-pulse" />
                    
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <span className="text-[10px] text-brand-secondary font-bold font-mono uppercase tracking-widest block">
                        EVALUACIÓN DE PERFIL PSICOLÓGICO FINANCIERO
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-white font-sans tracking-tight leading-none">
                        Racionalidad y Control del Hype
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        Se ha computado tu termómetro acumulado frente a la toma voluntaria de deudas y amortizaciones en mercados burbujeantes.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto font-mono text-xs">
                      <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <span className="text-slate-500 block">Capital Preservado</span>
                        <strong className="text-emerald-400 font-bold block text-base mt-0.5">
                          ${c4Capital.toLocaleString()} USD
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <span className="text-slate-500 block">Termómetro FOMO</span>
                        <strong className="text-indigo-400 font-bold block text-base mt-0.5">
                          {c4FOMO}%
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded border border-slate-800 col-span-2 md:col-span-1">
                        <span className="text-slate-500 block">Calificación</span>
                        <strong className="text-white font-bold block text-base mt-0.5">
                          {c4Decisions.filter(d => d.type === 'analitica').length * 25}% Racional
                        </strong>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl text-xs text-left max-w-lg mx-auto leading-relaxed border ${getC4Feedback().style}`}>
                      <strong className="font-mono font-black text-[11px] uppercase block mb-1">
                        PERFIL CONDUCTUAL ASIGNADO VLE:
                      </strong>
                      <span className="font-sans font-black text-sm block mb-1">
                        {getC4Feedback().profile}
                      </span>
                      <span className="font-sans text-slate-650 leading-relaxed font-medium block">
                        {getC4Feedback().body}
                      </span>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={resetC4}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reiniciar Intento</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          awardPoints(30, 'humano');
                          setActiveSimulator(null);
                          alert('¡Perfecto! El perfil ha sido indexado en tu biblioteca de simulación.');
                        }}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-amber-300" />
                        <span>Acreditar Conducta (+30 XP)</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
