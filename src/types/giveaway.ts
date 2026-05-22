export type GiveawayRegion = {
  name: string;
  cash: string;
  membership: string;
};

export type GiveawayConfig = {
  _id?: string;
  isActive: boolean;
  tickerEnabled: boolean;
  tickerItems: string[];
  bannerEnabled: boolean;
  bannerBadge: string;
  bannerHeadline: string;
  bannerHeadlineHighlight: string;
  bannerHeadlineSuffix: string;
  bannerDescription: string;
  bannerPrimaryCta: string;
  bannerSecondaryCta: string;
  bannerRegionsHeading: string;
  bannerFooterNote: string;
  regions: GiveawayRegion[];
  detailsEnabled: boolean;
  detailsHeroTitle: string;
  detailsHeroHighlight: string;
  detailsHeroSubtitle: string;
  detailsAboutTitle: string;
  detailsAboutParagraphs: string[];
  detailsRegionsTitle: string;
  detailsWhyTitle: string;
  detailsWhyParagraphs: string[];
  detailsHowTitle: string;
  detailsHowIntro: string;
  detailsEntrySteps: string[];
  detailsHowOutro: string;
  detailsUrgencyTitle: string;
  detailsUrgencyParagraphs: string[];
  detailsUrgencyTagline: string;
};
