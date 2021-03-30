export default abstract class InjectAbstract {
  cancelRequest: boolean = false;

  constructor(
    protected requestData: Buffer | null = null,
    protected responseData: Buffer | null = null
  ) {
  }

  setRequestData(requestData: Buffer | null) {
    this.requestData = requestData;
  }

  setResponseData(responseData: Buffer | null) {
    this.responseData = responseData;
  }

  abstract handlerRequest(): Promise<Buffer | string | null>;

  abstract handlerResponse(): Promise<Buffer | string | null>;
}