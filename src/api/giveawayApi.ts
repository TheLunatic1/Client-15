import axiosClient from './axios';
import type { GiveawayConfig } from '../types/giveaway';

export const getGiveawayConfig = async (): Promise<GiveawayConfig> => {
  const res = await axiosClient.get<GiveawayConfig>('/api/giveaway');
  return res.data;
};

export const updateGiveawayConfig = async (data: GiveawayConfig): Promise<GiveawayConfig> => {
  const res = await axiosClient.put<GiveawayConfig>('/api/giveaway', data);
  return res.data;
};
