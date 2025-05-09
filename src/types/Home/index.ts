import { MessageDescriptor } from '@lingui/core';

// ErrorDialog Types
export interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
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
