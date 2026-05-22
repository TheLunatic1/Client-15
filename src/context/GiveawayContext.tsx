import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getGiveawayConfig } from '../api/giveawayApi';
import { DEFAULT_GIVEAWAY_CONFIG } from '../data/giveaway';
import type { GiveawayConfig } from '../types/giveaway';

type GiveawayContextValue = {
  config: GiveawayConfig;
  loading: boolean;
  refresh: () => Promise<void>;
  showTicker: boolean;
  showBanner: boolean;
  showDetailsPage: boolean;
};

const GiveawayContext = createContext<GiveawayContextValue | null>(null);

export const GiveawayProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<GiveawayConfig>(DEFAULT_GIVEAWAY_CONFIG);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getGiveawayConfig();
      setConfig({ ...DEFAULT_GIVEAWAY_CONFIG, ...data });
    } catch {
      setConfig(DEFAULT_GIVEAWAY_CONFIG);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUpdated = () => refresh();
    window.addEventListener('giveaway-updated', onUpdated);
    return () => window.removeEventListener('giveaway-updated', onUpdated);
  }, [refresh]);

  const value = useMemo(() => {
    const active = config.isActive;
    return {
      config,
      loading,
      refresh,
      showTicker: active && config.tickerEnabled && config.tickerItems.length > 0,
      showBanner: active && config.bannerEnabled,
      showDetailsPage: active && config.detailsEnabled,
    };
  }, [config, loading, refresh]);

  return <GiveawayContext.Provider value={value}>{children}</GiveawayContext.Provider>;
};

export const useGiveaway = () => {
  const ctx = useContext(GiveawayContext);
  if (!ctx) {
    throw new Error('useGiveaway must be used within GiveawayProvider');
  }
  return ctx;
};
