# NaturesMud Nepal — Needed From Owner Checklist

**Date**: October 13, 2026  
**Status**: Pending Business Owner Review  
**Project**: Staging Quality & Technical Upgrade ([https://naturesmud.shop](https://naturesmud.shop))

> **Rule 2 Adherence**: Antigravity never fabricates lab results, certifications, licenses, awards, sales numbers, customer names, or customer proof. When an authoritative fact is unverified or missing from company records, a `TODO_OWNER` placeholder is inserted and recorded below.

---

## 1. Regulatory, Lab Reports & Quality Proof

| Item ID | Required Asset / Document | Purpose / Surface | Current Status | Action Required from Owner |
|---|---|---|---|---|
| **OWNER-DOC-01** | **DFTQC Food License / Registration Certificate** | Display on Quality & Proof page, footer, and schema to comply with Department of Food Technology and Quality Control (DFTQC, Babarmahal, Kathmandu). | `TODO_OWNER` | Provide high-resolution scan/PDF of DFTQC registration certificate and exact registration number. |
| **OWNER-DOC-02** | **PAN / VAT Registration Certificate** | Company transparency, invoice generation, checkout trustworthiness. | `TODO_OWNER` | Confirm official registered legal entity name (e.g. Krisha Agriline Pvt. Ltd. / NaturesMud Nepal) and 9-digit PAN/VAT number. |
| **OWNER-DOC-03** | **Laboratory Test Reports (Third-Party Analysis)** | Support claims regarding purity, microbiological safety, heavy metals (Lead, Cadmium, Arsenic), and nutrient retention. | `TODO_OWNER` | Upload latest laboratory test certificate PDFs (e.g., from DFTQC accredited laboratories in Nepal) for: (1) Shilajit Resin, (2) Avocado Powder, (3) Moringa Leaf Powder, (4) Coconut Oil. |
| **OWNER-DOC-04** | **Organic Certification Documents (if claimed)** | Substantiate any "Organic" labeling or trust badges. | `TODO_OWNER` | If products are certified organic, provide certificate from accredited certification agency (e.g. Organic Certification Nepal / INDOCERT). If not certified, packaging and web copy will use "100% Pure & Natural · Chemical-Free · 0 Additives" instead. |

---

## 2. Production Process & Sourcing Verification

| Item ID | Required Specification | Purpose / Surface | Current Status | Action Required from Owner |
|---|---|---|---|---|
| **OWNER-PROC-01** | **Drying Technology & Operating Temperature Log** | Standardize drying claims across Banana, Avocado, Strawberry, Sweet Potato, Beetroot, and Moringa powders. | `TODO_OWNER` | Specify exact processing method per powder: (a) Freeze-dried (lyophilization) vs closed-chamber dehydrator, and (b) exact maximum operating temperature (e.g., <40°C, 42°C, 45°C). |
| **OWNER-PROC-02** | **Regional Sourcing Breakdown per Belt** | Comply with origin transparency; differentiate Terai, Mid-Hills, and Himalayan sources. | `TODO_OWNER` | Confirm specific origin district for each raw crop: (a) Bananas (Chitwan/Nawalpur), (b) Apples (Mustang/Jumla), (c) Moringa (Terai), (d) Shilajit (High Himalaya), (e) Cashews & Almonds (Imported single-origin kernels vs local packaging). |
| **OWNER-PROC-03** | **Batch Numbering & Expiry Label Sample Photo** | Embed genuine packaging label photo inside the per-product Quality Proof block. | `TODO_OWNER` | Provide clean front and back label photos of current glass jars showing Batch No., Mfg Date, Best Before Date, and Net Weight (80g vs 100g vs 200g). |

---

## 3. Customer Consent & Real Imagery

| Item ID | Required Asset | Purpose / Surface | Current Status | Action Required from Owner |
|---|---|---|---|---|
| **OWNER-MEDIA-01** | **Customer Review Photo Written Consents** | Verify customer permission before displaying customer photos on the website. | `TODO_OWNER` | Confirm that all customer photo reviews currently shown in the review gallery have written customer consent for public marketing use. |
| **OWNER-MEDIA-02** | **Authentic Kitchen & Packaging Unit Photos** | Replace generic or stock lifestyle photos on the About Us / Our Story page. | `TODO_OWNER` | Provide 4–6 authentic photos of the Sitapaila/Kathmandu sorting, drying, and glass-jar packaging team. |

---

## 4. Payment Gateway Sandbox & Merchant Credentials

| Item ID | Integration | Purpose | Current Status | Action Required from Owner |
|---|---|---|---|---|
| **OWNER-PAY-01** | **eSewa EPAY v2 Sandbox / Production Credentials** | eSewa direct payment checkout integration. | Live active / verify test mode | Confirm eSewa Product Code and Secret Key for automated staging sandbox test validation. |
| **OWNER-PAY-02** | **Khalti Payment Gateway v2 Keys** | Khalti wallet & mobile banking checkout. | Live active / verify test mode | Provide Khalti Public & Secret test keys (`test_secret_key_...`) for staging automated testing. |
| **OWNER-PAY-03** | **Fonepay Merchant QR Dynamic Payment** | Fonepay interbank QR payment. | Static QR image | Provide Fonepay merchant credentials if dynamic server-to-server payment verification is desired. |
| **OWNER-PAY-04** | **Stripe / PayPal Sandbox (Diaspora Payments)** | International credit card processing for Nepalis abroad sending gifts to family in Nepal. | Not connected | If international payments (USD/GBP/AUD/AED) are required for Diaspora gift orders, supply Stripe test publishable/secret keys or PayPal sandbox client ID. |

---

## 5. Daraz Nepal Seller Center Onboarding & Brand Store Checklist

| Item ID | Requirement / Asset | Purpose on Daraz Nepal | Current Status | Action Required from Owner |
|---|---|---|---|---|
| **OWNER-DARAZ-01** | **Daraz Seller Center Nepal Account** | Bulk uploading the 32-SKU catalog (`public/daraz-all-32-sku-listings.csv`). | Pending Seller Login | Confirm Daraz Seller ID and registered email/mobile number for store sync. |
| **OWNER-DARAZ-02** | **Corporate Bank Account Cheque Copy** | Verification for automated bi-weekly payout deposits from Daraz to NaturesMud company bank account. | `TODO_OWNER` | Upload scanned blank cancelled cheque matching the business PAN registration name. |
| **OWNER-DARAZ-03** | **Trademark / Brand Authorization for DarazMall** | Qualify for DarazMall Flagship Store status (secures priority search ranking and higher conversion trust). | `TODO_OWNER` | Provide Department of Industry (DOI) trademark registration certificate or brand ownership declaration. |
| **OWNER-DARAZ-04** | **Fulfillment Model Selection (FBD vs FBM)** | Operational setup for dispatching daily Daraz orders. | Drop-shipping (FBM) Recommended | Confirm if orders will be handed over to local Daraz hub (Baneshwor/Koteshwor) daily, or stocked in Daraz Thapathali warehouse (FBD). |
| **OWNER-DARAZ-05** | **Packaging & AWB Shipping Label Printer** | Safeguarding glass jars in Daraz courier transit to prevent breakage deductions. | Packaging standard designed | Procure 4x6 inch thermal shipping label printer and bubble wrap sleeves for glass jars. Insert cards (`public/daraz-all-32-sku-listings.json`) ready to print. |

