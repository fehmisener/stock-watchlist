# Stock Watchlist Frontend

A React-powered basic web application that allows users to create and manage a stock watchlist User-friendly interface, easy-to-use, Java SpringBoot backend.

![Gif](/docs/demo.gif)

## Features

- **User Account**
  - Log in to your account to access and manage your watchlist from anywhere, at any time.
- **Stock Search Bar**
  - Easily find stocks using any familiar term or phrase with the Yahoo Finance API.
- **Watchlist Management**
  - **Add Stocks:** Users can add stocks to their personalized watchlist for easy tracking.
  - **Remove Stocks:** Users can effortlessly remove stocks from their watchlist when they are no longer of interest.
  - **Display Information:** The watchlist showcases essential stock information such as the symbol, company name, and current price.
- **Data Storage Options**
  - **Database Persistence:** Save your watchlist to a database for future access. This ensures your watchlist is available whenever you log in.
  - **Cache Storage:** If users choose not to save their watchlist to the database, it will be stored in the cache for quick access during the session.
- **Live Updates**
  - Receive real-time updates every 5 seconds for stocks added to your watchlist when the market is open.
- **Print Watchlist**
  - Users can print their watchlist for offline reference or record-keeping.

## Setup Instructions

**Clone the Repository**:

```bash
git clone https://github.com/fehmisener/stock-watchlist.git
```

Do not forget to change directory according to the frontend or backend.

### Frontend

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Start the Aplication**:

  > [!WARNING]
  > Do not forget to change the API key in the `.env` file with your own key.

    ```bash
    npm run dev
    ```

### Backend

1. **Build the Application**:

    ```bash
    mvn clean install
    ```

2. **Run the Application Locally**:

    ```bash
    mvn spring-boot:run
    ```

**Docker Setup:**

1. **Build the Docker Image**:

    ```bash
    docker build -t stock-watch .  
    ```

2. **Run the Application Locally**:

    ```bash
    docker run -p 8080:8080 stock-watch
    ```

## API Details

### Authentication

<details>
<summary>Login</summary>

#### Login

Logs a User into the system. It is used in the frontend client to authenticate a user.

**URL** : `/v1/auth/login`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

```json
{
  "email": "<email_of_user>",
  "password": "<password_of_user>"
}
```

**Success Response**

**Code** : `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTcxNjE2MTgwMCwiZXhwIjoxNzE2MTYyNDAwfQ.mS8oZ82B6v_XkVIZnK3_icw1JzY5Fz4SqMMIGnE4FXw",
  "expiresIn": 600000
}
```

**Error Responses**

**Condition** : If username or password is incorrect.

**Code** : `401 UNAUTHORIZED`

```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Bad credentials",
  "instance": "/v1/auth/login",
  "description": "The username or password is incorrect"
}
```

</details>

<details>
<summary>Register</summary>

#### Register

Registers a new User in the system.

**URL** : `/v1/auth/register`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

```json
{
  "email": "<email_of_user>",
  "password": "<password_of_user>"
}
```

**Success Response**

**Code** : `200 OK`

```json
{
  "createdDate": null,
  "lastModifiedDate": null,
  "deleted": false,
  "id": 1,
  "email": "user1@example.com",
  "password": "$2a$10$OmqqPnnVHEB.7bxvHVNsHumd76S18d9sZnZNffrQNfiuvKNUArah6",
  "watchlists": null,
  "enabled": true,
  "username": "user1@example.com",
  "authorities": [],
  "accountNonExpired": true,
  "accountNonLocked": true,
  "credentialsNonExpired": true
}
```

</details>

### Watchlist

<details>
<summary>Get Watchlist</summary>

#### Get Watchlist

Retrieves the watchlist of the User. It is used in the frontend client to display the watchlist of the User.

**URL** : `/v1/watchlist/get`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

**Success Response**

**Code** : `200 OK`

```json
[
  {
    "id": 1,
    "userId": 1,
    "watchlistItems": [
      {
        "symbol": "FROTO.IS"
      },
      {
        "symbol": "TESLA"
      },
      {
        "symbol": "THYAO.IS"
      }
    ]
  }
]
```

**Error Responses**

**Condition** : If the JWT token has expired.

**Code** : `403 FORBIDDEN`

```json
{
  "type": "about:blank",
  "title": "Forbidden",
  "status": 403,
  "detail": "JWT expired at 2024-05-19T20:55:11Z. Current time: 2024-05-20T00:05:51Z, a difference of 11440514 milliseconds.  Allowed clock skew: 0 milliseconds.",
  "instance": "/v1/watchlist/get",
  "description": "The JWT token has expired"
}
```

---
</details>

<details>
<summary>Add Watchlist</summary>

#### Add Watchlist

Registers a new user in the system.

**URL** : `/v1/watchlist/add`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

```json
{
  "watchlistItems": [
    {
      "symbol": "YATAS"
    },
    {
      "symbol": "KOTON"
    },
    {
      "symbol": "THYAO"
    }
  ]
}
```

**Success Response**

**Code** : `200 OK`

```json
{
  "id": 1,
  "userId": 1,
  "watchlistItems": [
    {
      "symbol": "YATAS"
    },
    {
      "symbol": "KOTON"
    },
    {
      "symbol": "THYAO"
    }
  ]
}

```

**Error Responses**

**Condition** : If the JWT token has expired.

**Code** : `403 FORBIDDEN`

```json
{
  "type": "about:blank",
  "title": "Forbidden",
  "status": 403,
  "detail": "JWT expired at 2024-05-19T20:55:11Z. Current time: 2024-05-20T00:05:51Z, a difference of 11440514 milliseconds.  Allowed clock skew: 0 milliseconds.",
  "instance": "/v1/watchlist/add",
  "description": "The JWT token has expired"
}
```

---
</details>

<details>
<summary>Delete Item from Watchlist</summary>

#### Delete Item from Watchlist

Deletes an item from the watchlist of the User.

**URL** : `/v1/watchlist/deleteItem`

**URL Parameters** : `symbol=[string]` where `symbol` is the symbol of the stock to be deleted.

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : None

**Error Responses**

**Condition** : If the JWT token has expired.

**Code** : `403 FORBIDDEN`

```json
{
  "type": "about:blank",
  "title": "Forbidden",
  "status": 403,
  "detail": "JWT expired at 2024-05-19T20:55:11Z. Current time: 2024-05-20T00:05:51Z, a difference of 11440514 milliseconds.  Allowed clock skew: 0 milliseconds.",
  "instance": "/v1/watchlist/deleteItem",
  "description": "The JWT token has expired"
}
```

</details>

## Dependencies

For the frontend, following dependencies are used:

> [!IMPORTANT]
> Vite requires Node.js version 18+ or 20+.

- [Vite](https://vitejs.dev/): A build tool that provides fast, reliable builds for modern web projects.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript): The programming language used for both frontend and backend development.
- [Material UI](https://material-ui.com/): A popular React UI framework that provides pre-built components for building user interfaces.

For the backend, following dependencies are used:

- [Java 17](https://openjdk.org/projects/jdk/17/)
- [Java SpringBoot](https://spring.io/projects/spring-boot): A Java-based framework used for building web applications.
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa): A part of the larger Spring Data project that makes it easy to implement JPA-based repositories.
- [H2 Database](https://www.h2database.com/html/main.html): A Java SQL database that provides in-memory and disk-based storage support.
- [Docker](https://www.docker.com/): A platform for developing, shipping, and running applications in containers.
