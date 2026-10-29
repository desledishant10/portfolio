import { Mail } from 'lucide-react';
import { profile } from '../data/content';
import { socialLinks } from './ui/socialLinks';

export function Footer() {
  return (
    <footer className="border-t border-bg-border mt-12 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs text-ink-mute">
        <div>
          <span className="text-neon-green">$</span> echo "built by {profile.name} · {new Date().getFullYear()}"
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {socialLinks.map(({ label, href, Icon, rel }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel={rel ? `noopener noreferrer ${rel}` : 'noopener noreferrer'}
              aria-label={label}
              title={label}
              className="hover:text-neon-cyan transition-colors"
            >
              <Icon size={14} />
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            title="Email"
            className="hover:text-neon-cyan transition-colors"
          >
            <Mail size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
