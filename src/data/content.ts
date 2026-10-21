export const profile = {
  name: 'Dishant Desle',
  handle: 'desledishant10',
  title: 'Cybersecurity Analyst',
  focus: 'SIEM · Threat Detection · Incident Response',
  location: 'Open to relocate',
  email: 'didesle7@gmail.com',
  github: 'https://github.com/desledishant10',
  linkedin: 'https://www.linkedin.com/in/dishant-desle-253437226/',
  tryhackmeUsername: 'ddesle3',
  // Public ID used by THM's live embed API:
  //   https://tryhackme.com/api/v2/badges/public-profile?userPublicId=<id>
  tryhackmePublicId: '2202803',
  tryhackmeStreakUrl:
    'https://tryhackme.com/ddesle3/streak?sharerId=64e11a049da0a6e14be7cdc9',
  resumePath: '/resume.pdf',
  tagline:
    'I build things that catch ransomware before it spreads and write the playbooks for what happens next.',
  bio: `Master's graduate in Cyber Security from the University of Denver, focused on threat detection, incident response, and security architecture. I like the part of the job where logs become stories - turning noisy telemetry into clear timelines, then automating the response so the same incident never has to be handled twice.`,
};

export type SkillCategory = {
  label: string;
  icon: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  {
    label: 'Security Operations',
    icon: 'radar',
    items: [
      'Splunk',
      'ELK Stack',
      'Suricata',
      'Snort',
      'Wireshark',
      'Threat Detection',
      'Threat Hunting',
      'Incident Response',
      'MITRE ATT&CK',
      'NIST CSF',
    ],
  },
  {
    label: 'Vulnerability & AppSec',
    icon: 'shield',
    items: [
      'Nessus',
      'OpenVAS',
      'Burp Suite',
      'Nmap',
      'SAST',
      'DAST',
      'AST Analysis',
      'Penetration Testing',
      'Coordinated Disclosure',
    ],
  },
  {
    label: 'Cloud & Identity',
    icon: 'cloud',
    items: [
      'AWS (IAM, S3, KMS)',
      'GCP IAM',
      'Okta',
      'Google Workspace',
      'Active Directory',
      'GPO',
      'Linux',
    ],
  },
  {
    label: 'Programming',
    icon: 'code',
    items: ['Python', 'Bash', 'SQL', 'C', 'C++'],
  },
];

export type Role = {
  title: string;
  start: string;
  end: string;
  bullets: string[];
  skills?: string[];
};

export type ExperienceItem = {
  org: string;
  location: string;
  type?: string;
  roles: Role[];
};

