<div align="center">

# 🌳 Heritage

**A private digital family archive — visualise generations, preserve family records, and manage your lineage from one elegant web app.**

Explore an interactive family tree, search relatives, maintain member profiles, upload family photos, and keep every record inside your own Google Workspace environment.

[![Live App](https://img.shields.io/badge/OPEN%20HERITAGE-Live%20App-C9A84C?style=for-the-badge\&logo=google\&logoColor=0D1117)](https://script.google.com/macros/s/AKfycbxE3g-BoxNN5vv2mJ3WFRiHbPurKZYSOEhiE-99HOjM0uEdiIjq62J6SoFekHW04c21/exec)
[![Google Sheets](https://img.shields.io/badge/Database-Google%20Sheets-4A7C59?style=for-the-badge\&logo=googlesheets\&logoColor=FFFFFF)](https://github.com/Paim41/FAMILYTREE)
[![Apps Script](https://img.shields.io/badge/Backend-Apps%20Script-9B7A2E?style=for-the-badge\&logo=googleappsscript\&logoColor=FFFFFF)](https://github.com/Paim41/FAMILYTREE)
[![Type](https://img.shields.io/badge/Type-Family%20Tree-0D1117?style=for-the-badge)](https://github.com/Paim41/FAMILYTREE)

</div>

---

## About

Heritage is a **Google Workspace-powered family tree web application** designed to preserve family history in a structured, searchable, and visual format.

The application combines a responsive dashboard, an interactive D3 family tree, family-member profiles, role-based access, Google Sheets storage, and Google Drive photo uploads in a lightweight deployment that does not require a traditional hosting server or separate database service.

> **Your archive, your workspace:** family records are stored in a Google Sheet connected to the Apps Script project, while uploaded profile photos are saved inside a dedicated Google Drive folder.

---

## Family Archive Flow

```text
Sign In                 →  Administrator or generation-based family member access
    ↓
Open Dashboard          →  Review generations, parents, members, and descendants
    ↓
Explore Family Tree     →  Zoom, pan, expand branches, and inspect member profiles
    ↓
Search a Relative       →  Locate a member and focus directly on their tree node
    ↓
Manage Records          →  Add, edit, or delete permitted family information
    ↓
Preserve the Archive    →  Data syncs to Google Sheets and photos save to Google Drive
```

---

## Features

* **Interactive Family Tree** — Visualises parent-and-child relationships with D3.js
* **Up to 10 Generations** — Organises relatives from the root ancestor through later generations
* **Expandable Branches** — Open or collapse individual family branches and expand the entire tree
* **Zoom and Pan Controls** — Zoom in, zoom out, move around, and fit the tree to the screen
* **Member Detail Cards** — View generation, life status, spouse, gender, contact information, address, and death date
* **Generation Colour System** — Uses distinct colours to separate generations visually
* **Living and Deceased Status** — Clear visual indicators and relationship-line styling
* **Dashboard Statistics** — Displays total generations, parents, family members, and descendants
* **Global Member Search** — Search by name and jump directly to the matching tree node
* **Photo Uploads** — Stores family profile photos inside a Google Drive folder
* **Three-Step Member Form** — Organises identity, family relationship, and additional member details
* **Automatic Child Records** — Creates linked child entries when children are added to a member
* **Administrator and Member Roles** — Separates full administrative access from generation-restricted access
* **Session-Based Access** — Uses temporary Apps Script cache sessions with automatic activity renewal
* **Password Management** — Administrators can update the shared application password
* **Responsive Navigation** — Desktop navigation and a mobile-friendly bottom navigation bar
* **Google Workspace Storage** — Uses Google Sheets as the database and Google Drive for photos
* **Sample Data Generator** — Can initialise the sheet with a ten-generation demonstration family

---

## Access Roles

| Role               | Access                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Administrator      | View the dashboard and tree, search members, add records, edit or delete records, and change the application password |
| Family Member      | View the dashboard and tree, search members, and manage records only within the selected generation                   |
| Signed-Out Visitor | Cannot access the family archive until authenticated                                                                  |

> The current implementation uses one shared application password with role and generation selection. For a public or highly sensitive deployment, replace this with individual user accounts and stronger authentication.

---

## Stored Member Information

| Field         | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| ID            | Automatically generated unique member identifier            |
| Generation    | Member's position from Generation 1 to Generation 10        |
| Parent        | Link to a member from the previous generation               |
| Name          | Family member's full name                                   |
| Status        | Living or deceased                                          |
| Spouse        | Spouse or partner name                                      |
| Gender        | Male or female classification used by the current interface |
| Children      | Linked child names and generated child records              |
| Photo         | Google Drive-hosted profile image                           |
| Address       | Member's address                                            |
| Phone Number  | Contact number                                              |
| Date of Death | Optional date for deceased members                          |
| Timestamp     | Date and time the record was created or updated             |

---

## Built For

```text
Purpose     → Preserve and visualise a private family lineage
Frontend    → Single responsive HTML interface
Backend     → Google Apps Script
Database    → Google Sheets
Photos      → Google Drive
Theme       → Sage green, antique gold, cream, and deep ink
Status      → Functional Google Workspace web application
Not For     → Public genealogy research or enterprise identity management
```

---

## Tech Stack

| Layer                | Technology                      |
| -------------------- | ------------------------------- |
| Structure            | HTML5                           |
| Styling              | Custom CSS and Tailwind CSS CDN |
| Client Logic         | Vanilla JavaScript              |
| Tree Visualisation   | D3.js 7                         |
| Dialogs and Feedback | SweetAlert2                     |
| Backend              | Google Apps Script              |
| Database             | Google Sheets                   |
| Photo Storage        | Google Drive                    |
| Fonts                | Cormorant Garamond and DM Sans  |
| Deployment           | Google Apps Script Web App      |

---

## Project Structure

```text
FAMILYTREE/
├── index.html      Complete responsive interface, styles, D3 tree, and client logic
├── Code.gs         Apps Script backend, authentication, CRUD, Sheets, and Drive logic
└── README.md
```

---

## Data Structure

The backend creates and manages a Google Sheet named:

```text
Data Silsilah
```

The sheet uses the following columns:

```text
ID
Timestamp
Generasi
Parent ID
Nama
Status
Pasangan
Gender
Anak
Foto URL
Alamat
No HP
Tgl Meninggal
```

Uploaded photos are stored in a Google Drive folder named:

```text
Foto_Silsilah_Keluarga
```

---

## Deploy with Google Apps Script

### 1. Create the database

1. Open Google Drive
2. Create a new Google Sheet
3. Open **Extensions → Apps Script**
4. Rename the Apps Script project if required

### 2. Add the project files

1. Replace the default Apps Script code with the contents of `Code.gs`
2. Create a new HTML file named `index`
3. Paste the contents of `index.html` into the HTML file
4. Save the project

### 3. Initialise the family sheet

1. Return to the connected Google Sheet
2. Reload the page
3. Open the **Heritage Admin** menu
4. Select **Reset & Load Sample Data (10 Generations)**

> This initialisation option deletes and recreates the existing `Data Silsilah` sheet. Do not run it on a populated production archive unless you intend to replace the data.

### 4. Deploy the web app

1. In Apps Script, select **Deploy → New deployment**
2. Choose **Web app**
3. Set **Execute as** to **Me**
4. Choose the required access setting
5. Select **Deploy**
6. Authorise the requested Google permissions
7. Copy the generated Web App URL

### 5. Secure the deployment

Before sharing the application:

1. Sign in as the administrator
2. Change the initial application password
3. Review the web app access setting
4. Restrict access to trusted family members
5. Confirm that uploaded Drive files use the visibility you expect

---

## How the Backend Works

```text
Browser Interface
       ↓
google.script.run
       ↓
Google Apps Script Functions
       ↓
Google Sheets Family Records
       +
Google Drive Profile Photos
```

The browser calls Apps Script functions directly through `google.script.run`. The backend validates the current session, reads or updates the family sheet, creates hierarchical tree data, and returns the result to the interface.

---

## Privacy and Security Notice

Heritage is intended for a **trusted private-family environment**, but family records may contain sensitive personal information.

* The current version uses a shared password rather than individual accounts
* Member access is restricted by the generation selected during sign-in
* Temporary session tokens are stored in Apps Script cache
* Uploaded images are configured as viewable by anyone with the link
* The Apps Script deployment setting determines who can open the application
* Google account and Workspace permissions still affect access to the underlying Sheet and Drive folder
* Do not store sensitive identity numbers, financial information, or confidential documents without strengthening the security model

For a broader deployment, consider Google OAuth, per-user permissions, audit logging, private image delivery, rate limiting, and encrypted sensitive fields.

---

## Backup Recommendations

Because Google Sheets acts as the primary database:

* Create regular copies of the spreadsheet
* Protect the header row and important ranges
* Limit editor access to trusted administrators
* Export occasional backups as Excel or CSV
* Back up the Drive photo folder separately
* Test changes using a duplicate spreadsheet before production deployment

---

## Roadmap / Ideas

* [ ] Individual Google account authentication
* [ ] Per-user permissions and approval workflow
* [ ] Relationship types beyond parent and spouse
* [ ] Multiple spouses and blended-family support
* [ ] Family events and important-date timeline
* [ ] Birth date and birthplace fields
* [ ] GEDCOM import and export
* [ ] Printable family-tree PDF
* [ ] Private photo proxy instead of public Drive links
* [ ] Activity log and record-change history
* [ ] Duplicate-member detection
* [ ] Automated spreadsheet and photo backups
* [ ] Multiple independent family trees
* [ ] Malay and English language switcher

---

<div align="center">

*Heritage — preserve every name, relationship, and generation in one living family archive.*

[Open Heritage](https://script.google.com/macros/s/AKfycbxE3g-BoxNN5vv2mJ3WFRiHbPurKZYSOEhiE-99HOjM0uEdiIjq62J6SoFekHW04c21/exec)

</div>
