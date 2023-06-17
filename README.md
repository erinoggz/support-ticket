# Support Request Project

Support request application for create support tickets for customers. Where agents can treat support tickets

## Tools

* [Node 18.13.0](https://nodejs.org/en)
* [express 4.18.2](https://www.npmjs.com/package/express)
* [mongoose 7.3.0](https://www.npmjs.com/package/mongoose?activeTab=readme)
* [pdfkit 0.13.0](https://www.npmjs.com/package/pdfkit) for extracting json to pdf
* [@json2csv/plainjs 7.0.1](https://juanjodiaz.github.io/json2csv/#/parsers/parser) for extracting json to csv


# Setup

## Database setup
### Using Atlas
* [you can register and create a database collection here](https://www.mongodb.com/cloud/atlas/register)

### Using Local database

* [Install mongodb here depending on your OS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/) I'll use MAC as an example


```bash
# Do this on a new terminal
# On your command line, create a data directory for storing data.
mkdir data/db

# Start mongo server with 
$ mongod --dbpath ~/data/db

# Do this in our application terminal
# Run to dump db data
$ yarn run dump

# For permission error, run this in your application terminal
$ chmod u+x bin/dump.bash 
```

### Using my test database
```bash
# Use database url in .env
DATABASE=mongodb+srv://sa:user12345678@citisquarecluster.bfvncum.mongodb.net/support

# Use port and other environment variables in .examples.env
```

# Start Application
```bash
# install dependencies
$ yarn

# start application
$ yarn start
```

# Testing
```bash
# run test
$ yarn run test
```

# APIs
* [Documentation for APIs can be found here](https://documenter.getpostman.com/view/9272702/2s93sgXAqs)

## API instructions

### Registering a User
* We have 3 types of Users. ADMIN, AGENT AND CUSTOMER. When you don't pass a query to the register url, it create a CUSTOMER by default. Example, this url below creates a CUSTOMER.

```
POST
http://localhost:6677/api/v1/auth/register
```
* To Register as an ADMIN, we simply pass userType=admin to the url query params. Example,
```
POST
http://localhost:6677/api/v1/auth/register?userType=admin
```
* To Register as an AGENT, we simply pass userType=agent to the url query params. Example,
```
POST
http://localhost:6677/api/v1/auth/register?userType=agent
```
* Sample Request Body
```
{
    "email": "deji@gmail.com",
    "password": "12345678",
    "userName": "erindeji"
}
```

### Loging In
Every usertype logs in the same way. A bearer token is returned which you can use to access other endpoints. Below is the url

```
POST
http://localhost:6677/api/v1/auth/login
```
* Sample Request Body
```
{
    "email": "deji@gmail.com",
    "password": "12345678",
    "userName": "erindeji"
}
```


### create ticket
* Customers create tickets. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
POST
http://localhost:6677/api/v1/auth/login
```
* Sample Request Body
```
{
    "issue": "my app is not running"
}
```

### process ticket
* All users are allowed to process ticket requests. With Admin and Agents having more deciding factor on changing status of a ticket. Customers are not allowed to comment on ticket without agent commenting. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
PUT
http://localhost:6677/api/v1/ticket/process
```
* Sample Request Body
```
{
    "issue": "my app is not running"
}
```

### get ticket requests of a customer

* Customers can get list of all their requests with statuses and responses. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
GET
http://localhost:6677/api/v1/ticket/customer
```
* It is a paginated route. Customers can set limit and page number as below. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
GET
http://localhost:6677/api/v1/ticket/customer?limit=2&page=1
```

### get ticket requests of all customers by agent or admin

* Agent or Admin can get list of all customer requests with statuses and responses. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
GET
http://localhost:6677/api/v1/ticket/staff
```
* It is a paginated route. Customers can set limit and page number as below. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
GET
http://localhost:6677/api/v1/ticket/staff?limit=2&page=1
```

### get all users

* Admin can get list of all registered users. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
GET
http://localhost:6677/api/v1/auth/users
```
* It is a paginated route. Customers can set limit and page number as below. In the Authorization header, pass the token to it as Bearer token. Below is the url

```
GET
http://localhost:6677/api/v1/auth/users?limit=2&page=1
```

### update users

* Admin can update registered users. In the Authorization header, pass the token to it as Bearer token. Also pass the user id in the params. Below is the url

```
PUT
http://localhost:6677/api/v1/auth/user/64899ca484d66417d40895a9
```

### export support request

* Admin and Agent can export closed support requests in last 1 month. Passing the data format they want in the query param as requestFormat=csv or requestFormat=pdf.
 Authorization header, pass the token to it as Bearer token. Below is an example of urls with request format of csv and pdf

CSV Format
```
GET
http://localhost:6677/api/v1/ticket/generate?requestFormat=csv
```
PDF Format
```
GET
http://localhost:6677/api/v1/ticket/generate?requestFormat=pdf
```

# Extras
## Assumptions

* I assume we will have 3 diffrent user types. admin, agent and customer. In which admin will be able to comment on support tickets created by customers. Follow up on support request and close it if necessary. Admin and agent should also be able to export closed support request in the last 1 month along and get all list of tickets. Customers are only limited to comment on ticket after the agent has commented on it and get a list of their tickets. Assuming all lists needs to be paginated.
