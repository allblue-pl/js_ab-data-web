import webABApi from "web-ab-api";
import abData, { DataScheme, Device, RequestProcessor, Response, type Request_Parsed } from "ab-data";
import type { ResponseData } from "ab-data/ts-lib/Response.ts";

export default class WebRequestProcessor extends RequestProcessor {
    #apiUri: string;
    #device: Device|null;

    constructor(dataScheme: DataScheme, device: Device|null, apiUri: string) {
        super(dataScheme, device);
        
        this.#apiUri = apiUri;
        this.#device = device;
    }

    async __processRequestBatch_Async(requests: Array<Request_Parsed>, 
            transactionId: number|null): Promise<Response> {
        let response = new Response();

        let result = await webABApi.json_Async(this.#apiUri + 'request', { 
            deviceInfo: this.#device === null ? null : {
                deviceId: this.#device.id,
                deviceHash: this.#device.hash,
                declaredItemIds: this.#device.declaredItemIds,
            },
            requests: requests,
            args: {},
        });

        response.setInfo({
            webResult: result,
        });

        if (!result.isSuccess()) {
            if (abData.debug) {
                console.error('Request error: ' + result.message);
                console.warn(result.data.data);
            }

            response.setType(Response.Types_Error);
            response.setError(result.message);

            return response;
        }

        /* Add response data validation. */
        response.parseRawObject(result.data.response as ResponseData);

        // for (let request of requests) {
        //     if (!(request[0] in response.results))
        //         continue;
        //     let result = response.results[request[0]];
        //     if (result === null)
        //         continue;
        //     if (result._type > 0)
        //         continue;

        //     // this.scheme.validateRequestResult(request, result);
        // }

        return response;
    }
}