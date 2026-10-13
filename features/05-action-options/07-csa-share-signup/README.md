# Action options · 07 · CSA share signup

Thornfield Organics' 2026 share list. Joining must not leave the page and
must not run twice. Two side cards show that the order of options on a
descriptor is a real sequence, not a bag of flags. Two buttons show that
options which differ put actions on different native listeners.

**What it teaches**

- Several options chain: `submit->csa-signup#joinShare:prevent:once`.
  `:prevent` keeps the submit on this page. `:once` drops the listener after
  the first submit, so a second Join does not increment the join count.
  `joinShare()` also disables the button: `:prevent` is gone with the
  listener, and a second submit would otherwise GET `joined/`.
- Built-in filters run in descriptor order and AND together. Stimulus
  walks `Object.entries(eventOptions)` and stops calling later filters
  once one has failed.
  - `click->csa-signup#holdShare:prevent:self` still `preventDefault()`s a
    click on "What's a hold?", then `:self` rejects, so `holdShare()` does
    not run and the hash does not change.
  - `click->csa-signup#joinWaitlist:self:prevent` fails `:self` on
    "What's a waitlist?" first, never reaches `:prevent`, and the hash
    changes.
- `:prevent` / `:stop` / `:self` are also keys in the object that identifies
  a native listener. `click->…#logValidate:prevent click->…#logAnnounce`
  are two `addEventListener` calls, so both methods run. `:stop` would not
  skip the second either (`stopPropagation` hides ancestors, not siblings).
  `stopImmediatePropagation()` in `logGuard` *does* skip `logReceipt`, even
  on the same-option pair that shares one listener.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Share form, hold and waitlist cards, mixed-option buttons |
| [`csa_signup_controller.js`](csa_signup_controller.js) | Joins, holds, waitlists, and logs which methods ran |

**Try it**

Choose a family share and Brookhaven Green, then Join: the confirmation
stays on this page. Join again: the join count stays 1. Click "What's a
hold?" — the hash does not become `#hold-info` and no hold is placed.
Click "What's a waitlist?" — the hash becomes `#waitlist-info` and the
waitlist status is unchanged. Then click the card background of each.
Finally press both "Check the share…" buttons: the mixed-option button
logs `validateShare` then `announceHold`; the same-option button logs
only `validateShare`, because `logGuard` calls `stopImmediatePropagation()`.
