# 🌳 Family Tree Web App

Family Tree Web App is a web-based application designed to manage and visualize family relationships in a simple and organized way. It uses Google Apps Script as a backend and Google Sheets as a database to store and retrieve family data.

🔗 API Endpoint: https://script.google.com/macros/s/AKfycbxE3g-BoxNN5vv2mJ3WFRiHbPurKZYSOEhiE-99HOjM0uEdiIjq62J6SoFekHW04c21/exec

---

## ✨ Features

- 👨‍👩‍👧 Store family member information  
- 🌳 Display family relationships (family tree structure)  
- ➕ Add and manage members  
- 🔄 Real-time data updates via API  
- 📊 Google Sheets as database  
- 🌐 Accessible from any device  

---

## 🧠 Purpose

This project is built to:

- Digitally organize family relationships  
- Replace manual or paper-based family records  
- Provide easy access to family lineage information  
- Demonstrate integration between frontend apps and cloud-based backend  

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Google Apps Script  
- **Database:** Google Sheets  
- **Deployment:** Web-based  

Google Apps Script allows building lightweight backend systems without managing servers, making it ideal for small to medium applications like this.

---

## 🚀 How It Works

1. User interacts with the frontend (add/view family members)  
2. Data is sent to Google Apps Script (API)  
3. Information is stored in Google Sheets  
4. The app retrieves and displays structured family data  

---

## 💫 Deployment (Google Apps Script)
1.Go to Google Drive → New → Google Sheets (create database)<br>
2.Open the sheet → Extensions → Apps Script<br>
3.Add your backend code in Code.gs<br>
4.Add frontend file → + HTML → index<br>
5.Click Deploy → New Deployment → Web App<br>
<br>
Set:<br>
Execute as: Me<br>
Access: Anyone<br>
Click Deploy and copy the Web App URL<br>
Use the URL in your frontend as API<br>

---

## 📁 Project Structure

```bash
/frontend
  ├── index.html
  ├── style.css
  ├── script.js

/backend
  ├── Code.gs
  ├── appsscript.json
