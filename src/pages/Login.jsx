import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Button from "../components/UI/Button.jsx";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post("/api/auth/login", form);
      login(data.user);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
      }}
    >
      {/* Left side (hidden on mobile) */}
      <div
        className="anim-fade-up"
        style={{
          padding: "60px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 40,
          }}
        >
          <div className="sidebar-brand-logo">
            <i className="fas fa-check-double" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>
            Smart<b style={{ color: "var(--primary)" }}>Task</b>
          </span>
        </Link>

        <h1
          style={{
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1px",
            marginBottom: 14,
          }}
        >
          Manage. Collaborate.
          <br />
          Achieve.
        </h1>
        <p
          style={{
            color: "var(--text-2)",
            fontSize: 15.5,
            lineHeight: 1.6,
            maxWidth: 420,
            marginBottom: 40,
          }}
        >
          Stay organized, work smarter, and get more done together.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 420,
          }}
        >
          {[
            {
              icon: "fa-list-check",
              t: "Task Management",
              d: "Create, assign and track tasks in one place.",
            },
            {
              icon: "fa-comments",
              t: "Real-time Chat",
              d: "Talk directly on every task with your team.",
            },
            {
              icon: "fa-chart-pie",
              t: "Reports",
              d: "Deep insights with export to PDF.",
            },
          ].map((f) => (
            <div key={f.t} style={{ display: "flex", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "#fff",
                  color: "var(--primary)",
                  boxShadow: "0 4px 12px rgba(229,57,53,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i className={"fas " + f.icon} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{f.t}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-2)" }}>
                  {f.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — the form */}
      <div
        className="anim-scale"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          background: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
            Welcome Back
          </h2>
          <p
            style={{ color: "var(--text-2)", fontSize: 13.5, marginBottom: 28 }}
          >
            Sign in to your account
          </p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="you@umyu.edu.ng"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  style={{ paddingRight: 44 }}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-3)",
                    fontSize: 14,
                  }}
                >
                  <i
                    className={"fas " + (showPass ? "fa-eye-slash" : "fa-eye")}
                  />
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "var(--text-2)",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" /> Remember me
              </label>
              <span
                style={{
                  fontSize: 12.5,
                  color: "var(--primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              block
              loading={loading}
              icon="fa-right-to-bracket"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "var(--text-3)",
                marginTop: 20,
              }}
            >
              Only administrators can register new accounts.
            </p>
          </form>
        </div>
      </div>

      <style>
        {
          '@media (max-width: 900px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important} div[style*="padding: 60px 60px"]{display:none !important}}'
        }
      </style>
    </div>
  );
}
