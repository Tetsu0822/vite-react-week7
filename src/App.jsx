
import { RouterProvider } from "react-router";
import { routes } from "./routes/index.jsx";
import MessageToast from "./components/MessageToast.jsx";
function App() {
    return (<>
        <MessageToast />
        <RouterProvider router={routes} />
    </>);
}

export default App;