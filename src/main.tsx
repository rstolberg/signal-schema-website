
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const root = document.getElementById("root")!;
const app = <App path={location.pathname} />;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
