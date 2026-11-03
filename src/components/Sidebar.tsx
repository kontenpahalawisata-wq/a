import React from 'react';
import {
  LayoutDashboard,
  Database,
  KanbanSquare,
  Calendar,
  Sparkles,
  Bot,
  BarChart3,
  Users,
  CalendarCheck,
  ChevronDown,
  LogOut,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ActiveView =
  | 'dashboard'
  | 'content-db'
  | 'kanban'
  | 'calendar'
  | 'ai-extractor'
  | 'maul-ai'
  | 'analytics'
  | 'team';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenNewContentModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenNewContentModal,
}) => {
  const {
    brands,
    activeBrand,
    setActiveBrandId,
    googleUser,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    isConnectingGoogle,
    brandContents,
  } = useApp();

  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = React.useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Studio Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'content-db',
      label: 'Content Database',
      icon: <Database className="w-4 h-4" />,
      badge: brandContents.length,
    },
    {
      id: 'kanban',
      label: 'Produksi Konten',
      icon: <KanbanSquare className="w-4 h-4" />,
    },
    {
      id: 'calendar',
      label: 'Kalender Konten',
      icon: <Calendar className="w-4 h-4" />,
      badge: brandContents.filter((c) => c.status === 'Scheduled').length || undefined,
    },
    {
      id: 'ai-extractor',
      label: 'AI Extractor',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'maul-ai',
      label: 'Maul AI Assistant',
      icon: <Bot className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analitik & Report',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'team',
      label: 'Tim & PIC',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-[#090D16] border-r border-slate-800/80 flex flex-col shrink-0 select-none h-screen sticky top-0">
      {/* Brand & Studio Lockup */}
      <div className="p-4 border-b border-slate-800/60">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-sm shadow-indigo-500/20">
              M
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                Maul Head of Sosmed
              </h1>
              <p className="text-[11px] text-slate-400">Content Operating System</p>
            </div>
          </div>
        </div>

        {/* Multi-Brand Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: activeBrand.color }}
              >
                {activeBrand.logoInitial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{activeBrand.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{activeBrand.handle}</p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isBrandDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-1 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl z-50">
              <p className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Ganti Brand Aktif
              </p>
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => {
                    setActiveBrandId(brand.id);
                    setIsBrandDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                    brand.id === activeBrand.id
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.logoInitial}
                  </span>
                  <span className="truncate">{brand.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-3 pt-3 pb-2">
        <button
          type="button"
          onClick={onOpenNewContentModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Konten Baru</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800/90 text-white border border-slate-700/60 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Google Calendar Integration Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Calendar</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                googleUser
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {googleUser ? 'Tersambung' : 'Belum Sync'}
            </span>
          </div>

          {googleUser ? (
            <div className="space-y-1.5">
              <p className="text-[11px] text-slate-400 truncate">{googleUser.email}</p>
              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Buka Kalender <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  type="button"
                  onClick={disconnectGoogleCalendar}
                  className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="w-2.5 h-2.5" /> Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isConnectingGoogle}
              onClick={connectGoogleCalendar}
              className="mt-1 w-full py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>{isConnectingGoogle ? 'Menghubungkan...' : 'Hubungkan Kalender'}</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
