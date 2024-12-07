export type UrlString = `http://${string}` | `https://${string}`;
export type Action = () => void;

export interface IActionItem {
  decription: string;
  action?: Action;
  link?: UrlString;
}

export interface ILinksBlock {
  title: string;
  actionItems: IActionItem[];
}
