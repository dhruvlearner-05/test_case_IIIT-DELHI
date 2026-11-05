# Privacy and security choices

## Purpose and minimum data
The prototype supports business discovery, catalogue quoting, document consistency checks and a simulated order. Discovery uses business category, staff, sites, city tier, budget, existing connection and priority. It does not require a contact name or phone number. All bundled registries and specimen documents are fictional case data. Use fictional documents only.

## Consent and user control
Document upload and registry checks remain locked until an explicit consent checkbox is selected. The notice states the purpose, local processing and retention. Extracted fields require user confirmation. Withdrawal or Reset clears extracted data and the stored demo order. Marketing consent is neither requested nor inferred.

## Processing and storage
Tesseract OCR runs locally in the browser using bundled assets. Raw images and extracted fields stay in memory; no upload or server database stores them. Reload clears the KYC session. A masked order summary, products and event timestamps persist in localStorage for up to 24 hours, with expiry enforced on next app load. Users can delete that state earlier. Downloaded quotes/receipts are user-managed files and are not erased by Reset.

## GenAI boundary
The optional local Node server keeps the API key in an ignored environment file. Only enumerated business attributes and a rule-approved product list are sent to the configured model. Raw images, names, GSTINs, Udyam numbers and signatory details are excluded. The request sets store:false, but provider retention terms still apply. The offline path calls no external service.

## Validation and safeguards
The rules engine checks prices, quantities, eligibility and dependencies. KYC checks GST checksum/status, names, full address, age of address proof, ID expiry and OCR confidence. Missing or inconsistent fields route to review. No uncertain record silently advances. The case clock is fixed at 2026-07-15. Responses are rendered as text, keys never reach the browser, the local server restricts host/origin and model request size, and no identifier logs are intentionally written.

## Prototype limits and production requirements
Client-side checks can be bypassed and are not production authorization. Mock CSVs are downloadable and do not prove identity or signatory authority. Payments, assistance tickets and installation events are demonstrations. Before production, add authenticated server validation, protected document storage, encryption/key management, role-based reviewer access, audit logs, legally approved retention/deletion, incident handling and contracted registry/KYC integrations. Confirm applicable DPDP and telecom obligations before launch; this note is not a compliance certification.