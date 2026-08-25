import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from '@/types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user as any);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as any);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
}

export function useCountry() {
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setCountry(data.country_code);
      } catch (error) {
        console.error('Failed to detect country:', error);
        setCountry('BR'); // Default to Brazil
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { country, loading };
}

export function useLanguage() {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['pt', 'en', 'es', 'fr', 'de', 'it'];

    if (supportedLanguages.includes(browserLanguage)) {
      setLanguage(browserLanguage);
    }
  }, []);

  return { language, setLanguage };
}
