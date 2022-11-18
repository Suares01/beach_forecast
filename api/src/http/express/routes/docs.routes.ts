import { Router } from "express";
import { serve, setup } from "swagger-ui-express";

import docs from "../../../docs/openapi.json";

const docsRoutes = Router();

docsRoutes.use("/docs", serve, setup(docs));

export default docsRoutes;
