# Color Mapping Guide for Light Mode Fix

## Replacement Rules

### Text Colors
- `text-hsem-gold` → `text-primary`
- `text-hsem-alabaster` → `text-foreground`
- `text-hsem-silver` → `text-muted-foreground`
- `text-hsem-navy` → `text-accent` or `text-background`
- `text-hsem-deep` → `text-background`

### Background Colors
- `bg-hsem-gold` → `bg-primary`
- `bg-hsem-alabaster` → `bg-background`
- `bg-hsem-silver` → `bg-muted`
- `bg-hsem-navy` → `bg-accent` or leave as is for dark backgrounds
- `bg-hsem-deep` → `bg-background`

### Border Colors
- `border-hsem-gold` → `border-primary`
- `border-hsem-alabaster` → `border-foreground`
- `border-hsem-silver` → `border-border`
- `border-hsem-navy` → `border-accent`

### Special Cases with Opacity
- `text-hsem-alabaster/70` → `text-foreground/70`
- `text-hsem-silver/60` → `text-muted-foreground/60`
- `border-hsem-silver/20` → `border-border/20`
- `bg-hsem-gold/10` → `bg-primary/10`

## Files to Update
All component and page files found in previous grep
