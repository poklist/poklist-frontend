// Hero Section Types
export interface HeroJoinInfo {
  title: string;
  descriprion: string;
  buttonText: string;
}

export interface HeroAccountInfo {
  title: string;
  buttonText: string;
}

export interface HeroQuestionInfo {
  title: string;
  url: string;
}

export interface HeroSectionContent {
  joinInformation: HeroJoinInfo;
  accountOwner: HeroAccountInfo;
  nonCreatorQuestion: HeroQuestionInfo;
}

// Feature Section Types
export interface FeatureSectionContent {
  title: string;
  description: string;
}

export interface FeatureListItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface FeatureListContent {
  title: string;
  user: string;
  account: string;
  userAvatar: string;
  listCount: string;
  listTitle: string;
  lists: FeatureListItem[];
}

export interface FeatureListSection {
  [key: string]: FeatureListContent;
}

// Tutorial Section Types
export interface TutorialLink {
  title: string;
  url: string;
}

// Footer Section Types
export interface FooterLink {
  title: string;
  url: string;
}

export interface SocialMediaLink {
  name: string;
  icon: string;
  url: string;
}
