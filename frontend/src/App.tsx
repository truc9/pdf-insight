import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Layout = lazy(() => import("./Layout"));
const Chat = lazy(() => import("./pages/Chat"));
const Load = lazy(() => import("./pages/Load"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Chat />} />
          <Route path="/load" element={<Load />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
