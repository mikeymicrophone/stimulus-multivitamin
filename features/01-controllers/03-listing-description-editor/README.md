# Controllers · 03 · Listing description editor

A listing agent at Fernbrook Realty rewrites the copy for a house going on the
market. Each field's wrapper carries several small controllers on one
element: `listing-draft` saves and restores drafts, `character-budget` counts
against the MLS field limit, and `fair-housing-check` flags wording the
compliance team rejects.

**What it teaches**

- One element can carry several controllers
  (`data-controller="listing-draft character-budget fair-housing-check"`), and
  each identifier gets its own independent instance on that element.
- Targets, values, and actions are namespaced by identifier, so one
  `<textarea>` is a target of all three controllers, and its `data-action`
  list routes the same `input` event to each of them.
- Controllers on one element connect in the order of their identifiers in
  `data-controller`. `listing-draft` is listed first so a restored draft is
  in the field before its siblings read it.
- Controllers that share an element should not fight over shared state. Each
  writes only its own targets and its own `data-*-state` attribute, and
  `listing-draft` tells the others about a discarded draft by firing a plain
  `input` event, not by calling them.
- Single-purpose controllers mix and match. The agents-only showing
  instructions field uses two of the three.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Listing form markup, importmap, and controller registration |
| [`listing_draft_controller.js`](listing_draft_controller.js) | Saves each field's draft to `localStorage` and restores it on connect |
| [`character_budget_controller.js`](character_budget_controller.js) | Counts characters against each field's limit |
| [`fair_housing_check_controller.js`](fair_housing_check_controller.js) | Lists flagged phrases and suggested replacements |

**Try it**

The headline and public remarks start with flagged phrases. Rewrite
"Family-friendly" and "master bedroom" and watch the findings clear while the
character count and draft status update from the same keystrokes. Reload the
page: your drafts come back, and the counts and findings match the restored
text. Use "Discard draft" to return a field to the published copy.
