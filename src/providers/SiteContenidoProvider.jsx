import { createContext, useContext, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { APP_CONSTANTS } from '../constants/constants.js';
import * as siteContenidoService from '../services/siteContenidoService.js';
import { buildSiteContenido } from '../utils/mergeSiteContenido.js';
import { applyBrandingTheme } from '../utils/applyBrandingTheme.js';

const SiteContenidoContext = createContext(null);

export function SiteContenidoProvider({ children }) {
  const brandingQuery = useQuery({
    queryKey: ['site', 'branding'],
    queryFn: siteContenidoService.obtenerBranding,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const contactoQuery = useQuery({
    queryKey: ['site', 'contacto'],
    queryFn: siteContenidoService.obtenerContacto,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const mediaQuery = useQuery({
    queryKey: ['site', 'media'],
    queryFn: siteContenidoService.obtenerMedia,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const redesQuery = useQuery({
    queryKey: ['site', 'redes'],
    queryFn: siteContenidoService.obtenerRedes,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const site = useMemo(
    () =>
      buildSiteContenido({
        brandingApi: brandingQuery.data,
        contactoApi: contactoQuery.data,
        mediaApi: mediaQuery.data,
        redesApi: redesQuery.data,
      }),
    [brandingQuery.data, contactoQuery.data, mediaQuery.data, redesQuery.data],
  );

  useEffect(() => {
    if (site.branding) {
      applyBrandingTheme(site.branding);
    }
  }, [site.branding]);

  const value = useMemo(
    () => ({
      site,
      isLoading:
        brandingQuery.isLoading ||
        contactoQuery.isLoading ||
        mediaQuery.isLoading ||
        redesQuery.isLoading,
      usesFallback:
        brandingQuery.isError ||
        contactoQuery.isError ||
        mediaQuery.isError ||
        redesQuery.isError,
    }),
    [
      site,
      brandingQuery.isLoading,
      contactoQuery.isLoading,
      mediaQuery.isLoading,
      redesQuery.isLoading,
      brandingQuery.isError,
      contactoQuery.isError,
      mediaQuery.isError,
      redesQuery.isError,
    ],
  );

  return <SiteContenidoContext.Provider value={value}>{children}</SiteContenidoContext.Provider>;
}

export function useSiteContenido() {
  const ctx = useContext(SiteContenidoContext);
  if (!ctx) {
    return {
      site: {
        ...APP_CONSTANTS,
        mediaByClave: {},
        redes: [],
      },
      isLoading: false,
      usesFallback: true,
    };
  }
  return ctx;
}
