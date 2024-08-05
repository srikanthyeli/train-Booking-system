import { createBrowserRouter,RouterProvider } from "react-router-dom";


import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import "./App.css";



const router=createBrowserRouter([
  {
    path:"/login",
    element:<div><Login/></div>
  },
  {
    path:"/register",
    element:<div><Register/></div>
  },
  {
    path:"/",
    element:<div><Dashboard/></div>
  }

])
function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
