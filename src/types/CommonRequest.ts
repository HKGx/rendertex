import { Static, Type } from "@sinclair/typebox";

const RequestData = Type.Object({
  data: Type.String({ minLength: 1, maxLength: 1024 }),
});

type CommonRequest = Static<typeof RequestData>;

const CommonRequest = RequestData;

export { CommonRequest };
