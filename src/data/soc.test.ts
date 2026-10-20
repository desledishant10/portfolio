import { describe, it, expect } from 'vitest'
import {
  AMBIENT,
  INCIDENT,
  SOURCES,
  SOURCE_BY_IP,
  TACTICS,
  TECHNIQUES,
  TECH_BY_ID,
} from './soc'

describe('soc data integrity', () => {
  it('every technique belongs to a known tactic', () => {
    for (const t of TECHNIQUES) {
      expect(TACTICS, `${t.id} tactic`).toContain(t.tactic)
    }
  })

  it('every ambient alert references a defined technique', () => {
    for (const a of AMBIENT) {
      expect(TECH_BY_ID[a.techId], a.techId).toBeDefined()
    }
  })

  it('every incident step references a defined technique and a known source', () => {
    for (const step of INCIDENT.steps) {
      expect(TECH_BY_ID[step.techId], step.techId).toBeDefined()
      expect(SOURCE_BY_IP[step.sourceIp], step.sourceIp).toBeDefined()
      expect(step.delayMs).toBeGreaterThanOrEqual(0)
    }
  })

  it('the incident ends in a containment (info) step', () => {
    const last = INCIDENT.steps[INCIDENT.steps.length - 1]
    expect(last.severity).toBe('info')
    expect(last.message.toLowerCase()).toContain('contained')
  })

  it('sources carry valid geo coordinates for the attack map', () => {
    for (const s of SOURCES) {
      expect(s.lat, s.ip).toBeGreaterThanOrEqual(-90)
      expect(s.lat, s.ip).toBeLessThanOrEqual(90)
      expect(s.lon, s.ip).toBeGreaterThanOrEqual(-180)
      expect(s.lon, s.ip).toBeLessThanOrEqual(180)
      expect(['clean', 'suspicious', 'malicious'], s.ip).toContain(s.reputation)
    }
  })
})
