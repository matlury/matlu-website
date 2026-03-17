export type Styles = {
  appFooter: string;
  appFooterSection: string;
  calendarEvents: string;
  footerBottom: string;
  footerMarquee: string;
  matluSome: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
