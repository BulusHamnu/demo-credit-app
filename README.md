# demo-credit-mvp-app

Bulus Hamnu's lendsqr Demo credit test app

## Database schema design

You can view the ERD diagram here:: [Database Design](https://dbdesigner.page.link/wrfy94TNxoZ2t3jW9) <br>

The application uses three main tables: Users, Wallets, and Transactions.

### Users Table

Stores user information:

- full_name
- email (unique)
- token (faux authentication token)
- created_at

### Wallets Table

Each user owns a wallet:

- balance
- address (unique public wallet identifier)
- user_id (references Users table)
- created_at

### Transactions Table

Tracks all money movements:

- amount
- receiver_wallet_id → references wallets.id
- sender_wallet_id → references wallets.id
- type (deposit, withdrawal, transfer)
- reference → unique transaction ID
- notes
- initiated_by → references users.id
- created_at

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
- Weak Use of Database Transactions (Partial Understanding)

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
- Database isolation & locking
- Atomic financial operations
- Domain-driven thinking

> I learned the hard way i guess. I’m going to study these concepts and update the codebase to correct my mistakes.
