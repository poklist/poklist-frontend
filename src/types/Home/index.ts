import { MessageDescriptor } from '@lingui/core';

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
  joinInformation: {
    title: MessageDescriptor;
    descriprion: MessageDescriptor;
    buttonText: MessageDescriptor;
  };
  accountOwner: {
    title: string;
    buttonText: MessageDescriptor;
  };
  nonCreatorQuestion: {
    title: MessageDescriptor;
    url: string;
  };
}

// Feature Section Types
export interface FeatureSectionContent {
  title: MessageDescriptor;
  description: MessageDescriptor;
}

export interface FeatureListItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface FeatureListContent {
  title: string;
  user: MessageDescriptor;
  account: string;
  userAvatar: string;
  listCount: string;
  listTitle: MessageDescriptor;
  lists: {
    id: number;
    title: MessageDescriptor;
    description: MessageDescriptor;
    image: string;
  }[];
}

export interface FeatureListSection {
  [key: string]: FeatureListContent;
}

// Tutorial Section Types
export interface TutorialLink {
  title: MessageDescriptor;
  url: string;
}

// Footer Section Types
export interface FooterLink {
  title: MessageDescriptor;
  url: string;
}

export interface SocialMediaLink {
  name: string;
  icon: string;
  url: string;
}
