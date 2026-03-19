export type Styles = {
  brand: string;
  brandLogo: string;
  isOpen: string;
  nav: string;
  navLink: string;
  navLinkActive: string;
  navMenu: string;
  navTop: string;
  navUtilities: string;
  navUtilitiesMobile: string;
  toggle: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
