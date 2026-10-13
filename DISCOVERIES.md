# Discoveries

Non-obvious or undocumented Stimulus behaviors found while bottling this
catalog, plus a few browser and DOM gotchas that show up inside Stimulus
code, and one note about serving the scenarios. Every entry was verified
on **Stimulus 3.2.2** (the version every page pins) either by a scenario
in this repository or by a scripted browser check against that scenario.

Each entry has a short title, what happens, why it matters, what to do
about it, and a link to the scenario that shows it. Entries that sit on
the line between Stimulus and the platform get a one-line note saying
why they are in the section they are in.

## Controllers

### Targets vanish in `disconnect()` after the identifier is removed

**What happens.** Removing a controller's token from `data-controller`
disconnects that instance while the element stays in the document. During
`disconnect()`, the element no longer matches
`[data-controller~="that-identifier"]`, so target lookups come back empty.

**Why it matters.** Cleanup that reads `this.toolbarTarget` or
`this.hasSaveButtonTarget` does nothing. The toolbar stays visible, fields
stay `contenteditable`, and buttons stay bound to a controller that is
gone.

**What to do.** Keep the elements `disconnect()` has to restore, from
`connect()` (or from the action that started the work), in instance
properties.

**Seen in:** [Recipe card collection](features/01-controllers/05-recipe-card-collection/),
[Pilot boarding board](features/08-target-callbacks/01-pilot-boarding-board/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

### Action params turn all-digit strings into numbers

**What happens.** `data-[identifier]-[name]-param` values go through
`JSON.parse`. A string of digits with no leading zero becomes a number,
so `"482917"` arrives as `482917` and is not `===` to the printed tag
`"482917"`. A leading zero is illegal in JSON, so `"01482"` and a UPC
like `"084271003318"` stay strings — `Number("084271003318")` would have
dropped the zero, and Stimulus params do not. A digit string past
`Number.MAX_SAFE_INTEGER` (`9007199254740993`) becomes a number and is
rounded. Wrapping the attribute in JSON quotes (`'"482917"'`) forces a
string.

**Why it matters.** The failure is inconsistent. A coat-check tag or a
member id that is only digits will not compare equal to the printed
string. A zip or a lot code that happens to start with zero survives,
which makes the bug look random. Long tokens lose a digit either way
once they parse as numbers.

**What to do.** Keep codes you must match character for character in a
String value, in `value=""`, or in a `data-*` attribute you read
yourself. To force a param to stay a string, wrap it in JSON quotes.
Don't put a bare all-digit identifier in an action param.

**Seen in:** [Warehouse pick list](features/01-controllers/12-warehouse-pick-list/)
(the scanner buttons keep every UPC in `value=""`),
[Concert hall coat check](features/06-action-parameters/04-concert-hall-coat-check/).

## Lifecycle callbacks

### Callback order is initialize, value-changed, target-connected, then connect

**What happens.** On the way in, Stimulus calls `initialize()` once,
then every `[name]ValueChanged()`, then every `[name]TargetConnected()`,
then `connect()`. On the way out it calls `disconnect()` first, then
`[name]TargetDisconnected()`.

**Why it matters.** A `*TargetConnected()` that observes a target can't
create the observer in `connect()` — `connect()` hasn't run yet. A
`*ValueChanged()` that looks up a parent in `connect()` has the same
problem. Teardown that expects targets to disappear first is also wrong:
`disconnect()` still sees them.

**What to do.** Create observers in `initialize()`. Look up neighbors
on first use, in a getter, and keep the reference. Tear targets down in
`*TargetDisconnected()` if the work is per-target, and in `disconnect()`
if it is per-instance.

**Seen in:** [Infinite-scroll product feed](features/02-lifecycle-callbacks/05-infinite-scroll-product-feed/),
[Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/),
[Pilot boarding board](features/08-target-callbacks/01-pilot-boarding-board/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

### Value-changed callbacks re-fire on every reconnect

**What happens.** Moving an element, or removing it and putting the same
node back, runs `[name]ValueChanged()` again with the same value. The
callback is not only for writes.

**Why it matters.** A callback that starts a clock, opens a socket, or
increments a counter will do that on every drag-reorder or filter toggle.

**What to do.** Make the callback idempotent: starting something that is
already running is a no-op.

**Seen in:** [Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/).

### A move is `disconnect()` then `connect()` on the same instance, and `isConnected` is true inside `disconnect()`

**What happens.** `element.parentNode.insertBefore(...)` that relocates a
connected node fires `disconnect()` and then `connect()` on the existing
instance. Inside that `disconnect()`, `this.element.isConnected` is already
`true` — the node is in its new place before Stimulus reacts.

**Why it matters.** Teardown that always clears timers and document
listeners will kill a drag session or a clock at the first reorder. You
cannot tell a move from a real removal by checking `isConnected` alone if
you also remove the identifier from `data-controller` (that case is
`isConnected === true` too).

**What to do.** Skip teardown when `this.element.isConnected` is true.
If the identifier might be removed while the element stays put, also
check `this.element.matches('[data-controller~="…"]')`.

**Seen in:** [Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/),
[Canal lock queue](features/08-target-callbacks/04-canal-lock-queue/).

**Why this section.** The element staying in the document is the DOM;
the surprise is that Stimulus still runs `disconnect()` then `connect()`
for that move.

### Re-inserting an element reuses the instance and skips `initialize()`

**What happens.** `element.remove()` followed by putting the same node
back reconnects the existing controller. `initialize()` does not run
again. New HTML, even if it looks identical, gets a new instance.

**Why it matters.** Deadlines, subscriptions, and "run once" setup that
belong in `initialize()` survive a hide/show. Reloading the same-looking
markup from the server does not — you get a fresh instance and a restarted
clock.

**What to do.** Put per-instance setup in `initialize()`, and per-appearance
setup in `connect()`. Treat fetched HTML as a new object.

**Seen in:** [Auction lot countdowns](features/02-lifecycle-callbacks/01-auction-lot-countdowns/),
[Resizable dashboard tiles](features/02-lifecycle-callbacks/07-resizable-dashboard-tiles/).

### Parent-before-child connect order only holds when both are registered before start

**What happens.** If every identifier is registered before
`Application.start()`, Stimulus connects in document order and a parent
connects before its children. A controller registered later (lazy load,
code splitting, `register()` after an `await`) connects at registration
time, after children that have been connected for a while.

**Why it matters.** `connect()` that does `closest()` and talks to a
parent will find nothing if the parent isn't registered yet. The reverse
assumption — "my children are already connected" — is also false on first
paint.

**What to do.** Handshakes have to work in both orders: the child retries
or waits to be collected, and the parent notices children that connect
later.

**Seen in:** [Insurance quote connect order](features/02-lifecycle-callbacks/11-insurance-quote-connect-order/).

### The parent disconnects first when a subtree is removed

**What happens.** Removing a parent element disconnects the parent, then
each child. A child's `disconnect()` cannot count on the parent still
being connected.

**Why it matters.** A child that reports "I'm leaving" to its parent during
`disconnect()` may call into a parent that has already stopped accepting
calls.

**What to do.** The parent should ignore late calls after it disconnects.
The child should keep a reference from `connect()` and tolerate a parent
that is already gone.

**Seen in:** [Insurance quote connect order](features/02-lifecycle-callbacks/11-insurance-quote-connect-order/).

### There is no unload callback

**What happens.** Closing the tab, reloading, or navigating away does not
run `disconnect()`. Stimulus watches the DOM; unloading the document does
not remove elements.

**Why it matters.** A pending autosave, an open socket, or a `document`
listener that you only clean up in `disconnect()` is still there when the
page dies — or, for the save, never happens.

**What to do.** Declare `pagehide@window` and `visibilitychange@document`
actions for work that must run as the visitor leaves. Stimulus removes
those listeners when the controller disconnects for a real DOM removal.

**Seen in:** [Autosaving draft editor](features/02-lifecycle-callbacks/06-autosaving-draft-editor/).

### Lifecycle callbacks are batched after the DOM change

**What happens.** `connect()` and `disconnect()` run from a
`MutationObserver` callback, as a microtask after the code that changed
the DOM finishes. On the line after `element.remove()`, the controller
is still connected.

**Why it matters.** Counting instances, destroying a third-party widget,
or reading layout immediately after a DOM write is one frame too early.

**What to do.** Wait until after Stimulus has reacted (`queueMicrotask`,
or the next animation frame) before asking "is it gone?".

**Seen in:** [Pet clinic visit date pickers](features/02-lifecycle-callbacks/04-pet-clinic-visit-date-pickers/).

### Events from a detached element don't reach old ancestors

**What happens.** Once an element is out of the document,
`this.element.closest()` can't find its old ancestors, and a bubbling
event dispatched from it never arrives there either.

**Why it matters.** A lot, tile, or row that announces "my clock
stopped" from `disconnect()` by dispatching on `this.element` is talking
to nobody.

**What to do.** Keep a reference to the parent element from `connect()`,
and dispatch there with `this.dispatch(name, { target: parentElement })`.

**Seen in:** [Auction lot countdowns](features/02-lifecycle-callbacks/01-auction-lot-countdowns/).

**Why this section.** The silent `closest()` / bubbling failure is the
DOM; it's here because Stimulus calls `disconnect()` after the node has
already left.

## Actions

### A descriptor without an event name is dropped if the element has no default

**What happens.** Stimulus fills in a default event only for `<a>`,
`<button>`, `<details>`, `<form>`, `<input>`, `<select>`, and
`<textarea>`. On anything else (`<div>`, `<td>`, `<label>`, `<span>`),
a bare `identifier#method` cannot be built. Stimulus skips that token
and logs nothing.

**Why it matters.** A clickable `<td>` or a `<div>` used as a button
silently does nothing.

**What to do.** Name the event: `click->harvest-board#editCell`.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/)
(the defaults table),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/)
(every cell names `click`).

### `<input type="button">` defaults to `input`, which it never fires

**What happens.** The default for `<input>` is `input`, except
`type="submit"` which is `click`. The comparison is exact and
case-sensitive: `type="SUBMIT"` falls back to `input`.
`<input type="button">` never fires `input`.

**Why it matters.** `data-action="pizza-order#repeatLastOrder"` on a
reset-looking input does nothing. No error appears.

**What to do.** Write `click->…` on `<input type="button">`, or use a
`<button type="button">`.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/).

**Why this section.** The element never firing `input` is the browser;
it's here because Stimulus is what assigned `input` as that default.

### `stopPropagation()` does not stop the next action on the same element

