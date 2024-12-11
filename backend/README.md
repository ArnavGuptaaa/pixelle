<!-- Setup -->

## 1. SETUP

### 1.1. Create environment file

1. Create `.env` file in [`backend/src/config`](./src/config/)
2. Copy contents from [`src/config/.env.example`](./src/config/.env.example) into `.env`
   <br />

### 1.2. AWS S3 bucket

Refer [Getting started with Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html) to create S3 bucket

After configuring, update credentials for AWS S3 in `.env`

### 1.3. AWS RDS

Refer [Create a MySQL DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html#CHAP_GettingStarted.Creating.MySQL) to create MySQL RDS

After configuring, update credentials for AWS RDS in `.env`

### 1.4. Email User

In order to send welcome emails, you will require a gmail account and app password.
Follow this [step-by-step guide](https://medium.com/@pratik_shrestha/sending-emails-with-node-js-and-gmail-using-nodemailer-a-step-by-step-guide-29fa8fcc6ed6)

After configuring, update credentials for Automated Emails in `.env`

### 1.5. Miscellaneous

-   Update `PORT` with the desired port to run the express server on
-   Update `JWT_TOKEN_SECRET` with a string to be able to sign JSON web tokens

<!-- Run DB Migrations -->

## 2. DB MIGRATIONS

Follow given steps to run drizzle migrations to RDS

```bash
# Generate database schema
$ npm run db:generate

# Run migrations
$ npm run db:migrate
```

<!-- Start -->

## 3. START SERVER

Follow the given commands to start the server.

```bash
# Install dependencies
$ cd pixelle/backend
$ npm i

# Run server
$ npm run dev
```

The server should now be running on http://localhost:[PORT] (default: 3000)

<!-- Issues -->

## 4. NEED HELP?

If you encounter any issues, feel free to open a [GitHub issue](https://github.com/ArnavGuptaaa/pixelle/issues) or reach out to the maintainers

---

<div align="center">
    Made with ♥️ by 
    <a href="https://github.com/ArnavGuptaaa">Nav</a>.
</div>
