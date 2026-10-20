import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import { safePath } from '../lib/safePath'

describe('safePath', () => {
  it('passes a normal path through unchanged', () => {
    expect(safePath('/projects')).toBe('/projects')
  })
  it('strips control bytes and bidi-override characters (Trojan Source guard)', () => {
    const NUL = String.fromCharCode(0)
    const BEL = String.fromCharCode(7)
    const RLO = String.fromCharCode(0x202e) // right-to-left override
    const LRI = String.fromCharCode(0x2066) // first-strong isolate
    const PDI = String.fromCharCode(0x2069) // pop directional isolate
    expect(safePath('/foo' + NUL + BEL + 'bar')).toBe('/foobar')
    expect(safePath('/a' + RLO + 'evil')).toBe('/aevil')
    expect(safePath('/x' + LRI + 'y' + PDI + 'z')).toBe('/xyz')
  })
  it('caps the rendered path at 80 characters', () => {
    expect(safePath('/' + 'a'.repeat(200))).toHaveLength(80)
  })
})

describe('<NotFoundPage>', () => {
  const renderPage = () => render(<MemoryRouter><NotFoundPage /></MemoryRouter>)

  it('renders a single 404 heading and a plain-language recovery message', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
    expect(screen.getByText(/does not resolve/i)).toBeInTheDocument()
  })

  it('exposes the home sections as a labelled nav of 8 anchor links', () => {
    renderPage()
    const nav = screen.getByRole('navigation', { name: /site sections/i })
    const links = within(nav).getAllByRole('link')
    expect(links).toHaveLength(8)
    const hrefs = links.map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('/#projects')
    expect(hrefs).toContain('/#contact')
  })

  it('provides a home link and a search button', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /return to the homepage/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open command palette/i })).toBeInTheDocument()
  })

  it('sets a 404 document title', () => {
    renderPage()
    expect(document.title).toMatch(/404/)
  })
})
