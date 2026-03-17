export type Styles = {
  nav: string;
  navLinkActive: string;
  navLink: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