**What happens.** All of an element's actions for one event share one
native listener. Stimulus runs them in `data-action` order and only
stops the list when `event.stopImmediatePropagation()` is called.
`stopPropagation()` still lets the rest of that list run; it only hides
the event from ancestors, `@document`, and `@window`.

**Why it matters.** A `validate` action that "stops the event" with
`stopPropagation()` will still be followed by `subscribe` on the same
element. The invalid form is sent.

**What to do.** Call `event.stopImmediatePropagation()` to skip later
actions on the same element. Put the guard first in the list.

**Seen in:** [Newsletter signup with live validation](features/03-actions/02-newsletter-signup-with-live-validation/).

### A rejected promise from an action never reaches `handleError`

**What happens.** Stimulus wraps the call to the action method. An
`async` method returns a promise before its body fails, so the throw
happens later, as an `unhandledrejection` on `window`.

**Why it matters.** `application.handleError()` never sees a failed
clipboard write or a failed fetch. The console shows a page error; your
error overlay does not.

**What to do.** Catch inside the action and update the UI yourself.

**Seen in:** [API token copy button](features/03-actions/07-api-token-copy-button/).

### A value's changed callback runs after the method that set the value has returned

**What happens.** Writing `this.ratingValue = 4` updates the data
attribute immediately. `[name]ValueChanged()` runs from a
`MutationObserver`, after the method returns.

**Why it matters.** Dispatching a custom event on the next line arrives
before the hidden field or the aria attributes have been updated, so a
parent that reads the field from the event sees the old value.

**What to do.** Dispatch from `[name]ValueChanged()`, once the markup
matches the value.

**Seen in:** [Product star rating](features/03-actions/08-product-star-rating/).

### `@window` and `@document` are the only global targets a descriptor can name

**What happens.** The descriptor grammar only accepts `@window` or
`@document`. `resize@visualViewport->…` or `change@matchMedia->…` does
not match that part of the pattern, so the whole string before `->`
becomes the event name. Stimulus listens on the element for an event
literally called `resize@visualViewport`, which never fires. No error is
logged.

**Why it matters.** A drawer that should follow a breakpoint, or a
banner that should follow `visualViewport`, silently never updates.

**What to do.** Listen on `@window` for `resize` (or on `@document` /
`@window` for an event that actually fires there) and read
`matchMedia()` or `visualViewport` inside the method.

**Seen in:** [Responsive navigation drawer](features/03-actions/05-responsive-navigation-drawer/).

### An action outside the controller's element silently does nothing

**What happens.** Stimulus only invokes an action if the event's path
is inside that controller's element (or the action is `@window` /
`@document` and the controller is still connected). A `data-action` on
markup outside the element is parsed and then ignored. No error is
logged.

**Why it matters.** A promo strip, third-party embed, or footer rendered
outside the page shell can look wired and never call the controller.

**What to do.** Move the controller up so it contains the control, or
send the request through a global event (`hashchange@window`, a custom
event on `document`) that the controller already listens for.

**Seen in:** [Responsive navigation drawer](features/03-actions/05-responsive-navigation-drawer/).

### Nested controllers with the same identifier hide inner events from the outer one

**What happens.** A controller's actions, including `@document` and
`@window` ones and actions on its own element, skip events that start
inside a nested element with the same identifier. Stimulus treats that
nested element as someone else's scope.

**Why it matters.** This is what makes a submenu's Escape close only the
submenu, and what keeps focus moving into the submenu from looking like
focus leaving the outer menu. It also means a click inside the submenu
never reaches the outer menu's `click@document` action, so an item that
should close the whole tree has to close it on purpose.

**What to do.** Let the inner controller handle events that start inside
it. Close the tree through a method the item calls
(`closeMenuTree()`), not by hoping the outer `@document` action will see
the click.

**Seen in:** [Menu that closes on outside click](features/03-actions/09-menu-that-closes-on-outside-click/).

### Removing the action's own element skips later actions for controllers outside the hole

**What happens.** After an action detaches its element, Stimulus still
walks the rest of that element's `data-action` list, but it only invokes
an action whose element is still inside its controller. A later
`shopping-cart#recalculate` on a button that just left the cart is
skipped. A later `cart-line#…` on the same button still runs, because
the button is still inside the detached line.

**Why it matters.** `cart-line#remove shopping-cart#recalculate` on
Remove looks right and leaves the totals stale.

**What to do.** Have the parent remove the child, then recalculate, in
one method.

**Seen in:** [Cart quantity steppers](features/03-actions/04-cart-quantity-steppers/).

### Actions on a brand-new element are not bound in the same turn

**What happens.** Stimulus notices `data-action` (and `data-controller`)
from a `MutationObserver`, after the code that inserted the node
returns. `button.click()` on the next line hits an element with no
actions. A microtask later (`await Promise.resolve()` or
`queueMicrotask`) is enough.

**Why it matters.** "Use these dates" that renders a month and then
clicks the offer's day does nothing. A same-turn click on a newly added
spreadsheet cell also does nothing.

**What to do.** Call the method directly (`chooseDate(isoDate)`,
`startEdit(cell)`) instead of synthesizing a click. Wait a microtask
only if you truly need the event to go through Stimulus.

**Seen in:** [Hotel booking date range](features/03-actions/10-hotel-booking-date-range/),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/).

### Method names are used exactly as written

**What happens.** Stimulus camelizes identifiers, value attributes, and
param names. It does not camelize action method names.
`unsaved-changes#save-profile` looks for a method literally called
`"save-profile"`.

**Why it matters.** The missing-method error is logged only when the
event fires. For `beforeunload@window`, that is the moment the visitor
leaves.

**What to do.** Spell the method the way it is declared. Name methods
for what they do (`saveProfile`, `trackChanges`), not for the event
(`handleInput`, `onSubmit`).

**Seen in:** [Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/).

### Hidden elements keep their actions

**What happens.** `[hidden]` only affects display. Stimulus does not
unbind actions on a hidden field. A radio the guest already chose still
listens, and a checkbox that is now on a hidden step still runs its
action if something dispatches `input` on it.

**Why it matters.** Branching UIs can keep answers on a hidden path
without rebinding when the path comes back. They can also be surprised
when a hidden control still reacts.

**What to do.** Treat hiding as hide, not as teardown. Clear values only
when you mean to.

**Seen in:** [Branching customer survey](features/03-actions/12-branching-customer-survey/).

**Why this section.** `[hidden]` only hides the element; it's here
because Stimulus is what leaves the actions bound.

### One click runs actions in a fixed order: element, ancestors, `@document`, `@window`

**What happens.** For a single event Stimulus runs:

1. actions on the event's target element, in `data-action` order;
2. actions on its ancestors, innermost first;
3. `@document` actions;
4. `@window` actions.

**Why it matters.** A toggle that opens a menu has already opened it
when that menu's `click@document` "outside" action runs for the same
click, so the menu does not immediately close. `stopPropagation()` in
the toggle would keep other open menus from hearing the click at all.

**What to do.** Let the order work for you: open first (on the button),
then let `@document` close everyone else. Don't stop propagation on a
toggle that shares the page with other menus.

**Seen in:** [Menu that closes on outside click](features/03-actions/09-menu-that-closes-on-outside-click/),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/).

## Keyboard filters

### Filters match every modifier flag, not just the named key

**What happens.** `keydown.enter` compares `event.key` to `"Enter"` *and*
requires `shiftKey`, `altKey`, `ctrlKey`, and `metaKey` to be false.
Shift+Enter does not match. `keydown.alt+left` does not match
Alt+Shift+Left. The order of modifiers in the descriptor does not matter
(`shift+alt+left` and `alt+shift+left` are the same set).

**Why it matters.** A chat composer that "sends on Enter" will also send
on Shift+Enter — the usual "newline" chord — unless Shift+Enter is a
separate descriptor. A kanban that moves on Alt+arrows will ignore
Shift+Alt+arrows until those combinations are declared too.

**What to do.** Declare each chord you want: `keydown.enter` and
`keydown.shift+enter`, or `keydown.alt+left` and `keydown.shift+alt+left`.

**Seen in:** [Clinic message composer](features/04-keyboard-filters/02-clinic-message-composer/),
[Newsroom assignment board](features/04-keyboard-filters/10-newsroom-assignment-board/).

### A local key filter never sees keys from a sibling

**What happens.** `keydown` goes to the focused element and bubbles
through its ancestors. A `keydown.esc` action on a dialog element does
not run while focus is in a sibling field. `keydown.esc@document` does.

**Why it matters.** Confirmation dialogs, palettes, and lightboxes that
listen on themselves miss Escape as soon as the visitor is typing
somewhere else on the page.

**What to do.** Put dismiss/open shortcuts on `@document` or `@window`,
and return early when the UI they control is not active.

**Seen in:** [Pharmacy refill confirmation](features/04-keyboard-filters/01-pharmacy-refill-confirmation/),
[Darkroom contact sheet](features/04-keyboard-filters/03-darkroom-contact-sheet/)
(the opposite: left/right stay on the filmstrip on purpose).

### `@window` filters still run while typing in a field

**What happens.** `keydown` bubbles to `window`. A
`keydown.a@window` action fires while the caret is in an `<input>`,
`<textarea>`, or `contenteditable` element. Stimulus does not skip
those targets.

**Why it matters.** Letter-key shortcuts steal keystrokes from team
names, notes, and captions. Save shortcuts (`ctrl+s`) usually *should*
win from those fields; answer keys usually should not.

**What to do.** Ignore the event when `event.target` is inside an
editable field, or, for a command palette, let the shortcut win on
purpose.

**Seen in:** [Pub quiz buzzers](features/04-keyboard-filters/04-pub-quiz-buzzers/)
(skip the team-name field),
[Hospital command palette](features/04-keyboard-filters/12-hospital-command-palette/)
(Ctrl+K wins from chart notes),
[Legal brief editor](features/04-keyboard-filters/11-legal-brief-editor/)
(save from every field).

### Unknown filter names throw when a key arrives, not when the page parses

**What happens.** `keydown.comma` parses as a valid descriptor. The first
keyboard event that reaches that action throws
`Error: contains unknown key filter: comma` into `handleError`. The
built-in map has `enter`, `tab`, `esc`, `space`, `up`, `down`, `left`,
`right`, `home`, `end`, `page_up`, `page_down`, `a`–`z`, and `0`–`9`.
`page-up`, `escape`, `backspace`, `comma`, and `plus` are not in it.

**Why it matters.** The page looks fine until someone presses a key.
`page_up` is the real name; `page-up` is an unknown filter.

**What to do.** Add the name to `schema.keyMappings`, or read `event.key`
from an unfiltered `keydown` action.

