# NaturesMud Nepal — Rollback Plan & Go-Live Checklist

**Project**: NaturesMud Nepal Technical, SEO, UX & AI Upgrade  
**Safety Protocol**: Strictly Non-Destructive to Live Production Site ([https://naturesmud.shop](https://naturesmud.shop))  
**Date**: October 13, 2026

---

## 1. Staging Isolation Architecture

1. **Current Working Branch**: `feature/naturesmud-audit-upgrade` (isolated from `main`).
2. **Local Preview Server**: Next.js 15 running locally on `http://localhost:3000` (or staging port `3001`).
3. **Noindex Directives**: Staging builds inject `<meta name="robots" content="noindex, nofollow" />` and HTTP header `X-Robots-Tag: noindex, nofollow` to prevent staging search indexation.
4. **Production Deployment Protection**: All scripts that trigger FTP or SSH uploads to production (`scripts/deploy-live-sync.js`, `scripts/deploy_now.js`, etc.) are locked and require explicit owner confirmation.

---

## 2. Full Backup Protocol Before Production Deployment

Before executing any approved deployment to the live host (cPanel / Nest Nepal / Passenger):

1. **Remote Filesystem Backup**:
   - Create a tarball/zip archive of remote `public_html/` or application directory:
     ```bash
     tar -czf naturesmud_backup_pre_upgrade_$(date +%Y%m%d_%H%M%S).tar.gz /home/naturesmud/public_html
     ```
2. **Remote MySQL Database Backup**:
   - Dump both `natures_mud` and `natures_mud_admin` schemas with data:
     ```bash
     mysqldump -u <user> -p natures_mud > backup_natures_mud_$(date +%Y%m%d).sql
     mysqldump -u <user> -p natures_mud_admin > backup_natures_mud_admin_$(date +%Y%m%d).sql
     ```
3. **Git Tagging**:
   - Tag the exact production commit before deployment:
     ```bash
     git tag -a prod-backup-pre-upgrade-$(date +%Y%m%d) -m "Production snapshot before upgrade"
     git push origin --tags
     ```

---

## 3. Immediate Rollback Procedure (< 5 Minutes)

If any catastrophic issue occurs during production rollout (payment failure, checkout blockage, routing loop, server crash):

1. **Instant Revert via Git**:
   ```bash
   git checkout main
   git reset --hard prod-backup-pre-upgrade-<date>
   npm run build
   # execute rollback sync
   ```
2. **Server Restore via Archive**:
   - Unpack the pre-upgrade tarball:
     ```bash
     tar -xzf naturesmud_backup_pre_upgrade_*.tar.gz -C /home/naturesmud/public_html
     touch /home/naturesmud/tmp/restart.txt # restart Phusion Passenger
     ```
3. **Database Restore** (if schema migration was run):
   ```bash
   mysql -u <user> -p natures_mud < backup_natures_mud_<date>.sql
   ```
4. **Service Verification**:
   - Verify `curl -I https://naturesmud.shop/` returns HTTP 200.
   - Verify `curl -I https://naturesmud.shop/products/banana-powder` returns HTTP 200.
   - Place a test Cash on Delivery order to confirm checkout pipeline.

---

## 4. Go-Live Verification Checklist (Pre-Approval Gateway)

Every item below must be checked and signed off before requesting production release approval:

### A. Integrity & Correctness
- [ ] Unified `products.json` matches authoritative pricing:
  - Banana Powder: 100 GM @ Rs. 650
  - Avocado Powder: 80 GM @ Rs. 790
  - Strawberry Powder: 80 GM @ Rs. 1,395
  - Moringa Leaf Powder: 200 GM @ Rs. 690
  - Raw Cashew: 150 GM @ Rs. 750
  - Roasted Cashew: 200 GM @ Rs. 750
- [ ] Zero price discrepancies between cards, detail pages, reels, schema, and cart.
- [ ] Zero fabricated reviews, review counts, lab certificates, or awards.
- [ ] All 32 SKU files in `/content/products/<slug>.json` validated.

### B. Technical SEO & Routing
- [ ] All 301 redirects in place (`/shipping` → `/shipping-policy`, `/returns` → `/return-policy`, `/privacy` → `/privacy-policy`, `/return-refund-policy` → `/return-policy`).
- [ ] Clean XML sitemaps with zero 404 links.
- [ ] `<meta name="keywords">` removed from all pages.
- [ ] `og:type="product"` on all 32 product pages.
- [ ] Schema.org validation clean (Product, Offer, BreadcrumbList, Organization, LocalBusiness).

### C. UX & Conversion
- [ ] Mobile navigation and sticky add-to-cart functioning smoothly.
- [ ] District delivery estimator functional across all 7 provinces & 77 districts.
- [ ] Free delivery progress bar working (Rs. 3,000 threshold, Rs. 5,000 + free pink salt gift).
- [ ] Video reels rendered via lazy thumbnail facade (<2.2 MB initial page payload).
- [ ] AI assistant responsive (<1 second on pre-indexed Q&A), disclosed as AI, with WhatsApp fallback (+977-9713888002).

### D. QA Testing & Approvals
- [ ] Cross-browser test (Chrome, Safari, Firefox, Edge) passed.
- [ ] Mobile responsive test (360px – 1440px) passed.
- [ ] End-to-end checkout (COD and sandbox wallets) verified.
- [ ] Client owner approval in writing.
