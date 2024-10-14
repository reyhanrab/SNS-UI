import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";

import Store from "./store/Store";
import SignUp from "./components/auth/Signup";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route exact path="/signup" element={<SignUp />} />
          <Route path="/main" element={<ProtectedRoutes Component={Main} />} />
        </Routes>
      </Router>
    </Provider>
  );
}

const Main = () => {
  return <h1>MAIN</h1>;
};

export default App;
