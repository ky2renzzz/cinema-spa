import React from 'react';
import { ShieldCheck, Play, Database, Server, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-zinc-800/80 bg-zinc-950/90 text-zinc-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Server className="w-4 h-4 text-red-500" />
              <span>Без собственного бэкенда</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Сайт работает исключительно на стороне клиента (SPA). Запросы происходят напрямую в публичные API Кинопоиска и TMDB.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Play className="w-4 h-4 text-amber-500" />
              <span>Балансеры и CDN плееры</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Видео не хранится на серверах сайта. Iframe плееры подгружают видеофайлы, озвучки (Дубляж, HDRezka) и качества с Kollam, Collaps, Alloha и SvCDN.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Бесплатный хостинг за 1 мин</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Так как базу данных поддерживать не нужно, данный проект можно запустить бесплатно на GitHub Pages, Netlify или Vercel.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>CINEMA-SPA — Фронтенд видеосервис для просмотра фильмов и сериалов</span>
          </div>
          <p className="font-mono">
            Pure Frontend • React & Tailwind • Free CDN Embeds
          </p>
        </div>

      </div>
    </footer>
  );
};