**Seen in:** [Recipe dietary tags](features/04-keyboard-filters/06-recipe-dietary-tags/)
(comma and Backspace via `event.key`),
[Vet appointment calendar](features/04-keyboard-filters/08-vet-appointment-calendar/)
(`page_up`, not `page-up`),
[Deli counter scale](features/04-keyboard-filters/13-deli-counter-scale/)
(custom mappings).

### Custom mappings belong on the schema passed to `Application.start()`

**What happens.** `Action` reads `this.schema.keyMappings` from the
application. Spreading `defaultSchema.keyMappings` and adding `plus: "+"`,
`f2: "F2"`, and so on makes `keydown.plus` and `keydown.f2` work.
Replacing `keyMappings` outright drops `enter` and `esc`. The comparison
is `event.key`, case-insensitive, still with exact modifier flags.

**Why it matters.** A scale that maps `plus` but forgets to keep the
defaults can no longer listen for Enter. Numpad `+` is `event.key === "+"`
with `shiftKey === false`; the main-keyboard `+` is Shift+`=` (`event.key`
`"+"` with `shiftKey === true`), so it needs `keydown.shift+plus`.

**What to do.** Pass `{ ...defaultSchema, keyMappings: { ...defaultSchema.keyMappings, plus: "+" } }`
into `Application.start()`. Declare both the shifted and unshifted
forms when the produced character is the same.

**Seen in:** [Deli counter scale](features/04-keyboard-filters/13-deli-counter-scale/).

### Filters only apply to `keydown`, `keyup`, and `keypress`

**What happens.** The descriptor parser treats `.esc` as a key filter
only when the event name is `keydown`, `keyup`, or `keypress`. On any
other event it concatenates the suffix, so `click.esc` listens for an
event literally named `click.esc`, which never fires. No error is logged.

**Why it matters.** A "click the Escape-looking button" descriptor that
borrows the keyboard-filter spelling fails silently.

**What to do.** Use keyboard event names for key filters. The three
events are not interchangeable: `keydown` repeats while held, `keyup`
fires once, and `keypress` does not fire for Escape, Tab, or arrows.

**Seen in:** [Ferry radio talkback](features/04-keyboard-filters/05-ferry-radio-talkback/).

**Why this section.** The silent `click.esc` miss is Stimulus's parser;
which keys fire `keypress` is the browser (see below).

### Letter filters ignore case on `event.key`, but Shift is still a modifier

**What happens.** `keydown.a` lowercases both sides, so Caps Lock + A
matches (`event.key` is `"A"`, `shiftKey` is false). Shift+A does not,
because `shiftKey` is true and the filter did not name `shift`.

**Why it matters.** A buzzer that should accept `A` with Caps Lock on
already does. One that should accept Shift+A needs `keydown.shift+a`.

**What to do.** Treat Caps Lock as `keydown.a`. Declare `shift` when you
mean the Shift key.

**Seen in:** [Pub quiz buzzers](features/04-keyboard-filters/04-pub-quiz-buzzers/).

### `alt+letter` compares `event.key`, which Option rewrites on macOS

**What happens.** `keydown.alt+r` requires `event.key.toLowerCase() === "r"`
and `altKey === true`. On macOS, Option+R often produces a different
character (`®`, `å`, …), so the filter misses. `event.code` stays `KeyR`.

**Why it matters.** Menu mnemonics that look right in the markup fail on
Mac keyboards.

**What to do.** Keep the Stimulus filter for Windows/Linux, and also
match `event.altKey && event.code === "KeyR"` from an unfiltered
`keydown@window` action.

**Seen in:** [Kitchen expo menubar](features/04-keyboard-filters/09-kitchen-expo-menubar/).

### There is no `cmdorctrl` modifier

**What happens.** Meta is Command on macOS and the Windows key elsewhere.
Ctrl is Control on every platform. Stimulus has no combined modifier.
`keydown.meta+s` and `keydown.ctrl+s` are two descriptors.

**Why it matters.** A save shortcut declared only as `ctrl+s` never runs
for ⌘S. One declared only as `meta+s` never runs for Ctrl+S on Windows
and Linux.

**What to do.** Declare both. `preventDefault()` on each so the browser's
Save dialog does not appear.

**Seen in:** [Legal brief editor](features/04-keyboard-filters/11-legal-brief-editor/),
[Hospital command palette](features/04-keyboard-filters/12-hospital-command-palette/).

## Action options

### `:once` is spent by the first event, even when a keyboard filter rejects it

**What happens.** `:once` is `{ once: true }` on the native listener for
that event name. `keydown.enter@document->…:once` still receives every
`keydown`. The first key — a letter in a field, Shift, Tab — invokes the
listener. The keyboard filter then rejects it, the method never runs, and
the browser has already removed the listener. Later Enter does nothing.

**Why it matters.** A front desk that "encodes on Enter once" silently
dies as soon as anyone types the guest's name. The page looks fine. The
button beside it, with `click->…:once`, still works, because that is a
different event.

**What to do.** Do not put `:once` on a filtered `keydown` / `keyup` /
`keypress`. Guard the method with an instance flag, or put `:once` on
`click` / `submit`.

**Seen in:** [Hotel key encoder](features/05-action-options/09-hotel-key-encoder/).

### `:once` takes `:prevent` with it

**What happens.** `:once` is `{ once: true }` on the native listener.
After the first event the browser removes that listener. `:prevent` was
a Stimulus filter on the same listener, not a separate one. A second
click on a Charge card `<a href="receipt/">` or a second Join submit
is a plain browser click/submit again.

**Why it matters.** The first Charge stays on the box office page. The
second follows `receipt/` and looks like `:once` "didn't work", when
what actually happened is `:prevent` stopped working.

**What to do.** After a `:prevent:once` action runs, disable the control
or remove the `href` / `action`. Don't leave a live link or submit
button whose only guard was that listener.

**Seen in:** [Community theater box office](features/05-action-options/01-community-theater-box-office/),
[CSA share signup](features/05-action-options/07-csa-share-signup/),
[Permit photo uploader](features/05-action-options/13-permit-photo-uploader/).

### Built-in filters run in descriptor order and short-circuit

**What happens.** Stimulus walks `Object.entries(eventOptions)` and
assigns `passes = passes && filter(...)`. `:prevent:self` still calls
`preventDefault()` on a child click, then `:self` returns false and the
method does not run. `:self:prevent` fails `:self` on that child first,
never reaches `:prevent`, and the click's default (a hash change, a
navigation) goes through.

**Why it matters.** A card that "prevents and only handles self" does not
do those two things independently. The nested "What's a hold?" link either
loses its navigation or keeps it, depending on which token is written
first.

**What to do.** Put filtering options (`:self`, custom options) before
mutating ones (`:prevent`, `:stop`) when a rejected event should keep its
default. Put mutating ones first when the default must never happen, even
if the method will not run.

**Seen in:** [CSA share signup](features/05-action-options/07-csa-share-signup/),
[Permit photo uploader](features/05-action-options/13-permit-photo-uploader/)
(an offline drop still `:prevent`s, so the browser does not navigate to
the file).

### Actions with different option sets are different native listeners

**What happens.** The dispatcher keys listeners by event name plus every
option, including `:prevent`, `:stop`, `:self`, and custom names. In
Stimulus 3.2.2 that is not limited to `capture` / `once` / `passive`.
`click->csa-signup#logValidate:prevent click->csa-signup#logAnnounce` are
two `addEventListener` calls, so both methods run. `:stop` on the first
would not skip the second: `stopPropagation()` hides the event from
ancestors, not from other listeners on the same element.
`stopImmediatePropagation()` in a method *does* skip remaining listeners
on that target, including ones with a different option set.

**Why it matters.** Adding `:prevent` to the first of two actions does
not by itself stop the second. Assuming "different options mean
`stopImmediatePropagation()` can't see the other action" is also wrong;
that call is native and applies to the target.

**What to do.** If two actions on one control must both run, don't call
`stopImmediatePropagation()`. If the first must skip the second, call it
— or do the later work from the first method. Don't rely on `:stop` to
skip a sibling action.

**Seen in:** [CSA share signup](features/05-action-options/07-csa-share-signup/).

### A custom option that returns `undefined` blocks the action

**What happens.** `registerActionOption` callbacks are AND-ed into
`passes`. Returning `false` blocks, as the docs say. Returning nothing
also blocks, because `passes && undefined` is `undefined`. Returning
`true` is what lets the method run. `:open` yields `value: true`;
`:!open` yields `value: false` to the same callback.

**Why it matters.** A filter that `return event.target.open === value`
inside an `if (event.type == "toggle")` and forgets `return true` in the
`else` will swallow every non-toggle event on that descriptor.

**What to do.** Always return a boolean. Log `{ name, value, event,
element, controller }` while writing the filter; `element` is the node
that declared the action, not `event.target`, and `event.params` is
already filled in.

**Seen in:** [Metro fare FAQ](features/05-action-options/11-metro-fare-faq/),
[Community solar cancel](features/05-action-options/12-community-solar-cancel/)
(returning `false` is what keeps `cancelShare()` from running).

### `:!self` does not mean "only children"

**What happens.** The built-in `self` filter returns `element ===
event.target` when `value` is true, and returns `true` when `value` is
false. `:!self` therefore never filters. The comparison is to
`event.target`, not `event.currentTarget` — `currentTarget` is already
the declaring element for every click inside it.

**Why it matters.** An overlay that tries `:!self` to "handle the scan
but not the backdrop" handles both. Close has to omit `:self` instead.

**What to do.** Use `:self` for the backdrop. Give child controls their
own actions without `:self`. There is no built-in inverse.

**Seen in:** [County archives viewer](features/05-action-options/03-county-archives-viewer/).

### Keyboard filters run before action options

**What happens.** `Binding.handleEvent` asks `willBeInvokedByEvent` (the
key / modifier filter) before `applyEventModifiers` (`:prevent`,
`:stop`, `:self`, custom options). A key that fails the filter never
reaches `:prevent`. `keydown.enter->…:prevent` does not cancel
Shift+Enter.

**Why it matters.** Find-in-minutes that "prevents Enter from submitting
the form" still lets Shift+Enter through, because that chord is a
different filter.

**What to do.** Declare each chord you want to cancel. Leave the ones
you want the browser to keep (Shift+Enter in a field) off the
descriptor.

**Seen in:** [Clerk minutes editor](features/05-action-options/08-clerk-minutes-editor/).

### `:capture` runs before a child's `:stop`

**What happens.** `:capture` is `{ capture: true }`. That action runs
while the event is traveling down, before any bubble-phase child.
`:stop` calls `stopPropagation()` when *its* action runs, in the bubble
phase unless that child also asked for `:capture`. Capture-phase
ancestors have already run. Bubble-phase ancestors, `@document`, and
`@window` never see the event.

