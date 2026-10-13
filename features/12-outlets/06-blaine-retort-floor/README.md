# Outlets · 06 · Blaine retort floor

The Alaska Packers floor at Blaine. Shell 2 is in the document
with `data-controller="retort-shell"`, and that controller is
not registered. The cooling basket shares the shell's class.

**What it teaches**

- The selector `.retort-shell` matches shell 2 and the basket.
  Only shell 2 carries the `retort-shell` token, so
  `retortShellOutletElements` is shell 2 and the basket is
  excluded.
- `hasRetortShellOutlet` is true. `retortShellOutletElement`
  is the shell. `retortShellOutlets` warns
  `The provided outlet element is missing an outlet controller
  "retort-shell" instance for host controller "retort-floor"`
  and returns an empty list. The warning is issued on every
  read. `retortShellOutlet` throws that same sentence as an
  `Error`.
- Loading the controller with `application.register` connects
  the shell. `retortShellOutletConnected` runs before the
  shell's `connect()`, so the cook flag is still missing.
  The shell's status then says the cook is set.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Shell 2, the basket, the floor board |
| [`retort_floor_controller.js`](retort_floor_controller.js) | Counts the warn, reads the shell, registers it |
| [`retort_shell_controller.js`](retort_shell_controller.js) | Sets the cook flag when it finally connects |
| [`retort_basket_controller.js`](retort_basket_controller.js) | The basket that is not a shell controller |

**Try it**

The board opens "hasRetortShellOutlet true. Elements shell-two.
Outlets 0. Basket shell-basket excluded. Warns 1." and the warn
sentence about a missing retort-shell instance. Shell 2 still
says "Shell cook has not been set." Read the shell. The fault
is `Error: The provided outlet element is missing an outlet
controller "retort-shell" instance for host controller
"retort-floor"`. Load the shell controller. The log says
"Connected shell-two. Cook missing." then "Registered
retort-shell." Shell 2 says "Shell cook set."
