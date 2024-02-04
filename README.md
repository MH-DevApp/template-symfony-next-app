![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Template](https://badgen.net/badge/Version/1.0.0/orange)

# TEMPLATE - SYMFONY & NEXTJS APP


It is evident that Next.js could enable the management of the entire backend part of a web application.

This template allows setting up a Symfony application for handling authentication and communication with the database. Additionally, it includes a Next.js application for managing the frontend, primarily used for server-side rendering (SSR) and search engine optimization (SEO).

For authentication management, we use the "LexikJWT" library. When a JWT token is invalid, not found, or expired, the request will receive an exception in response. The JWT token is refreshed every 15 minutes and is valid for 1 day by default.

As soon as a user logs out or the token is refreshed, it becomes invalid. The validity of JWT tokens is managed by a database session, and the verification of validity occurs when listening to the token decoding event. Additionally, when creating the token, the user's IP address is added to the token payload. Thus, if the user's IP changes, the token becomes invalid.

It is also possible to configure an API key to allow only requests from the frontend application. This key is added to the headers of each request and is verified by a listener. If the key is invalid, the request will receive an exception in response.


This template only handles authentication and communication between the two applications. It is possible to add additional features by following the best practices of Symfony and Next.js. Here are a few ideas:

- Setting up an email sending service
- User account confirmation through email confirmation
- Forgotten password feature
- ...

## Specs :

- PHP >= 8.1
- Symfony 6.4
- Node 16+
- Next 14
- React 18
- Typescript

### Libraries :

- Symfony :
  - Doctrine / ORM
  - Lexik / JWT Authentication Bundle
  - Symfony / Security Bundle
  - Symfony / Uid
  - Symfony / Validator
  - Symfony / Expression Language
  - Symfony / Maker Bundle (Dev)


- Next.js :
  - Next
  - React
  - React Hook Form
  - Typescript
  - Tailwind
  - Sass
  - Zod
  - Tanstack / React Query

### Install, build and run in development environment:

Before starting, it is necessary to clone or download the source code and extract it into a folder.

#### The following instructions are to be executed in a terminal and pertain to installation in a `development environment`.

1. Install the dependencies :

  ```bash
    cd client
  ```
  ```bash
    npm install
  ```
  ```bash
    cd ../server
  ```
  ```bash
    composer install
  ```

2. Create the `.env.development.local` file in the `/client` directory and the `.env.dev.local` file in the `/server` directory. These files will contain the environment variables necessary for the proper functioning of the applications.<br><br>

- `.env.development.local`, default example :
```yaml
NODE_TLS_REJECT_UNAUTHORIZED=0
SERVER_API_URL=https://localhost:8000/api/
API_URL=http://localhost:3000/api/
NEXT_PUBLIC_COOKIE_JWT_NAME="template_symf_next_token_auth"
```

- `.env.dev.local`, default example :

```yaml
APP_SECRET=0ca42e13ab0a102601ccc9515d1f7b8d
    
DATABASE_URL="postgresql://root:!changeme!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
    
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=52e951a1fbad7f7889acdf98c401445285b26bd1a58874debcccccd014fd75b6
```

3. Generate the JWT keys :

```bash
    cd server
```
```bash
    mkdir config/jwt
```
___

```bash
    php bin/console lexik:jwt:generate-keypair
```
or
```bash
    openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
```
```bash
    openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
```

4. Create the database and load the schema :

```bash
    php bin/console doctrine:database:create --env=dev
```
```bash
    php bin/console doctrine:schema:update -f --complete --env=dev
```

5. Launch the applications :

```bash
    cd client
```
```bash
    npm run dev
```
```bash
    cd ../server
```
```bash
    symfony serve
```

The website is available at the url: http://localhost:3000, the port may be different depending on your configuration.

### Configuration de l'API KEY :

To use the API KEY, you need to add the environment variable `API_KEY` in the `.env.dev.local` files in the `/server` directory and `.env.development.local` in the `/client` directory.

Example :
```yaml
SERVER_API_KEY=dfc17fadfa8f5b1f9751ff84224ebc49
```

A script is available to generate a random key and copy it into the `.env.dev.local` and `.env.development.local` files :
```bash
cd server
```
___
```bash
composer run api-key
```
or
```bash
php scripts/generateServerAPIKey.php
```

### Customize the JWT token :

- Validity duration :

```yaml
# /server/.env.dev.local
JWT_TOKEN_TTL=86400 # default value

# /client/.env.development.local
NEXT_PUBLIC_COOKIE_JWT_TTL=86400 # Note that by default, it is the token expiration date that is taken into account. The value of this variable is not supposed to be used; if it is, it means that the JWT token does not have an expiration date. 
```

- Refresh duration :

```yaml
# /server/.env.dev.local
REFRESH_TOKEN_TICK=900 # default value

# /client/.env.development.local
NEXT_PUBLIC_REFRESH_TOKEN_TICK=900 # default value
```
