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
    body: {
      En: {
        data: {
          En: string;
        };
      };
      Fi: {
        data: {
          Fi: string;
        };
      };
    };
    Title: Record<Language, string>;
  };
};
export type BasePageContext = {
  id: string;
  documentId: string;
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
  Fi: {
    data: {
      Fi: string;
    };
  };
};
export type LocalizedRichTextEn = {
  En: {
    data: {
      En: string;
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

export type FrontPageQuery<
  T extends
    | [LocalizedTextFi, LocalizedRichTextFi]
    | [LocalizedTextEn, LocalizedRichTextEn],
> = {
  strapiPage: {
    Title: T[0];
    Description: T[0];
    body: T[1];
    HideFromSearchEngine: boolean;
  } | null;
};

export type BoardTemplateQuery<T = LocalizedTextFi | LocalizedTextEn> = {
  strapiBoard: {
    id: string;
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

export type CalendarEventData = {
  id: string;
  documentId: string;
  event_link: string;
  hide_location: boolean;
  start_date: string;
  title: LocalizedText;
  location: LocalizedText | null;
};

export type CalendarEventsQuery = {
  allStrapiCalendarEvent: {
    nodes: Array<CalendarEventData>;
  };
};