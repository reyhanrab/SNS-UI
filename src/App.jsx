import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";


import Store from "./store/Store";
import SignUp from "./components/auth/Signup";


function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route exact path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
