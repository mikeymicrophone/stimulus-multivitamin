# Keyboard filters

keydown.enter, keydown.esc, arrow keys, modifier combinations like ctrl+s and meta+k, and custom key names added through the schema's keyMappings.

Official reference: <https://stimulus.hotwired.dev/reference/actions#keyboardevent-filter>

## Examples (13 of 13 bottled)

01. [Pharmacy refill confirmation](01-pharmacy-refill-confirmation/) — available
02. [Clinic message composer](02-clinic-message-composer/) — available
03. [Darkroom contact sheet](03-darkroom-contact-sheet/) — available
04. [Pub quiz buzzers](04-pub-quiz-buzzers/) — available
05. [Ferry radio talkback](05-ferry-radio-talkback/) — available
06. [Recipe dietary tags](06-recipe-dietary-tags/) — available
07. [Medication pack tabs](07-medication-pack-tabs/) — available
08. [Vet appointment calendar](08-vet-appointment-calendar/) — available
09. [Kitchen expo menubar](09-kitchen-expo-menubar/) — available
10. [Newsroom assignment board](10-newsroom-assignment-board/) — available
11. [Legal brief editor](11-legal-brief-editor/) — available
12. [Hospital command palette](12-hospital-command-palette/) — available
13. [Deli counter scale](13-deli-counter-scale/) — available

## What each scenario adds

| Slot | Keyboard-filter technique |
| --- | --- |
| 01 | `keydown.esc@document`; a local filter misses a sibling field |
| 02 | `keydown.enter` vs `keydown.shift+enter` on a textarea |
| 03 | `keydown.left` / `keydown.right` on a focused filmstrip, not `@window` |
| 04 | `a`–`d` and `1`–`4` on `@window`; skip keys that started in an input |
| 05 | The same Space key on `keydown`, `keyup`, and `keypress`; `keypress.esc` never fires |
| 06 | Filters on an `<input>`; comma and Backspace are not built-in names |
| 07 | Roving tabindex: `home`, `end`, `left`, `right`, `space`, `enter` |
| 08 | `page_up` / `page_down`, `alt+page_up` for year, `home` / `end` on a grid |
| 09 | Menubar navigation; `alt+r` vs matching `event.code` for macOS Option |
| 10 | `alt+arrows`, `shift+alt+arrows`, `ctrl+enter`; every modifier flag must match |
| 11 | `meta+s` and `ctrl+s` on `@window` from contenteditable, input, and textarea |
| 12 | Command palette: `meta+k` / `ctrl+k`, then a listbox of `up` / `down` / `enter` / `esc` |
| 13 | Custom `keyMappings` (`plus`, `f2`, `backspace`); spreading `defaultSchema` |

Planned titles are proposals, not commitments. See
[CONTRIBUTING.md](../../CONTRIBUTING.md) before filling a slot.
