import Config from "./types/Config";
declare module 'warrant' {
    export class WarrantClient {
        static WarrantClient: typeof WarrantClient;

        constructor(config: Config);
    }

    export default WarrantClient;
}
