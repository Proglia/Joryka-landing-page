# **SOFTWARE REQUIREMENTS SPECIFICATION (SRS)**

## **TraceForce**

### **Offline-First Retail POS & Inventory System**

---

# **1\. Introduction**

## **1.1 Purpose**

This Software Requirements Specification (SRS) defines the functional, non-functional, operational, and system-level requirements for Phase 1 of the Track Force Offline Retail POS & Inventory System.

This document shall serve as:

* Engineering implementation reference

* UI/UX validation baseline

* Acceptance criteria benchmark

* Scope control document

---

## **1.2 Scope**

Phase 1 includes development of a standalone, offline-first POS & inventory system capable of operating in a wholesale retail environment with:

* Multi-unit (carton \+ unit) inventory logic

* Credit-based customer transactions

* Multi-device concurrency

* Role-based access control

* Audit logging

* Reporting and export

* Multi-language UI capability

* Offline data persistence with sync

---

## **1.3 Definitions**

* **Offline-First:** System operates fully without internet and synchronizes when restored.

* **Carton-Unit Conversion:** Products stored in units but sellable in cartons via conversion logic.

* **Ledger:** Chronological customer transaction record including outstanding balances.

* **Concurrency:** Multiple users/devices operating simultaneously.

* **UAT:** User Acceptance Testing period (15 business days).

---

# **2\. Overall System Description**

---

## **2.1 Product Perspective**

The system is a standalone retail execution tool designed for:

* High-volume wholesale environments

* Low-connectivity settings

* Multi-terminal shop usage

It must prioritize:

* Speed

* Data integrity

* Operational safety

* Minimal transaction friction

---

## **2.2 User Classes**

### **2.2.1 Admin**

Full configuration and operational control.

### **2.2.2 Staff**

Operational sales and limited inventory access.

---

## **2.3 Operating Environment**

* Desktop-first web application

* LAN multi-device usage

* Local data persistence

* Third-party PCI-DSS compliant digital payment integration

* Thermal printer support

---

# **3\. Functional Requirements**

---

# **3.1 Authentication & Authorization**

### **FR-1: Secure Login**

System shall require authentication before access.

### **FR-2: Role-Based Access Control (RBAC)**

System shall restrict features based on assigned role.

### **FR-3: Session Management**

System shall:

* Log login/logout events

* Automatically expire inactive sessions (configurable timeout)

### **FR-4: User Management (Admin Only)**

Admin shall:

* Create users

* Edit users

* Activate/deactivate users

* Assign roles

---

# **3.2 POS (Point of Sale) Module**

---

## **3.2.1 Product Selection**

### **FR-5**

Search by:

* Product name

* SKU

* Barcode

### **FR-6**

Display:

* Unit price

* Carton price

* Available stock (units & cartons)

---

## **3.2.2 Cart Management**

### **FR-7**

Allow:

* Add/remove items

* Modify quantities

* Mixed carton \+ unit combinations

### **FR-8**

Prevent adding quantity exceeding available stock.

---

## **3.2.3 Payment Processing**

### **FR-9**

Support:

* Cash

* Digital payment (via PCI-compliant third-party)

* Partial payment

* Full credit

### **FR-10**

Partial payments shall:

* Record paid amount

* Automatically calculate outstanding balance

### **FR-11**

Digital payments shall:

* Not store raw cardholder data

* Rely solely on external gateway

---

## 

## **3.2.4 Transaction Finalization**

### **FR-12**

Upon confirmation:

* Deduct inventory

* Create transaction record

* Update customer ledger (if applicable)

* Log audit entry

### **FR-13**

System shall generate printable receipt.

---

# **3.3 Inventory Management Module**

---

## **3.3.1 Product Management**

### **FR-14**

Admin shall create/edit products.

Required fields:

* Product name

* SKU

* Barcode (optional)

* Cost price

* Unit selling price

* Carton selling price

* Units per carton

---

## **3.3.2 Inventory Logic**

### **FR-15**

All inventory shall be stored in base unit quantity.

### **FR-16**

Carton sale shall deduct (units per carton × carton quantity).

### **FR-17**

System shall prevent negative stock.

---

## **3.3.3 Stock Adjustment**

