import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../services/storageService';
import { X, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form
  const [role, setRole] = useState<'student' | 'tutor'>('tutor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [regError, setRegError] = useState<string | null>(null);

  // Sync activeTab with initialTab whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setLoginError(null);
      setRegError(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = storage.login(loginEmail, loginPass);
    if (result.success && result.user) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setLoginError(result.error || 'Ошибка входа');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !pass.trim()) {
      setRegError('Заполните все поля');
      return;
    }

    const result = storage.registerUser({
      name: name.trim(),
      email: email.trim(),
      password: pass.trim(),
      phone: phone.trim(),
      role
    });

    if (result.success && result.user) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setRegError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-xs">
        
        {/* Header */}
        <div className="bg-[#0a0a0a] px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            {activeTab === 'login' ? 'Вход в аккаунт' : 'Регистрация аккаунта'}
          </h3>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#171717] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Tabs */}
        <div className="flex border-b border-neutral-800 bg-[#0a0a0a] p-1 gap-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Вход</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Регистрация</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {loginError && (
                <div className="p-2.5 rounded-lg bg-[#171717] border border-red-500/40 text-red-400 font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="text-neutral-300 font-medium mb-1 block">
                  Email адрес *:
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@domain.az"
                  className="w-full input-clean px-3 py-2"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium mb-1 block">
                  Пароль *:
                </label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full input-clean px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-white text-black hover:bg-neutral-200 transition-all mt-2"
              >
                Войти
              </button>
            </form>
          )}

          {/* REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {regError && (
                <div className="p-2.5 rounded-lg bg-[#171717] border border-red-500/40 text-red-400 font-medium">
                  {regError}
                </div>
              )}

              {/* Role Toggle */}
              <div>
                <label className="text-neutral-300 font-medium mb-1 block">
                  Тип аккаунта:
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0a0a0a] rounded-xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setRole('tutor')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      role === 'tutor' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    👨‍🏫 Я репетитор
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      role === 'student' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    🎒 Я ученик
                  </button>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium mb-1 block">
                  ФИО *:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя Фамилия"
                  className="w-full input-clean px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-medium mb-1 block">
                    Email *:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.az"
                    className="w-full input-clean px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-medium mb-1 block">
                    Пароль *:
                  </label>
                  <input
                    type="password"
                    required
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full input-clean px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium mb-1 block">
                  Телефон / WhatsApp *:
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+994 50 123 45 67"
                  className="w-full input-clean px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-white text-black hover:bg-neutral-200 transition-all mt-2"
              >
                Зарегистрироваться
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
