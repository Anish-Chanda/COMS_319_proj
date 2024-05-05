import React, { useState } from "react";
import "./App.css";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./Components/Dashboard";
import About from "./Components/AboutPage";

function App() {
  const [view, setView] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div
      className={`min-h-screen h-full flex items-center justify-center ${
        view === "about" ? "bg-[#a2b997]" : "bg-gray-900"
      }`}
    >
      {view === "" && (
        <div className="flex-col flex space-y-5">
          <button
            onClick={() => setView("login")}
            className="px-4 py-2 text-3xl font-bold text-white bg-green-500 rounded hover:bg-green-700"
          >
            Login
          </button>
          <button
            onClick={() => setView("about")}
            className="px-4 py-2 text-3xl font-bold text-white bg-green-500 rounded hover:bg-green-700"
          >
            About
          </button>
        </div>
      )}
      {view === "login" && <LoginForm setView={setView} setIsAdmin={setIsAdmin} setUserId={setUserId}/>}
      {view === "dashboard" && (
        <Dashboard userId={userId} isAdmin={isAdmin}/>
      )}
      {view === "about" && <About setView={setView} />}
    </div>
  );
}

export default App;
