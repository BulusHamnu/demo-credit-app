# Demo-Credit-Mvp-App

Bulus Hamnu's lendsqr Assessment Demo Credit App \
This project is a backend wallet system built as part of a technical assessment for Lendsqr.

The goal was to design and implement a simple MVP that simulates a credit/wallet system, where users can perform core financial operations such as depositing, transferring, and withdrawing funds.

The focus of this project is not on authentication or input validation, but on building a reliable backend system that correctly handles money movement and transaction logic.

Key features include:

- Wallet creation and balance management
- Deposit, transfer, and withdrawal operations
- Transaction recording for all financial activities
- Basic handling of edge cases such as insufficient balance

Tech stack:

- TypeScript
- Node.js
- Knex.js
- MySQL

## Database schema design (Improved version)

You can view the ERD diagram here:: [Database Design Diagram](https://dbdiagram.io/d/Demo-Credit-App-69c64721fb2db18e3b1b7bdc)

---

The application uses three main tables: Users, Wallets, and Transactions.

<br>

<img src="demo_credit_app_db_design.svg">Database Diagram</img>

## Routes Design

### Auth routes

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | `/api/register` | Register a new user          |
| POST   | `/api/login`    | Login and receive faux token |

### Wallet routes

| Method | Endpoint       | Description                            |
| ------ | -------------- | -------------------------------------- |
| POST   | `/api/wallets` | Create a new wallet                    |
| GET    | `/api/wallets` | Retrieve the user’s wallet and balance |

### Transaction routes

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| POST   | `/api/transactions/deposit`  | Deposit funds into wallet        |
| POST   | `/api/transactions/withdraw` | Withdraw funds from wallet       |
| POST   | `/api/transactions/transfer` | Transfer funds to another wallet |
| GET    | `/api/transactions`          | Get all user transactions        |

## How to Run the Project Locally

- Clone the Repository

```bash
git clone https://github.com/BulusHamnu/demo-credit-mvp-app.git
cd demo-credit-mvp-app
```

- Install Dependencies

```bash
npm install
```

- Create a .env file

```bash
MYSQL_PASSWORD=your_mysql_password
PORT=3500
DEMO_CREDIT_ADJUSTOR_ID=you_adjustor_project_id
DEMO_CREDIT_ADJUSTOR_API_KEY=your_adjustor_project_api_key
DATABASE_HOST=127.0.0.1_or_your host
DATABASE_ADMIN=database_usernamr
DATABASE_NAME=lendsqr_wallet
DATABASE_PORT=port_number
```

- Run migrations

```bash
npx knex migrate:latest --knexfile knexfile.js
```

- Start development server

```bash
npm run dev
```

## Links:

- [Github Repo](https://github.com/BulusHamnu/demo-credit-mvp-app)
- [Live Preview](https://bulus-lendsqr-be-test.onrender.com)

<br>

## Lender Backend Assessment Aftermath

### Why I Failed (and What I Learned)

_Context_

This project/assessment was my first wallet / financial system.
The application worked functionally, had good folder structure, and clean separation of concerns (they told me that).
However, it failed to meet backend engineering benchmarks required for a financial system.

This document records exactly what went wrong, why it mattered, and what I must do differently going forward.

Core Reasons I Failed

### Race Conditions in Critical Business Logic (BIGGEST ISSUE)

What I did

- Checked wallet balance
- Updated balance
- Saved changes
- This logic assumed single execution, not concurrent requests.

Why this failed:

- Two requests could read the same balance at the same time
- Both pass validation
- Both deduct funds
- Money is effectively duplicated

Why this is unacceptable:

- In a wallet / fintech system, race conditions = financial corruption
- Backend engineers are expected to prevent, not just understand, this

What I should have done:

- Use database transactions with isolation
- Lock wallet rows (SELECT … FOR UPDATE or equivalent)
- Perform atomic balance updates
- Treat balance updates as critical sections
- Weak Use of Database Transactions

What I understood

- Transactions rollback on error

What I missed
Transactions also:

- Prevent concurrent modification
- Enforce isolation
- Guarantee atomic multi-step operations

Why this mattered

- Balance update + transaction record must succeed or fail together
- My logic allowed partial state changes under concurrency

### Poor Transaction Tracking (Domain-Level, Not SQL)

Important clarification
They did NOT mean “SQL transactions” here.
They meant financial transaction tracking.

What I did
Treated wallet.balance as source of truth

What was expected

- Treat transactions as the source of truth
- Balance should be derived or protected by invariant rules
- Maintain immutable transaction history for auditability

Why this matters

- Financial systems must be auditable
- Balances should never be trusted blindly
- Code Quality Issues in Error-Prone Logic
  My code:
- Was readable
- Was not excessively long
- Was logically correct in isolation

The problem
Critical domain rules were hidden inside large logical flows
Validation, fetching, mutation, persistence, and logging were mixed

This made:
Race conditions harder to see
Auditing harder
Testing harder

What was expected
Clear separation of:

- Domain rules
- Persistence logic
- State mutation
- Functions that communicate intent, not just steps

### Insufficient Systems Thinking (Concurrency, Scale, Performance)

I focused on
CRUD correctness
Request → response logic

But the assessment tested

- Concurrency safety
- Data integrity under load
- Query efficiency
- System behavior, not just correctness

### Limited Test Coverage (Secondary, Not Primary)

Tests were not the main failure, but:
Tests would have exposed race conditions

Tests force clearer boundaries in logic
Lack of tests signaled lack of defensive design

What This Failure Taught Me

- Technical Gaps Identified
- Race conditions & concurrency
- Database contraits, database isolation & locking
- Atomic financial operations
- Domain-driven thinking

> I learned the hard way i guess. I’m going to study these concepts and update the codebase to correct my mistakes.

## What I Improved After the Assessment

After going through the assessment again, I took time to review my approach and identify the gaps in my implementation. I realized there were multiple areas that needed improvement, so I started refining the system step by step.

---

## Database Improvements

### Users Table

- Made `full_name` and `email` **NOT NULL**
- Kept `email` **UNIQUE**
- Removed `UNIQUE` from `token` since tokens change frequently
- Added `created_at` with default timestamp

---

### Wallets Table

- Added constraint: `balance >= 0` (to prevent negative balance)
- Made `balance` **NOT NULL** with default `0`
- Made `user_id`:
  - **NOT NULL**
  - **UNIQUE** (one wallet per user)

- Added `created_at`

---

### Transactions Table

- Added constraint: `amount > 0`
- Allowed `sender_wallet_id` and `receiver_wallet_id` to be nullable
- Enforced rule:
  - At least one of them must exist (sender or receiver)

- Made `initiated_by` **NOT NULL**
- Made `reference` **UNIQUE** (for idempotency)
