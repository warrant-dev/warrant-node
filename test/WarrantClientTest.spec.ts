import WarrantClient from "../src/WarrantClient";
import { ApiError } from "../src/types";
import { assert } from "chai";
import { MockAgent, setGlobalDispatcher } from "undici";

describe('WarrantClientTest', function () {
    before(function () {
        this.warrant = new WarrantClient({ apiKey: "my_api_key", endpoint: "http://localhost:8000" });

        const agent = new MockAgent();
        agent.disableNetConnect();
        this.client = agent.get("http://localhost:8000")
        setGlobalDispatcher(agent);
    });

    it('should make request after retries', async function () {
        this.timeout(10000);
        this.client
            .intercept({
                path: "/v2/objects/user/some-user",
                method: "GET"
            })
            .reply(502);

        this.client
            .intercept({
                path: "/v2/objects/user/some-user",
                method: "GET"
            })
            .reply(502);

        this.client
            .intercept({
                path: "/v2/objects/user/some-user",
                method: "GET"
            })
            .reply(200, { "objectType": "user", "objectId": "some-user" });

        const fetchedUser = await this.warrant.User.get("some-user");

        assert.strictEqual(fetchedUser.userId, "some-user");
        assert.strictEqual(fetchedUser.meta, undefined);
    });

    it('should stop requests after max retries', async function () {
        this.timeout(10000);
        this.client
            .intercept({
                path: "/v2/objects/user/some-user",
                method: "GET"
            })
            .reply(502, {
                message: "Bad Gateway"
            });

        this.client
            .intercept({
                path: "/v2/objects/user/some-user",
                method: "GET"
            })
            .reply(502, {
                message: "Bad Gateway"
            });

        this.client
            .intercept({
                path: "/v2/objects/user/some-user",
                method: "GET"
            })
            .reply(502, {
                message: "Bad Gateway"
            });

        try {
            await this.warrant.User.get("some-user");
        } catch (e) {
            assert.instanceOf(e, ApiError);
        }
    });
});
