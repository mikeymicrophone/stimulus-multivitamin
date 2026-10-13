# Stimulus Multivitamin

Thirteen samples of healthy code for each feature of the
[Stimulus](https://stimulus.hotwired.dev) JavaScript library.

| Supplement Facts | |
| --- | --- |
| Serving size | 1 scenario |
| Servings per feature | 13 |
| Features | 15 |
| Scenarios | 195 |
| Active ingredient | Stimulus 3.2.2 |
| Build step | 0 mg |

## Why

The official Hotwire docs explain each Stimulus feature well, but most of
their snippets are deliberately small: a greeter, a clipboard button, a
counter. That is enough to learn the syntax and not enough to see how a
feature holds up inside a real interface.

Stimulus Multivitamin is a catalog of realistic scenarios: an invoice editor,
a seat picker, a recipe scaler. Each feature gets thirteen of them, ranging
from moderately complex to complex, so you can see the same feature applied
in thirteen different shapes.

Every scenario uses real, domain-meaningful names for controllers, targets,
values, actions, and variables. You will not find placeholder names here.

The bottle is full: 15 features, 13 scenarios each, 195 pages.

## Run the examples locally

There is no build step and nothing to install. Every page loads Stimulus as an
ES module from a CDN through an importmap. Pages must be served over HTTP
(browsers block ES modules on `file://` URLs), so start any static server from
the repository root:

```sh
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed address (<http://localhost:8000> for the Python server) to see the
catalog at `index.html`.

## Layout

```
index.html                         catalog of every feature and scenario
DISCOVERIES.md                     Stimulus behaviors (by feature), a serving note, then browser gotchas that bite Stimulus code
assets/multivitamin.css            shared styling (optional; scenarios work without it)
serve.json                         keeps `npx serve` URLs ending in a slash so relative imports resolve
features/
  01-controllers/
    README.md                      what the feature covers and its 13 slots
    01-invoice-line-items/
      index.html                   markup, importmap, controller registration
      invoice_controller.js
      line_item_controller.js
      README.md                    what the scenario teaches
  02-lifecycle-callbacks/
  ...
```

Each scenario folder is self-contained: open its `index.html` through the
server and it runs on its own.

## Features

1. [Controllers](features/01-controllers/)
2. [Lifecycle callbacks](features/02-lifecycle-callbacks/)
3. [Actions](features/03-actions/)
4. [Keyboard filters](features/04-keyboard-filters/)
5. [Action options](features/05-action-options/) (including custom options via `registerActionOption`)
6. [Action parameters](features/06-action-parameters/)
7. [Targets](features/07-targets/)
8. [Target callbacks](features/08-target-callbacks/)
9. [Values](features/09-values/)
10. [Value change callbacks](features/10-value-change-callbacks/)
11. [CSS classes](features/11-css-classes/)
12. [Outlets](features/12-outlets/)
13. [Dispatching custom events](features/13-dispatching-events/)
14. [Application setup and registration](features/14-application-setup/) (`shouldLoad`, `afterLoad`, `debug`)
15. [Error handling](features/15-error-handling/) (`handleError`)

The reference scenario that later ones copy is
[Controllers · 01 · Invoice line-item editor](features/01-controllers/01-invoice-line-items/).

## Discoveries

Behaviors the official docs don't mention, found while building these
scenarios, are collected in [DISCOVERIES.md](DISCOVERIES.md). Stimulus
entries are grouped by feature. Browser and DOM gotchas that show up
inside Stimulus code sit in their own section at the bottom.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the scenario conventions.

## License

[MIT](LICENSE) © Mike Schwab
