import type { GiveawayConfig } from '../types/giveaway';

export const DEFAULT_GIVEAWAY_CONFIG: GiveawayConfig = {
  isActive: true,
  tickerEnabled: true,
  tickerItems: [
    'Loyalty Rewards Giveaway — Join FREE in 2026',
    '$2,500 cash + free membership per Tasmanian region',
    '4 major winners — Hobart, Launceston, Devonport & Burnie',
    'Limited spots — 10 businesses per category, per location',
  ],
  bannerEnabled: true,
  bannerBadge: 'Loyalty Rewards Giveaway',
  bannerHeadline: 'Join FREE in 2026.',
  bannerHeadlineHighlight: 'Get Rewarded',
  bannerHeadlineSuffix: 'for Staying Local.',
  bannerDescription:
    'Every business that joins MyLocalPro and remains a paid member for their first 3 months in 2027 goes into the draw to win one of four major Local Business Rewards Packages — $2,500 cash plus free membership until January 2028 in each Tasmanian region.',
  bannerPrimaryCta: 'Full Giveaway Details',
  bannerSecondaryCta: 'List Your Business',
  bannerRegionsHeading: '4 Major Winners — One Per Region',
  bannerFooterNote: 'Strictly limited spots — 10 businesses per category, per location. Join early.',
  regions: [
    { name: 'Hobart Region', cash: '$2,500', membership: 'FREE MyLocalPro membership until January 2028' },
    { name: 'Launceston Region', cash: '$2,500', membership: 'FREE MyLocalPro membership until January 2028' },
    { name: 'Devonport Region', cash: '$2,500', membership: 'FREE MyLocalPro membership until January 2028' },
    { name: 'Burnie Region', cash: '$2,500', membership: 'FREE MyLocalPro membership until January 2028' },
  ],
  detailsEnabled: true,
  detailsHeroTitle: 'The MyLocalPro',
  detailsHeroHighlight: 'Loyalty Rewards Giveaway',
  detailsHeroSubtitle: 'Join FREE in 2026. Get rewarded for staying local. Proudly Tasmanian owned & operated.',
  detailsAboutTitle: 'About the Giveaway',
  detailsAboutParagraphs: [
    "At MyLocalPro, we're all about supporting Tasmanian small businesses — and we believe loyalty should be rewarded. That's why every business that joins MyLocalPro and remains a paid member for their first 3 months in 2027 will automatically go into the draw to win one of four massive Local Business Rewards Packages.",
  ],
  detailsRegionsTitle: '4 Major Winners — One in Each Region',
  detailsWhyTitle: 'Why Are We Doing This?',
  detailsWhyParagraphs: [
    "Because we genuinely want to help Tasmanian businesses grow. We know running a business isn't easy, and we want to reward the local businesses that back MyLocalPro from the beginning.",
    "Whether it's upgrading equipment, paying bills, boosting advertising, or investing back into your business — $2,500 cash could make a real difference. And with free membership until January 2028, your business gets even more time to generate leads, attract customers, and grow.",
  ],
  detailsHowTitle: 'How Do I Enter?',
  detailsHowIntro: "It's simple:",
  detailsEntrySteps: [
    'Join MyLocalPro and enjoy FREE membership for all of 2026',
    'Stay a paid member for your first 3 months in 2027',
    "You're automatically entered — no forms, no catches, no extra costs",
  ],
  detailsHowOutro: "Just another reason to join Tasmania's newest local business platform.",
  detailsUrgencyTitle: "But Don't Wait…",
  detailsUrgencyParagraphs: [
    'We are accepting strictly limited business numbers. Only 10 businesses per category, per location will be accepted. Once spots are filled, applications will close.',
  ],
  detailsUrgencyTagline: 'Join Early. Stay Local. Get Rewarded.',
};

/** @deprecated use DEFAULT_GIVEAWAY_CONFIG.regions */
export const GIVEAWAY_REGIONS = DEFAULT_GIVEAWAY_CONFIG.regions;
/** @deprecated use DEFAULT_GIVEAWAY_CONFIG.tickerItems */
export const GIVEAWAY_TICKER_ITEMS = DEFAULT_GIVEAWAY_CONFIG.tickerItems;
/** @deprecated use DEFAULT_GIVEAWAY_CONFIG.detailsEntrySteps */
export const GIVEAWAY_ENTRY_STEPS = DEFAULT_GIVEAWAY_CONFIG.detailsEntrySteps;
