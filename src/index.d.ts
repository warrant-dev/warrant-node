import Config from "./types/Config";
import Authorization from "./modules/Authorization";
declare module 'warrant' {
    export class WarrantClient {
        static WarrantClient: typeof WarrantClient;

        constructor(config: Config);

        Authorization: typeof Authorization;
    }

    export default WarrantClient;
}
