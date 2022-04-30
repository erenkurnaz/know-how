![](nestjs-boilerplate.png)

# NestJS Boilerplate with GraphQL and Mikro-Orm
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![Workflow Status](https://github.com/erenkurnaz/nestjs-boilerplate-with-graphql/actions/workflows/nodejs-ci.yaml/badge.svg?branch=main)](https://github.com/erenkurnaz/nestjs-boilerplate-with-graphql/actions/workflows/nodejs-ci.yaml)
___
> Web API boilerplate made with [NestJS](https://nestjs.com), [GraphQL](https://graphql.org) and [Mikro-Orm](https://mikro-orm.io). 

Also includes;  
* E2E and unit tests
* Authentication (Jwt and Refresh token)

## Installation and Configuration

```bash
# install dependencies 
$ yarn

# create .env file from .env.example
$ cp .env.example .env

# start containers
$ docker-compose up -d --build 
```

## Mikro-Orm
> PS: Project has **User** and **RefreshToken** entities.

| POSTGRES_DB          | POSTGRES_USER | POSTGRES_PASSWORD | POSTGRES_HOST Value |
|----------------------|---------------|-------------------|---------------------|
| "nestjs_boilerplate" | "postgres"    | "postgres"        | "localhost"         |

```bash
# create initial migrations
$ yarn migration:init

# create migration from changes
$ yarn migration:create

# apply the migration
$ yarn migration:up
```

## Graphql
> Code-first approach was used in this project.

| GRAPHQL_PLAYGROUND | GRAPHQL_DEBUG | GRAPHQL_PATH |
|--------------------|---------------|--------------|
| true               | true          | api          |

### # Error Handling
* **Custom exception types:**
  1. [Exception](./src/errors/exception.ts): Base custom exception for resolving in union
  2. [ValidationException](./src/errors/validation.exception.ts): Validation exception has ```fields``` property for 
     ```class-validator``` errors.   
> Errors return as ***Union Type***.

**Example**

```graphql
# Server
union ErrorableUserResult = User | ServerError

query {
    users: ErrorableUserResult!
}
```
```graphql
# Client
query {
    users {
        ... on User {
            id,
            name,
        }
        ... on ServerError {
            message
            name
            status
        }
    }
}
```
