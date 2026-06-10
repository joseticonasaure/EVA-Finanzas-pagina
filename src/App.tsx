/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, TabType } from './types';
import LoginRegister from './components/LoginRegister';
import InicioContent from './components/InicioContent';
import TeoriaContent from './components/TeoriaContent';
import PracticaContent from './components/PracticaContent';
import QuizContent from './components/QuizContent';
import ConfigContent from './components/ConfigContent';
import logoImage from './assets/images/finance_logo_1781058553440.png';
import { 
  Home, BookOpen, Edit2, Play, Settings, LogOut, Bell, HelpCircle, Menu, X, 
  Award, RefreshCw, ChevronRight, User as UserIcon, ShieldAlert 
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [welcomeAlert, setWelcomeAlert] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync editName with username when user loads or updates
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.username);
    }
  }, [currentUser?.username]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editName.trim()) return;

    const updated: User = {
      ...currentUser,
      username: editName.trim()
    };

    handleUpdateUser(updated);

    // Save to localStorage of users
    const rawUsers = localStorage.getItem('finanzas_users');
    const users = rawUsers ? JSON.parse(rawUsers) : {};
    users[currentUser.email.toLowerCase().trim()] = updated;
    localStorage.setItem('finanzas_users', JSON.stringify(users));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  // Load session from sessionStorage to preserve across hot-reloads
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('finanzas_active_user');
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('finanzas_active_user', JSON.stringify(user));
    setWelcomeAlert(true);
    // Dismiss welcome float after 4s
    setTimeout(() => {
      setWelcomeAlert(false);
    }, 4500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('finanzas_active_user');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    sessionStorage.setItem('finanzas_active_user', JSON.stringify(updatedUser));
  };

  const handleAddPoints = (amount: number) => {
    if (!currentUser) return;
    
    const updated: User = {
      ...currentUser,
      progress: {
        ...currentUser.progress,
        points: currentUser.progress.points + amount
      }
    };
    
    handleUpdateUser(updated);

    // Persist to local storage database
    const rawUsers = localStorage.getItem('finanzas_users');
    const users = rawUsers ? JSON.parse(rawUsers) : {};
    users[currentUser.email.toLowerCase().trim()] = updated;
    localStorage.setItem('finanzas_users', JSON.stringify(users));
  };

  const handleResetProgress = () => {
    if (!currentUser) return;

    const resetUser: User = {
      ...currentUser,
      progress: {
        completedModules: [],
        points: 0,
        quizHighScore: 0,
        completedQuiz: false,
        budgetIncome: 0,
        budgetExpenses: []
      }
    };

    handleUpdateUser(resetUser);

    const rawUsers = localStorage.getItem('finanzas_users');
    const users = rawUsers ? JSON.parse(rawUsers) : {};
    users[currentUser.email.toLowerCase().trim()] = resetUser;
    localStorage.setItem('finanzas_users', JSON.stringify(users));

    alert('¡Tu avance práctico ha sido reestablecido con éxito!');
  };

  // Compute stats for progress bar
  const completedCount = currentUser?.progress.completedModules.length || 0;
  const progressPercent = Math.round((completedCount / 4) * 100);

  // If user is not logged in, render the login/register workspace
  if (!currentUser) {
    return (
      <div className="font-sans antialiased text-slate-800 bg-brand-bg min-h-screen flex items-center justify-center">
        <LoginRegister onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-slate-900 bg-brand-bg min-h-screen flex flex-col md:flex-row relative">
      
      {/* Welcome Notification Float Toast */}
      {welcomeAlert && (
        <div 
          className="fixed top-20 right-6 z-50 bg-slate-950 text-white p-4 rounded-lg shadow-lg border border-slate-800 max-w-sm flex items-start gap-3 animate-[slide-in_0.3s_ease-out_forwards] text-left" 
          id="welcome-toast"
        >
          <div className="w-8 h-8 rounded-full bg-brand-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">
            ✓
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold font-mono tracking-widest text-brand-secondary uppercase">Acceso Autorizado</h4>
            <p className="text-xs text-slate-350">Bienvenido(a) de nuevo, <strong>{currentUser.username}</strong>. Tu progreso local ha sido cargado con éxito.</p>
          </div>
        </div>
      )}

      {/* Side Navigation Bar - Collapses fully on mobile */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-white border-r border-slate-200 w-[280px] flex flex-col justify-between pt-16 transition-transform duration-350 ${
          mobileMenuOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full md:translate-x-0'
        }`}
        id="side-bar"
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center -ml-1 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
              <img 
                src={logoImage} 
                alt="Logo Finanzas para la vida" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-950 leading-none">Finanzas para la vida</h2>
              <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mt-1">VLE Dashboard</p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Items */}
        <nav className="flex-1 space-y-1 px-4 text-left">
          <button
            onClick={() => {
              setActiveTab('inicio');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded text-xs font-bold transition duration-150 cursor-pointer ${
              activeTab === 'inicio' 
                ? 'border-l-4 border-brand-secondary bg-slate-100 text-slate-950' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" /> Inicio
          </button>

          <button
            onClick={() => {
              setActiveTab('teoria');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded text-xs font-bold transition duration-150 cursor-pointer ${
              activeTab === 'teoria' 
                ? 'border-l-4 border-brand-secondary bg-slate-100 text-slate-950' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Teoría Financiera
          </button>

          <button
            onClick={() => {
              setActiveTab('practica');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded text-xs font-bold transition duration-150 cursor-pointer ${
              activeTab === 'practica' 
                ? 'border-l-4 border-brand-secondary bg-slate-100 text-slate-950' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Edit2 className="w-4 h-4" /> Sección de Práctica
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              setMobileMenuOpen(false);
              try {
                window.open('https://eva-finanzas-1.onrender.com/', '_blank');
              } catch (e) {
                // Ignore popup blocking errors
              }
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded text-xs font-bold transition duration-150 cursor-pointer ${
              activeTab === 'quiz' 
                ? 'border-l-4 border-brand-secondary bg-slate-100 text-slate-950' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" /> Ponte a prueba
          </button>
        </nav>

        {/* Bottom Panel of the sidebar */}
        <div className="p-6 border-t border-slate-100">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  setActiveTab('configuracion');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold font-sans transition ${
                  activeTab === 'configuracion'
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" /> Configuración
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-800 rounded text-xs font-bold transition"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content viewport block */}
      <main className="flex-1 min-h-screen flex flex-col justify-between">
        
        {/* Top bar header */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 md:hidden text-slate-600 hover:bg-slate-50 rounded"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-sans font-extrabold text-slate-950 text-base">Finanzas para la vida</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded">
              Línea: {currentUser.progress.points} XP
            </span>

            <button
              onClick={() => alert('No tienes notificaciones pendientes. Tu base de datos local está al día.')}
              className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full cursor-pointer transition active:scale-95 duration-150"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={() => alert(`Finanzas para la vida - VLE Dashboard. Correo activo local: ${currentUser.email}`)}
              className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full cursor-pointer transition active:scale-95 duration-150"
              title="Información"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Profile dropdown wrapper */}
            <div className="relative" id="profile-dropdown-container">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9 h-9 rounded-full border-2 border-slate-200 hover:border-brand-secondary bg-slate-100 overflow-hidden select-none flex-shrink-0 cursor-pointer transition focus:outline-none flex items-center justify-center p-0"
                title="Menú de Usuario"
                id="profile-avatar-btn"
              >
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa6eTzSroUF5OWgZaHEoLHpYnHlZMzrdBEpVRJghvnXAoRp1QMKbhEXdL24KZEZfp9HYGiQPIi6CB245mqu0diJS3joAVt53v_2F55UPrYhK0upCZpS9majL30fqXn6IPnL0q_6Q28dOCJBO7sr-hSR2bzFPCIYiW6lYMo2AOXulT60euNfHITnoFUEjGySkzhz3Xopdv8nMoB9mqYC3fqxR56iDIj8nEdqL1D0VUJpCnoI0uy0TjPxNXpl5fZas_vWwt4nsFVZ4C4" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              {profileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-5 z-50 space-y-4 text-left"
                  id="profile-dropdown-menu"
                >
                  {/* Dropdown Header */}
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Mi Perfil Académico</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 break-all">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => setProfileMenuOpen(false)}
                      className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition"
                      title="Cerrar menú"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Edit Name Form */}
                  <form onSubmit={handleSaveProfile} className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-600 block" htmlFor="profile-username-input">
                      Editar Nombre
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="profile-username-input"
                        type="text"
                        className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-brand-secondary focus:outline-none"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Tu Nombre"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-brand-secondary hover:bg-[#005236] text-white text-xs font-bold rounded transition cursor-pointer"
                      >
                        {saveSuccess ? '¡Listo!' : 'Guardar'}
                      </button>
                    </div>
                  </form>

                  {/* Brief Performance summary */}
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Resumen de Desempeño</span>
                    
                    <div className="grid grid-cols-2 gap-2.5 text-center">
                      <div className="bg-white p-2 rounded border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Racha/Puntos</span>
                        <span className="text-sm font-black text-brand-secondary font-mono block">{currentUser.progress.points} XP</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Máximo Quiz</span>
                        <span className="text-sm font-black text-slate-800 font-mono block">{currentUser.progress.quizHighScore} XP</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Módulos Completados:</span>
                        <span className="font-bold text-slate-900">{completedCount} de 4</span>
                      </div>
                      
                      {/* Completed Modules list mini tags */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold block ${
                          currentUser.progress.completedModules.includes('presupuesto')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          Presupuesto
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold block ${
                          currentUser.progress.completedModules.includes('ahorro')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          Ahorro
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold block ${
                          currentUser.progress.completedModules.includes('deuda')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          Deuda
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold block ${
                          currentUser.progress.completedModules.includes('emergencia')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          F. Emergencia
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions inside menu */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 text-xs font-bold rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
                      id="dropdown-logout-btn"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Contents Container */}
        <div className="p-6 md:p-10 flex-1 w-full max-w-7xl mx-auto space-y-6">
          
          {activeTab === 'inicio' && (
            <InicioContent user={currentUser} onNavigate={setActiveTab} />
          )}

          {activeTab === 'teoria' && (
            <TeoriaContent user={currentUser} onAddPoints={handleAddPoints} />
          )}

          {activeTab === 'practica' && (
            <PracticaContent user={currentUser} onUpdateUser={handleUpdateUser} />
          )}

          {activeTab === 'quiz' && (
            <QuizContent user={currentUser} onUpdateUser={handleUpdateUser} />
          )}

          {activeTab === 'configuracion' && (
            <ConfigContent 
              user={currentUser} 
              onLogout={handleLogout} 
              onResetProgress={handleResetProgress} 
            />
          )}

        </div>

        {/* Footer */}
        <footer className="bg-slate-100 border-t border-slate-200 py-6 px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-4 md:mb-0 text-center md:text-left">
            <span className="font-bold text-slate-900">Finanzas para la vida</span>
            <span>© 2026 Finanzas para la vida. Todos los derechos reservados.</span>
          </div>

          <div className="flex gap-4">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Todos tus datos de privacidad permanecen en el LocalStorage de este navegador.'); }}
              className="hover:text-slate-900 transition"
            >
              Privacidad
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Uso educativo sin fin comercial o transaccional real.'); }}
              className="hover:text-slate-900 transition"
            >
              Términos
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert(`Soporte VLE offline. Correo: ${currentUser.email}`); }}
              className="hover:text-slate-900 transition"
            >
              Contacto
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
}
