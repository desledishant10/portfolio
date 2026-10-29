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
  // rel="me" lets Mastodon verify this profile links back to the site.
  rel?: string;
};

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', handle: `@${profile.handle}`, href: profile.github, Icon: GithubIcon },
  { label: 'LinkedIn', handle: '/in/dishant-desle', href: profile.linkedin, Icon: LinkedinIcon },
  { label: 'X', handle: '@dishant_desle', href: profile.twitter, Icon: XIcon },
  { label: 'Bluesky', handle: '@jinjijo.bsky.social', href: profile.bluesky, Icon: BlueskyIcon },
  { label: 'Mastodon', handle: '@jinjijo@infosec.exchange', href: profile.mastodon, Icon: MastodonIcon, rel: 'me' },
  { label: 'dev.to', handle: '@dishant_desle', href: profile.devto, Icon: DevtoIcon },
  { label: 'Reddit', handle: 'u/didesle', href: profile.reddit, Icon: RedditIcon },
  { label: 'Hacker News', handle: 'di_desle', href: profile.hackernews, Icon: HackerNewsIcon },
];
