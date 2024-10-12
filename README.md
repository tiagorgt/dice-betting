# 🎲 Dice Betting Application 🎲

This project is a [NestJS](https://nestjs.com/)-based server-side application that provides a [GraphQL](https://graphql.org/) API for managing users and bets. It is built using [TypeScript](https://www.typescriptlang.org/) and [Sequelize](https://sequelize.org/).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) (>= 12.x)
- [npm](https://www.npmjs.com/) (>= 6.x)
- [Docker](https://www.docker.com/) (for running PostgreSQL in a container)

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

## Running the Application

1. Start the application:

```bash
 docker-compose up --build
 # or
 npm run start
```

If you run the application without docker, you should set the environment variables to point to a running database.

2. The application will be running at `http://localhost:3000`.

## Using the APIs

### GraphQL Playground

You can access the GraphQL Playground to explore the available schemas and test the APIs at `http://localhost:3000/graphql`.

### Example Queries and Mutations

#### Get User List

```graphql
query {
  getUserList {
    id
    name
    balance
  }
}
```

#### Get Single User

```graphql
query {
  getUser(id: 1) {
    id
    name
    balance
  }
}
```

#### Create a New User

```graphql
mutation {
  createUser(input: { name: "John Doe", balance: 1000 }) {
    id
    name
    balance
  }
}
```

#### Get Bet List

```graphql
query {
  getBetList {
    id
    userId
    betAmount
    chance
    payout
    win
  }
}
```

#### Create a New Bet

```graphql
mutation {
  createBet(input: { userId: 1, betAmount: 100, chance: 0.5 }) {
    id
    userId
    betAmount
    chance
    payout
    win
  }
}
```

#### Get Best Bet Per User

```graphql
query {
  getBestBetPerUser(limit: 2) {
    id
    userId
    betAmount
    chance
    payout
    win
  }
}
```

## Running Tests

1. Run unit tests:

   ```bash
   npm run test
   ```

2. Run end-to-end tests:

   ```bash
   npm run test:e2e
   ```

