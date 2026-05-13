#!/usr/bin/env bash
# ============================================================================
# check-dashes.sh — block em-dash (—) and en-dash (–) from user-facing files.
#
# Why: typography auto-correct (and AI assistants) like to insert "smart"
# dashes. They look fine in print but make CLI / mono / terminal aesthetics
# inconsistent and harder to grep. We standardize on the ASCII hyphen.
#
# Implementation note: we use python3 (not grep) because POSIX `grep -E` with
# a multi-byte character class operates in BYTE mode under most locales, which
# causes false positives on completely different unicode characters (arrows,
# bullets, box drawing) that happen to share UTF-8 lead bytes (0xE2). Python's
# 'in' operator on strings is codepoint-aware and rock-solid.
#
# Two modes:
#   ./scripts/check-dashes.sh           # report + exit 1 if any found
#   ./scripts/check-dashes.sh --fix     # auto-replace with `-` then exit 0
#
# Wired into:
#   - `prebuild` npm script  → fails Vercel + local builds
#   - `.githooks/pre-commit` → fails `git commit` on staged dashes
# ============================================================================
set -e

MODE="${1:-check}"

python3 - "$MODE" <<'PY'
import os, sys

mode = sys.argv[1]
TARGETS = ['src', 'public/og.svg', 'index.html']
EXTENSIONS = {'.tsx', '.ts', '.jsx', '.js', '.html', '.css', '.svg', '.md'}
EM = '—'  # —
EN = '–'  # –


def collect_files():
    files = []
    for t in TARGETS:
        if not os.path.exists(t):
            continue
        if os.path.isfile(t):
            files.append(t)
            continue
        for root, _, fs in os.walk(t):
            # Skip node_modules and other vendored dirs (none here, but be safe).
            if 'node_modules' in root.split(os.sep):
                continue
            for f in fs:
                if os.path.splitext(f)[1] in EXTENSIONS:
                    files.append(os.path.join(root, f))
    return files


def find_hits(files):
    hits = []
    for f in files:
        try:
            with open(f, encoding='utf-8') as fh:
                for i, line in enumerate(fh, 1):
                    if EM in line or EN in line:
                        hits.append((f, i, line.rstrip()))
        except (UnicodeDecodeError, IsADirectoryError, PermissionError):
            pass
    return hits


def fix_files(files):
    fixed = []
    for f in files:
        try:
            with open(f, encoding='utf-8') as fh:
                content = fh.read()
        except (UnicodeDecodeError, IsADirectoryError, PermissionError):
            continue
        if EM in content or EN in content:
            new = content.replace(EM, '-').replace(EN, '-')
            with open(f, 'w', encoding='utf-8') as fh:
                fh.write(new)
            fixed.append(f)
    return fixed


files = collect_files()

if mode == '--fix':
    print('→ replacing em/en dashes with ASCII hyphen...')
    fixed = fix_files(files)
    if not fixed:
        print('✓ nothing to fix')
        sys.exit(0)
    for f in fixed:
        print(f'  fixed: {f}')
    print('✓ done')
    sys.exit(0)

hits = find_hits(files)
if hits:
    print()
    print('✗ em-dash (—) or en-dash (–) found in user-facing files:')
    print()
    for f, ln, txt in hits[:80]:
        # Highlight the dash position in the line
        print(f'  {f}:{ln}: {txt}')
    print()
    print(f'  (total: {len(hits)} occurrence{"s" if len(hits) != 1 else ""})')
    print()
    print('  fix automatically: npm run lint:dashes:fix')
    print('  or replace with a regular hyphen (-) by hand.')
    print()
    sys.exit(1)

print('✓ no em/en dashes in user-facing files')
sys.exit(0)
PY
