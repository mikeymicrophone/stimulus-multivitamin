# Controllers · 13 · Mortgage application sections

Jordan Avery, a first-time buyer, applies for a home loan with Riverbend Home
Loans. Every section of the form is a namespaced subclass of one section
controller, and every dollar field has its own small controller. The
application controller finds all the sections by class and works out the
monthly payment and debt-to-income ratio. Jordan's income alone puts the
ratio over the limit, so the form also lets you add a co-borrower.

**What it teaches**

This capstone combines the Controllers feature's techniques on one
realistic form.

- Namespaced identifiers from folders: `mortgage/application_controller.js`
  is `mortgage--application`, and `shared/currency_field_controller.js` is
  `shared--currency-field`.
- Inheritance across a namespace: five section identifiers share one
  `SectionController` base. The declarations section uses the base directly
  as `mortgage--section`; the borrower, income, debts, and loan sections
  subclass it and add rules through `additionalProblems()` and public
  getters.
- Finding controllers by class. The application filters
  `this.application.controllers` with `instanceof SectionController`
  (limited to its own element), so it never keeps a list of identifiers,
  and it sums income across every `IncomeSectionController` it finds.
- Don't shadow controller properties. Each section stores the surrounding
  controller as `this.mortgageApplication`, because `this.application` is
  already the Stimulus application.
- Several controllers per element, across scopes. Each dollar `<input>` is a
  section's target and also hosts its own `shared--currency-field`
  controller. The parsing rule is a static method, so a section can use it
  before the input's controller has connected.
- Dynamic sections. "Add a co-borrower" clones a `<template>` holding two
  more sections, which connect and report in. Removing them disconnects
  them, and the totals drop back.

**Files**

| File | Identifier | Role |
| --- | --- | --- |
| [`index.html`](index.html) | | Form markup, co-borrower template, importmap, and registration |
| [`mortgage/application_controller.js`](mortgage/application_controller.js) | `mortgage--application` | Finds sections by class; computes ratios and gates submission |
| [`mortgage/section_controller.js`](mortgage/section_controller.js) | `mortgage--section` | Base class: required fields, status, and reporting up |
| [`mortgage/borrower_section_controller.js`](mortgage/borrower_section_controller.js) | `mortgage--borrower-section` | Email and residence-history rules |
| [`mortgage/income_section_controller.js`](mortgage/income_section_controller.js) | `mortgage--income-section` | Exposes `monthlyIncome` |
| [`mortgage/debts_section_controller.js`](mortgage/debts_section_controller.js) | `mortgage--debts-section` | Sums every `payment` target |
| [`mortgage/loan_section_controller.js`](mortgage/loan_section_controller.js) | `mortgage--loan-section` | Down payment rules and the monthly payment |
| [`shared/currency_field_controller.js`](shared/currency_field_controller.js) | `shared--currency-field` | Formats and flags each dollar input |

**Try it**

Fill in Jordan's previous address, confirm the debts, and complete the
declarations. Every section turns complete, but debt-to-income sits near 49%
and submission stays locked. Add a co-borrower with $3,200 of monthly income
and the ratio drops to about 34%, which unlocks "Submit application". Remove
the co-borrower and it locks again. Type "about 8k" into an income field to
see the currency controller flag it.
