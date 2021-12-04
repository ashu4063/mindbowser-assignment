import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./Pages/Users";
import ViewUser from "./Pages/ViewUser";
import Header from "./Components/Header";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/*Define routes for url rendering on url
        pass element like these not like "component={User}"*/}
        <Route exact path="/" element={<Users />} />
        <Route exact path="/viewuser" element={<ViewUser />} />
      </Routes>
    </Router>
  );
}

export default App;
