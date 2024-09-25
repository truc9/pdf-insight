import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Layout = lazy(() => import("./app-layout"));
const ChatBox = lazy(() => import("./containers/chatbox"));
const Uploads = lazy(() => import("./containers/uploads"));
const NotFound = lazy(() => import("./containers/not-found"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ChatBox />} />
          <Route path="/load" element={<Uploads />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