export const experience: ExperienceItem[] = [
  {
    org: 'University of Denver',
    location: 'Denver, CO',
    type: 'Part-time · 1 yr 5 mos',
    roles: [
      {
        title: 'Facility Associate - Ritchie Center',
        start: 'Mar 2025',
        end: 'Aug 2026',
        bullets: [
          'Oversee daily operations across multiple campus facilities, maintaining physical security controls, access enforcement, and situational awareness.',
          'Monitor high-traffic and restricted areas to detect unauthorized access, policy violations, and safety anomalies.',
          'Perform routine inspections of facilities and equipment; generate incident documentation and remediation requests to reduce operational risk.',
          'Execute incident response procedures during emergencies, collaborating with campus safety and supervisory teams.',
          'Support secure event operations, including pre-event preparation and post-event recovery for athletic and community programs.',
          'Maintain environmental readiness by ensuring compliance with safety, cleanliness, and operational standards.',
        ],
        skills: [
          'Facilities Operations',
          'Safety Monitoring',
          'Access Control',
          'Incident Reporting',
          'Event Support',
          'Equipment Inspection',
          'Radio Communication',
          'Customer Service',
        ],
      },
      {
        title: 'Service Associate - Joy Burns Arena & Coors Fitness Center',
        start: 'Mar 2025',
        end: 'Aug 2026',
        bullets: [
          'Manage member and guest check-ins using RecTrac, ensuring accurate identity verification, authorization, and policy-compliant access to facilities.',
          'Administer locker room assignments and rental equipment through system tracking, maintaining controlled access and inventory accountability.',
          'Operate and reconcile point-of-sale (POS) transactions within RecTrac for memberships, rentals, and programs, ensuring data accuracy and audit readiness.',
          'Enforce access control policies at entry points to prevent unauthorized use and maintain a safe, secure environment.',
          'Document incidents, safety concerns, and operational issues through work orders and incident reports, supporting timely remediation.',
          'Use two-way radio systems for real-time communication, escalation, and coordination across multiple facilities.',
          'Deliver professional customer support while maintaining a security-aware, policy-driven service environment.',
        ],
        skills: [
          'Access Control',
          'POS Systems',
          'Identity Verification',
          'Incident Reporting',
          'Work Orders',
          'Radio Communication',
          'Inventory Tracking',
          'CPR/AED Certified',
        ],
      },
    ],
  },
  {
    org: 'University of Illinois Chicago - College of Engineering',
    location: 'Chicago, IL',
    type: 'Part-time · 1 yr 9 mos',
    roles: [
      {
        title: 'Lifeguard',
        start: 'Sep 2023',
        end: 'May 2024',
        bullets: [
          'Ensured the safety of all patrons by vigilantly monitoring pool activities and enforcing safety regulations, resulting in zero major incidents during my tenure.',
          'Executed a successful rescue and provided immediate first aid care, demonstrating quick decision-making and effective crisis management.',
          'Provided emergency response and first aid care as a Red Cross Certified Lifeguard.',
          'Represented the university at the 2024 Region III Student Lead On conference.',
          'Conducted regular safety drills and training sessions to maintain high standards of preparedness across the team.',
        ],
        skills: [
          'Lifeguarding',
          'First Aid',
          'Crisis Management',
          'Emergency Response',
          'Red Cross Certified',
          'Leadership',
        ],
      },
      {
        title: 'Mathematics Grader',
        start: 'Sep 2022',
        end: 'May 2024',
        bullets: [
          'Evaluated and graded assignments and exams for foundational and advanced courses including Math 106, Math 121, and STAT 101.',
          'Provided detailed feedback to students, helping them understand their mistakes and guiding them toward improved performance.',
          'Contributed to course enhancement by identifying common areas of struggle and suggesting targeted improvements.',
          'Collaborated with faculty to develop grading rubrics and ensure consistency in grading standards across multiple sections.',
          'Maintained academic integrity by upholding strict confidentiality and ethical standards in the grading process.',
        ],
        skills: [
          'Problem Solving',
          'Feedback Delivery',
          'Academic Integrity',
          'Collaboration',
          'Time Management',
          'Grading & Assessment',
        ],
      },
      {
        title: 'Lead Frontend Developer · Elicit Lab - Undergraduate Research Assistant',
        start: 'Dec 2022',
        end: 'May 2023',
        bullets: [
          'Achieved 1st place at the Undergraduate Research Forum 2023.',
          'Led UI/UX design efforts, developed prototypes, and presented findings to key stakeholders.',
          'Collaborated within a research team to conduct user research and usability testing for the design of spherical screens and displays.',
          'Implemented gesture-based interactions to enhance user engagement, using C# for backend logic and XML for frontend layout.',
          'Analyzed logs, transcriptions, and audio/visual data to draw meaningful conclusions about user behavior and inform design decisions.',
        ],
        skills: [
          'UI/UX Design',
          'User Research',
          'Usability Testing',
          'C#',
          'XML',
          'Data Analysis',
          'R&D',
          'Prototyping',
        ],
      },
      {
        title: 'Research Observer · Early Research Scholar Program (ERSP)',
        start: 'Sep 2022',
        end: 'May 2023',
        bullets: [
          'Engaged in the Undergraduate Research Experience in STEM Program at UIC.',
          'Conducted detailed observations of research projects, documenting data collection and analysis techniques.',
          'Collaborated with research teams to develop proposals and hypotheses, gaining practical research experience.',
        ],
        skills: [
          'R&D',
          'Scientific Writing',
          'Presentations',
          'Project Management',
          'Design Research',
        ],
      },
    ],
  },
];

export type Project = {
  title: string;
  blurb: string;
  stack: string[];
  bullets: string[];
  metric?: { label: string; value: string };
  accent: 'green' | 'cyan' | 'violet' | 'amber';
  // Public GitHub URL. Omit to hide the repo icon on the card.
  repo?: string;
  // Optional live demo or writeup URL. Omit to hide the demo link.
  demo?: string;
};

