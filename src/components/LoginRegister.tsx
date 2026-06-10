/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, UserProgress } from '../types';
import { ShieldCheck, User as UserIcon, Mail, Lock, ShieldAlert, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import logoImage from '../assets/images/finance_logo_1781058553440.png';

interface LoginRegisterProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginRegister({ onLoginSuccess }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Alert & feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [welcomeUser, setWelcomeUser] = useState<string | null>(null);

  // Initialize with some default users in LocalStorage if empty
  useEffect(() => {
    const existingUsers = localStorage.getItem('finanzas_users');
    if (!existingUsers) {
      const defaultUsers: Record<string, User> = {
        'demo@finanzas.com': {
          username: 'Estudiante Financiero',
          email: 'demo@finanzas.com',
          password: 'password123',
          progress: {
            completedModules: ['presupuesto'],
            points: 10,
            quizHighScore: 0,
            completedQuiz: false,
            budgetIncome: 2000,
            budgetExpenses: [
              { id: '1', category: 'needs', name: 'Alquiler', amount: 800 },
              { id: '2', category: 'needs', name: 'Servicios Básicos', amount: 200 },
              { id: '3', category: 'wants', name: 'Suscripciones y entretención', amount: 300 },
              { id: '4', category: 'savings', name: 'Fondo de Retiro', amount: 400 }
            ]
          }
        }
      };
      localStorage.setItem('finanzas_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }

    const rawUsers = localStorage.getItem('finanzas_users');
    const users: Record<string, User> = rawUsers ? JSON.parse(rawUsers) : {};

    // Find user by email
    const user = users[email.toLowerCase().trim()];

    if (!user || user.password !== password) {
      setError('Correo electrónico o contraseña incorrectos.');
      return;
    }

    // Login successful
    setWelcomeUser(user.username);
    setSuccess(`¡Bienvenido de nuevo, ${user.username}!`);
    
    // Play a brief visual transition, then call callbacks
    setTimeout(() => {
      onLoginSuccess(user);
    }, 1800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor complete todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un correo electrónico válido.');
      return;
    }

    const rawUsers = localStorage.getItem('finanzas_users');
    const users: Record<string, User> = rawUsers ? JSON.parse(rawUsers) : {};

    const normalizedEmail = email.toLowerCase().trim();
    if (users[normalizedEmail]) {
      setError('El correo electrónico ya está registrado.');
      return;
    }

    // Creative baseline progress structure
    const initialProgress: UserProgress = {
      completedModules: [],
      points: 0,
      quizHighScore: 0,
      completedQuiz: false,
      budgetIncome: 0,
      budgetExpenses: []
    };

    const newUser: User = {
      username: username.trim(),
      email: normalizedEmail,
      password: password,
      progress: initialProgress
    };

    users[normalizedEmail] = newUser;
    localStorage.setItem('finanzas_users', JSON.stringify(users));

    setSuccess('¡Registro completado con éxito! Iniciando sesión...');
    setWelcomeUser(newUser.username);

    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1800);
  };

  const useDemoAccount = () => {
    setEmail('demo@finanzas.com');
    setPassword('password123');
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]" id="login-container">
        
        {/* Visual Brand Panel with Financial Accents */}
        <div className="w-full md:w-1/2 bg-brand-primary text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden" id="brand-panel">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/60 via-slate-950 to-black z-0"></div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-xs mb-8">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center -ml-1 rounded-full overflow-hidden border border-slate-700/50 bg-slate-900/50 shadow-inner">
                <img 
                  src={logoImage} 
                  alt="Logo Finanzas para la vida" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-sans font-bold tracking-tight text-xl text-white">Finanzas para la vida</span>
            </div>
            
            <div className="space-y-6 mt-12">
              <span className="inline-block px-3 py-1 bg-brand-secondary/30 text-brand-secondary text-xs rounded-full font-mono font-bold tracking-wide uppercase border border-brand-secondary/40">
                VLE Educativo
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Toma el control absoluto de tu futuro financiero
              </h1>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                Aprende con simulaciones interactivas basadas en casos de la vida real. Calcula presupuestos, analiza inversiones, y domina tus deudas de manera práctica y divertida.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 xl:mt-0 pt-8 border-t border-slate-800">
            <div className="flex items-start gap-4">
              <div className="bg-brand-secondary/20 p-2 rounded text-brand-secondary mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Privacidad Local Garantizada</p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                  Tu progreso, presupuestos y contraseñas se almacenan de manera 100% local en tu navegador mediante LocalStorage. Sin servidores ni cookies externas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative" id="auth-panel">
          
          {/* Success / Welcome Message Block (Hiding or transforming form smoothly) */}
          {welcomeUser ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-12"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-brand-secondary animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary">Sesión Iniciada Localmente</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  ¡Hola, {welcomeUser}!
                </h2>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Cargando tus progresos y simuladores financieros interactivos...
                </p>
              </div>
              <div className="w-32 bg-slate-100 h-1.5 rounded-full mx-auto overflow-hidden">
                <div className="bg-brand-secondary h-full rounded-full animate-[progress_1.6s_ease-out_forwards]" style={{ width: '100%' }}></div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Toggle controls */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    isLogin 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    !isLogin 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                >
                  Registrarse
                </button>
              </div>

              {/* Title Header */}
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {isLogin ? 'Accede a tu Cuenta' : 'Crea tu Cuenta'}
                </h2>
                <p className="text-sm text-slate-500">
                  {isLogin 
                    ? 'Ingresa tus credenciales del navegador para continuar practicando.' 
                    : 'Regístrate localmente para almacenar tus datos de presupuesto.'}
                </p>
              </div>

              {/* Error Alert Info Block */}
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2.5 text-xs text-left border border-red-200">
                  <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Forms */}
              <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                
                {/* User Name field for Register only */}
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block" htmlFor="username">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email address field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block" htmlFor="email">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block" htmlFor="password">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Repeat Password field for Register only */}
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block" htmlFor="confirmPassword">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  id="submit-auth-btn"
                  type="submit"
                  className="w-full py-2.5 bg-brand-secondary hover:bg-[#005236] text-white font-bold text-sm rounded transition cursor-pointer flex items-center justify-center gap-1 shadow-sm mt-6 hover:opacity-95"
                >
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>
              </form>

              {/* Demo Account shortcut */}
              <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
                <p className="text-xs text-slate-400">¿Quieres probar rápido sin registrarte?</p>
                <button
                  type="button"
                  onClick={useDemoAccount}
                  className="text-xs text-brand-secondary font-mono font-semibold px-2 py-1.5 bg-slate-50 border border-brand-secondary/35 rounded hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Usar cuenta demo rápida
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
