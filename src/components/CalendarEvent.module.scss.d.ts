export type Styles = {
  eventLocation: string;
  eventTime: string;
  eventTitle: string;
  matluEvent: string;
  matluEvents: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