export const projects: Project[] = [
  {
    title: 'mcp-witness - Security Scanner for MCP Servers',
    blurb:
      'Static + dynamic vulnerability scanner for Model Context Protocol servers: 15 static rules and 7 dynamic test scenarios covering SSRF, path traversal, shell injection, prompt injection, DNS rebinding, and CORS misconfig.',
    stack: ['Python', 'SAST', 'DAST', 'MCP', 'SSRF', 'DNS Rebinding'],
    bullets: [
      `Reported 6 vulnerabilities through coordinated disclosure, including an SSRF in Anthropic's mcp-server-fetch, and filed CVE requests confirming the upstream fixes.`,
      'Proved the SSRF end-to-end on AWS EC2 via the instance metadata service, retrieving live IAM credentials as impact.',
      'Calibrated against a corpus of real MCP servers at high precision/recall, with a deterministic test suite backing the ruleset.',
    ],
    metric: { label: 'vulns disclosed', value: '6' },
    accent: 'cyan',
    repo: 'https://github.com/desledishant10/mcp-witness',
  },
  {
    title: 'AgentSploit - Offensive Framework for AI Agents',
    blurb:
      'Open-source (PyPI) offensive testing framework for AI agents and MCP servers: 11 modules spanning MCP scanning, indirect prompt injection, attack-path mapping, and memory/RAG/thread poisoning.',
    stack: ['Python', 'PyPI', 'LLM Security', 'MCP', 'Prompt Injection'],
    bullets: [
      'Delivers prompt-injection payloads through realistic carriers (PDF, email, and calendar files), not just user-supplied jailbreaks.',
      'Traces attack paths from untrusted inputs to sensitive tools against live Claude and OpenAI agents.',
      'Composable detector stack (refusal, pattern, compliance, LLM-as-judge); CI-native with build-gating exit codes and deterministic replay.',
    ],
    metric: { label: 'modules', value: '11' },
    accent: 'violet',
    repo: 'https://github.com/desledishant10/vex',
  },
  {
    title: 'mllm-scan - On-Device LLM Measurement Study',
    blurb:
      `Master's capstone: a static scanner that detects on-device LLMs bundled inside Android apps, run as a large-scale measurement study across the app ecosystem.`,
    stack: ['Python', 'Android', 'APK Analysis', 'Static Analysis', 'Research'],
    bullets: [
      'Scanned 1,001 Android apps to map how on-device models ship in the wild.',
      'Identified a new threat class, Mutable-Reference Model Substitution, where a swappable model reference becomes an injection point.',
      'Static pipeline over APKs: locating model artifacts, loaders, and the references that bind them at runtime.',
    ],
    metric: { label: 'apps scanned', value: '1,001' },
    accent: 'amber',
    repo: 'https://github.com/desledishant10/mllm-scan',
  },
  {
    title: 'Afterlife - Ghost-Access Auditor',
    blurb:
      'Cross-source identity graph auditor that surfaces credentials outliving their owners across cloud, code hosting, IdPs, and SaaS. The detection class behind Uber 2022, Okta 2023, and the Snowflake 2024 breach wave.',
    stack: ['Python', 'FastAPI', 'IAM', 'AWS / GCP', 'Identity Graph'],
    bullets: [
      'Pulls identities and credentials from 8 systems (AWS, GCP, GitHub, GitLab, Okta, Google Workspace, Slack, Vault) and joins them via cross-source identity edges.',
      'Shipped 11 detection rules (OFFBOARDED-OWNER, ADMIN-CONCENTRATION, UNROTATED-KEY, and more) ranked by blast radius across 250+ tests against mocked cloud APIs.',
      'Exports JSON, HTML, PDF, and SARIF reports plus a FastAPI dashboard for SOC review.',
    ],
    metric: { label: 'tests passing', value: '250+' },
    accent: 'green',
    repo: 'https://github.com/desledishant10/afterlife',
  },
];

export type Competition = {
  name: string;
  detail: string;
  bullets: string[];
};

