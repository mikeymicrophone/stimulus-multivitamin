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

**Seen in:** [Recipe card collection](features/01-controllers/05-recipe-card-collection/).

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
[Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/).

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

**Seen in:** [Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/).

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
