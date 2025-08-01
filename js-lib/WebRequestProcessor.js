'use strict';

const
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    abData = require('ab-data')
;

export default class WebRequestProcessor extends abData.RequestProcessor {
    constructor(dataScheme, device, apiUri) {
        super(dataScheme, device);
        js0.args(arguments, abData.DataScheme, abData.Device, 'string');

        this._apiUri = apiUri;
    }

    async __processRequestBatch_Async(requests, transactionId) {
        js0.args(arguments, Array, [ js0.Null, js0.Default ]);

        let response = new abData.Response();

        let result = await webABApi.json_Async(this._apiUri + 'request', { 
            deviceInfo: {
                deviceId: this.device.id,
                deviceHash: this.device.hash,
                declaredItemIds: this.device.declaredItemIds,
            },
            requests: requests,
            args: {},
        });

        response.info = {
            webResult: result,
        };

        if (!result.isSuccess()) {
            if (abData.debug) {
                console.error('Request error: ' + result.message);
                console.warn(result.data.data);
            }

            response.type = Response.Types_Error;
            response.error = result.message;

            return response;
        }

        response.parseRawObject(result.data.response);

        for (let request of requests) {
            if (!(request[0] in response.results))
                continue;
            let result = response.results[request[0]];
            if (result === null)
                continue;
            if (result._type > 0)
                continue;

            this._scheme.validateResult(request, result);
        }

        return response;
    }
}