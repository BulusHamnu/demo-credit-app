# Demo-Credit-App

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

| Method | Endpoint                | Description                            |
| ------ | ----------------------- | -------------------------------------- |
| POST   | `/api/wallets`          | Create a new wallet                    |
| GET    | `/api/wallets`          | Retrieve the user’s wallet and balance |
| POST   | `/api/wallets/deposit`  | Deposit funds into wallet              |
| POST   | `/api/wallets/withdraw` | Withdraw funds from wallet             |
| POST   | `/api/wallets/transfer` | Transfer funds to another wallet       |

### Transaction routes

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/api/transactions` | Get all user transactions |

## How to Run the Project Locally

- Clone the Repository

```bash
git clone https://github.com/BulusHamnu/demo-credit-app.git
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
npm run migrate
```

- Start development server

```bash
npm run dev
```

## Links:

- [Github Repo](https://github.com/BulusHamnu/demo-credit-app)
- [Live Preview](https://bulus-lendsqr-be-test.onrender.com)

---

### API Documentation

Link: [Postman Documentation](https://documenter.getpostman.com/view/44782397/2sBXqDs3be)

---

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

---

## Migrations

- Added migration scripts to reflect all database changes
- This ensures the schema is version-controlled and reproducible across environments

---

## Error Handling & Response Structure

- Introduced a standardized error response format
- Implemented a structured error system using `AppError`

Each error now includes:

- `code` → machine-readable error identifier
- `message` → human-readable message
- `details` → additional context

Example:

```json
{
  "status": false,
  "message": "User already exists.",
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "details": {
      "email": "hamnubulus88@gmail.com"
    }
  }
}
```

---

## Codebase Refactor

- Refactored imports, function names, and response messages for consistency
- Fixed minor issues such as incorrect status codes and typos
- Improved overall readability and maintainability of the codebase

---

## Auth Service Improvements

- Removed pre-check for existing users (which was vulnerable to race conditions)
- Now attempts to create the user directly and handles duplicate key errors
- Returns a standardized `USER_ALREADY_EXISTS` error when necessary
- Refactored `retrieveUser` → `retrieveUserToken` to better reflect its responsibility

---

## Wallet Service Improvements

- Leveraged the `UNIQUE(user_id)` constraint:
  - Instead of pre-checking, the system now attempts wallet creation directly and handles duplicate key errors
  - This ensures correctness even under concurrent requests

- Refactored responsibilities:
  - Wallet domain now handles **deposit, withdrawal, and transfer operations**
  - Transaction domain is limited to **recording and retrieving transaction data**

- Separated wallet creation and retrieval into a dedicated service for better structure

- Refactored large functions into smaller, reusable units

- Reduced duplication and improved clarity of logic

---

### Transaction Handling

- Ensured only critical operations are wrapped in database transactions
- Non-critical reads are performed outside transactions for better clarity and efficiency

---

### Concurrency & Data Integrity

- Introduced **row locking** for:
  - withdrawals
  - transfers

This ensures:

- safe balance validation before updates

- prevention of race conditions

- Retained database constraint:
  - `balance >= 0` as a safety net against invalid states

This combination guarantees:

- correctness at the database level
- consistency at the application level

---

## Transaction Service Improvements

- Transaction service is now strictly responsible for:
  - creating transaction records
  - retrieving transaction history

- Business logic has been removed to maintain clear separation of concerns

---

### Notes

- I did not modify the test suite in this iteration, as my focus was on improving core backend logic and data integrity
- Pagination was not added to transaction retrieval, as it was not a primary requirement for this assessment

---

## Why I Documented This

This was my first backend assessment, and it made me realize that backend engineering goes far beyond just CRUD operations.

The system worked functionally, but I missed important aspects like data integrity, concurrency, and proper handling of financial logic. Failing the assessment helped me clearly see those gaps.

Instead of moving on, I decided to go back, understand my mistakes, and improve the system step by step. This process helped me understand not just _what_ I got wrong, but _why_ it mattered.

I documented these changes so I can:

- track my learning progress
- clearly understand my weak points
- have something to revisit in the future

This project marks an important point in my learning journey, where I started thinking more like a backend engineer rather than just building features.
