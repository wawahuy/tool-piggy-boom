import express, { Router } from "express";
import routerAdmin from "./admin";
import routerUsers from "./user";

const routerGlobals = Router();
routerGlobals.use("/adm", routerAdmin);
routerGlobals.use("/usr", routerUsers);

export default routerGlobals;