export const competitions: Competition[] = [
  {
    name: 'Trace Labs Global OSINT Search Party CTF - DEF CON 34',
    detail: 'Team Cyber@DU · 5th of 100+ · Aug 2026',
    bullets: [
      'Finished 5th of 100+ international teams (3,500 points across 46 accepted submissions) at Trace Labs flagship crowdsourced-OSINT event at DEF CON 34, where every "flag" is a verified real-world lead on an active missing-persons case handed to law enforcement.',
      'Rebuilt the digital footprint of assigned subjects across multiple platforms under a 4-hour clock; attributed pseudonymous accounts through cross-platform correlation and reverse image/face analysis, and recovered physical identifiers and timeline details missing from official records.',
      'Operated inside a strict passive-recon, chain-of-custody framework (isolated Kasm OSINT VM, VPN egress, sock-puppet management) for zero-touch, court-defensible evidence; the team recap was officially reposted by Trace Labs.',
    ],
  },
  {
    name: 'Rocky Mountain Collegiate Cyber Defense Competition',
    detail: 'RMCCDC · Mar 2026',
    bullets: [
      'First team from the University of Denver to qualify for RMCCDC Regionals.',
      'Defended enterprise infrastructure (Active Directory, DNS, IIS, FTP, Linux servers, firewalls, VPN) against an active professional Red Team while maintaining required service availability for scoring.',
      'Performed log analysis, threat detection, persistence removal, and live incident response; produced IR procedures and executive reports for White Team injects.',
    ],
  },
  {
    name: 'CyberForce Competition (U.S. Department of Energy)',
    detail: 'Team T-82 · Nov 2025',
    bullets: [
      'Defended a simulated ICS/OT environment (Active Directory, OpenPLC, HMI, database, web services) against live Red Team attacks while completing White Team incident response injects.',
      'Removed PAM backdoors, PHP webshells, and port-based persistence; hardened Windows and Linux systems; performed forensic log analysis using netstat, auth logs, and Windows Event Logs.',
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  url?: string;
};

export const certifications: Certification[] = [
  {
    name: 'Student Employees Achieve (SEA) Badge',
    issuer: 'University of Denver',
    date: 'Mar 2026',
    url: 'https://www.credly.com/badges/9d5e098b-13e5-4834-bc24-9a2d1bf2cc1c',
  },
  {
    name: 'Professionally API Testing',
    issuer: 'Antisyphon Training',
    date: 'Apr 2026',
    url: 'https://drive.google.com/file/d/1ZZJSIWmPGfuQTgBkm8NPVwI2m9a3poC_/view?usp=drive_link',
  },
  {
    name: 'Workshop: How to Think Like a Cybersecurity Defender',
    issuer: 'Antisyphon Training',
    date: '2026',
    url: 'https://drive.google.com/file/d/1mOTyShwNQ5sz1XKZBZY-UzGXKJCcboAj/view?usp=drive_link',
  },
  {
    name: 'Google Cybersecurity',
    issuer: 'Coursera',
    date: 'Feb 2026',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/A9AY1VB9IJ63',
  },
  {
    name: 'Google Cloud Cybersecurity',
    issuer: 'Coursera',
    date: 'Feb 2026',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/R0HP6SLMLWHW',
  },
  {
    name: 'Jr Penetration Tester',
    issuer: 'TryHackMe',
    date: 'Dec 2025',
    url: 'https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-YR86CPYWHH.pdf',
  },
  {
    name: 'CompTIA PenTest+ Pathway',
    issuer: 'TryHackMe',
    date: 'Sep 2025',
    url: 'https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-CXQWR9PBQJ.pdf',
  },
  {
    name: 'First Aid / CPR / AED',
    issuer: 'American Red Cross',
    date: 'Sep 2025 - Sep 2027',
    url: 'https://drive.google.com/file/d/1R4g7s3okvf8u9aRxPkHowWq4pVZqrN9q/view?usp=drive_link',
  },
  {
    name: 'Intro to Cyber Security',
    issuer: 'TryHackMe',
    date: 'Jun 2024',
    url: 'https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-ECEQPVHQLW.pdf',
  },
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
    date: 'Aug 2026',
  },
  {
    school: 'University of Illinois Chicago',
    degree: 'B.S. in Computer Science',
    detail: 'Honor: 1st Place, Undergraduate Research Forum (2023)',
    date: 'May 2024',
  },
];

/**
 * Badges that scroll in the marquee above the terminal in the Hero.
 * Each renders as a styled tile (icon + name + issuer + click → verification URL).
 *
 * Badge images are self-hosted under public/badges/ (downscaled to 128px and
 * compressed) so the site loads no third-party image hosts. To add one, save
 * the image there and set `src` to '/badges/<name>.png'. If you ever point
 * `src` at an external host instead, that host must be re-added to the CSP
 * img-src in vercel.json (the badge CDNs were removed from it).
 */
export type Badge = {
  name: string;
  issuer: 'TryHackMe' | 'Credly' | 'Antisyphon' | string;
  href: string;
  src?: string;
  accent?: 'green' | 'cyan' | 'violet' | 'amber' | 'pink';
};

const THM_SHARER = '64e11a049da0a6e14be7cdc9';

export const badges: Badge[] = [
  {
    name: 'OSINT Search Party CTF',
    issuer: 'Trace Labs · DEF CON 34',
    src: '/badges/osint-search-party-ctf.png',
    href: 'https://factory.cancred.ca/obv3/credentials/642114cf9622224c555aaa0226adc0dca9bf5370',
    accent: 'violet',
  },
  {
    name: 'SEA Badge',
    issuer: 'Credly · DU',
    src: '/badges/sea-badge.png',
    href: 'https://www.credly.com/badges/9d5e098b-13e5-4834-bc24-9a2d1bf2cc1c',
    accent: 'amber',
  },
  {
    name: 'Linux Guardian',
    issuer: 'TryHackMe',
    src: '/badges/linux-guardian.png',
    href: `https://tryhackme.com/ddesle3/badges/linux-guardian?sharerId=${THM_SHARER}`,
    accent: 'green',
  },
  {
    name: 'Windows Guardian',
    issuer: 'TryHackMe',
    src: '/badges/windows-guardian.png',
    href: `https://tryhackme.com/ddesle3/badges/windows-guardian?sharerId=${THM_SHARER}`,
    accent: 'cyan',
  },
  {
    name: 'Adversary',
    issuer: 'TryHackMe',
    src: '/badges/adversary.png',
    href: `https://tryhackme.com/ddesle3/badges/adversary?sharerId=${THM_SHARER}`,
    accent: 'pink',
  },
];
