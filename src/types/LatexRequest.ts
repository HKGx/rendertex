import { Static, Type } from "@sinclair/typebox";
import { CommonRequest } from "./CommonRequest.js";

const LatexRequest = CommonRequest;

type LatexRequest = Static<typeof LatexRequest>;

export { LatexRequest };
