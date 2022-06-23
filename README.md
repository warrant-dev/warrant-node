# Warrant Node.js Library

Use [Warrant](https://warrant.dev/) in server-side Node.js projects.

[![npm](https://img.shields.io/npm/v/@warrantdev/warrant-node)](https://www.npmjs.com/package/@warrantdev/warrant-node)
[![Slack](https://img.shields.io/badge/slack-join-brightgreen)](https://join.slack.com/t/warrantcommunity/shared_invite/zt-12g84updv-5l1pktJf2bI5WIKN4_~f4w)

## Installation

Use `npm` to install the Warrant module:

```sh
npm install @warrantdev/warrant-node
```

## Usage
Import the Warrant client and pass your API key to the constructor to get started:
```js
const Warrant = require("@warrantdev/warrant-node");
const warrantClient = new Warrant.Client("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");
```
Or using ES modules:
```js
import { Client as WarrantClient } from "@warrantdev/warrant-node";
const warrantClient = new WarrantClient("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");
```

### `createUser(userId, username)`
This method creates a user entity in Warrant with the specified `userId`. Provide an optional `username` to make it easier to identify users in the Warrant dashboard.
```js
const Warrant = require("@warrantdev/warrant-node");
const warrantClient = new Warrant.Client("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

// Creates a user with user.id as the userId
warrantClient
    .createUser(user.id, user.email)
    .then((newUser) => console.log(newUser))
    .catch((error) => console.log(error));
```
Or using ES modules and async/await:
```js
import { Client as WarrantClient } from "@warrantdev/warrant-node";
const warrantClient = new WarrantClient("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

// Creates a user with user.id as the userId and
// assigns the new user the "store_owner" role
const newUser = await warrantClient.createUser(user.id, user.email);
```

### `createWarrant(objectType, objectId, relation, user)`

This method creates a warrant which specifies that the provided `user` (or userset) has `relation` on the object of type `objectType` with id `objectId`.
```js
const Warrant = require("@warrantdev/warrant-node");
const warrantClient = new Warrant.Client("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

// Create a warrant allowing user.id to "view" the store with id store.id
warrantClient
    .createWarrant("store", store.id, "view", { userId: user.id })
    .then((newWarrant) => console.log(newWarrant))
    .catch((error) => console.log(error));
```
Or using ES modules and async/await:
```js
import { Client as WarrantClient } from "@warrantdev/warrant-node";
const warrantClient = new WarrantClient("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

// Create a warrant allowing user.id to "view" the store with id store.id
const newUser = await warrantClient.createWarrant("store", store.id, "view", user.id);
```

### `createSession(userId)`
This method creates a session in Warrant for the user with the specified `userId` and returns a session token which can be used to make authorized requests to the Warrant API only for the specified user. This session token can safely be used to make requests to the Warrant API's authorization endpoint to determine user access in web and mobile client applications.

```js
const Warrant = require("@warrantdev/warrant-node");
const warrantClient = new Warrant.Client("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

// Creates a session token scoped to the specified userId
// Return this token to your client application to allow
// it to make requests for the given user.
warrantClient
    .createSession(user.id)
    .then((sessionToken) => console.log(sessionToken))
    .catch((error) => console.log(error));
```
Or using ES modules and async/await:
```js
const { Client as WarrantClient } = require("@warrantdev/warrant-node");
const warrantClient = new WarrantClient("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

// Creates a session token scoped to the specified userId
// Return this token to your client application to allow
// it to make requests for the given user.
const sessionToken = await warrantClient.createSession(user.id);
```

### `isAuthorized(objectType, objectId, relation, userId)`

This method returns a `Promise` that resolves with `true` if the user with the specified `userId` has the specified `relation` to the object of type `objectType` with id `objectId` and `false` otherwise.

```js
const Warrant = require("@warrantdev/warrant-node");

const warrantClient = new Warrant.Client("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

//
// Example Scenario:
// An e-commerce website where Store Owners can edit store info
//
warrantClient
    .isAuthorized("store", storeId, "edit", user.id)
    .then((isAuthorized) => {
        if (isAuthorized) {
            // Carry out logic to allow user to edit a Store
        }
    })
    .catch((error) => console.log(error));
```
Or using ES modules and async/await:
```js
import { Client as WarrantClient } from "@warrantdev/warrant-node";

const warrantClient = new WarrantClient("api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=");

//
// Example Scenario:
// An e-commerce website where Store Owners can edit store info
//
if (await warrantClient.isAuthorized("store", storeId, "edit", user.id)) {
    // Carry out logic to allow user to edit a Store
}
```

We’ve used a random API key in these code examples. Replace it with your
[actual publishable API keys](https://app.warrant.dev) to
test this code through your own Warrant account.

For more information on how to use the Warrant API, please refer to the
[Warrant API reference](https://docs.warrant.dev).

Note that we may release new [minor and patch](https://semver.org/) versions of
`@warrantdev/warrant-node` with small but backwards-incompatible fixes to the type
declarations. These changes will not affect Warrant itself.

## TypeScript support

This package includes TypeScript declarations for Warrant.

## Warrant Documentation

- [Warrant Docs](https://docs.warrant.dev/)
