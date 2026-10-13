# Outlets · 12 · Quillayute chart desk

Plates at the Quillayute River station. The tide desk inherits
a horn. Two plates file `static outlets` the way a value is
filed. The staff plate hyphenates the attribute in the wrong
place. The collision plate uses a log name with and without a
namespace.

**What it teaches**

- `horn` is declared on the parent. `bell` is declared on
  `tide-desk`. Both attributes use the subclass identifier:
  `data-tide-desk-horn-outlet` and `data-tide-desk-bell-outlet`.
  `data-chart-desk-horn-outlet="#decoy-horn"` is on the element
  and is not the horn the desk reads.
- An object or a string `static outlets` defines no outlet
  properties. `tideStaffOutlet` is not on the controller.
  Reading it is `undefined` and does not throw.
- Outlet names are copied into the attribute as written.
  `tide-staff` requires `data-staff-plate-tide-staff-outlet`.
  `data-staff-plate-tideStaff-outlet` is stored lowercased and
  does not match. `hasTideStaffOutlet` is false. The singular
  getter throws with selector `null`. The Quillayute staff is
  connected anyway.
- `keeper--log` and `keeper-log` both become `keeperLog`.
  The later entry in `static outlets` owns `keeperLogOutlet`,
  so the getter is the dashed log. Both identifiers still call
  `keeperLogOutletConnected`. The attributes stay different.
  See
  [A namespaced outlet and its dashed twin share one property](../../../DISCOVERIES.md#a-namespaced-outlet-and-its-dashed-twin-share-one-property).

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The marks and the five plates |
| [`tide_desk_controller.js`](tide_desk_controller.js) | Inherited horn, own bell |
| [`chart_desk_controller.js`](chart_desk_controller.js) | Parent outlet list, not registered |
| [`object_plate_controller.js`](object_plate_controller.js) | Outlets as an object |
| [`string_plate_controller.js`](string_plate_controller.js) | Outlets as a string |
| [`staff_plate_controller.js`](staff_plate_controller.js) | CamelCase attribute miss |
| [`collision_plate_controller.js`](collision_plate_controller.js) | Two names, one property |
| [`keeper_log_controller.js`](keeper_log_controller.js) | Both log identifiers |
| [`horn_controller.js`](horn_controller.js), [`bell_controller.js`](bell_controller.js), [`tide_staff_controller.js`](tide_staff_controller.js) | The marks |

**Try it**

Cape horn, the decoy horn, and the cape bell each say they
connected. The tide desk says "Horn cape-horn. Bell cape-bell.
Own attribute cape-horn. Parent attribute decoy-horn." The
object plate says "Object plate tideStaffOutlet in false.
Value undefined." The string plate says "String plate
tideStaffOutlet in false." The staff plate says "Staff plate
hasTideStaffOutlet false." The Quillayute staff says
"Quillayute staff connected." The collision log says "Callback
keeper--log namespaced-log." then "Callback keeper-log
dashed-log." then "Getter dashed-log identifier keeper-log."
Read the staff. The fault is `Error: Missing outlet element
"tide-staff" for host controller "staff-plate". Stimulus
couldn't find a matching outlet element using selector "null".`
