export type Styles = {
  calendarContainer: string;
  detailItem: string;
  eventCard: string;
  eventContent: string;
  eventDetails: string;
  eventHeader: string;
  eventTitle: string;
  mapAction: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
