import type { ComponentType } from 'react';
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
  BlueskyIcon,
  MastodonIcon,
  DevtoIcon,
  RedditIcon,
  HackerNewsIcon,
} from './BrandIcons';
import { profile } from '../../data/content';

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  // Brand color, tuned for the dark background. The three monochrome brands
  // (GitHub, X, dev.to) have a black official mark that would vanish on dark,
  // so they use a bright near-white for visibility instead of their real hex.
  color: string;
  // rel="me" lets Mastodon verify this profile links back to the site.
  rel?: string;
};

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', handle: `@${profile.handle}`, href: profile.github, Icon: GithubIcon, color: '#e6edf3' },
  { label: 'LinkedIn', handle: '/in/dishant-desle', href: profile.linkedin, Icon: LinkedinIcon, color: '#3b9df8' },
  { label: 'X', handle: '@dishant_desle', href: profile.twitter, Icon: XIcon, color: '#e7e9ea' },
  { label: 'Bluesky', handle: '@jinjijo.bsky.social', href: profile.bluesky, Icon: BlueskyIcon, color: '#38a8ff' },
  { label: 'Mastodon', handle: '@jinjijo@infosec.exchange', href: profile.mastodon, Icon: MastodonIcon, rel: 'me', color: '#8b8dff' },
  { label: 'dev.to', handle: '@dishant_desle', href: profile.devto, Icon: DevtoIcon, color: '#e8e8e8' },
  { label: 'Reddit', handle: 'u/didesle', href: profile.reddit, Icon: RedditIcon, color: '#ff4500' },
  { label: 'Hacker News', handle: 'di_desle', href: profile.hackernews, Icon: HackerNewsIcon, color: '#ff6600' },
];
