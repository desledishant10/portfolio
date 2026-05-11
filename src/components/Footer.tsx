import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';
import { profile } from '../data/content';

export function Footer() {
  return (
    <footer className="border-t border-bg-border mt-12 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs text-ink-mute">
        <div>
          <span className="text-neon-green">$</span> echo "built by {profile.name} · {new Date().getFullYear()}"
        </div>
        <div className="flex items-center gap-3">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-neon-cyan"><GithubIcon size={14} /></a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-neon-cyan"><LinkedinIcon size={14} /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-neon-cyan"><Mail size={14} /></a>
        </div>
      </div>
    </footer>
  );
}
