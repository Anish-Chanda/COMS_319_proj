import React, { useState } from "react";
import "./App.css";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./Components/Dashboard";

function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="min-h-screen h-full flex items-center justify-center bg-gray-900">
      {view === "" && (
        <button
          onClick={() => setView("login")}
          className="px-4 py-2 text-3xl font-bold text-white bg-green-500 rounded hover:bg-green-700"
        >
          Login
        </button>
      )}
      {view === "login" && <LoginForm setView={setView} />}
      {view === "dashboard" && <Dashboard userId={"662d27c91e4d04f831c2bdd7"}/>}
    </div>
  );
}

export default App;
