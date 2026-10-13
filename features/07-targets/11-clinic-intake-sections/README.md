# Targets · 11 · Clinic intake sections

Front desk at Cedar Clinic. Insurance and pharmacy are both intake
sections. The shared heading, field, and summary targets live on the
base controller. Each section adds one target of its own.

**What it teaches**

- `static targets` is inherited. `InsuranceSection` declares `memberId`
  and still has `headingTarget`, `fieldTargets`, and `summaryTarget`.
  `PharmacySection` declares `allergyNote` and has the same three.
- The attribute uses the identifier on the element.
  `data-insurance-section-target="heading"` is the insurance heading.
  `data-intake-section-target="heading"` on a paragraph in that section
  is not. The summary names that stray text and does not use it as the
  heading.
- The base controller is registered. No element uses `intake-section`,
  so it has no instance. The subclasses do not redeclare the inherited
  names.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | Insurance and pharmacy sections, importmap, and registration |
| [`intake_section_controller.js`](intake_section_controller.js) | Heading, fields, and summary |
| [`insurance_section_controller.js`](insurance_section_controller.js) | Adds the member id and ignores the parent attribute |
| [`pharmacy_section_controller.js`](pharmacy_section_controller.js) | Adds the allergy note |

**Try it**

Summarize insurance. The line starts "Insurance — Carrier: Aetna." and
includes member id AET-44021, inherited heading and fields yes, and the
ignored stray heading "Primary policyholder, printed on the base form."
Summarize pharmacy. The line is "Pharmacy — Allergies: Penicillin.
Allergy note: Carry an epinephrine pen. Inherited heading and fields: yes."
