export interface SeoFields {
  metaTitle?: { fi: string; en: string };
  metaDescription?: { fi: string; en: string };
  shareImage?: {
    url: string;
    alternativeText?: string;
  };
  canonicalUrl?: string;
}

export const DEFAULT_DESCRIPTION_FI =
  "Matlu ry on Helsingin yliopiston matemaattis-luonnontieteellisen tiedekunnan opiskelijajärjestöjen edunvalvonta- ja yhteistyöjärjestö.";

export const DEFAULT_DESCRIPTION_EN =
  "Matlu ry is the advocacy and cooperation organization for student organizations in the Faculty of Science at the University of Helsinki.";
