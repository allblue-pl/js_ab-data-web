import WebRequestProcessor from "./WebRequestProcessor.ts";

export class abDataWeb_Class {
    get WebRequestProcessor(): typeof WebRequestProcessor {
        return WebRequestProcessor;
    }


    constructor() {

    }
}
const abDataWeb = new abDataWeb_Class();
export default abDataWeb;