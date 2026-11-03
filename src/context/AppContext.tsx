import React, { createContext, useContext, useState, useEffect } from 'react';
import { Brand, ContentItem, TeamMember } from '../types/content';
import { INITIAL_BRANDS, INITIAL_CONTENTS, INITIAL_TEAM } from '../data/initialData';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  syncContentToGoogleCalendar,
} from '../services/googleCalendar';
import { User } from 'firebase/auth';

interface AppContextType {
  brands: Brand[];
  activeBrand: Brand;
  setActiveBrandId: (id: string) => void;
  contents: ContentItem[];
  brandContents: ContentItem[];
  addContent: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => ContentItem;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  duplicateContent: (id: string) => void;
  team: TeamMember[];
  inviteTeamMember: (name: string, email: string, role: TeamMember['role']) => void;
  googleUser: User | null;
  googleToken: string | null;
  isConnectingGoogle: boolean;
  connectGoogleCalendar: () => Promise<void>;
  disconnectGoogleCalendar: () => Promise<void>;
  syncContentItemToCalendar: (content: ContentItem) => Promise<{ success: boolean; eventId?: string }>;
  exportCSV: () => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands] = useState<Brand[]>(INITIAL_BRANDS);
  const [activeBrandId, setActiveBrandId] = useState<string>(() => {
    return localStorage.getItem('maul_active_brand_id') || INITIAL_BRANDS[0].id;
  });

  const [contents, setContents] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('maul_contents_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved contents', e);
      }
    }
    return INITIAL_CONTENTS;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('maul_team_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved team', e);
      }
    }
    return INITIAL_TEAM;
  });

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('maul_active_brand_id', activeBrandId);
  }, [activeBrandId]);

  useEffect(() => {
    localStorage.setItem('maul_contents_db', JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem('maul_team_db', JSON.stringify(team));
  }, [team]);

  // Init Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
  const brandContents = contents.filter((c) => c.brandId === activeBrandId);

  const addContent = (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...item,
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: now.split('T')[0],
      updatedAt: now.split('T')[0],
    };
    setContents((prev) => [newItem, ...prev]);
    showNotification(`Konten "${newItem.title || newItem.hookText}" berhasil ditambahkan ke database!`);
    return newItem;
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setContents((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    showNotification('Data konten berhasil diperbarui');
  };

  const deleteContent = (id: string) => {
    setContents((prev) => prev.filter((item) => item.id !== id));
    showNotification('Konten berhasil dihapus dari database', 'info');
  };

  const duplicateContent = (id: string) => {
    const target = contents.find((c) => c.id === id);
    if (!target) return;
    const now = new Date().toISOString().split('T')[0];
    const duplicated: ContentItem = {
      ...target,
      id: `content-${Date.now()}`,
      title: `${target.title} (Salinan)`,
      status: 'Ideation',
      approvalStatus: 'Draft',
      googleCalendarEventId: undefined,
      googleCalendarLink: undefined,
      createdAt: now,
      updatedAt: now,
    };
    setContents((prev) => [duplicated, ...prev]);
    showNotification(`Salinan konten "${target.title}" dibuat`);
  };

  const inviteTeamMember = (name: string, email: string, role: TeamMember['role']) => {
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name,
      email,
      role,
      avatarInitials: initials || 'TM',
      assignedCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setTeam((prev) => [...prev, newMember]);
    showNotification(`Undangan terkirim ke ${email} sebagai ${role}`);
  };

  const connectGoogleCalendar = async () => {
    setIsConnectingGoogle(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        showNotification(`Terhubung ke Google Calendar: ${res.user.email}`);
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Gagal login ke Google', 'error');
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setGoogleToken(null);
      showNotification('Koneksi Google Calendar terputus', 'info');
    } catch (err: any) {
      console.error(err);
    }
  };

  const syncContentItemToCalendar = async (content: ContentItem) => {
    if (!googleToken) {
      await connectGoogleCalendar();
    }
    const res = await syncContentToGoogleCalendar({
      id: content.id,
      title: content.title,
      hookText: content.hookText,
      visualAngle: content.visualAngle,
      scriptText: content.scriptText,
      caption: content.caption,
      platform: content.platform,
      pillar: content.pillar,
      funnel: content.funnel,
      publishDate: content.publishDate,
      publishTime: content.publishTime,
    });

    if (res.success && res.eventId) {
      updateContent(content.id, {
        googleCalendarEventId: res.eventId,
        googleCalendarLink: res.htmlLink,
      });
      showNotification(`Jadwal konten tersinkron ke Google Calendar!`);
      return { success: true, eventId: res.eventId };
    }
    return { success: false };
  };

  const exportCSV = () => {
    const headers = [
      'ID',
      'Judul Konten',
      'Platform',
      'Format',
      'Pilar Konten',
      'Funnel Marketing',
      'Status Produksi',
      'Status Approval',
      'Jadwal Publikasi Utama',
      'Jam Tayang',
      'Jadwal Instagram',
      'Jadwal TikTok',
      'Jadwal YT Shorts',
      'Jadwal YouTube',
      'PIC Nama',
      'PIC Email',
      'Hook Naskah',
      'Arahan Visual Angle',
      'Hashtags',
      'Tayangan (Views)',
      'Likes',
      'Shares',
      'Saves',
    ];

    const rows = brandContents.map((c) => [
      c.id,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      c.platform,
      c.format,
      `"${(c.pillar || '').replace(/"/g, '""')}"`,
      c.funnel,
      c.status,
      c.approvalStatus,
      c.publishDate,
      c.publishTime || '',
      c.platformSchedules?.instagram?.date ? `"${c.platformSchedules.instagram.date} ${c.platformSchedules.instagram.time || ''}"` : '',
      c.platformSchedules?.tiktok?.date ? `"${c.platformSchedules.tiktok.date} ${c.platformSchedules.tiktok.time || ''}"` : '',
      c.platformSchedules?.youtubeShorts?.date ? `"${c.platformSchedules.youtubeShorts.date} ${c.platformSchedules.youtubeShorts.time || ''}"` : '',
      c.platformSchedules?.youtube?.date ? `"${c.platformSchedules.youtube.date} ${c.platformSchedules.youtube.time || ''}"` : '',
      `"${(c.pic?.name || '').replace(/"/g, '""')}"`,
      c.pic?.email || '',
      `"${(c.hookText || '').replace(/"/g, '""')}"`,
      `"${(c.visualAngle || '').replace(/"/g, '""')}"`,
      `"${(c.hashtags || []).join(' ')}"`,
      c.metrics?.views || 0,
      c.metrics?.likes || 0,
      c.metrics?.shares || 0,
      c.metrics?.saves || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Konten_${activeBrand.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('File CSV berhasil diunduh!');
  };

  return (
    <AppContext.Provider
      value={{
        brands,
        activeBrand,
        setActiveBrandId,
        contents,
        brandContents,
        addContent,
        updateContent,
        deleteContent,
        duplicateContent,
        team,
        inviteTeamMember,
        googleUser,
        googleToken,
        isConnectingGoogle,
        connectGoogleCalendar,
        disconnectGoogleCalendar,
        syncContentItemToCalendar,
        exportCSV,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
