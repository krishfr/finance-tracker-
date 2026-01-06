// src/AuthPage.jsx
import { useState } from "react";
import { apiRequest, setToken } from "./api";

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const body =
        mode === "register"
          ? { name, email, password }
          : { email, password };

      const data = await apiRequest(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      setToken(data.token);
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-gray-700"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700"
            required
          />

          <button className="w-full bg-sky-600 p-3 rounded font-semibold">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <button
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-sky-400 underline"
          >
            {mode === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
