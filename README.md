# Wallet Transaction System

A scalable, transactional backend system built for the "Jr. Full Stack Developer" assessment. This system manages client wallets, handles atomic transactions, and integrates with a mock external fulfillment service.

## Features
* **Atomic Transactions:** Uses database transactions (ACID) to ensure money is never lost during order creation or wallet updates.
* **Scalable Architecture:** Built with **Node.js, Express, and MySQL (Sequelize)**, structured in a modular MVC pattern (Models, Routes, Controllers).
* **External Integration:** Simulates a real-world fulfillment API call upon successful order payment.
* **Audit Logging:** Maintains a `Ledger` for every single credit, debit, and order event.

---

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (via Sequelize ORM)
* **External Requests:** Axios

---

## Setup & Installation

### 1. Prerequisites
* Node.js installed
* MySQL installed and running

### 2. Database Setup
Open your MySQL terminal or Workbench and run:
```sql"
CREATE DATABASE transaction_db;


## AI PROMPTS USED

As per the assignment requirements, here are the prompts used to assist in the development of this project.

**1. Database Schema Design**
"I need to design a MySQL database for a wallet system using Sequelize. Can you help me create the models? I need a Wallet table for users, an Order table for purchases, and a Ledger table to keep a log of every transaction. Also, what's the best data type for money to avoid precision issues?"

**2. Atomic Transaction Logic**
"How do I handle a transaction in Express where I need to deduct money from a wallet and create an order at the same time? I want to make sure that if one fails, the other rolls back so I don't lose money. Also, how do I prevent race conditions if two requests come in at once?"

**3. External API Integration**
"I need to call an external API after the order is placed. Can you show me how to use Axios to post to a placeholder URL? I want to update my local order with the ID returned from that API. Should I do this inside the database transaction or after it commits?"