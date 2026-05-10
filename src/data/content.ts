export const profile = {
  name: 'Dishant Desle',
  handle: 'desledishant10',
  title: 'Cybersecurity Analyst',
  focus: 'SIEM · Threat Detection · Incident Response',
  location: 'Denver, CO',
  email: 'didesle7@gmail.com',
  github: 'https://github.com/desledishant10',
  linkedin: 'https://www.linkedin.com/in/dishant-desle-253437226/',
  // TODO: replace with your TryHackMe username (the part after tryhackme.com/p/)
  tryhackmeUsername: 'desledishant10',
  resumePath: '/resume.pdf',
  tagline:
    'I build things that catch ransomware before it spreads and write the playbooks for what happens next.',
  bio: `Master's student in Cyber Security at the University of Denver, focused on threat detection, incident response, and security architecture. I like the part of the job where logs become stories — turning noisy telemetry into clear timelines, then automating the response so the same incident never has to be handled twice.`,
};

export type SkillCategory = {
  label: string;
  icon: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  {
    label: 'SIEM & Detection',
    icon: 'radar',
    items: ['ELK Stack', 'Splunk', 'Suricata', 'Snort'],
  },
  {
    label: 'Security Tools',
    icon: 'shield',
    items: ['Wireshark', 'Nmap', 'Burp Suite', 'Nessus', 'OpenVAS'],
  },
  {
    label: 'Cloud & Systems',
    icon: 'cloud',
    items: ['AWS (S3, KMS)', 'Google Cloud IAM', 'Linux', 'Active Directory', 'GPO'],
  },
  {
    label: 'Programming',
    icon: 'code',
    items: ['Python', 'Bash', 'SQL', 'C / C++'],
  },
];

export type ExperienceItem = {
  org: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    org: 'University of Denver',
    role: 'Facility & Service Associate',
    location: 'Denver, CO',
    start: 'Mar 2025',
    end: 'Present',
    bullets: [
      'Monitored access control systems and investigated anomalies, supporting real-time incident identification and response.',
      'Documented incidents and maintained structured reports aligned with audit and compliance standards.',
      'Applied situational awareness and escalation protocols in high-responsibility environments.',
    ],
  },
  {
    org: 'Elicit Lab — University of Illinois Chicago',
    role: 'Undergraduate Research Assistant',
    location: 'Chicago, IL',
    start: 'Dec 2022',
    end: 'Aug 2023',
    bullets: [
      'Led prototyping and user testing; analyzed data and presented findings to stakeholders.',
      'Awarded 1st Place — Undergraduate Research Forum 2023.',
    ],
  },
];

export type Project = {
  title: string;
  blurb: string;
  stack: string[];
  bullets: string[];
  metric?: { label: string; value: string };
  accent: 'green' | 'cyan' | 'violet';
  // TODO: paste public GitHub URL for this project (or leave empty to hide the icon)
  repo?: string;
  // TODO: optional live demo / writeup URL
  demo?: string;
};

export const projects: Project[] = [
  {
    title: 'Ransomware Detection & Automated Response Pipeline',
    blurb:
      'Real-time behavioral monitoring with automated containment + recovery aligned to the IR lifecycle.',
    stack: ['Python', 'TensorFlow', 'AWS S3', 'AWS KMS'],
    bullets: [
      'Detected ransomware-like behavior through real-time monitoring and behavioral analysis.',
      'Investigated file activity patterns to assess potential compromise and impact.',
      'Implemented automated containment and recovery workflows: detection → containment → recovery.',
    ],
    metric: { label: 'Detection rate', value: '98%' },
    accent: 'green',
    repo: '',
  },
  {
    title: 'Intrusion Detection & Threat Analysis System (IDPS)',
    blurb:
      'Network IDS with alert triage, event correlation, and forensic-style investigation of attack patterns.',
    stack: ['Suricata', 'Snort', 'ELK Stack', 'Python'],
    bullets: [
      'Analyzed network traffic and logs to identify suspicious activity and potential intrusions.',
      'Performed alert triage and event correlation to distinguish true positives from false positives.',
      'Documented findings to simulate forensic-style analysis and isolated threats during response.',
    ],
    accent: 'cyan',
    repo: '',
  },
  {
    title: 'Vulnerability Assessment & Security Hardening',
    blurb:
      'Endpoint vuln scanning paired with AD/GPO controls to systematically reduce attack surface.',
    stack: ['Nessus', 'Splunk', 'Active Directory', 'GPO'],
    bullets: [
      'Conducted vulnerability assessments and analyzed system weaknesses across endpoints.',
      'Implemented security configurations and controls to reduce exposure and improve resilience.',
    ],
    accent: 'violet',
    repo: '',
  },
];

