import "./style.scss";
import "./components/theme.css";

import { render } from "solid-js/web";
import { App } from "./App";

render(() => <App />, document.getElementById("app")!);

postMessage({ payload: "removeLoading" }, "*");
