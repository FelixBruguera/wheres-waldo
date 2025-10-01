import { Route, Routes } from "react-router";
import Start from "./components/Start";
import Game from "./components/Game";

const App = () => {
  return (
    <Routes>
      <Route index={true} element={<Start />} />
      <Route path="/:id" element={<Game />} />
    </Routes>
  );
};

export default App;
