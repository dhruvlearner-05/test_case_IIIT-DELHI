# Implemented architecture
```mermaid
flowchart LR
 UI[Mobile web: profile and consent] --> Rules[Browser catalogue and KYC rules]
 OCR[Local Tesseract OCR] --> Rules
 CSV[Mock registry and catalogue CSV] --> Rules
 Rules --> Checkout[Simulated checkout]
 Checkout --> Tracker[Order tracker]
 Tracker --> Cache[Masked localStorage: 24-hour expiry]
 UI --> Node[Optional loopback Node API]
 Node --> AI[Responses API: approved non-identity facts]
 AI --> UI
```
All raw KYC stays in browser memory. Static hosting cannot run the Node API. Browser validation is not a production trust boundary. No production payment, CRM, registry or installation adapter exists. Production would require authenticated server decisions and approved document storage/retention.
