import { describe, it, expect } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CommandPalette } from './CommandPalette'

const renderPalette = () => render(<MemoryRouter><CommandPalette /></MemoryRouter>)
const openPalette = () => act(() => void window.dispatchEvent(new CustomEvent('open-palette')))

describe('<CommandPalette> dialog + combobox semantics', () => {
  it('renders nothing until opened', () => {
    renderPalette()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens as a labelled modal dialog wired as a combobox over a listbox', () => {
    renderPalette()
    openPalette()

    const dialog = screen.getByRole('dialog', { name: /command palette/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    const combo = screen.getByRole('combobox', { name: /search commands/i })
    expect(combo).toHaveAttribute('aria-expanded', 'true')
    expect(combo).toHaveAttribute('aria-autocomplete', 'list')
    expect(combo).toHaveAttribute('aria-controls', screen.getByRole('listbox').id)

    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThan(5)
    const selected = options.filter((o) => o.getAttribute('aria-selected') === 'true')
    expect(selected).toHaveLength(1)
    expect(combo).toHaveAttribute('aria-activedescendant', selected[0].id)
  })

  it('filters options as the user types', async () => {
    const user = userEvent.setup()
    renderPalette()
    openPalette()
    await user.type(screen.getByRole('combobox'), 'linkedin')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent(/linkedin/i)
  })

  it('announces no matches via a status region and collapses the combobox', async () => {
    const user = userEvent.setup()
    renderPalette()
    openPalette()
    await user.type(screen.getByRole('combobox'), 'zzzznope')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/no commands found/i)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('moves the active option with ArrowDown and tracks it via aria-activedescendant', async () => {
    const user = userEvent.setup()
    renderPalette()
    openPalette()
    const combo = screen.getByRole('combobox')
    await user.click(combo)
    const before = combo.getAttribute('aria-activedescendant')
    await user.keyboard('{ArrowDown}')
    const after = combo.getAttribute('aria-activedescendant')
    expect(after).not.toBe(before)
    const selected = screen.getAllByRole('option').filter((o) => o.getAttribute('aria-selected') === 'true')
    expect(selected).toHaveLength(1)
    expect(selected[0].id).toBe(after)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderPalette()
    openPalette()
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
