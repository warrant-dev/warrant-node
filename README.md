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
const warrantClient = new Warrant.WarrantClient({
  apiKey: "api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=",
});
```

Or using ES modules:

```js
import { WarrantClient } from "@warrantdev/warrant-node";
const warrantClient = new WarrantClient({
  apiKey: "api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=",
});
```

---

This method creates a user in Warrant with the provided `userId`. Provide an optional `email` to make it easier to identify users in the Warrant dashboard.

```js
const Warrant = require("@warrantdev/warrant-node");
const warrantClient = new Warrant.WarrantClient({
  apiKey: "api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=",
});

// Creates a user with user.id as the userId
warrantClient.User
  .create({ userId: user.id, email: user.email })
  .then((newUser) => console.log(newUser))
  .catch((error) => console.log(error));
```

Or using ES modules and async/await:

```js
import { WarrantClient } from "@warrantdev/warrant-node";
const warrantClient = new WarrantClient({
  apiKey: "api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=",
});

// Creates a user with user.id as the userId and
// assigns the new user the "store_owner" role
const newUser = await warrantClient.User.create({
  userId: user.id,
  email: user.email,
});
```

## Authorization

All access checks are performed based on an `object`, `relation` and `subject`. You can pass your own defined objects to the check methods by implementing the `WarrantObject` interface.

```
interface WarrantObject {
    getObjectType(): string;
    getObjectId(): string;
}
```

### `check(Check)`

This method returns a `Promise` that resolves with `true` if the `subject` has the specified `relation` to the `object` and `false` otherwise.

```js
const Warrant = require("@warrantdev/warrant-node");

const warrantClient = new Warrant.WarrantClient({
  apiKey: "api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=",
});

// Store class implements WarrantObject
class Store {
  private id: number;

  public getObjectType(): string {
    return "store";
  }

  public getObjectId(): string {
    return this.id.toString();
  }
}

//
// Example Scenario:
// An e-commerce website where Store Owners can edit store info
//
const myStore = new Store('my-store');
warrantClient.Authorization
  .check({
    object: myStore,
    relation: "edit",
    subject: {
      objectType: "user",
      objectId: user.id,
    },
  })
  .then((isAuthorized) => {
    if (isAuthorized) {
      // Carry out logic to allow user to edit a Store
    }
  })
  .catch((error) => console.log(error));
```

Or using ES modules and async/await:

```js
import { WarrantClient } from "@warrantdev/warrant-node";

const warrantClient = new WarrantClient({
  apiKey: "api_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=",
});

//
// Example Scenario:
// An e-commerce website where Store Owners can edit store info
//
const myStore = new Store('my-store');
if (
  await warrantClient.Authorization.check({
    object: myStore,
    relation: "edit",
    subject: {
      objectType: "user",
      objectId: user.id,
    },
  })
) {
  // Carry out logic to allow user to edit a Store
}
```

We’ve used a random API key in these code examples. Replace it with your
[actual publishable API keys](https://app.warrant.dev) to
test this code through your own Warrant account.

For more information on how to use the Warrant API and usage examples for all methods, please refer to the
[Warrant API reference](https://docs.warrant.dev).

Note that we may release new [minor and patch](https://semver.org/) versions of
`@warrantdev/warrant-node` with small but backwards-incompatible fixes to the type
declarations. These changes will not affect Warrant itself.

## TypeScript support

This package includes TypeScript declarations for Warrant.

## Warrant Documentation

- [Warrant Docs](https://docs.warrant.dev/)
