export type Styles = {
  activeBoard: string;
  activeNavlink: string;
  boardMember: string;
  boardMembers: string;
  formerBoards: string;
  memberEmail: string;
  memberTitle: string;
  officer: string;
  officerEmail: string;
  officers: string;
  officerTitle: string;
  team: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
