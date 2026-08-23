import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { I18n } from 'i18n-js';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import en from './en.json';
import es from './es.json';

export const i18n = new I18n({ es, en });

const LOCALE_STORAGE_KEY = 'app_locale';

const rawLocale = getLocales()[0]?.languageCode ?? 'es';
const initialLocale = rawLocale.startsWith('en') ? 'en' : 'es';

i18n.enableFallback = true;
i18n.defaultLocale = 'es';
i18n.locale = initialLocale;

type LanguageContextType = {
    locale: string;
    changeLanguage: (lang: string) => void;
    toggleLanguage: () => void;
    t: (key: string, options?: Record<string, unknown>) => string;
};

const LanguageContext = createContext<LanguageContextType>({
    locale: initialLocale,
    changeLanguage: () => {},
    toggleLanguage: () => {},
    t: (key: string) => i18n.t(key),
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState(initialLocale);

    useEffect(() => {
        SecureStore.getItemAsync(LOCALE_STORAGE_KEY).then((saved) => {
            if (saved === 'en' || saved === 'es') {
                setLocale(saved);
            }
        });
    }, []);

    const changeLanguage = (newLang: string) => {
        const cleanLang = newLang.startsWith('en') ? 'en' : 'es';
        i18n.locale = cleanLang;
        setLocale(cleanLang);
        SecureStore.setItemAsync(LOCALE_STORAGE_KEY, cleanLang).catch(() => {});
    };

    const toggleLanguage = () => {
        const nextLang = locale === 'es' ? 'en' : 'es';
        changeLanguage(nextLang);
    };

    const contextValue = useMemo(() => {
        i18n.locale = locale;
        return {
            locale,
            changeLanguage,
            toggleLanguage,
            t: (key: string, options?: Record<string, unknown>) => {
                i18n.locale = locale; 
                return i18n.t(key, options);
            },
        };
    }, [locale]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);