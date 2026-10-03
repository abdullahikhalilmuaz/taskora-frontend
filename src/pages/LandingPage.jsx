import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 60%)",
      }}
    >
      <header
        style={{
          padding: "22px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="sidebar-brand-logo">
            <i className="fas fa-check-double" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>
            Taskora<b style={{ color: "var(--primary)" }}>Ora</b>
          </span>
        </div>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </header>

      <section
        className="hero-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div className="anim-fade-up">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--primary-light)",
              color: "var(--primary-dark)",
              padding: "6px 14px",
              borderRadius: 30,
              fontSize: 12.5,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <i className="fas fa-star" /> Trusted by Umaru Musa Yar'adua
            University Katsina
          </div>
          <h1
            className="hero-title"
            style={{
              fontSize: 46,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.2px",
              marginBottom: 18,
            }}
          >
            Manage. Collaborate.
            <br />
            <span style={{ color: "var(--primary)" }}>Achieve.</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              lineHeight: 1.6,
              marginBottom: 28,
              maxWidth: 480,
            }}
          >
            Stay organized, work smarter, and get more done together. The smart
            task management system built for teams that ship.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: "13px 26px", fontSize: 14.5 }}
            >
              Get Started <i className="fas fa-arrow-right" />
            </Link>
            <a
              href="#features"
              className="btn btn-outline"
              style={{ padding: "13px 26px", fontSize: 14.5 }}
            >
              <i className="fas fa-play-circle" /> See Features
            </a>
          </div>

          <div style={{ display: "flex", gap: 28, marginTop: 40 }}>
            <Stat n="10k+" l="Active Users" />
            <Stat n="50k+" l="Tasks Completed" />
            <Stat n="4.9" l="User Rating" />
          </div>
        </div>

        <div className="anim-fade" style={{ position: "relative" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 22,
              padding: 18,
              boxShadow: "0 30px 80px rgba(229,57,53,0.15)",
              border: "1px solid var(--border-2)",
            }}
          >
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#f59e0b",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#10b981",
                }}
              />
            </div>
            <div
              style={{
                background: "var(--primary-light)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--primary-dark)",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                <i className="fas fa-circle-check" /> In Progress
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                Website Redesign
              </div>
              <div
                style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}
              >
                Assigned to John Doe
              </div>
            </div>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--warning)",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                <i className="fas fa-clock" /> Pending
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                Database Backup
              </div>
            </div>
            <div
              style={{ background: "#f8f9fa", borderRadius: 12, padding: 14 }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--success)",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                <i className="fas fa-circle-check" /> Completed
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                Report Generation
              </div>
            </div>
          </div>
          <div
            className="anim-pop floating-badge"
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              background: "#fff",
              padding: "10px 16px",
              borderRadius: 14,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              fontSize: 12.5,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className="fas fa-bell" style={{ color: "var(--primary)" }} />{" "}
            New task assigned
          </div>
        </div>
      </section>

      <section
        id="features"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 32px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
          Everything you need to succeed
        </h2>
        <p style={{ color: "var(--text-2)", marginBottom: 48, fontSize: 15 }}>
          Powerful features to help you manage tasks, collaborate with teams,
          and achieve more.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              icon: "fa-list-check",
              t: "Smart Tasks",
              d: "Create, assign, prioritize, and track tasks easily.",
            },
            {
              icon: "fa-users",
              t: "Team Collaboration",
              d: "Real-time chat and comments on every task.",
            },
            {
              icon: "fa-chart-line",
              t: "Analytics",
              d: "Detailed reports with PDF export.",
            },
            {
              icon: "fa-bell",
              t: "Live Notifications",
              d: "Instant alerts when things change.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="card"
              style={{ padding: 26, textAlign: "left" }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 14,
                }}
              >
                <i className={"fas " + f.icon} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                {f.t}
              </h3>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--text-2)",
                  lineHeight: 1.5,
                }}
              >
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 32px 80px" }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #e53935 0%, #c62828 100%)",
            borderRadius: 24,
            padding: "52px 40px",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 30px 60px rgba(229,57,53,0.35)",
          }}
        >
          <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
            Ready to get started?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: 26, fontSize: 15 }}>
            Sign in to your account or contact your administrator.
          </p>
          <Link
            to="/login"
            className="btn"
            style={{
              background: "#fff",
              color: "var(--primary)",
              padding: "13px 30px",
              fontSize: 14.5,
            }}
          >
            Sign In Now <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>

      <footer
        style={{
          textAlign: "center",
          padding: "20px 0 40px",
          color: "var(--text-3)",
          fontSize: 12.5,
        }}
      >
        © 2026 Umaru Musa Yar'adua University Katsina — Smart Task Management
        System
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px 20px 60px !important;
            text-align: left;
          }
          .hero-title {
            font-size: 34px !important;
            letter-spacing: -0.8px !important;
          }
          .floating-badge {
            top: -12px !important;
            right: 12px !important;
            font-size: 11.5px !important;
            padding: 8px 12px !important;
          }
        }
        @media (max-width: 500px) {
          .hero-title {
            font-size: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{n}</div>
      <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
        {l}
      </div>
    </div>
  );
}
