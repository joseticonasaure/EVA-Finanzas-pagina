/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from '../types';
import { Settings, Shield, User as UserIcon, RefreshCw, Trash2, HelpCircle } from 'lucide-react';

interface ConfigContentProps {
  user: User;
  onLogout: () => void;
  onResetProgress: () => void;
}

export default function ConfigContent({ user, onLogout, onResetProgress }: ConfigContentProps) {
  const handleResetClick = () => {
    if (window.confirm('¿Estás absolutamente seguro de querer borrar tu progreso y simulaciones? Esta acción no se puede deshacer.')) {
      onResetProgress();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Header section */}
      <section className="mb-6">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-widest block mb-1">
          Configuración Global
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl">
          Administra la persistencia de tu cuenta local, reinicia avances prácticos, o consulta detalles sobre el VLE Offline de Finanzas para la vida.
        </p>
      </section>

      {/* Settings Grid layouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-3">
            <UserIcon className="w-5 h-5 text-brand-secondary" />
            <h3 className="font-bold text-slate-950">Datos Personales Locales</h3>
          </div>
          
          <div className="space-y-3.5 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-bold">Nombre del Estudiante</p>
              <p className="font-semibold text-slate-800">{user.username}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">Correo Electrónico Registrado</p>
              <p className="font-semibold text-slate-850 font-mono text-xs">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">Tipo de Base de Datos</p>
              <p className="inline-block px-2 py-0.5 bg-blue-50 text-brand-tertiary font-mono text-[10px] font-bold rounded">
                HTML5 LocalStorage Engine
              </p>
            </div>
          </div>
        </div>

        {/* Security & Reset control panel */}
        <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-3">
            <Shield className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-slate-950">Zona de Seguridad y Datos</h3>
          </div>

          <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
            <p>
              Todos tus estados, partidas presupuestadas cargadas, e historiales de teoría permanecen anidados permanentemente dentro de tu navegador actual.
            </p>
            <p className="font-semibold text-slate-800">
              ¿Quieres borrar el progreso de tu simulador para comenzar el curso o la evaluación desde cero?
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleResetClick}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Resetear Avances Prácticos
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Info FAQ matching human-centered guidelines */}
      <section className="bg-slate-100 border p-5 rounded-lg">
        <h4 className="font-bold text-slate-950 mb-2 flex items-center gap-1.5 text-sm">
          <Settings className="w-4 h-4 text-slate-600 animate-spin-slow" /> Acerca del Laboratorio VLE
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Finanzas para la vida es un simulador virtual auto-portante diseñado con el fin de educar sobre decisiones monetarias complejas de forma intuitiva. Respeta el diseño sistemático ISO 9241, manteniendo alta legibilidad, controles fluidos y persistencia local sin fugas de datos.
        </p>
      </section>

    </div>
  );
}
