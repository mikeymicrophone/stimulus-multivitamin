# Target callbacks · 12 · Shipyard paint booths

The yard is painting three hulls. The launch tender and the trawler
June are in the open. The skiff Ellen is already sitting in the spray
booth, and the booth is not a controller until it is opened.

**What it teaches**

- On open, Ellen is inside the yard's scope, so the yard chalk is 9 gal
  (Tender, June, Ellen). The getter agrees until the booth becomes its
  own controller. Scope is re-checked on every read, as in
  [the nested meter bank](../../../DISCOVERIES.md#a-nested-controller-with-the-same-identifier-is-a-scope-boundary-re-checked-on-every-read).
- Opening the booth sets `data-controller` on the bay and does not move
  Ellen. The booth runs `hullTargetConnected` for her. The yard does
  not run `hullTargetDisconnected`. The yard chalk stays 9 gal. Read
  the yard slip and it is 7 gal (Tender, June). The booth chalk is 2 gal
  (Ellen). Adding the chalks counts Ellen twice.
- Rolling June in moves the element, so the yard disconnects her and
  the booth connects her. The yard chalk is then 3 gal (Tender, Ellen)
  and the slip is 1 gal (Tender). Recount copies the slip onto the
  chalk. The booth recount leaves Ellen and June, 8 gal.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Yard, spray booth, importmap, and registration |
| [`paint_booth_controller.js`](paint_booth_controller.js) | Chalk, slip, and recount |

**Try it**

The yard chalk reads "9 gal (Tender, June, Ellen)". The spray booth
chalk is quiet. Open the booth. The booth chalk reads "2 gal (Ellen)".
The yard chalk is still 9 gal. Read the yard slip: "7 gal (Tender, June)".
Read the booth slip: "2 gal (Ellen)". Roll June into the booth. She is
listed in the bay. The yard chalk is "3 gal (Tender, Ellen)" and, after
reading it, the yard slip is "1 gal (Tender)". The booth chalk is
"8 gal (Ellen, June)". Recount the yard and the booth. The yard chalk
matches its slip at 1 gal (Tender). The booth chalk matches its slip at
8 gal (Ellen, June).
