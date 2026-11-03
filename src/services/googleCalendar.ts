/**
 * Google Calendar & Firebase Auth Client Service
 * Complies with workspace-integration rules:
 * - Scopes: https://www.googleapis.com/auth/calendar.events
 * - In-memory access token caching only (no localStorage/sessionStorage for tokens)
 * - User confirmation required for mutating calendar events
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token will be refreshed on interactive action
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan access token dari Google Provider');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in Google Calendar error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
}

export const syncContentToGoogleCalendar = async (
  content: {
    id: string;
    title: string;
    hookText: string;
    visualAngle?: string;
    scriptText?: string;
    caption?: string;
    platform: string;
    pillar: string;
    funnel: string;
    publishDate: string;
    publishTime?: string;
  }
): Promise<{ success: boolean; eventId?: string; htmlLink?: string; error?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Anda belum terhubung ke Google Calendar. Silakan login terlebih dahulu.');
  }

  const timeStr = content.publishTime || '10:00';
  const startDateTime = `${content.publishDate}T${timeStr}:00+07:00`;
  // Default duration 30 minutes
  const [hourStr, minStr] = timeStr.split(':');
  const endHour = (parseInt(hourStr, 10) + 1).toString().padStart(2, '0');
  const endDateTime = `${content.publishDate}T${endHour}:${minStr}:00+07:00`;

  const description = `[MAUL HEAD OF SOSMED - KONTEN JADWAL]
Platform: ${content.platform}
Pilar: ${content.pillar}
Funnel: ${content.funnel}
Hook: ${content.hookText}
Visual Angle: ${content.visualAngle || '-'}

Naskah:
${content.scriptText || '-'}

Caption:
${content.caption || '-'}
`;

  const eventPayload = {
    summary: `[${content.platform}] ${content.title || content.hookText}`,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Jakarta',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Jakarta',
    },
    colorId: content.platform === 'Semua Platform' ? '9' : content.platform === 'TikTok' ? '11' : content.platform === 'Instagram' ? '6' : content.platform === 'YouTube' ? '11' : '8',
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'popup', minutes: 120 },
      ],
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Gagal menyinkronkan event ke Google Calendar');
  }

  const created = await response.json();
  return { success: true, eventId: created.id, htmlLink: created.htmlLink };
};
