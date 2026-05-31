# Design System Document

## 1. Overview & Creative North Star: "The Precision Curator"

This design system is built to move beyond the transactional nature of e-commerce and into the realm of digital editorial. Our Creative North Star is **The Precision Curator**. We treat every product listing like a gallery piece and every interface element like a deliberate architectural choice.

The system breaks the "template" look by rejecting rigid, boxed-in layouts. Instead, we use **Intentional Asymmetry** and **Tonal Depth**. By utilizing white space as a structural element rather than a void, we create a premium experience where the interface breathes. Elements should overlap slightly, and typography scales should be dramatic, ensuring the user feels they are browsing a high-end lookbook rather than a generic database.

---

## 2. Colors & Surface Architecture

Our palette balances high-energy "Digital Blue" with a sophisticated range of cool grays and crisp whites.

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** To define boundaries, designers must use background color shifts. A section layout should transition from `surface` (#f9f9ff) to `surface-container-low` (#f0f3ff) to signal a change in context. This creates a "soft" interface that feels more organic and premium.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
- **Base Layer:** `surface` (#f9f9ff).
- **Secondary Content:** `surface-container` (#e7eefe).
- **Elevated Interactive Elements (Cards):** `surface-container-lowest` (#ffffff).
By nesting a `#ffffff` card inside a `surface-container-low` section, you achieve visual separation without a single line of CSS border.

### The "Glass & Gradient" Rule
To add "soul" to the digital experience:
- **Floating Navigation:** Use `surface-container-lowest` at 80% opacity with a `24px` backdrop blur (Glassmorphism).
- **Primary Actions:** Use a subtle linear gradient from `primary` (#0061a5) to `primary_container` (#0d99ff) at a 135-degree angle. This prevents the vibrant blue from feeling "flat" or "default."

---

## 3. Typography: Editorial Authority

We use a dual-font strategy to balance character with legibility.

- **Display & Headlines (Plus Jakarta Sans):** These are our "voice." Use `display-lg` (3.5rem) for hero sections with tight letter-spacing (-0.02em). This typeface conveys modern authority.
- **Interface & Body (Inter):** Inter is used for technical data, product descriptions, and navigation. It is chosen for its exceptional legibility at small scales. 

**Hierarchy Strategy:** 
Use `title-lg` (Inter, 1.375rem) for product names to maintain a clean, utilitarian feel, while using `headline-sm` (Plus Jakarta Sans, 1.5rem) for section headers to inject brand personality.

---

## 4. Elevation & Depth

We avoid traditional material shadows in favor of **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-highest` (#dce2f3) element placed on a `surface` background creates a natural recession.
- **Ambient Shadows:** If a component must float (e.g., a Quick-Buy modal), use an ultra-diffused shadow: `0px 24px 48px rgba(21, 28, 39, 0.06)`. The shadow color is derived from `on_surface` to keep it natural.
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in a high-density data table), use `outline_variant` (#bfc7d5) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text, `md` (0.75rem) corner radius. High-gloss finish.
- **Secondary:** `secondary_container` (#e2e2e5) fill with `on_secondary_container` text. No border.
- **Tertiary:** Ghost style. No fill, `primary` text. Focus state uses a `surface_container_high` background.

### Product Cards
Forbid divider lines. Use `surface-container-lowest` as the card base. Product imagery should have a `sm` (0.25rem) corner radius and be nested within the card with 16px of padding. Use `body-md` for price points to keep them clean and professional.

### Input Fields
- **Container:** `surface_container_low` fill.
- **Active State:** A 2px "Ghost Border" of `primary` at 40% opacity.
- **Label:** `label-md` using `on_surface_variant`.

### Chips (Filters/Categories)
Use `full` (9999px) roundedness. Unselected chips should match `secondary_container` with `on_secondary_container` text. Selected chips should use the `primary` fill to act as a vibrant visual anchor.

### Lists & Navigation
Never use horizontal rules (HR tags). Separation is achieved through 24px or 32px vertical gaps (Spacing Scale). For navigation items, use `title-sm` with a `primary` dot indicator for active states.

---

## 6. Do's and Don'ts

### Do
- **Do** use `display-lg` for impactful brand moments, even if it feels "too big"—embrace the editorial scale.
- **Do** use `surface-dim` (#d3daea) for footer areas to provide a weighted "ground" to the page.
- **Do** allow product images to break the container slightly (asymmetric overlap) to create a premium feel.

### Don't
- **Don't** use 100% black (#000000) for body text; use `on_surface` (#151c27) to maintain a soft, high-end contrast.
- **Don't** use sharp corners. Every interactive element should have at least a `sm` (0.25rem) radius to feel approachable.
- **Don't** use standard "drop shadows" on buttons; let the color and gradient define the clickability.
- **Don't** use dividers between list items. Use white space and `body-md` / `body-sm` hierarchy to separate info.

---

## 7. Responsive Grid Strategy

- **Desktop (1440px+):** 12-column grid, 80px margins, 24px gutters. Use off-center placements for hero text to drive the "curated" look.
- **Mobile (375px):** 4-column grid, 20px margins, 16px gutters. Stack components vertically but maintain the "No-Line" rule using subtle `surface-container` background blocks to separate product categories.