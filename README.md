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
