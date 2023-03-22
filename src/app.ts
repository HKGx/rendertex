import latexJpg from "./routes/latex/jpg.js";
import appContext from "./appContext.js";

const app = appContext.app();

app.use(latexJpg);

export default app;