### **FR-18**

Admin shall:

* Increase/decrease stock

* Provide mandatory reason

### **FR-19**

Stock adjustment shall be logged immutably.

---

# **3.4 Customer & Credit Ledger Module**

---

## **3.4.1 Customer Management**

### **FR-20**

Create customer profile with:

* Name

* Phone

* Address (optional)

---

## **3.4.2 Credit Handling**

### **FR-21**

Allow credit sales.

### **FR-22**

Maintain chronological ledger entries.

### **FR-23**

Auto-update outstanding balance after:

* Credit sale

* Payment entry

### **FR-24**

Allow recording of payments against outstanding balance.

---

## **3.4.3 Ledger Integrity**

### **FR-25**

Ledger entries shall not be deleted without audit logging.

### **FR-26**

Outstanding balance shall be system-calculated only.

---

# **3.5 Reporting Module**

---

### **FR-27: Daily Sales Report**

Generate report by date.

### **FR-28: Inventory Report**

Show current stock levels.

### **FR-29: Customer Outstanding Report**

List customers with balances.

### **FR-30: Filtering**

Allow filtering by:

* Date range

* Staff

* Payment type

### **FR-31: Export**

Support CSV and PDF export.

---

# **3.6 Audit & Logging**

---

### **FR-32**

Log:

* Product edits

* Price changes

* Stock adjustments

* Transaction voids

* Credit changes

* Login activity

### **FR-33**

Audit logs shall:

* Be immutable

* Include timestamp

* Include user ID

---

# **3.7 Offline-First Requirements**

---

### **FR-34**

System shall allow full sales functionality offline.

### **FR-35**

All transactions shall be stored locally when offline.

### **FR-36**

System shall automatically sync when internet restored.

### **FR-37**

Sync logic shall prevent:

* Duplicate transactions

* Stock corruption

* Ledger inconsistency

---

# **3.8 Multi-Device Concurrency**

---

### **FR-38**

System shall support simultaneous usage across multiple devices.

### **FR-39**

System shall prevent race-condition negative stock.

### **FR-40**

System shall preserve all transactions during concurrent operations.

---

# **3.9 Multi-Language Support**

---

### **FR-41**

System shall support UI localization framework.

### **FR-42**

All UI labels shall use translation keys (no hardcoded text).

### **FR-43**

Admin shall configure default system language.

### **FR-44**

System architecture shall allow adding additional languages without codebase restructuring.

*(Initial deployment may include English only, but system must be language-ready.)*

---

# **3.10 System Settings & Configuration**

---

### **FR-45**

Admin shall configure:

* Business name

* Logo

* Receipt footer

* Default currency

* Tax display toggle

### **FR-46**

System shall support enabling/disabling:

* Barcode scanning

* Display stock in POS

* Display outstanding balance in POS

---

# **3.11 Receipt Management**

---

### **FR-47**

Receipt shall include:

* Business logo

* Date/time

* Staff name

* Item breakdown

* Carton/unit clarity

* Total

* Paid amount

* Outstanding balance (if applicable)

### **FR-48**

Support:

* Thermal printer format

* A4 format

---

# **4\. Non-Functional Requirements**

---

## **4.1 Performance**

* Checkout \< 2 seconds under normal load.

* UI response time \< 1 second for search queries.

---

## **4.2 Reliability**

* No data loss during offline operations.

* No duplicate transactions after sync.

---

## **4.3 Security**

* No storage of raw cardholder data.

* Encrypted authentication.

* Role-based restriction enforced at backend.

---

## **4.4 Usability**

* Counter-optimized layout.

* Minimal navigation layers.

* Large readable typography.

* High contrast interface.

---

## **4.5 Scalability**

* System shall handle growth in:

  * Products

  * Customers

  * Transactions

     Without architectural redesign.

---

## **4.6 Maintainability**

* Modular architecture.

* Clear separation of:

  * POS logic

  * Inventory logic

  * Ledger logic

  * Sync logic

---

# **5\. Constraints**

* Offline card processing out of scope.

* Multi-branch centralization out of scope.

* Advanced accounting integration out of scope.

* Supplier & purchase module out of scope (Phase 1).

---

