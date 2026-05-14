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
  tryhackmeStreakUrl:
    'https://tryhackme.com/ddesle3/streak?sharerId=64e11a049da0a6e14be7cdc9',
  resumePath: '/resume.pdf',
  tagline:
    'I build things that catch ransomware before it spreads and write the playbooks for what happens next.',
  bio: `Master's student in Cyber Security at the University of Denver, focused on threat detection, incident response, and security architecture. I like the part of the job where logs become stories - turning noisy telemetry into clear timelines, then automating the response so the same incident never has to be handled twice.`,
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
    type: 'Part-time · 1 yr 3 mos',
    roles: [
      {
        title: 'Facility Associate - Ritchie Center',
        start: 'Mar 2025',
        end: 'Present',
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
        end: 'Present',
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
  accent: 'green' | 'cyan' | 'violet';
  // TODO: paste public GitHub URL for this project (or leave empty to hide the icon)
  repo?: string;
  // TODO: optional live demo / writeup URL
  demo?: string;
};

export const projects: Project[] = [
  {
    title: 'Vex - Agent-First Red Team Framework',
    blurb:
      'Open-source red team framework for AI agents. Probes LLMs, MCP servers, and RAG pipelines for indirect prompt injection, tool hijacking, system prompt extraction, and Unicode smuggling.',
    stack: ['Python', 'LLM Security', 'MCP', 'Prompt Injection', 'CI/CD'],
    bullets: [
      'Built an attack library for the realistic deployment surface (attacker-controlled tool output, documents, MCP) - not just user-supplied jailbreaks.',
      'Multi-provider abstraction (Anthropic, OpenAI-compatible, Ollama) with composable detectors: refusal, pattern, compliance, LLM-as-judge.',
      'CI-native - stable JSON schema, deterministic seeds for forensic replay, `--exit-on-finding` flag for build gating.',
    ],
    metric: { label: 'attack classes', value: '5+' },
    accent: 'violet',
    repo: 'https://github.com/desledishant10/vex',
  },
  {
    title: 'MCP-Scan - Security Scanner for MCP Servers',
    blurb:
      'Static analyzer + dynamic harness for Model Context Protocol servers. Surfaced two confirmed SSRF vulnerabilities in PyPI-published MCP servers - one demonstrated end-to-end on EC2 with real IAM credentials retrieved.',
    stack: ['Python', 'Static Analysis', 'MCP', 'SSRF', 'DNS Rebinding'],
    bullets: [
      'Disclosed 2 SSRF vulnerabilities in PyPI MCP servers (incl. an Anthropic reference server); demonstrated full exploitation on EC2 via the instance metadata service.',
      'Identified a DNS-rebinding class affecting 3 HTTP-transport MCP servers; coordinated disclosure with maintainers under embargo.',
      'Shipped 14 static-analyzer rules across 151 passing tests, with a 10-target calibration corpus at 100% precision/recall.',
    ],
    metric: { label: 'real findings', value: '11' },
    accent: 'cyan',
    repo: 'https://github.com/desledishant10/mcp-scan',
  },
  {
    title: 'Afterlife - Ghost-Access Auditor',
    blurb:
      'Cross-source identity graph that surfaces credentials outliving their owners across cloud, code hosting, IdPs, and SaaS. The detection class behind Uber 2022, Okta 2023, and the Snowflake 2024 breach wave.',
    stack: ['Python', 'IAM', 'AWS / GCP', 'Identity Graph', 'Detection Rules'],
    bullets: [
      'Pulls identities and credentials from 8 systems (AWS, GCP, GitHub, GitLab, Okta, Google Workspace, Slack, Vault) and joins them via cross-source identity edges.',
      'Catches the Uber-2022 pattern: an AWS access key still active even though its owner is suspended in the IdP.',
      'Shipped 11 detection rules (OFFBOARDED-OWNER, ADMIN-CONCENTRATION, UNROTATED-KEY, and more) ranked by blast radius across 250+ tests.',
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
    date: 'Expected Aug 2026',
  },
  {
    school: 'University of Illinois - Chicago',
    degree: 'B.S. in Computer Science',
    detail: '',
    date: 'May 2024',
  },
];

/**
 * Badges that scroll in the marquee above the terminal in the Hero.
 * Each renders as a styled tile (icon + name + issuer + click → verification URL).
 *
 * To add a real badge image instead of the icon tile, set `src` to an image URL:
 *   - Credly: https://images.credly.com/size/340x340/images/<image-uuid>/image.png
 *   - TryHackMe: get from your THM profile (some badges have direct image URLs)
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
    name: 'SEA Badge',
    issuer: 'Credly · DU',
    src: 'https://images.credly.com/images/b0cdb1d6-c205-4366-96f5-563e486ca20d/linkedin_thumb_image.png',
    href: 'https://www.credly.com/badges/9d5e098b-13e5-4834-bc24-9a2d1bf2cc1c',
    accent: 'amber',
  },
  {
    name: 'Linux Guardian',
    issuer: 'TryHackMe',
    src: 'https://assets.tryhackme.com/room-badges/18908d5bd61f470bd1bea5737d58d023.png',
    href: `https://tryhackme.com/ddesle3/badges/linux-guardian?sharerId=${THM_SHARER}`,
    accent: 'green',
  },
  {
    name: 'Windows Guardian',
    issuer: 'TryHackMe',
    src: 'https://assets.tryhackme.com/room-badges/fea10f17246d396c5b29abeb0d4a672a.png',
    href: `https://tryhackme.com/ddesle3/badges/windows-guardian?sharerId=${THM_SHARER}`,
    accent: 'cyan',
  },
  {
    name: 'Adversary',
    issuer: 'TryHackMe',
    src: 'https://assets.tryhackme.com/room-badges/e2ce4a409fa11e6085a075fbf99a443a.png',
    href: `https://tryhackme.com/ddesle3/badges/adversary?sharerId=${THM_SHARER}`,
    accent: 'pink',
  },
];
