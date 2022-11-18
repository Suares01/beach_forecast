import { AxiosError } from "axios";

import { InternalError } from "./InternalError";

export class OpenMeteoRequestError extends InternalError {
  constructor(err: AxiosError) {
    const internalMessage =
      "Unexpected error returned by the OpenMeteo service";
    super(
      `${internalMessage}: Error: ${JSON.stringify(err.response?.data)} Code: ${
        err.response?.status
      }`
    );
  }
}
