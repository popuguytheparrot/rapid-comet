import { using } from "forest";
import { app } from "./app";

const root = document.getElementById("app")!;

using(root, app);
