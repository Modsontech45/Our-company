# Our-company
# Expense Tracker

## Overview
The **Expense Tracker** is a web-based application that helps users manage their financial transactions by tracking income and expenses. It categorizes transactions into different fields and provides a summary of financial data.

## Features
- Add transactions (income/expense) with a description, category, and amount.
- Categorize transactions into fields such as Software, Hardware, Design, and Others.
- Filter transactions by category.
- Display total income, total expenses, net profit/loss, and net profit percentage.
- Retrieve and review individual transactions.
- Mark transactions as reviewed.
- Uses a Google Apps Script backend to store and fetch transaction data.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Google Apps Script
- **Storage:** Google Sheets (via Google Apps Script API)

## Project Structure
```
Expense-Tracker/
│── index.html          # Main UI for expense tracking
│── style.css           # Stylesheet for the application
│── script.js           # JavaScript logic for handling transactions
│── review.html         # UI for reviewing transactions
│── review.css          # Stylesheet for the review page
```

## How to Use
1. **Adding a Transaction:**
   - Enter a name, description, and select whether it's an income or expense.
   - Choose a category and enter the amount.
   - Add optional notes and click "Add Transaction".
   - The transaction will be processed and stored.

2. **Filtering Transactions:**
   - Select a category from the filter dropdown to view related transactions.
   - "Total Money" provides a summary of all transactions.

3. **Reviewing a Transaction:**
   - The `review.html` page fetches and displays transaction details.
   - Transactions can be marked as reviewed using the "Mark as Reviewed" button.

## Google Apps Script Integration
- The script interacts with a Google Sheet to store and retrieve transaction data.
- API endpoints:
  - `addTransaction`: Adds a new transaction.
  - `getTransaction`: Retrieves a transaction by ID.
  - `reviewTransaction`: Marks a transaction as reviewed.
  - `filter`: Fetches filtered transactions.

## Deployment
1. Host the frontend files using GitHub Pages, Netlify, or any web server.
2. Deploy the Google Apps Script and update the `scriptURL` in `script.js`.
3. Ensure API permissions are set to allow data access.

## License
This project is open-source under the MIT License.

## Author
Created by **AfR** (2025).

