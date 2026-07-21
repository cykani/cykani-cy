# cykani Design System

## Philosophy

> "Every pixel serves a purpose." — Inspired by Raycast, Linear, Resend.

A monochrome system where restraint IS the design. No decoration, no gradients, no shadows. Power comes from typography, spacing, and information density.

---

## Color System

### Core Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#09090B` | Page background |
| `--surface` | `#18181B` | Cards, panels, inputs |
| `--surface-hover` | `#27272A` | Hover states |
| `--border` | `#27272A` | Subtle borders (barely visible) |
| `--border-active` | `#3F3F46` | Focus/active borders |
| `--text` | `#FAFAFA` | Primary text |
| `--text-secondary` | `#A1A1AA` | Secondary text |
| `--text-muted` | `#71717A` | Muted/caption text |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `#22C55E` | Online, running, complete |
| `--warning` | `#EAB308` | Idle, pending, caution |
| `--error` | `#EF4444` | Error, stopped, failed |
| `--info` | `#3B82F6` | Informational |

### Status Colors

| Status | Dot Color | Badge BG | Badge Text |
|--------|-----------|----------|------------|
| Running | `#22C55E` | `#22C55E15` | `#22C55E` |
| Idle | `#EAB308` | `#EAB30815` | `#EAB308` |
| Error | `#EF4444` | `#EF444415` | `#EF4444` |
| Stopped | `#71717A` | `#71717A15` | `#71717A` |

---

## Typography

### Font Stack

```css
--font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
```

### Scale

| Name | Size | Line Height | Weight | Tracking | Use |
|------|------|-------------|--------|----------|-----|
| Display | 36px | 40px | -0.02em | - | Hero headlines |
| H1 | 24px | 32px | 600 | -0.02em | Page titles |
| H2 | 18px | 24px | 600 | -0.01em | Section titles |
| H3 | 14px | 20px | 500 | - | Subsection titles |
| Body | 14px | 20px | 400 | - | Default text |
| Small | 13px | 18px | 400 | - | Secondary text |
| Caption | 12px | 16px | 500 | 0.01em | Labels, badges |
| Mono | 13px | 20px | 400 | - | Code, IDs, ports |

---

## Spacing

4px grid system. All spacing is a multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight padding |
| `--space-2` | 8px | Default padding |
| `--space-3` | 12px | Card padding |
| `--space-4` | 16px | Section gaps |
| `--space-5` | 20px | Large gaps |
| `--space-6` | 24px | Page margins |
| `--space-8` | 32px | Major sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, tags |
| `--radius-md` | 6px | Buttons, inputs |
| `--radius-lg` | 8px | Cards, panels |
| `--radius-xl` | 12px | Modals, dialogs |

---

## Shadows

**None.** Depth through background color only.

---

## Components

### Button

```tsx
// Primary - white on dark
<Button>Start Session</Button>

// Secondary - ghost style
<Button variant="secondary">Cancel</Button>

// Destructive
<Button variant="destructive">Delete Profile</Button>

// Subtle - for less important actions
<Button variant="subtle">View Details</Button>
```

**Specs:**
- Height: 32px
- Font: 13px, weight 500
- Padding: 0 12px
- Border radius: 6px
- Transition: background 150ms
- No shadows, no gradients

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Sessions</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

**Specs:**
- Background: `#18181B`
- Border: none (or `1px solid #27272A` for emphasis)
- Border radius: 8px
- Padding: 16px
- Hover: background → `#27272A`

### Input

```tsx
<Input placeholder="Search profiles..." />
```

**Specs:**
- Height: 32px
- Font: 13px
- Background: `#18181B`
- Border: `1px solid #27272A`
- Border radius: 6px
- Focus: border → `#3F3F46`, box-shadow `0 0 0 1px #3F3F46`

### Badge

```tsx
<Badge>Running</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Idle</Badge>
<Badge variant="error">Error</Badge>
```

**Specs:**
- Font: 11px, weight 500
- Padding: 1px 6px
- Border radius: 4px

### Status Dot

```tsx
<span className="status-dot status-running" />
```

**Specs:**
- Size: 6px × 6px
- Border radius: 50%
- Color varies by status

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Profile 1</TableCell>
      <TableCell><Badge>Running</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Specs:**
- Header: 12px, weight 500, text-muted
- Row: 14px, hover → `#27272A`
- Border: none between rows (separation through spacing)
- Cell padding: 12px 16px

### Sidebar

```tsx
<Sidebar>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>Sessions</SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</Sidebar>
```

**Specs:**
- Width: 240px
- Background: `#09090B`
- Item: 13px, weight 400
- Active item: `#FAFAFA` text, `#27272A` background
- Hover: `#27272A` background
- Group label: 11px, weight 500, `#71717A`, uppercase, tracking 0.05em

---

## Animation

| Property | Duration | Easing |
|----------|----------|--------|
| Background | 150ms | ease-in-out |
| Border | 150ms | ease-in-out |
| Opacity | 200ms | ease-in-out |
| Transform | 200ms | ease-out |

**Rules:**
- Never animate width/height
- Never use CSS transitions on `display`
- Prefer `opacity` over `visibility` for fade effects
- All interactive elements use 150ms transitions

---

## Responsive

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640-1024px | Collapsed sidebar |
| Desktop | > 1024px | Full sidebar |

---

## Dark Mode (Default)

The system is dark-mode first. Light mode is a future option, not a priority.

```css
:root {
  --background: #09090B;
  --surface: #18181B;
  --text: #FAFAFA;
  /* ... */
}
```

---

## What NOT to Do

- ❌ Never use gradients
- ❌ Never use drop shadows
- ❌ Never use colored backgrounds for cards
- ❌ Never use decorative icons
- ❌ Never use loading spinners (use skeletons)
- ❌ Never use full-width banners for status
- ❌ Never use color for text hierarchy (use weight/size)
- ❌ Never use borders heavier than 1px
