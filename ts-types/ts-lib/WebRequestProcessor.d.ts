import { DataScheme, Device, RequestProcessor, Response, type Request_Parsed } from "ab-data";
export default class WebRequestProcessor extends RequestProcessor {
    #private;
    constructor(dataScheme: DataScheme, device: Device | null, apiUri: string);
    __processRequestBatch_Async(requests: Array<Request_Parsed>, transactionId: number | null): Promise<Response>;
}
