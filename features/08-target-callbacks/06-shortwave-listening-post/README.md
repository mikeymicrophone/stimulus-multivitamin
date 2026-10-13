# Target callbacks · 06 · Shortwave listening post

Evening log at a kitchen-table listening post. WWV is chalked as a
station. NDB BN is chalked as a station and a beacon, in that order.

**What it teaches**

- One element can carry several target names. `stationTargetConnected`
  runs, then `beaconTargetConnected`, in the order the tokens are
  written. The counts list WWV and NDB BN as stations, and only NDB BN
  as a beacon.
- Adding `beacon` at the end of WWV's attribute runs only
  `beaconTargetConnected`. Removing the trailing `beacon` token from
  NDB BN runs only `beaconTargetDisconnected`. The station callback
  does not run again.
- Swapping WWV from `station beacon` to `beacon station` changes the
  first token. Both names disconnect and both connect again, even
  though the card is still a station and a beacon. The counts finish
  unchanged for that card. The tape shows the four lines.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | WWV, NDB BN, importmap, and registration |
| [`listening_post_controller.js`](listening_post_controller.js) | Station list, beacon list, and the tape |

**Try it**

The counts start "Stations: WWV, NDB BN. Beacons: NDB BN." The tape
shows station connected for both, beacon connected for NDB BN, then
"post open". Mark WWV as a beacon. The tape adds only
`beacon connected: WWV`, and the beacon count names both. Clear the
trailing beacon on NDB BN. The tape adds only
`beacon disconnected: NDB BN`. Swap the WWV chalk. The tape shows WWV
disconnected as a station, disconnected as a beacon, connected as a
beacon, and connected as a station. The counts read
"Stations: NDB BN, WWV. Beacons: WWV."
