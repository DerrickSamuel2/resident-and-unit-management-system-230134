import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "26px 0" }}>
      <div className="container">
        <section className="card" aria-label="Welcome">
          <header className="cardHeader">
            <div>
              <div className="h1">Resident Directory</div>
              <div className="muted">
                Search residents, manage privacy, and broadcast announcements.
              </div>
            </div>
            <span className="badge">RETRO / SECURE / ROLE-BASED</span>
          </header>

          <div className="cardBody">
            <div className="grid2">
              <div className="card" style={{ padding: 16 }}>
                <div className="h2">Get started</div>
                <p className="muted" style={{ marginTop: 6 }}>
                  Log in to view the directory and announcements.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <Link className="btn btnPrimary" href="/login">
                    Login
                  </Link>
                  <Link className="btn" href="/register">
                    Register
                  </Link>
                </div>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <div className="h2">Quick links</div>
                <p className="muted" style={{ marginTop: 6 }}>
                  You can navigate directly if you already have access.
                </p>
                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    marginTop: 14,
                    gridTemplateColumns: "1fr",
                  }}
                >
                  <Link className="btn" href="/directory">
                    Resident Directory
                  </Link>
                  <Link className="btn" href="/profile">
                    My Profile & Privacy
                  </Link>
                  <Link className="btn" href="/admin">
                    Admin Console
                  </Link>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }} className="muted">
              Tip: Set <span className="kbd">NEXT_PUBLIC_API_BASE_URL</span> to
              point the UI at the backend API.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
