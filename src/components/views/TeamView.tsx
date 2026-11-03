import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Layers,
  CheckCircle2,
  Calendar,
  Send,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeamMember } from '../../types/content';

export const TeamView: React.FC = () => {
  const { team, inviteTeamMember, brandContents, showNotification } = useApp();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Scriptwriter');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) {
      showNotification('Mohon lengkapi nama dan email anggota tim', 'error');
      return;
    }

    inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">Manajemen Tim & Penugasan PIC</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Undang anggota tim kreatif menggunakan email agar bisa ditetapkan sebagai Penanggung Jawab (PIC) untuk setiap materi konten yang dibuat.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Undang Anggota Tim</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => {
          const assignedCount = brandContents.filter(
            (c) => c.pic?.email === member.email
          ).length;

          return (
            <div
              key={member.id}
              className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                    {member.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                    <span className="text-[11px] font-medium text-indigo-400">{member.role}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px]">Bergabung: {member.joinedAt}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Tugas Konten Aktif:</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {assignedCount} Konten
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Undang Tim Kreatif</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Contoh: Rian Anggara"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Alamat Email * (Untuk PIC & Notifikasi)
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="rian.editor@gmail.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Peran / Tanggung Jawab Utama
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Scriptwriter">Scriptwriter (Penulis Naskah)</option>
                  <option value="Talent / Shooter">Talent / Shooter (Syuting)</option>
                  <option value="Video Editor">Video Editor (Penyunting Video)</option>
                  <option value="Creative Strategist">Creative Strategist</option>
                  <option value="Head of Sosmed">Head of Sosmed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Undangan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
