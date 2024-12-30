export type Language = "fi" | "en";
export type LocalizedLink = Record<Language, string>;
type SiteMetadata = {
  title: string;
  description: string;
  author: string;
};
export type SEOQuery = {
  site: {
    siteMetadata: SiteMetadata;
  };
};
export type PageTemplateQuery = {
  strapiPage: {
    body: Record<Language, string>;
    Title: Record<Language, string>;
  };
};
export type BasePageContext = {
  id: string;
  language: Language;
  localizedLinks: LocalizedText;
  hideFromSearchEngine: boolean;
};
export type BoardPageContext = BasePageContext & {
  boardYears: number[];
};

export type PageTemplatePageContext = BasePageContext;
export type EventsPageTemplateQuery = PageTemplateQuery;
export type EventsPageTemplatePageContext = BasePageContext;
export type ContactPageTemplateQuery = PageTemplateQuery;
export type ContactPageTemplatePageContext = BasePageContext;

export type LocalizedTextFi = Record<"id" | "fi", string>;
export type LocalizedTextEn = Record<"id" | "en", string>;
export type LocalizedRichTextFi = {
  id: string;
  fi: {
    data: {
      fi: string;
    };
  };
};
export type LocalizedRichTextEn = {
  id: string;
  en: {
    data: {
      en: string;
    };
  };
};
export type LocalizedText = Record<Language, string>;

type BoardMember<T = LocalizedTextFi | LocalizedTextEn> = {
  id: number;
  name: string;
  email: string | null;
  role: T;
};
type Officer<T = LocalizedTextFi | LocalizedTextEn> = {
  id: number;
  name: string;
  role: T;
};

type TeamMember = {
  id: number;
  name: string;
};

type Team<T = LocalizedTextFi | LocalizedTextEn> = {
  id: number;
  title: T;
  team_members: TeamMember[];
};

export type FrontPageQuery<T extends [LocalizedTextFi, LocalizedRichTextFi] | [LocalizedTextEn, LocalizedRichTextEn]> = {
  strapiPage: {
    Title: T[0];
    Description: T[0];
    body: T[1];
    HideFromSearchEngine: boolean;
  } | null;
};

export type BoardTemplateQuery<T = LocalizedTextFi | LocalizedTextEn> = {
  strapiBoard: {
    id: number;
    year: number;
    members: BoardMember<T>[] | null;
    officers: Officer<T>[] | null;
    teams: Team<T>[] | null;
  };
};

export type NavQuery = {
  allStrapiPage: {
    nodes: Array<{
      id: string;
      page: string;
      Ordering: number;
      Draft: boolean;
      Title: LocalizedText;
    }>;
  };
};
