# CSS classes · 03 · Netshed mend flags

La Conner netshed, mending week. The gillnet's urgent flag is three
utility classes. The purse seine's is two. The singular property
returns only the first token.

**What it teaches**

- One logical name, `urgent`, can list several classes separated by
  spaces. Repeated spaces are not tokens. The gillnet attribute
  `"ink-red   rule-thick  hang-high"` is three classes.
- `this.urgentClass` is the first token, `ink-red` on the gillnet
  and `chalk-blue` on the purse seine. The reference says the
  singular property returns the first class in the list.
- `this.urgentClasses` is the whole list.
  `classList.add(this.urgentClass)` paints the first token.
  `classList.add(...this.urgentClasses)` paints the stack.
  `classList.remove(...this.urgentClasses)` clears it. The tokens
  are not in the controller.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Gillnet and purse seine, importmap, and registration |
| [`mend_flag_controller.js`](mend_flag_controller.js) | Flags the first class or the whole stack |

**Try it**

The gillnet opens "Gillnet urgentClass ink-red. urgentClasses
["ink-red","rule-thick","hang-high"]. On the flag none." The purse
seine opens "Purse seine urgentClass chalk-blue. urgentClasses
["chalk-blue","stitch-tight"]. On the flag none." Flag the first
class on the gillnet. The reading says "On the flag ink-red." Flag
the whole stack. The reading says "On the flag ink-red rule-thick
hang-high." Clear the flag and it says "On the flag none." Flag the
whole stack on the purse seine. It says "On the flag chalk-blue
stitch-tight." The gillnet stays clear.
