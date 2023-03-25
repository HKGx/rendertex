import latexJpg from "./routes/latex/jpg.js";
import appContext from "./appContext.js";
import index from "./routes/index.js";

const app = appContext.app();

app.use(latexJpg, index);

export default app;