export type Competition = {
  name: string;
  detail: string;
  bullets: string[];
};

export const competitions: Competition[] = [
  {
    name: 'CyberForce Competition (DOE)',
    detail: 'Team T-82',
    bullets: [
      'Defended enterprise and ICS infrastructure against live cyber attacks in a simulated environment.',
      'Performed real-time incident response, system hardening, and threat mitigation.',
    ],
  },
  {
    name: 'Rocky Mountain Collegiate Cyber Defense Competition',
    detail: 'RMCCDC',
    bullets: [
      'Secured enterprise systems including Active Directory, web services, and network infrastructure.',
      'Identified vulnerabilities and responded to active threats using logs and network analysis tools.',
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  // TODO: paste credential / verification URL when you have it (Credly, TryHackMe, Coursera, etc.)
  url?: string;
};

export const certifications: Certification[] = [
  { name: 'Student Employees Achieve (SEA) Badge', issuer: 'University of Denver', date: 'Mar 2026', url: '' },
  { name: 'Professionally API Testing', issuer: 'Antisyphon Training', date: 'Apr 2026', url: '' },
  { name: 'Google Cybersecurity', issuer: 'Coursera', date: 'Feb 2026', url: '' },
  { name: 'Google Cloud Cybersecurity', issuer: 'Coursera', date: 'Feb 2026', url: '' },
  { name: 'Jr Penetration Tester', issuer: 'TryHackMe', date: 'Dec 2025', url: '' },
  { name: 'CompTIA PenTest+ Pathway', issuer: 'TryHackMe', date: 'Sep 2025', url: '' },
  { name: 'First Aid / CPR / AED', issuer: 'American Red Cross', date: 'Sep 2025 – Sep 2027', url: '' },
  { name: 'Intro to Cyber Security', issuer: 'TryHackMe', date: 'Jun 2024', url: '' },
];

export type Education = {
  school: string;
  degree: string;
  detail: string;
  date: string;
};

export const education: Education[] = [
  {
    school: 'University of Denver',
    degree: 'M.S. in Cyber Security',
    detail: 'Focus: Threat Detection, Incident Response, Security Architecture',
    date: 'Expected Aug 2026',
  },
  {
    school: 'University of Illinois — Chicago',
    degree: 'B.S. in Computer Science',
    detail: '',
    date: 'May 2024',
  },
];

/**
 * Badges to scroll in the marquee above the terminal in the Hero.
 *
 * To add a real badge:
 *  1. Get the badge image URL (e.g. from Credly: right-click the badge image → Copy Image Address)
 *     Examples:
 *       Credly: https://images.credly.com/size/340x340/images/<uuid>/image.png
 *       TryHackMe: https://tryhackme-badges.s3.amazonaws.com/<username>.png
 *  2. Paste the URL as `src`, set `alt`, and `href` to the verification page.
 *  3. The marquee will auto-scroll the list infinitely.
 *
 * Leave the array empty to hide the marquee. Placeholders below render a skeleton you can replace.
 */
export type Badge = { src: string; alt: string; href?: string };
export const badges: Badge[] = [
  // Examples — replace with real badge URLs:
  // { src: 'https://images.credly.com/size/340x340/images/xxxx/image.png', alt: 'Google Cybersecurity', href: 'https://www.credly.com/badges/xxxx' },
  // { src: 'https://tryhackme-badges.s3.amazonaws.com/desledishant10.png', alt: 'TryHackMe Profile', href: 'https://tryhackme.com/p/desledishant10' },
];
