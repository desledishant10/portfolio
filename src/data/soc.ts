// Fake-but-plausible SOC telemetry for the /admin easter-egg dashboard. Every
// alert is mapped to a real MITRE ATT&CK technique, sources are geo-located for
// the attack map, and a scripted kill chain plays out over the ambient noise.
// None of this is real data - it all runs in the browser.

export type Tactic =
  | 'Initial Access'
  | 'Execution'
  | 'Persistence'
  | 'Credential Access'
  | 'Discovery'
  | 'Lateral Movement'
  | 'Command and Control'
  | 'Exfiltration'
  | 'Impact';

// Ordered left-to-right as a simplified kill chain for the ATT&CK matrix.
export const TACTICS: Tactic[] = [
  'Initial Access',
  'Execution',
  'Persistence',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Command and Control',
  'Exfiltration',
  'Impact',
];

export type Technique = { id: string; name: string; tactic: Tactic };

export const TECHNIQUES: Technique[] = [
  { id: 'T1566.001', name: 'Spearphishing Attachment', tactic: 'Initial Access' },
  { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
  { id: 'T1059.001', name: 'PowerShell', tactic: 'Execution' },
  { id: 'T1204.002', name: 'Malicious File', tactic: 'Execution' },
  { id: 'T1053.005', name: 'Scheduled Task', tactic: 'Persistence' },
  { id: 'T1136.001', name: 'Local Account', tactic: 'Persistence' },
  { id: 'T1110.001', name: 'Password Guessing', tactic: 'Credential Access' },
  { id: 'T1003.001', name: 'LSASS Memory', tactic: 'Credential Access' },
  { id: 'T1046', name: 'Network Service Discovery', tactic: 'Discovery' },
  { id: 'T1018', name: 'Remote System Discovery', tactic: 'Discovery' },
  { id: 'T1021.001', name: 'Remote Desktop Protocol', tactic: 'Lateral Movement' },
  { id: 'T1021.002', name: 'SMB / Admin Shares', tactic: 'Lateral Movement' },
  { id: 'T1071.001', name: 'Web Protocols (C2)', tactic: 'Command and Control' },
  { id: 'T1572', name: 'Protocol Tunneling', tactic: 'Command and Control' },
  { id: 'T1567.002', name: 'Exfil to Cloud Storage', tactic: 'Exfiltration' },
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact' },
];

export const TECH_BY_ID: Record<string, Technique> = Object.fromEntries(
  TECHNIQUES.map((t) => [t.id, t]),
);

export type Severity = 'info' | 'warn' | 'crit';
export type Reputation = 'clean' | 'suspicious' | 'malicious';

// Geo-located threat sources (lon -180..180, lat -90..90). Reputation drives the
// attack-map dot color. IPs are documentation / known-benign ranges.
export type SourceNode = {
  ip: string;
  city: string;
  cc: string; // ISO country code
  lat: number;
  lon: number;
  asn: string;
  reputation: Reputation;
};

export const SOURCES: SourceNode[] = [
  { ip: '185.220.101.182', city: 'Frankfurt', cc: 'DE', lat: 50.1, lon: 8.7, asn: 'AS205100 Tor exit', reputation: 'malicious' },
  { ip: '45.133.1.17', city: 'Amsterdam', cc: 'NL', lat: 52.37, lon: 4.9, asn: 'AS60781 bulletproof VPS', reputation: 'malicious' },
  { ip: '91.219.237.44', city: 'Moscow', cc: 'RU', lat: 55.75, lon: 37.62, asn: 'AS49505 Selectel', reputation: 'malicious' },
  { ip: '223.5.5.5', city: 'Hangzhou', cc: 'CN', lat: 30.29, lon: 120.16, asn: 'AS37963 Alibaba', reputation: 'suspicious' },
  { ip: '203.0.113.42', city: 'Singapore', cc: 'SG', lat: 1.35, lon: 103.82, asn: 'AS13335 edge POP', reputation: 'suspicious' },
  { ip: '198.51.100.7', city: 'Sao Paulo', cc: 'BR', lat: -23.55, lon: -46.63, asn: 'AS28573 Claro', reputation: 'suspicious' },
  { ip: '102.89.23.9', city: 'Lagos', cc: 'NG', lat: 6.52, lon: 3.38, asn: 'AS29465 MTN', reputation: 'suspicious' },
  { ip: '115.42.150.12', city: 'Mumbai', cc: 'IN', lat: 19.08, lon: 72.88, asn: 'AS9829 BSNL', reputation: 'suspicious' },
  { ip: '175.45.176.3', city: 'Pyongyang', cc: 'KP', lat: 39.02, lon: 125.75, asn: 'AS131279 Star JV', reputation: 'malicious' },
  { ip: '45.33.32.156', city: 'Fremont', cc: 'US', lat: 37.55, lon: -121.99, asn: 'AS63949 Akamai', reputation: 'suspicious' },
  { ip: '103.86.49.11', city: 'Sydney', cc: 'AU', lat: -33.87, lon: 151.21, asn: 'AS55803 colo', reputation: 'clean' },
  { ip: '5.182.210.6', city: 'Tehran', cc: 'IR', lat: 35.69, lon: 51.39, asn: 'AS44244 Irancell', reputation: 'malicious' },
];

export const SOURCE_BY_IP: Record<string, SourceNode> = Object.fromEntries(
  SOURCES.map((s) => [s.ip, s]),
);

// Where the defended estate "lives" - the SOC. Denver, matching the DU line.
export const HOME = { label: 'SOC :: DEN', lat: 39.74, lon: -104.99 };

export type SocEventSeed = {
  techId: string;
  severity: Severity;
  message: string;
  action: string; // recommended analyst action for the drill-down
};

// Ambient background noise - independent, low-correlation alerts.
export const AMBIENT: SocEventSeed[] = [
  { techId: 'T1110.001', severity: 'warn', message: 'SSH password spray - 240 attempts against sshd (root, admin, git)', action: 'Confirm fail2ban ban; verify key-only auth is enforced.' },
  { techId: 'T1046', severity: 'info', message: 'TCP SYN scan observed - 22, 80, 443, 3389, 5985', action: 'Expected recon noise; drop at edge ACL, no host response.' },
  { techId: 'T1190', severity: 'warn', message: 'WAF: SQLi probe on /api/login (UNION SELECT) blocked', action: 'Rule 942100 fired; confirm parametrized queries upstream.' },
  { techId: 'T1071.001', severity: 'info', message: 'Suricata ET POLICY - outbound to newly-registered domain', action: 'Low confidence; enrich domain age, keep on watchlist.' },
  { techId: 'T1204.002', severity: 'warn', message: 'EDR quarantine - user opened invoice_scan.pdf.exe', action: 'File detonated in sandbox; hash added to blocklist.' },
  { techId: 'T1018', severity: 'info', message: 'Unusual LDAP enumeration from workstation WKS-114', action: 'Correlate with user baseline; likely IT asset scan.' },
  { techId: 'T1572', severity: 'warn', message: 'DNS tunneling heuristic - high entropy TXT queries', action: 'Sinkhole domain; pull PCAP for the host.' },
  { techId: 'T1567.002', severity: 'info', message: 'Large upload to unsanctioned cloud storage (mega.nz)', action: 'DLP review; confirm business justification with user.' },
];

export type IncidentStep = SocEventSeed & { host: string; sourceIp: string; delayMs: number };

// A scripted kill chain: phishing -> execution -> creds -> lateral -> C2 ->
// exfil -> ransomware -> containment. Fires over the ambient stream.
export const INCIDENT: { name: string; steps: IncidentStep[] } = {
  name: 'OP: CRIMSON TIDE',
  steps: [
    { techId: 'T1566.001', severity: 'warn', host: 'WKS-042', sourceIp: '185.220.101.182', delayMs: 0, message: 'Spearphish delivered - "Q3_bonus.docm" to j.okafor@corp', action: 'Pull mail from all inboxes; detonate attachment.' },
    { techId: 'T1059.001', severity: 'crit', host: 'WKS-042', sourceIp: '185.220.101.182', delayMs: 1800, message: 'powershell -enc <b64> spawned by WINWORD.EXE', action: 'Isolate WKS-042; decode the command line; kill tree.' },
    { techId: 'T1003.001', severity: 'crit', host: 'WKS-042', sourceIp: '185.220.101.182', delayMs: 2000, message: 'LSASS memory access by rundll32 (comsvcs MiniDump)', action: 'Rotate exposed creds; enable Credential Guard.' },
    { techId: 'T1021.001', severity: 'crit', host: 'FILESRV-02', sourceIp: '91.219.237.44', delayMs: 2200, message: 'Lateral RDP WKS-042 -> FILESRV-02 with harvested creds', action: 'Block RDP east-west; disable the compromised account.' },
    { techId: 'T1071.001', severity: 'crit', host: 'FILESRV-02', sourceIp: '45.133.1.17', delayMs: 2000, message: 'C2 beacon to 45.133.1.17:443 - 60s jitter, TLS SNI mismatch', action: 'Blackhole the C2 IP; hunt the beacon across the fleet.' },
    { techId: 'T1567.002', severity: 'crit', host: 'FILESRV-02', sourceIp: '45.133.1.17', delayMs: 2000, message: 'Staged 3.4 GB archive exfiltrated to cloud storage', action: 'Egress block; scope the data; start breach timeline.' },
    { techId: 'T1486', severity: 'crit', host: 'FILESRV-02', sourceIp: '175.45.176.3', delayMs: 2200, message: 'Mass file rename *.README_CRIMSON - ransomware detonation', action: 'Kill the process; restore from immutable backups.' },
    { techId: 'T1021.002', severity: 'info', host: 'FILESRV-02', sourceIp: '175.45.176.3', delayMs: 2600, message: 'CONTAINED - hosts isolated, account disabled, IOCs pushed', action: 'Post-incident: eradicate persistence, lessons learned.' },
  ],
};
