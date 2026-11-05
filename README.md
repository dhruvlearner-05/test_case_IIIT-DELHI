# Udyam Digital
Team: **test_case**, campus: **IIIT-DELHI**.
Working synthetic-data prototype for the Accel Business / Airtel SYNC case.

## Start the app
Install Node.js 20.6 or later. No npm installation is needed.
```sh
npm start
```
Open http://127.0.0.1:4173 and keep the terminal running. On Windows, double-click START_DEMO.bat. Stop with Ctrl+C. Use recent Edge or Chrome. All OCR assets, mock registries and specimen images are bundled for the offline path.

## Enable live GenAI
1. Copy `.env.example` to `.env` in this folder.
2. For Groq, set `LLM_PROVIDER=groq`, `GROQ_API_KEY` and `GROQ_MODEL=openai/gpt-oss-120b` locally. Choose a model available to your Groq account. For OpenAI instead, set `LLM_PROVIDER=openai`, `OPENAI_API_KEY` and `OPENAI_MODEL`.
3. Stop an existing server, then run `npm run start:ai`.
4. Complete the advisor. Verify **Live GenAI explanation** appears on the quote.
5. If offline/fallback appears, check model access, billing and the local environment, then retry.

The key stays server-side. Only enumerated business attributes and a rule-approved product list reach the model. Documents, names, GSTINs, Udyam numbers and signatory information never enter the prompt. The OpenAI request sets `store:false`; Groq uses Chat Completions without this parameter. Provider retention terms still apply. The shipped demo video uses the offline path because no team API key was available. The Groq adapter was verified with a live local advisor request: HTTP 200, mode genai, and a non-empty explanation. This verifies that configuration at the time of testing; reviewers need their own valid key and model access.

## Judge walkthrough
1. Select professional office, 5 people, 1 site, tier 2, INR 3,500 budget and uptime priority.
2. Quote subtotal: INR 3,118; recurring total with assumed 18% demo tax: INR 3,679.24; first payment including setup and setup tax: INR 5,449.24. Remove/add backup or change quantities.
3. Accept quote terms. Give KYC consent. Choose **K09**, extract sample documents, review fields and confirm. OCR reads the actual images.
4. Verify mock registries. K09 passes consistency checks. Simulate payment failure, retry and advance the labelled installation simulator. Test delay and refresh.
5. Reset and try **K01**. Cancelled GST must block payment and route to review. **K11** contains stale address proof. Other samples may require manual corrections/review due to OCR quality or document issues.
6. Try Hindi and a mobile viewport. Primary headings/navigation support Hindi; catalogue labels and secondary controls remain partly English.

## Implemented
- Discovery: segment, staff, sites, city tier, budget, existing connection and priority.
- Optional server-side GenAI explanations, explicit offline/failure fallback.
- Catalogue pricing, quantities, eligibility, active-GST gates, dependency cascades, transparent setup/tax/contract/installation estimates.
- Local Tesseract OCR, editable extraction, mandatory confirmation, GST checksum, mock GST/Udyam lookups, name/full-address/date/ID-expiry checks, low-confidence review.
- Consent gate and withdrawal/reset. Documents/extracted fields stay in session memory. Masked order state expires after 24 hours.
- Simulated payment success/failure/retry, stable order reference, installation events/delay and reload persistence.

## Boundaries
This is not statutory telecom KYC. It cannot authenticate document issuers or signatory authority. Browser checks are not a security boundary. Production approvals, pricing and order writes must move to authenticated server APIs. Mock CSVs are client-readable: use only fictional data and never upload real customer documents. No production database, payment gateway, CRM, e-sign, DigiLocker or installation system is connected. Assistance/review buttons acknowledge a demo event only; they do not contact anyone or create a real ticket. Tax is an explicit demo assumption. The document-rule date is **2026-07-15** per the case README.

The hosted preview, if available, runs the static offline path and starts owner-private. It is not automatically accessible to judges. Use the local Node server for live GenAI.

## Tests
```sh
npm test
```
32 regression tests cover pricing, eligibility, dependencies, consent, document failures and order transitions. Browser QA also exercised actual OCR, payment retry, installation delay, persistence, masking, withdrawal, 390px mobile layout and Hindi. See docs/TEST_REPORT.md.

## Structure
- dist/: frontend, rule engine, case data, specimen images and bundled OCR.
- server.mjs: loopback-only server and optional model adapter.
- tests/: deterministic regression suite.
- docs/: architecture, privacy, tests and evidence.
- scripts/analyze.py: reproducible CSV analysis with Python standard library.

## Create the submission repository
Create an empty repository in your GitHub account. Upload this source folder or run:
```sh
git init
git add .
git commit -m "Add Udyam Digital prototype"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```
Replace the example URL. Never upload .env. Grant judges the required access. The team must create the repository and submit its actual URL.

## Credits
Case data/specimens: supplied fictional YTL Track A pack. Tesseract.js 6.0.1, Tesseract.js-core 6.0.0 and English trained data: respective upstream licenses, listed in THIRD_PARTY_NOTICES.md. No rights to redistribute case materials outside the event are asserted.

Groq adapter reference: https://console.groq.com/docs/api-reference . Provider routing and error handling are covered by mocked tests. A live Groq advisor request also passed. Run `node --env-file=.env scripts/check-ai.mjs` to check your own local configuration without printing the key.

## Submission documents
- [Seven-slide presentation PDF](test_case_IIIT-DELHI.pdf)
- [Editable PowerPoint](test_case_IIIT-DELHI.pptx)
- [Architecture](test_case_IIIT-DELHI_Architecture.pdf)
- [One-page privacy note](test_case_IIIT-DELHI_Privacy.pdf)

The recorded demo demonstrates the offline path. Supply the MP4 or an accessible video link with the submission.
