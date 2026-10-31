# Design

Warm beige background, near-black text, oversized headings, thin rules, and wide spacing. Projects and credentials are plain lists. Circular hero buttons and the floating profile card provide the main shaped elements. The footer reverses the colors.

## Colors

Defined in `src/app/globals.css`. Use the Tailwind tokens when adding styles.

| Token     | Value                                                 | Use                                   |
| --------- | ----------------------------------------------------- | ------------------------------------- |
| `primary` | `#e2441d`                                             | Hover, input focus, errors, selection |
| `base`    | `#dcd3bd`                                             | Background, text on dark surfaces     |
| `inverse` | `#111110`                                             | Text, buttons, footer background      |
| `muted`   | `color-mix(in srgb, var(--inverse) 70%, var(--base))` | Descriptions and metadata             |
| `line`    | `color-mix(in srgb, var(--inverse) 40%, transparent)` | Dividers                              |

## Type

Local fonts are loaded in `src/app/layout.tsx`: Bricolage Grotesque (700, 800) for headings, Inter (400, 500, 600) for body text, and system monospace for labels and technology lists.

Reuse the classes in `globals.css`:

| Class | Use                                  |
| ----- | ------------------------------------ |
| `.t1` | Hero name                            |
| `.t2` | Section headings                     |
| `.t3` | Project, role, and credential titles |
| `.t4` | Summaries                            |
| `.t5` | Descriptions and supporting details  |
| `.t6` | Experience points                    |
| `.t7` | Skills and technology lists          |
| `.t8` | Form labels and footer text          |

Headings use tight tracking; `.t1` and `.t2` have line heights of 0.8 and 0.9. Numbered classes use viewport-based sizing below 384px, then fixed sizes at each breakpoint. `.t6` and `.t7` currently get smaller from `sm` to `md`; check those values before changing the scale.

Selected name text turns orange with a transparent background. This prevents the selection rectangle from covering adjacent letters at the tight leading.

## Layout

Page order: Hero → About → Projects → Experience → Education → Certifications → Skills → Contact → Footer.

- `Section`: 5% side padding, `pb-48`, and `mb-12` below the `.t2` heading. Contact also uses this component.
- Hero: 5% side padding, `pt-24`, `pb-48`.
- Footer: 5% side padding.
- Projects: full-width rows below `lg`; a 9/3 split for text and arrow from `lg`. Descriptions stop at `54ch`.
- Experience points and contact form: `max-w-3xl`.
- Dividers: shared `Separator` component.

## Controls and feedback

Hero links wrap in a row below `xl` and stack in the upper-right corner from `xl`. CV and profile buttons are filled; social and contact links are outlined.

The profile card opens from the desktop name on hover or keyboard focus, or from the profile button on smaller screens. Escape, blur, and outside pointer presses close it. It fades over 200ms and switches from vertical to horizontal at `xl`.

Project arrows link to a new tab. The row content slides in on scroll.

Contact inputs have transparent backgrounds and bottom borders. Focus and errors use the primary color. Invalid submissions focus the first invalid field. Sending disables the fields and button. Failure keeps the message and shows an alert; success clears the form and shows a dismissible toast for five seconds, with a 400ms transition.

Footer copy buttons show a checkmark for two seconds after copying.

## Motion

`Slide` in `src/components/Motion.tsx` renders a `div`. It accepts `children`, `className`, `delay` in seconds, `inView`, and `animation`. Keep animation styling in `globals.css`; the component only controls when the class is applied.

| Animation class          | Applied to                                                       | Duration | Trigger                             |
| ------------------------ | ---------------------------------------------------------------- | -------- | ----------------------------------- |
| `slide-up`               | Hero name lines                                                  | 1s       | Page load; second line delayed 0.2s |
| `slide-up-short-summary` | Hero summary                                                     | 2s       | Page load                           |
| `slide-up-section`       | Shared section titles                                            | 1s       | Scroll                              |
| `slide-up-long-summary`  | About summary                                                    | 1s       | Scroll                              |
| `slide-left`             | Project, experience, education, certification, and skill entries | 1s       | Scroll                              |

Upward animations move from `translateY(100px)` to zero. Leftward animations move from `translateX(200px)` to zero. Both fade from zero to full opacity and use `cubic-bezier(0.22, 1, 0.36, 1)` with `both` fill mode.

With `inView`, items start hidden through `slide-pending`. The animation begins once they enter 120px past the viewport's bottom edge (`margin: "0px 0px -120px 0px"`) and runs once. Scroll reveals depend on JavaScript.

```tsx
<Slide inView animation="slide-left">
  {content}
</Slide>
```

Reduced motion is handled centrally in `globals.css`: pending items stay visible, animation delay becomes zero, and animation and transition durations become `0.01ms`. Do not add reduced-motion hooks to each `Slide`.

## Accessibility

Icon buttons have accessible names. Form errors use `aria-invalid`, `aria-describedby`, and `role="alert"`; the success toast uses `role="status"`. Decorative rules and arrows are hidden from assistive technology.

Non-input controls use a 2px inverse focus outline with a 3px offset; inputs use a primary border. Check the outline's visibility on dark surfaces. CSS disables smooth scrolling for reduced motion. The profile card and contact toast still use Motion-driven animations rather than the CSS slide keyframes.

Without JavaScript, the contact form is hidden and replaced by a prompt to use email or phone.

## Files

Content lives in `src/data/*.data.ts`, shared styles in `src/app/globals.css`, and components in `src/components/`. Reuse `Section`, `Separator`, `Slide`, and `icon.tsx`. Write static Tailwind classes directly in markup rather than assigning them to constants.
