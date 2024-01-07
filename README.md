![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Template](https://badgen.net/badge/Version/Building/orange)

# TEMPLATE - SYMFONY & NEXTJS APP

It is evident that NextJS could enable the management of the entire backend part of a web application.

This template allows setting up a Symfony application for handling authentication and communication with the database. 
Additionally, it includes a Next.js application for managing the frontend, primarily used for server-side 
rendering (SSR) and SEO management.

Each request sent to the Symfony application will require an API key. If it is missing, the request will 
receive an exception in response.


For authentication management, we use the "LexikJWT" library. When a JWT token is invalid, not found, or expired, 
the request will receive an exception in response. The JWT token is refreshed every 5 minutes and is valid for 
1 day (customizable).<br/>

As soon as a user logs out or the token is refreshed, it becomes invalid. The validity of JWT tokens is 
managed in the database, and the verification of validity occurs when listening to the token decoding event.

My goal is to make this template as scalable as possible.

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
  - Symfony / Mailer
  - Symfony / Maker Bundle (Dev)


- NextJS :
  - Next
  - React
  - React Hook Form
  - Typescript
  - Tailwind
  - Sass
  - Zod
  - Tanstack / React Query

The template is under construction, the remaining documentation will be available soon.