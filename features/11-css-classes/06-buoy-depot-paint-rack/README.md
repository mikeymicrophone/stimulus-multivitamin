# CSS classes · 06 · Buoy depot paint rack

Port Angeles buoy depot. The rack names the low paint and the fresh
paint. Those classes are applied to the cans, which are targets.
The rack element does not wear them.

**What it teaches**

- `low` and `fresh` are `data-paint-rack-low-class` and
  `data-paint-rack-fresh-class` on the controller element.
- `classList.add(this.lowClass)` runs on a can target, not on the
  rack. Marking every can fresh removes `lowClass` and adds
  `freshClass` on each target.
- The nun can also carries `data-paint-rack-low-class="stray-low"`.
  Class attributes are read from the controller element, so
  `lowClass` stays `can-low` and `hasLowClass` is true because the
  rack wrote it. The reference says the class attribute has to be
  on the same element as `data-controller`.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The rack, three cans, importmap, and registration |
| [`paint_rack_controller.js`](paint_rack_controller.js) | Paints can targets from the rack's classes |

**Try it**

The rack opens "Rack connect. lowClass can-low. freshClass can-fresh.
hasLowClass true. Stray on the nun stray-low. Cans Nun bare, Can bare,
Special bare." Mark the nun low. The reading says "Rack nun. ... Cans
Nun can-low, Can bare, Special bare." Mark every can fresh. The
reading says "Cans Nun can-fresh, Can can-fresh, Special can-fresh."
The stray attribute is still `stray-low`, and `lowClass` is still
`can-low`.