**Why it matters.** A directory that logs visits on the way down still
sees "Text the stall". The same directory's bubble logger, and the
card's `openStall`, do not.

**What to do.** Put analytics and "I need to see every click" handlers
in `:capture`. Put "this button owns the click" on the button with
`:stop`.

**Seen in:** [Farmers market stall analytics](features/05-action-options/05-farmers-market-stall-analytics/),
[Community radio request](features/05-action-options/10-community-radio-request/)
(`:stop` hides `@document` / `@window` bubble, not `@window:capture`).

## Action parameters

### Params are read from the action's element when the action runs

**What happens.** `event.params` is built from
`data-[identifier]-[name]-param` attributes on the element that declares
the action. A click whose `event.target` is a child `<span>` still sees
the button's params. An action on a parent does not see param attributes
on the child that was clicked. An `@document` or `@window` action reads
the element that wrote the descriptor, not the focused field. The
attributes are read at the call, not when the action was bound, so
changing one updates the next event. An element inserted in the same
turn has no action yet; see
[Actions on a brand-new element are not bound in the same turn](#actions-on-a-brand-new-element-are-not-bound-in-the-same-turn).

**Why it matters.** A room that listens for clicks will not pick up
accessions written on the paintings. A keyboard shortcut on the page
shell will not pick up a param written on the field that has focus.
Doubling a servings attribute, though, is visible on the next click
without reconnecting.

**What to do.** Put the action and its params on the same element. Read
`event.target` yourself when the click target is the data you need and
the action lives on an ancestor. Change param attributes freely; don't
cache them in `connect()`.

**Seen in:** [Museum gallery labels](features/06-action-parameters/08-museum-gallery-labels/),
[Neighborhood potluck board](features/06-action-parameters/06-neighborhood-potluck-board/),
[Lighthouse watch log](features/06-action-parameters/11-lighthouse-watch-log/),
[Field recording chapters](features/06-action-parameters/07-field-recording-chapters/).

### Each action gets a fresh `event.params`, and the next action replaces it

**What happens.** Stimulus assigns `event.params` on the shared event
object just before each action method. The object is built again from
the attributes, so a property the first method adds is not visible to
the second method on the same element. After the click has finished
bubbling, a later action's assignment is what `event.params` points at.
A reference saved at the start of the method still points at the
original object. `:stop` keeps ancestors from running, so nothing
replaces it.

**Why it matters.** `const seat = event.params` is stable.
`event.params.sectionName` after the click may be missing, or may be
the ancestor's house note. `await Promise.resolve()` is not late enough
to see that on a real click; see
[A real click runs microtasks before the event finishes bubbling](#a-real-click-runs-microtasks-before-the-event-finishes-bubbling).

**What to do.** Copy the fields you need before you yield. Don't read
`event.params` again after the click has moved on.

**Seen in:** [Campus mail tray](features/06-action-parameters/05-campus-mail-tray/),
[Repertory seat holds](features/06-action-parameters/12-repertory-seat-holds/).

### Params are `JSON.parse`; values and `dataset` are not

**What happens.** A param is cast with `JSON.parse`. `"2"` and `"1.5"`
become numbers, `"true"` and `"false"` become booleans, `"null"` becomes
`null`, and a JSON array or object becomes that value. Anything that is
not valid JSON, including `"Caraway rye"`, `"FALSE"`, and `"1_000"`,
stays the original string. `"2e1"` is valid JSON and becomes `20`. Keys
inside a JSON object are not camelized. A String value is never parsed.
A Number value uses `Number()`, so `"08"` becomes `8` and `"1_000"`
becomes `1000`. A Boolean value treats `"FALSE"` as false. `dataset`
keeps the raw string under a key that includes the identifier and the
`Param` suffix (`greenhouseBedLitersParam`), not the param name
(`liters`).

**Why it matters.** The same characters mean different things depending
on which channel you read. A spreadsheet's `"FALSE"` is a string in a
param and `false` in a Boolean value. A liters param is a number on
`event.params.liters` and the string `"1.5"` on `dataset`.

**What to do.** Read `event.params` for action arguments. Use a value
when the controller needs the data without an event and a declared type.
Use `dataset` only when you want the raw attribute string. For all-digit
strings and leading zeros, see
[Action params turn all-digit strings into numbers](#action-params-turn-all-digit-strings-into-numbers).

**Seen in:** [Bakery preorder window](features/06-action-parameters/02-bakery-preorder-window/),
[Trail kitchen batch card](features/06-action-parameters/03-trail-kitchen-batch-card/),
[Greenhouse watering round](features/06-action-parameters/09-greenhouse-watering-round/).

**Why this section.** `dataset` returning strings is the DOM. It's here
because the surprise is reading it instead of `event.params`.

### A shorter identifier matches a longer identifier's param attributes

**What happens.** The pattern is `^data-${identifier}-(.+)-param$`. For
`bin-ticket` that also matches
`data-bin-ticket-printer-copies-param`, and the captured name
`printer-copies` camelizes to `printerCopies`.
`data-bin-ticket-printer-tray-name-param` becomes `printerTrayName`.
The controller `bin-ticket-printer` sees those same attributes as
`copies` and `trayName`. `data-bin-ticket-shed-name-param` matches only
`bin-ticket`.

**Why it matters.** Two controllers on one element, where one identifier
extends the other with a hyphen, leak params into the shorter one under
a different name.

**What to do.** Don't let one identifier be a hyphen-prefix of another
(`bin-ticket` / `bin-ticket-printer`). Use names that don't nest
(`dispatch-slip` / `courier-radio`).

**Seen in:** [Orchard bin tickets](features/06-action-parameters/13-orchard-bin-tickets/),
[Courier dispatch slip](features/06-action-parameters/10-courier-dispatch-slip/).

## Targets

### The singular target throws when it is missing; the plural and the has-property do not

**What happens.** `this.slipTarget` throws
`Missing target element "slip" for "tide-board" controller` at the
moment it is read. `this.slipTargets` is `[]` and `this.hasSlipTarget`
is false. The controller still connects and can render its other
targets. A name that is not listed in `static targets` never gets a
getter: `this.botanicalTarget` is `undefined`, and reading it does not
throw that error, even when an element carries the token.

**Why it matters.** An optional advisory can be absent and the board
still loads. Code that treats the singular form as "zero or one" fails
through `handleError` the first time that line runs. Code that invents
a getter for an undeclared token fails differently, with no Stimulus
error at all.

**What to do.** Declare every name you read. Use `has[Name]Target`
before the singular getter when the element is optional. Use the plural
when there may be many, or none.

**Seen in:** [Harbor tide board](features/07-targets/01-harbor-tide-board/),
[Seed packet label press](features/07-targets/04-seed-packet-label-press/).

### Target names are matched exactly and are not camelized

**What happens.** The selector is `[data-${identifier}-target~="varietyName"]`.
The token has to be the `static targets` string, including case.
`variety-name` does not match `varietyName`. Stimulus camelizes value
names, CSS class names, outlet names, and action parameters. It does
not camelize target names. `hasVarietyNameTarget` is `has`, plus the
declared name with only its first character capitalized, plus `Target`.

**Why it matters.** Markup written in the value-attribute style
(`variety-name`) leaves `hasVarietyNameTarget` false, and the singular
getter throws the missing-target error, on a packet that clearly has a
variety field.

**What to do.** Write the token in the same camelCase as `static targets`:
`data-label-press-target="varietyName"`. Keep kebab-case for the
identifier only.

**Seen in:** [Seed packet label press](features/07-targets/04-seed-packet-label-press/).

### The singular target is the first match in the document

**What happens.** `terminusTarget` is `terminusTargets[0]`. Several
elements may carry the token. Stimulus does not warn. The first in the
document wins, not the last and not a highlighted one. An element whose
attribute is `stop terminus` is one node, so it is in both lists, and
writing its `textContent` changes both.

**Why it matters.** Flagging Harper, printed above Port Orchard, makes
`terminusTarget` Harper. Renaming the end of the line renames that same
stop in the stop list.

**What to do.** Use the plural list when more than one element can
match, and pick the one you mean. Put several tokens on one element
only when it really is both things.

**Seen in:** [County bus route card](features/07-targets/02-county-bus-route-card/),
[Orchestra seating chart](features/07-targets/13-orchestra-seating-chart/).

### Target getters query the DOM when you read them

**What happens.** `this.plotTargets` runs a query on every read and
returns a new array. A plot appended in the current turn is already in
the list. A plot removed in the current turn is already gone. An array
saved from `connect()` is not updated. `plotTargetConnected()` runs
later, from the mutation observer, after the method that inserted the
plot has finished writing its status.

**Why it matters.** A roster cached at connect still says Beans, Kale
after Squash is on the board. A status line written in the add method
cannot see the callback's stamp yet. The list itself is already current,
so the callback is not a refresh.

**What to do.** Read `this.plotTargets` at the moment you need it. Do
not keep the array. Use a connected callback for work that should happen
because a target appeared; that is a separate feature.

**Seen in:** [Garden work day](features/07-targets/05-garden-work-day/).

**Why this section.** Scheduling the callback is the observer. The
getter is the target API, and it is already current before the callback
runs.

### A nested controller with the same identifier is a scope boundary, re-checked on every read

**What happens.** A target counts when
`element.closest('[data-controller~="that-identifier"]')` is that
controller's element. A nested `meter-bank` is a boundary: its meters,
and the nested element itself when it carries the target attribute, are
left out of the outer `meterTargets`. A nested `water-heater` is not a
`meter-bank`, so a meter inside the heater still belongs to the outer
bank. The check runs at read time. Moving Owen's element into the nested
saw crew drops him from the trail day's list on the next line. The outer
controller does not disconnect.

**Why it matters.** A building total written with `querySelectorAll`
bills Unit 2's kitchen to the building. A roll that is not re-read after
a move still includes someone who now belongs to the nested crew.

**What to do.** Read the target list. Use a nested controller of the
same identifier only where that boundary is what you want. Read again
after you move nodes.

**Seen in:** [Apartment meter bank](features/07-targets/09-apartment-meter-bank/),
[Trail work crew](features/07-targets/12-trail-work-crew/).

### Target attributes are not prefix-matched

**What happens.** The attribute name is exactly
`data-${identifier}-target`. `data-moorage-bill-ledger-target="slipFee"`
is not a `slipFee` target of `moorage-bill`, even though `moorage-bill`
is a hyphen-prefix of `moorage-bill-ledger`. Action parameters use a
prefix pattern and do leak across that pair of names. Targets do not.
An input both controllers should see needs both attributes.

**Why it matters.** A $999 field stamped only for the ledger stays out
of the bill's slip-fee list. Sharing the real slip fee means writing
`data-moorage-bill-target` and `data-moorage-bill-ledger-target` on
that one input.

**What to do.** Stamp each controller's own attribute on the elements it
should see. The target lookup will not borrow the longer identifier's
attribute.

**Seen in:** [Marina moorage bill](features/07-targets/03-marina-moorage-bill/).

**Why this section.** The contrast with
[A shorter identifier matches a longer identifier's param attributes](#a-shorter-identifier-matches-a-longer-identifiers-param-attributes)
is the point. The target attribute is a different name, not a prefix.

### `querySelector` is not a target lookup, and the legacy attribute still matches

**What happens.** Stimulus finds a target with
`[data-identifier-target~="name"]`, includes the controller element
when it matches, drops anything inside a nested element with the same
identifier, and then appends legacy `data-target="identifier.name"`
matches. `querySelectorAll` does none of the scope work, skips the
element itself, and an exact `[data-request-desk-target="slip"]` misses
`slip rush`. A `NodeList` from `querySelectorAll` is static. The legacy
attribute still matches. Those matches are concatenated after the
modern ones, so they are not interleaved in document order. An element
with both attributes appears twice in the plural list. The first time a
legacy element is found, Stimulus logs a deprecation warning naming
`data-target` and the replacement `data-identifier-target`. The singular
getter prefers a modern match and does not, by itself, look at the
legacy attribute when a modern one exists.

**Why it matters.** A count written with `querySelectorAll` includes the
nested desk's map, misses the walk-up slip on the desk element, misses
a rush slip when the selector is exact, and goes stale when a tax lien
is filed. The card catalog's old stamp still shows up in `slipTargets`,
and the dual-stamped slip shows up twice, the second time in the legacy
block rather than at its place in the document.

**What to do.** Read `this.slipTargets`. Replace
`data-target="request-desk.slip"` with
`data-request-desk-target="slip"`. Do not leave both on one element.

**Seen in:** [Archive request desk](features/07-targets/10-archive-request-desk/).

### Inherited target names use the subclass identifier

**What happens.** `static targets` is collected from the class and its
ancestors. `InsuranceSection` declares `memberId` and inherits
`heading`, `field`, and `summary`, so `headingTarget` exists. The
attribute Stimulus looks up is `data-insurance-section-target="heading"`,
the instance's identifier, not `data-intake-section-target`. A paragraph
stamped with the parent attribute sits in the section and is not the
heading target.

**Why it matters.** A block copied from the base section's markup looks
wired. `hasHeadingTarget` is true only because the subclass's own
attribute is also present. The stray heading is ignored.

**What to do.** Stamp inherited targets with the identifier of the
controller that is actually on the element.

**Seen in:** [Clinic intake sections](features/07-targets/11-clinic-intake-sections/).

### A hidden element is still a target

**What happens.** `[hidden]` does not remove a node, and the target
query does not care that it is hidden. `pieceTargets` includes the
lantern in storage. After a wig filter sets `hidden` on the coat,
`pieceTarget` is still the coat, the first piece in the document. The
visible rows are the wigs. A checked lantern is still in the list a
pull walks, in document order, after the pocket watch.

**Why it matters.** Filtering the screen and then reading the singular
target returns the coat, not the first wig. A count of `pieceTargets`
counts covered pieces.

**What to do.** Filter the `pieceTargets` array for the rows you mean.
Treat `hidden` as a visual state. The plural list is the whole rack.

**Seen in:** [Costume shop pull list](features/07-targets/07-costume-shop-pull-list/).

**Why this section.** Hiding is presentation. The target list is a DOM
query, so a covered lantern is still a piece. The same split is why
[hidden elements keep their actions](#hidden-elements-keep-their-actions).

## Target callbacks

### After `disconnect()`, each target callback still receives its element

**What happens.** The way-out order is the one in
[Callback order is initialize, value-changed, target-connected, then connect](#callback-order-is-initialize-value-changed-target-connected-then-connect):
`disconnect()` first, then each `[name]TargetDisconnected(element)`.
Removing the identifier empties the getters inside `disconnect()`, as in
[Targets vanish in `disconnect()` after the identifier is removed](#targets-vanish-in-disconnect-after-the-identifier-is-removed).
The disconnected callback still runs after that and is given the
element, which is still in the document and still carries the target
attribute. Moving the controller element runs that way-out pair and
then the way-in pair on the same instance: `disconnect()` while the
getters still work (see
[A move is `disconnect()` then `connect()` on the same instance](#a-move-is-disconnect-then-connect-on-the-same-instance-and-isconnected-is-true-inside-disconnect)),
each target disconnected, each target connected, then `connect()`.
`initialize()` does not run again.

**Why it matters.** A transcript written from `this.transcriptTarget`
while the board is being taken down has nowhere to go: the getter is
empty, and the ships are still on the wall. The disconnected callback
is what can still name them. Shifting a lock to another pier also
rebuilds anything a boat callback allocated, because those callbacks
run again around the second `connect()`.

**What to do.** Save, from the connected callback, any element you must
write after the identifier is gone. Release per-target resources in the
disconnected callback, using the element argument. Expect a move of the
controller element to run every target callback twice.

**Seen in:** [Pilot boarding board](features/08-target-callbacks/01-pilot-boarding-board/),
[Canal lock queue](features/08-target-callbacks/04-canal-lock-queue/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

### Moving a target inside its controller fires disconnected, then connected

**What happens.** Reordering a target, or moving it to another parent
that is still inside the same controller, runs
`[name]TargetDisconnected` and then `[name]TargetConnected`. The
controller's own `connect()` and `disconnect()` do not run. During the
disconnected callback the node is already in its new place,
`isConnected` is true, and `closest()` still finds this controller.
Moving the target outside the controller runs only the disconnected
callback. `closest()` no longer matches, even though the node is still
in the document. Moving it into a nested controller with the same
identifier is the outside case for the outer controller and the inside
case for the inner one: outer disconnected, then inner connected.

**Why it matters.** A passage count incremented in the connected
callback goes up when a boat changes places in the queue. A widget
created there is destroyed and built again. Skipping teardown because
`isConnected` is true also skips the lay-by, because that boat is still
on the page.

**What to do.** Detach in the disconnected callback and attach in the
connected callback. Keep durable state on the element when a move
should not reset it. Decide "still in this controller" with `closest()`,
not with `isConnected`.

**Seen in:** [Canal lock queue](features/08-target-callbacks/04-canal-lock-queue/),
[Smokehouse racks](features/08-target-callbacks/05-smokehouse-racks/),
[Buoy tender charts](features/08-target-callbacks/08-buoy-tender-charts/).

### A target token can change without removing the element

**What happens.** Setting the target attribute on an element that is
already in the tree runs the connected callback. Removing the
attribute, or removing one token, runs the disconnected callback for
the names that left. The element stays put, and the controller does not
reconnect. Tokens are compared by index. Adding or removing a token at
the end notifies only that name. The first index that differs is
unmatched and then rematched, along with every token after it.
Rewriting `station beacon` as `beacon station` disconnects and
reconnects both names, even though the card still has both.

**Why it matters.** Wiring a lantern that is already hanging is a new
target and not a new element. Reordering the chalk on a listening card
tears down and rebuilds every name from the first token that moved.
Clearing a beacon that sits in front, by writing the attribute back as
only `station`, restarts the station too.

**What to do.** Add and remove tokens at the end when the other names
should stay quiet. Treat a reorder as a restart of every name from the
first change. Setting the attribute to the value it already has does
not notify.

**Seen in:** [Orchard frost lanterns](features/08-target-callbacks/03-orchard-frost-lanterns/),
[Shortwave listening post](features/08-target-callbacks/06-shortwave-listening-post/).

### A nested same-identifier controller does not disconnect outer targets unless the element moves

**What happens.** The getter drops a target as soon as a nested element
with the same identifier is its closest controller. That re-check is
[A nested controller with the same identifier is a scope boundary](#a-nested-controller-with-the-same-identifier-is-a-scope-boundary-re-checked-on-every-read).
The callbacks do not follow it unless the target node itself is added,
removed, or retokened. Setting `data-controller` on a bay that already
contains a hull runs the connected callback on the new booth and does
not run the disconnected callback on the yard. Moving a side into a
cabinet that is already a controller does run the outer disconnected
callback and the inner connected callback.

**Why it matters.** A chalk total kept only in callbacks still includes
the hull, and the booth's own callback includes it too. The gallons are
counted twice. A slip that reads the getter does not include it.

**What to do.** Move the nodes when you open the nested controller, or
recount from the getter after you add the identifier. Do not expect the
outer disconnected callback to notice a scope change that did not touch
the target.

**Seen in:** [Smokehouse racks](features/08-target-callbacks/05-smokehouse-racks/),
[Shipyard paint booths](features/08-target-callbacks/12-shipyard-paint-booths/).

### In one mutation the getter already shows the finished tree

**What happens.** Appending a document fragment, assigning `innerHTML`,
calling `insertAdjacentHTML`, and appending a cloned `<template>` each
deliver their target callbacks in one mutation-observer turn, after the
method that changed the DOM has finished writing. The getter is already
current on the next line, as in
[Target getters query the DOM when you read them](#target-getters-query-the-dom-when-you-read-them),
and the callbacks are batched after that write, as in
[Lifecycle callbacks are batched after the DOM change](#lifecycle-callbacks-are-batched-after-the-dom-change).
Inside the turn, callbacks run one element at a time. `innerHTML`
unmatches every removed target before it matches the added ones, in
tree order. On the first disconnected callback of a reprint, the plural
getter is already the new list.

**Why it matters.** A weighmaster who clears the chalk and copies the
board on the first erasure copies the new ticket, and the connected
callbacks then add it again. A notice written in the action can still
say the ledger had not stamped the new berries; the ledger stamps them
after that sentence is already on the page.

**What to do.** Add and subtract the element the callback was given.
Read the getter when you want the finished list, once, not from inside
every callback of the same mutation. Nodes in a template stay out of
that list until the clone is appended; see
[Nodes inside a `<template>` are not targets](#nodes-inside-a-template-are-not-targets).

**Seen in:** [Cranberry receiving dock](features/08-target-callbacks/07-cranberry-receiving-dock/),
[Grain elevator ledger](features/08-target-callbacks/09-grain-elevator-ledger/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

### The target observer is paused while the callback runs

**What happens.** Stimulus disconnects the mutation observer before
calling `[name]TargetConnected` or `[name]TargetDisconnected`, and
starts it again afterward without scanning the tree. A target inserted
or removed synchronously inside the callback does not get its own
callback. The node is in the document, and the getter sees it.
`queueMicrotask` runs after the observer is listening again, so a
target inserted there does get a callback. A callback that always
defers another insert does not stop. If the callback throws, the
observer is never restarted. The error is uncaught:
`application.handleError` does not see it. Later targets in that batch
are skipped. If the throw happens while the controller is connecting,
`connect()` never runs, and targets added afterward are silent.

**Why it matters.** Writing a serial into a docket is safe, because
that paragraph is not a target. Inserting the next docket from the
callback looks like it should number that one too, and it does not,
which is also why the tray does not fill itself. A throw looks like a
one-time failure and quietly disables every later target callback.

**What to do.** Change text, classes, and non-target nodes from the
callback. Insert or remove targets from the action, or from a microtask
you mean to run once. Catch inside the callback if the work can fail.
Do not rely on `handleError` for these callbacks.

**Seen in:** [Letterpress job dockets](features/08-target-callbacks/10-letterpress-job-dockets/).

## Values

### `has[Name]Value` stays true when the definition is an object or a literal

**What happens.** The reference says `has[Name]Value` is true when the
data attribute is present and false when it is absent. That is true for
a bare type (`breed: String`, `temperature: Number`, `flagged: Boolean`).
It is not true for the `{ type, default }` form, for `{ type: Number }`
with no `default` key, or for a literal (`breed: "Jersey"`,
`flagged: false`, `spareDegrees: 0`). Those definitions make
`has[Name]Value` true even when the attribute was never written. The
getter still returns the default: `"Jersey"`, `86`, `0`, `false`, or
`["mesophilic"]`.

**Why it matters.** A card that uses the object form cannot tell "the
cook left this blank" from "the cook wrote the default." A spare
temperature declared as `{ type: Number }` looks present (`has` is
true) and reads `0`, the same number a bare `Number` reads when `has`
is false. A flag defaulted to `false` with `flagged: false` also
reports `hasFlaggedValue` true.

**What to do.** Use a bare type when `has[Name]Value` has to mean "the
attribute is in the markup." Use `{ type, default }` or a literal when
a missing attribute should still count as set. Read
`element.hasAttribute` when you need the attribute itself.

**Seen in:** [Creamery vat card](features/09-values/06-creamery-vat-card/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/)
(the relief boat's name and bowl count).

### An empty Boolean attribute is true

**What happens.** The reader is
`!(value == "0" || String(value).toLowerCase() == "false")`. `"0"`,
`"false"`, `"FALSE"`, and `"False"` are false. An empty attribute,
including `data-signal-horn-sounding-value` with no value, is `""`,
and that is true. `"00"`, `"false "` (trailing space), `" 0"`,
`"no"`, `"off"`, and `"1"` are true. A missing attribute is the
default `false`, and for a bare `Boolean` the `has` property is false.
The reference formula does not lowercase. Stimulus 3.2.2 does, which
is why `"FALSE"` is false. That case is already noted under
[Params are `JSON.parse`; values and `dataset` are not](#params-are-jsonparse-values-and-dataset-are-not).

**Why it matters.** A blank cell on a fog slip is not "they said no."
It is "the horn is sounding," and `hasSoundingValue` is true because
the attribute is present. `"00"` is not `"0"`. A trailing space keeps
`"false"` from matching.

**What to do.** Treat only `"0"` and `"false"` in any letter case as
false. Don't leave the attribute empty if you mean false. Assign
`false` to write the attribute `"false"`.

**Seen in:** [Fog signal board](features/09-values/03-fog-signal-board/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/)
(the relief galley's blank cell).

### A Number value keeps the attribute text until you assign

**What happens.** The reader strips underscores, then calls `Number()`.
`"1_000"` is `1000`. `"08"` is `8`. `" 14.5 "` is `14.5`. `"2e1"` is
`20`. `"1,200"` and `"12dwt"` are `NaN`. An empty attribute is `0`
with `hasPennyweightsValue` true. A missing attribute is `0` with
`has` false, for a bare `Number`. `9007199254740993` becomes
`9007199254740992`. None of those reads rewrite the attribute. The
writer is `` `${value}` ``, so assigning the parsed number stores a
plain decimal: Kingston's `"08"` becomes `"9"` after one more bushel,
and a certificate assigned back to itself loses the digit in the
attribute too.

**Why it matters.** The slip on the wall and the number in the
controller disagree until something assigns. A comma that a clerk
thinks is a thousands separator is `NaN`, and `has` is still true, so
a guard that only checks `has` will add to `NaN`. A blank weight and
a missing weight are both `0` and only `has` tells them apart.

**What to do.** Keep identifiers and leading zeros in a `String`
value. Assign only when you mean to normalize the attribute. Check
`Number.isNaN` before doing arithmetic. For the same precision loss
on action params, see
[Action params turn all-digit strings into numbers](#action-params-turn-all-digit-strings-into-numbers).

**Seen in:** [Cider press tally](features/09-values/02-cider-press-tally/),
[Assay office slips](features/09-values/07-assay-office-slips/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/).

### Array and Object values reject the other shape

**What happens.** Both types `JSON.parse` the attribute. An `Array`
then requires `Array.isArray`. An `Object` rejects `null`, arrays, and
anything whose `typeof` is not `"object"`. The failure is a
`TypeError` whose message names the attribute text and a type:
`"object"`, `"array"`, `"number"`, or, for `null`, `"undefined"`.
Invalid JSON, including `eagle,shield` and `{fine:900}`, throws
`SyntaxError` from `JSON.parse` instead. Neither throw happens at
connect. It happens when the getter runs. Keys inside an object are
not camelized: `wick_height` stays `wick_height`. Each read parses
again, so `this.lampValue === this.lampValue` is false when the
attribute is present, and `push` on the returned array is gone by the
next read.

**Why it matters.** A spare tin written as a list looks like data and
throws the first time the watch reads it. A menu written as
`chowder, pilot bread` connects fine and throws on the button. A
`push` that is not followed by an assignment never reaches the
attribute.

**What to do.** Store arrays as JSON arrays and objects as JSON
objects. Catch the read if the attribute came from a person. Assign a
new array or object to persist a change. Don't mutate the value you
just read.

**Seen in:** [Seed vault tray](features/09-values/04-seed-vault-tray/),
[Lighthouse wick log](features/09-values/05-lighthouse-wick-log/),
[Assay office slips](features/09-values/07-assay-office-slips/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/).

### A custom Array or Object default is one shared value

**What happens.** `{ type: Array, default: ["brood", "honey"] }`
returns that same array every time the attribute is missing, on every
instance. `push` mutates it. The attribute stays absent.
`hasFramesValue` is true because of the object form, as in
[`has[Name]Value` stays true when the definition is an object or a literal](#hasnamevalue-stays-true-when-the-definition-is-an-object-or-a-literal).
A bare `frames: Array` is different: the built-in default is a new
`[]` on every read, so a `push` disappears, and `hasFramesValue` is
false. Assigning `this.framesValue = this.framesValue.slice()` writes
JSON on that element only. The other hive, still missing its
attribute, keeps reading the mutated default.

**Why it matters.** Dropping a frame on the Langstroth changes the
Warre's next read. Writing one lid down does not give the other hive
its own list.

**What to do.** Don't mutate a default. Assign a new array or object.
If each controller needs its own starting list, put the JSON on the
element, or copy the default before you change it
(`this.framesValue = this.framesValue.concat(["pollen"])`).

**Seen in:** [Apiary super stack](features/09-values/08-apiary-super-stack/).

### Value attributes are the exact kebab-case name

**What happens.** Stimulus looks up
`data-${identifier}-${dasherize(name)}-value`. `meshSize` is
`data-bolt-ticket-mesh-size-value`. HTML lowercases attribute names,
so `data-bolt-ticket-meshSize-value` is stored as
`data-bolt-ticket-meshsize-value` and does not match. Underscores are
not camelized either. `data-bolt-ticket-mesh_size-value` is a
different attribute. Action parameters do camelize `-` and `_`. Value
lookup does not scan the element's attributes and camelize them. A
miss reads as the type default, and for a bare `String`
`hasMeshSizeValue` is false.

**Why it matters.** A ticket written in the controller's camelCase, or
with underscores, still shows "4 in" in the markup and the controller
reads `""`.

**What to do.** Write value attributes in kebab-case. The same
lowercasing rule for params is
[HTML lowercases param attribute names](#html-lowercases-param-attribute-names).
The value failure is an exact-name miss, not a failed camelize.

**Seen in:** [Sail loft bolt ticket](features/09-values/09-sail-loft-bolt-ticket/),
[Maple sugar shack](features/09-values/01-maple-sugar-shack/).

**Why this section.** Lowercasing is the HTML parser. Stimulus is what
requires the hyphenated name and will not accept the underscore form
that params accept.

### Only `undefined` removes a value attribute

**What happens.** The setter deletes the attribute when the new value
is `undefined`. Every other assignment writes.
`hoopCountValue = 0` writes `"0"` and `hasHoopCountValue` stays true.
`flaggedValue = false` writes `"false"`. `woodNameValue = null` writes
the characters `null`, and the getter returns the string `"null"`.
After a real delete, a bare `Number` reads `0` with `has` false, and a
bare `String` reads `""` with `has` false.

**Why it matters.** Zeroing a hoop count looks like clearing it and
leaves `"0"` on the barrel. A "blank" wood name of `null` becomes the
word null. The next read cannot tell that from a cooper who stamped
those letters.

**What to do.** Assign `undefined` to remove the attribute. Assign
`0`, `false`, or `""` only when that value should stay on the element.

**Seen in:** [Cooperage hoop log](features/09-values/10-cooperage-hoop-log/).

### Inherited values use the subclass identifier

**What happens.** `static values` is collected from the class and its
ancestors. `RidgeLog` declares `gustKnots` and inherits `stationName`
and `launched`, so `stationNameValue` exists. The attribute is
`data-ridge-log-station-name-value`, the instance's identifier, not
`data-kite-log-station-name-value`. A station name stamped with the
parent identifier sits on the element and is not the value. Assigning
`launchedValue` writes `data-ridge-log-launched-value`.

**Why it matters.** A card copied from the base log looks wired. The
reading uses Cape Flattery, the subclass attribute, and leaves the
valley line unread.

**What to do.** Stamp inherited values with the identifier of the
controller that is actually on the element. The same rule for targets
is
[Inherited target names use the subclass identifier](#inherited-target-names-use-the-subclass-identifier).

**Seen in:** [Ridge kite log](features/09-values/11-ridge-kite-log/).

### A shorter identifier can share a longer identifier's value attribute

**What happens.** The attribute name is
`data-${identifier}-${dasherize(valueName)}-value`. For `gauge` and
`houseZeroFeet` that is `data-gauge-house-zero-feet-value`. For
`gauge-house` and `zeroFeet` it is the same string. Both controllers,
on one element, read and write one attribute. Setting the gauge zero
to `5` makes the house zero `5` on the next read, in the same turn.
`poolFeet` does not collide: the gauge's pool is
`data-gauge-pool-feet-value` and the house's pool is
`data-gauge-house-pool-feet-value`. This is not the param prefix
regex. Each controller asks for an attribute it declared. The names
happen to compose to one string. Targets do not do this, because a
target attribute is `data-${identifier}-target` and does not include
the token in the attribute name. See
[Target attributes are not prefix-matched](#target-attributes-are-not-prefix-matched).

**Why it matters.** Two controllers that were meant to keep separate
zeros share one, with no error. Raising the gauge moves the house.

**What to do.** Don't let one identifier be a hyphen-prefix of another
when a value name on the shorter one can spell the rest
(`gauge` / `gauge-house`, `houseZeroFeet` / `zeroFeet`). Name the
shorter controller so it does not begin the longer one.

**Seen in:** [Lock gauge house](features/09-values/12-lock-gauge-house/).

### A mismatched default throws when the controller is registered

**What happens.** `{ type: Number, default: "12" }` throws while the
controller is blessed, inside `application.register()`, before
`initialize()`. The message is `The specified default value for the
Stimulus Value "temperature" must match the defined type "number".
The provided default value of "12" is of type "string".` The
identifier is not in that message. The throw is not an action and
does not go through `handleError` unless the caller catches it.
Controllers already registered stay registered. The mismatched class
is not.

**Why it matters.** A vat card filed from a button can fail the whole
module if the `register()` call is not caught. The wording names the
value and not which controller it was.

**What to do.** Match the default's type to `type`. Catch around a
`register()` that might load a card you did not write. Read the value
token out of the message; don't expect the identifier there.

**Seen in:** [Creamery vat card](features/09-values/06-creamery-vat-card/).

## Running the examples

### `npx serve` without a trailing slash breaks relative imports

**What happens.** Scenario pages load controllers with
`import LineItemController from "./line_item_controller.js"`. That URL is
resolved against the page URL. `python3 -m http.server` serves a folder
at both `/path` and `/path/`. `npx serve` without configuration serves
`/path` as the folder's `index.html` but leaves the URL at `/path`, so
the browser asks for `/line_item_controller.js` at the repository root
and gets a 404.

**Why it matters.** Opening a catalog link that forgot the trailing slash
fails silently in the page (a blank scenario and a console error) when
someone follows the README's `npx serve .` instructions.

**What to do.** This repository's [`serve.json`](serve.json) sets
`"trailingSlash": true`, so `npx serve` redirects `/path` to `/path/`.
Catalog links in `index.html` already include the slash
(`features/01-controllers/01-invoice-line-items/`). Extra pages that
must load under `npx serve` (a dashboard, a fetched fragment) live in
their own folder as `index.html`, not as `dashboard.html`.

**Seen in:** [CONTRIBUTING.md](CONTRIBUTING.md) (the trailing-slash
rule), [Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/)
(the dashboard is `dashboard/`, not `dashboard.html`),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/)
(last week's extras are `last-week/extra-crops/`).

## Browser gotchas that bite Stimulus code

These are the platform, not Stimulus. They belong here because they show
up inside actions, callbacks, and `data-action` descriptors, and the
fix is usually in the Stimulus code.

### Nodes inside a `<template>` are not targets

**What happens.** `element.querySelectorAll` does not look inside a
`<template>`'s document fragment. Stimulus target lookup uses that
method, so a place card drawn in the blueprint is not a `guest` target.
The `<template>` element can itself be a target (`cardBlueprint`).
Cloning `template.content` and appending the clone puts a real guest in
the document, and the next `guestTargets` read includes them. The
blueprint still holds its own card.

**Why it matters.** A seating chart that counts guests on load reports
Priya and not the blank card, which is what you want, and it will keep
reporting that after a clone that was never appended.

**What to do.** Keep the blueprint as its own target. Clone
`template.content`, fill the clone, and append it where the chart
should show it. Then read `guestTargets`.

**Seen in:** [Rehearsal dinner seating](features/07-targets/06-rehearsal-dinner-seating/),
[Orchestra seating chart](features/07-targets/13-orchestra-seating-chart/),
[Cranberry receiving dock](features/08-target-callbacks/07-cranberry-receiving-dock/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

**Why this section.** Skipping template contents is the HTML parsing
rules. Stimulus inherits it by querying the live document.

### Flex `order` does not change target order

**What happens.** `this.loafTargets` follows document order. CSS `order`
changes which loaf is painted first and leaves the target list alone.
`insertBefore` changes the document, and the next target read follows
the nodes.

**Why it matters.** A rack that paints Ciabatta at the front still pulls
Brioche first when Brioche is first in the markup. The pull order and
the paint order diverge on purpose only if you meant them to.

**What to do.** Move the nodes when the sequence matters. Read
`loafTargets` for that sequence. Use CSS `order` for a visual treatment
that must not become the sequence.

**Seen in:** [Bakery oven queue](features/07-targets/08-bakery-oven-queue/).

**Why this section.** Paint order is CSS. The target query never asks
for it.

### `[hidden]` loses to any author `display` rule

**What happens.** The user-agent stylesheet hides `[hidden]` with
`display: none`. A class or element rule that sets `display: flex`,
`display: grid`, or `display: block` wins, and the element shows.

**Why it matters.** A banner, drawer, dialog, or toolbar that uses
`hidden` and also sets `display` in the page stylesheet appears on load
even though the markup says it shouldn't.

**What to do.** Every scenario page includes
`[hidden] { display: none !important; }` in its own `<style>`. The shared
stylesheet does not, because scenarios must still work if that file fails
to load.

**Seen in:** [Offline connection banner](features/03-actions/11-offline-connection-banner/)
(the banner is `display: flex` and `[hidden]` on load), and every
Controllers scenario from
[Restaurant seat picker](features/01-controllers/02-restaurant-seat-picker/)
onward.

### Setting `.value` or `.checked` from code fires no events

**What happens.** Assigning to a field's `.value` or `.checked` does not
dispatch `input` or `change`. None of that field's actions run.

**Why it matters.** "Repeat last order", "use this address", and
"restore the saved profile" update the fields and leave the rest of the
UI stale if they wait for actions to catch up.

**What to do.** Call the render method yourself, or dispatch the event
you want (`field.dispatchEvent(new Event("input", { bubbles: true }))`)
so the field's actions run in their usual order.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/),
[Newsletter signup with live validation](features/03-actions/02-newsletter-signup-with-live-validation/).

### A `<details>` rendered open fires `toggle` before Stimulus is listening

**What happens.** The browser fires `toggle` when it applies the `open`
attribute during parsing. Stimulus binds actions later, so that first
event is missed.

**Why it matters.** A `toggle` action that shows or hides related fields
never sees the starting state of a `<details open>`.

**What to do.** Read `.open` in `connect()` and render from that.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/).

**Why this section.** The early `toggle` is the browser; the miss happens
because Stimulus binds actions after parse.

### The browser's own validation can swallow `submit` before any action sees it

**What happens.** A field with `required` or `type="email"` and no
`novalidate` on the form makes the browser cancel `submit`. No `submit`
action runs.

**Why it matters.** Your `validateSignup` and `saveProfile` never fire,
and you get the browser's bubble instead of your own messages.

**What to do.** Put `novalidate` on the form and validate in the action.

**Seen in:** [Newsletter signup with live validation](features/03-actions/02-newsletter-signup-with-live-validation/),
[Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/).

### `HTMLFormElement.submit()` never fires `submit`

**What happens.** `form.submit()` from JavaScript submits (or, in this
catalog, navigates) without dispatching a `submit` event.
`form.requestSubmit()` and a clicked submit button do dispatch it.

**Why it matters.** A `data-action` on the form that prevents the default
and saves in place never runs if some other script calls `.submit()`.

**What to do.** Use `requestSubmit()`, or click the submit button, or
call the save method directly.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/).

### `event.currentTarget` is `null` after an `await` that waits for a later task

**What happens.** The browser sets `event.currentTarget` only while the
event is being dispatched. After `await navigator.clipboard.writeText()`,
`await fetch(...)`, or `await` a timer, it is `null`.
`await Promise.resolve()` can still look fine, because that promise
settles before dispatch moves on.

**Why it matters.** `event.currentTarget.disabled = true` after a fetch
throws. The bug only shows up once real work is awaited, so it passes a
check that `await`s a resolved promise.

**What to do.** Take what you need from the event before the first
`await`: `async rollSecret({ currentTarget: rollButton })`.

**Seen in:** [API token copy button](features/03-actions/07-api-token-copy-button/).

**Why this section.** Clearing `currentTarget` is the Event object's
lifetime; it shows up here because the usual trigger is an `async`
Stimulus action.

### `focus` and `blur` do not bubble

**What happens.** `focus` and `blur` fire only on the element that gained
or lost focus. They never reach an ancestor. `focusin` and `focusout`
fire at the same moments and do bubble. The same split exists for
`pointerenter` / `pointerleave` versus `pointerover` / `pointerout`, and
for `mouseenter` / `mouseleave` versus `mouseover` / `mouseout`. `toggle`
on `<details>` has no bubbling twin.

**Why it matters.** `focus->product-review#highlightAspect` on the form
never runs when a star row is focused, so the form has no idea which
aspect is active.

**What to do.** Put non-bubbling listeners on the element that actually
fires them, or use the bubbling twin (`focusin`, `focusout`,
`pointerover`, `pointerout`).

**Seen in:** [Product star rating](features/03-actions/08-product-star-rating/).

### The `reset` event fires before the form resets

**What happens.** A `reset` action runs while the fields still hold the
edits. The native reset then puts back the values from the page's
markup, not the last save. Even a microtask after the action is too
early; a `setTimeout(0)` is late enough to see the markup values.

**Why it matters.** "Discard changes" that lets the native reset through
throws away a successful save and restores page-load data.

**What to do.** `event.preventDefault()` and restore the last save
yourself.

**Seen in:** [Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/).

### `online` and `offline` fire on `window` only

**What happens.** The browser dispatches `online` and `offline` on
`window`. They do not fire on `document` and they do not bubble there.
`visibilitychange` fires on `document` and does bubble to `window`.

**Why it matters.** `offline@document->…` never runs. A banner that used
`@document` for both kinds of event would only ever see the tab hiding.

**What to do.** Use `online@window` and `offline@window`. Read
`navigator.onLine` in `connect()` for the state the page loaded in;
these events report changes only.

**Seen in:** [Offline connection banner](features/03-actions/11-offline-connection-banner/).

**Why this section.** Where the browser fires the event is the platform;
the silent miss is a Stimulus `@document` descriptor that looks valid.

### Setting `location.hash` to the value it already has fires no `hashchange`

**What happens.** Assigning `location.hash = "#departments"` when the
hash is already `#departments` dispatches nothing.

**Why it matters.** A promo link that opens the drawer through
`hashchange@window` works once and then seems broken.

**What to do.** After answering the hash, clear it with
`history.replaceState(...)` so the next click is a real change. Also
read the hash in `connect()` for a shared URL.

**Seen in:** [Responsive navigation drawer](features/03-actions/05-responsive-navigation-drawer/).

### Scroll position is already reset before `disconnect()`

**What happens.** Moving an element resets its `scrollTop` as part of the
move. Stimulus reacts after the move, so `disconnect()` reads `0`.

**Why it matters.** Saving scroll in `disconnect()` and restoring it in
`connect()` always restores `0`.

**What to do.** Record the offset on every `scroll` event and restore it
in `connect()`.

**Seen in:** [Live support chat transcript](features/02-lifecycle-callbacks/08-live-support-chat-transcript/).

**Why this section.** The scroll offset is already gone before Stimulus
runs; `disconnect()` is just too late to read it.

### A moved element never gets `pointerleave`

**What happens.** If you move or remove the element that is under the
pointer, the browser does not fire `pointerleave` (or `mouseleave`) on
it. The pointer is still "inside" as far as that element knows.

**Why it matters.** A hover-to-pause flag kept across a reconnect stays
true forever, and the carousel, tooltip, or menu never resumes.

**What to do.** Recompute pointer state on `connect()`. Don't keep
"the pointer is over me" across a move.

**Seen in:** [Carousel that pauses offscreen](features/02-lifecycle-callbacks/09-carousel-that-pauses-offscreen/).

**Why this section.** Missing `pointerleave` is the browser; it bites
because a Stimulus reconnect would otherwise restore a stale hover flag.

### `keypress` does not fire for Escape, Tab, arrows, Home, End, or Page Up/Down

**What happens.** Modern browsers fire `keypress` only for (some)
printable characters. Space gets a `keypress`; Escape, Tab, arrows,
Home, End, PageUp, and PageDown do not. `keydown` and `keyup` still
fire for all of them. `keydown` repeats while the key is held; `keyup`
fires once.

**Why it matters.** `keypress.esc` is a valid Stimulus filter that never
runs. Talkback that starts on `keydown.space` must ignore the repeats
or it will flicker.

**What to do.** Use `keydown` / `keyup` for non-printable keys. Treat a
repeated `keydown` as "already doing this".

**Seen in:** [Ferry radio talkback](features/04-keyboard-filters/05-ferry-radio-talkback/).

### The `space` filter maps to `" "`, not `"Space"`

**What happens.** Stimulus's built-in `space` mapping is the character
`" "`. That matches `event.key`. `event.code` is `"Space"`.

**Why it matters.** Reading `event.code === "Space"` in a method that
already passed a `space` filter works, but a custom mapping of
`space: "Space"` would match nothing.

**What to do.** Keep the built-in mapping. `preventDefault()` on
`keydown.space` so the page does not scroll.

**Seen in:** [Ferry radio talkback](features/04-keyboard-filters/05-ferry-radio-talkback/),
[Medication pack tabs](features/04-keyboard-filters/07-medication-pack-tabs/).

### Enter in a textarea inserts a newline; Enter in an input submits the form

**What happens.** The browser's default for Enter depends on the field.
A textarea inserts a newline. An input in a form submits. A
`contenteditable` region inserts a break. Stimulus filters do not cancel
those defaults.

**Why it matters.** `keydown.enter` on a textarea that "sends" still
gets a newline unless the action `preventDefault()`s. `keydown.enter`
on a tag field inside a form submits the form unless it does the same.
Tab still moves focus unless `preventDefault()` runs during `keydown`.

**What to do.** Call `preventDefault()` when the filter should own the
key. Leave it off when you want the browser's newline (Shift+Enter in a
composer).

**Seen in:** [Clinic message composer](features/04-keyboard-filters/02-clinic-message-composer/),
[Recipe dietary tags](features/04-keyboard-filters/06-recipe-dietary-tags/),
[Legal brief editor](features/04-keyboard-filters/11-legal-brief-editor/).

### Alt+ArrowLeft is Back in some browsers

**What happens.** Alt+Left and Alt+Right are history navigation in
Chrome and Firefox on Windows and Linux. The page sees the `keydown`
and can `preventDefault()` it. Without that, a kanban that listens for
`keydown.alt+left` also leaves the page.

**Why it matters.** The story moves *and* the browser goes Back.

**What to do.** `preventDefault()` in the Alt+arrow actions.

**Seen in:** [Newsroom assignment board](features/04-keyboard-filters/10-newsroom-assignment-board/).

### `wheel` on `window`, `document`, and `body` is passive unless you opt out

**What happens.** Chrome (and other engines following the same spec)
treat `wheel`, `touchstart`, and `touchmove` listeners on `window`,
`document`, and `body` as `{ passive: true }` by default.
`preventDefault()` there does nothing. Stimulus `:prevent` is that call.
`:!passive` is `{ passive: false }` and is what makes `:prevent` work on
those events.

**Why it matters.** A map that zooms on wheel with
`wheel@window->…:prevent` still scrolls the page. The same descriptor
with `:!passive:prevent` zooms and the page stays put.

**What to do.** Write `:!passive:prevent` on `wheel` / `touchmove`
listeners that must cancel the default, including ones on an inner
element if you want the guarantee rather than the browser's default.

**Seen in:** [Botanical garden map](features/05-action-options/06-botanical-garden-map/).

**Why this section.** The passive default is the platform; `:!passive`
is the Stimulus spelling that opts out.

### `preventDefault()` in a `:passive` listener is ignored

**What happens.** `:passive` is `{ passive: true }`. The browser will not
cancel that event. Chromium logs a console warning if the handler calls
`preventDefault()` anyway. Stimulus `:prevent` on a `:passive`
descriptor is that ignored call.

**Why it matters.** A reading-progress bar that only reads `scrollTop`
is the right use of `:passive`. Pairing it with `:prevent` looks like it
should freeze the scroll and does not.

**What to do.** Use `:passive` when you will not cancel. Use
`:!passive:prevent` when you will.

**Seen in:** [Literary essay progress](features/05-action-options/04-literary-essay-progress/),
[Botanical garden map](features/05-action-options/06-botanical-garden-map/)
(the trail notes stay `:passive` and keep scrolling).

**Why this section.** Ignoring `preventDefault()` is the Event Listener
options spec; it shows up here because Stimulus exposes those flags as
`:passive` / `:prevent`.

### A real click runs microtasks before the event finishes bubbling

**What happens.** During a real click, the browser runs the microtask
checkpoint when a listener returns, before the event bubbles to the next
element. `await Promise.resolve()` inside an action therefore resumes
before ancestor actions run, and `event.params` is still the seat's
object. `element.click()` from script does not checkpoint there: the
rest of the bubble, including the ancestor action, runs before that
microtask, so the same `await` already sees the ancestor's params.
`setTimeout` runs after the whole dispatch either way.

**Why it matters.** A check that uses `element.click()` and
`await Promise.resolve()` will say the params were replaced. The same
code, clicked for real, still sees the seat. The two disagree, and only
the timer agrees with both.

**What to do.** Copy the params before yielding. When the read has to
happen after the click, wait for a timer. Don't treat
`Promise.resolve()` as "after the bubble."

**Seen in:** [Repertory seat holds](features/06-action-parameters/12-repertory-seat-holds/).

**Why this section.** The checkpoint is the browser. Stimulus is what
writes a new `event.params` for each action along the way.

### HTML lowercases param attribute names

**What happens.** In an HTML document, attribute names are converted to
ASCII lowercase. `data-hold-shelf-patronName-param` is stored as
`data-hold-shelf-patronname-param`. Stimulus camelizes only on `-` and
`_`, so the key is `patronname`, not `patronName`.
`setAttribute("data-hold-shelf-patronName-param", ...)` is lowercased
the same way.

**Why it matters.** `event.params.patronName` is `undefined`. The value
is sitting on `patronname`.

**What to do.** Write multi-word param names in kebab-case:
`data-hold-shelf-patron-name-param`. Underscores camelize too
(`patron_name` becomes `patronName`), but hyphens match the rest of the
`data-*` attributes in this catalog.

**Seen in:** [Library hold shelf](features/06-action-parameters/01-library-hold-shelf/).

**Why this section.** Lowercasing is the HTML parser. Stimulus's
camelize is what fails to put the capital letter back.

### An already-aborted `AbortSignal` silently adds nothing

**What happens.** `AbortController.abort()` can only happen once.
`addEventListener(..., { signal })` with an already-aborted signal
attaches no listener and throws nothing.

**Why it matters.** An `AbortController` created in `initialize()` and
aborted in `disconnect()` is spent. The next `connect()` adds no
listeners, and the page looks fine until the feature just stops working.

**What to do.** Make a new `AbortController` every time you start
listening.

**Seen in:** [Session timeout warning](features/02-lifecycle-callbacks/02-session-timeout-warning/).

**Why this section.** `addEventListener` ignoring a spent signal is the
platform; the usual victim is a controller that aborts in `disconnect()`
and listens again in `connect()`.

### A child of a removed node can still have `parentElement`

**What happens.** Replacing an element's `innerHTML` detaches its
children. A node that was a direct child has `parentElement === null`.
A node that was inside one of those children is still parented by that
child. `isConnected` is false either way. The removed wrapper is a
document fragment's worth of nodes, not a signal that the inner node
is still on the page.

**Why it matters.** `berryTargetDisconnected` runs for both shapes.
Checking `parentElement` to mean "still on the dock" treats a berry in
the morning tote as still packed somewhere on the slip. The tote is
only still its parent; the tote itself has left the document.

**What to do.** Use `isConnected` to ask whether the node is in the
document. Read `parentElement` when you want the detached fragment it
is still in.

**Seen in:** [Cranberry receiving dock](features/08-target-callbacks/07-cranberry-receiving-dock/).

**Why this section.** `parentElement` surviving on descendants is the
DOM. The disconnected callback is what hands you the node after the
slip was replaced.
