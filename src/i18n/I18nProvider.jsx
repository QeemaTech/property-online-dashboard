import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { updatePreferences } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enLayout from './locales/en/layout.json';
import enResources from './locales/en/resources.json';
import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arLayout from './locales/ar/layout.json';
import arResources from './locales/ar/resources.json';

const dictionaries = {
  EN: { common: enCommon, auth: enAuth, layout: enLayout, resources: enResources },
  AR: { common: arCommon, auth: arAuth, layout: arLayout, resources: arResources },
};

const directions = {
  EN: 'ltr',
  AR: 'rtl',
};

const locales = {
  EN: 'en-US',
  AR: 'ar-EG',
};

const I18nContext = createContext(null);

function getPath(source, path) {
  return path.split('.').reduce((value, segment) => value?.[segment], source);
}

function interpolate(value, params = {}) {
  if (typeof value !== 'string') return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? '');
}

export function I18nProvider({ children }) {
  const { admin, updateAdmin } = useAuth();
  const [language, setLanguageState] = useState('EN');
  const direction = directions[language] || 'ltr';
  const locale = locales[language] || locales.EN;

  useEffect(() => {
    if (admin?.language && admin.language !== language) {
      setLanguageState(admin.language);
    }
  }, [admin?.language, language]);

  useEffect(() => {
    document.documentElement.lang = language === 'AR' ? 'ar' : 'en';
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [language, direction]);

  const t = (key, params) => {
    const [namespace, ...rest] = key.split('.');
    const path = rest.join('.');
    const value =
      getPath(dictionaries[language]?.[namespace], path) ??
      getPath(dictionaries.EN?.[namespace], path) ??
      key;

    return interpolate(value, params);
  };

  const setLanguage = async (nextLanguage) => {
    if (!dictionaries[nextLanguage] || nextLanguage === language) return;

    if (!admin) {
      setLanguageState(nextLanguage);
      return;
    }

    try {
      const res = await updatePreferences({ language: nextLanguage });
      updateAdmin(res.data.data);
      setLanguageState(nextLanguage);
    } catch {
      toast.error(t('common.errors.languageUpdateFailed'));
    }
  };

  const localizedField = (item, base = 'name') => {
    if (!item) return '';
    const primary = language === 'AR' ? `${base}Ar` : `${base}En`;
    const fallback = language === 'AR' ? `${base}En` : `${base}Ar`;
    return item[primary] || item[fallback] || item[base] || '';
  };

  const formatDate = (value, options) => {
    if (!value) return '-';
    return new Intl.DateTimeFormat(locale, options).format(new Date(value));
  };

  const formatNumber = (value, options) => {
    if (value === null || value === undefined || value === '') return '-';
    return new Intl.NumberFormat(locale, options).format(Number(value));
  };

  const formatCurrency = (value, currency = 'EGP') => (
    formatNumber(value, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    })
  );

  const value = {
    language,
    locale,
    direction,
    isRtl: direction === 'rtl',
    setLanguage,
    t,
    localizedField,
    formatDate,
    formatNumber,
    formatCurrency,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
