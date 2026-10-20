"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Filter,
  LayoutGrid,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Star,
  TriangleAlert,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Brand, Modal, Toolbox } from "./shared";
import {
  initialArtisans,
  initialJobs,
  services,
  tabs,
  money,
  type Job,
  type Artisan,
} from "@/lib/data";
type Payout = { name: string; bank: string; value: number; status: string };
const seedPayouts: Payout[] = [
  {
    name: "Chinedu Okafor",
    bank: "GTBank ••89",
    value: 64500,
    status: "Pending",
  },
  {
    name: "Ibrahim Okon",
    bank: "Access ••31",
    value: 48200,
    status: "Pending",
  },
  { name: "Babatunde Ade", bank: "UBA ••47", value: 52850, status: "Pending" },
  { name: "Musa Bello", bank: "OPay ••65", value: 27000, status: "Review" },
];
const seedDisputes = [
  {
    id: "DS-102",
    customer: "Chika Nwosu",
    job: "FX-20518",
    title: "Leak returned after repair",
    status: "Open",
  },
  {
    id: "DS-101",
    customer: "Daniel Udo",
    job: "FX-20514",
    title: "Quote clarification requested",
    status: "Open",
  },
];
function useStored<T>(key: string, seed: T) {
  const [value, setValue] = useState(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
  }, [key, value, ready]);
  return [value, setValue] as const;
}
function Badge({ children }: { children: string }) {
  return (
    <span
      className={`badge badge-${children.toLowerCase().replaceAll(" ", "-")}`}
    >
      {children}
    </span>
  );
}
function exportCSV(name: string, rows: (string | number)[][]) {
  const safe = (v: string | number) => {
    let text = String(v);
    if (/^[=+@\-]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const url = URL.createObjectURL(
    new Blob([rows.map((r) => r.map(safe).join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useStored<Job[]>("fixit-demo-jobs-v2", initialJobs);
  const [artisans, setArtisans] = useStored<Artisan[]>(
    "fixit-demo-artisans-v2",
    initialArtisans,
  );
  const [payouts, setPayouts] = useStored("fixit-demo-payouts-v2", seedPayouts);
  const [disputes, setDisputes] = useStored(
    "fixit-demo-disputes-v2",
    seedDisputes,
  );
  const [pricing, setPricing] = useStored(
    "fixit-demo-pricing-v2",
    services.map((s) => s.price),
  );
  const [settings, setSettings] = useStored("fixit-demo-settings-v2", {
    name: "Alex Morgan",
    email: "admin@example.com",
    city: "Lagos",
    emailAlerts: true,
    pushAlerts: true,
  });
  const [reviewNotes, setReviewNotes] = useStored<Record<string, string>>(
    "fixit-demo-review-notes-v2",
    {},
  );
  const [resolutionNotes, setResolutionNotes] = useStored<
    Record<string, string>
  >("fixit-demo-resolution-notes-v2", {});
  const [reviewNote, setReviewNote] = useState("");
  const [notice, setNotice] = useState("");
  const [notify, setNotify] = useState(false);
  const [modal, setModal] = useState<"job" | "artisan" | "detail" | null>(null);
  const [selected, setSelected] = useState("");
  const [artisanFilter, setArtisanFilter] = useState("All");
  const [reportPeriod, setReportPeriod] = useState("All sample dates");
  useEffect(() => {
    const read = () => {
      const k = window.location.hash.slice(1);
      if (tabs.some((t) => t.key === k)) setTab(k);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);
  function go(key: string) {
    setTab(key);
    setQuery("");
    setFilter("All");
    setPage(1);
    setMenu(false);
    window.history.replaceState(null, "", `#${key}`);
  }
  const unassigned = jobs.filter((j) => j.status === "Unassigned").length;
  const pending = artisans.filter((a) => a.status === "Pending").length;
  const open = disputes.filter((d) => d.status === "Open").length;
  const completed = jobs.filter((j) => j.status === "Completed");
  const total = jobs.reduce((a, j) => a + j.value, 0);
  const revenue = completed.reduce((a, j) => a + j.value * 0.1, 0);
  const matching = jobs.filter(
    (j) =>
      (filter === "All" ||
        (filter === "Active"
          ? ["On the way", "In progress"].includes(j.status)
          : j.status === filter)) &&
      Object.values(j).join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const selectedJob = jobs.find((j) => j.id === selected);
  const selectedArtisan = artisans.find((a) => a.id === selected);
  const customers = jobs.filter(
    (j, i, a) => a.findIndex((x) => x.customer === j.customer) === i,
  );
  const current = tabs.find((t) => t.key === tab)!;
  function jobTable(list: Job[]) {
    return (
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Job reference</th>
              <th>Service / customer</th>
              <th>Artisan</th>
              <th>Status</th>
              <th className="align-right">Value</th>
              <th>
                <span className="sr-only">View job</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((j) => (
              <tr key={j.id}>
                <td>
                  <span className="ref">{j.id}</span>
                  <small>{j.date}</small>
                </td>
                <td>
                  <strong>{j.service}</strong>
                  <small>
                    {j.customer} · {j.area}
                  </small>
                </td>
                <td>
                  {j.artisan === "Unassigned" ? (
                    <span className="muted">Not assigned yet</span>
                  ) : (
                    <>
                      <span className="tiny-avatar">
                        {j.artisan
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      {j.artisan}
                    </>
                  )}
                </td>
                <td>
                  <Badge>{j.status}</Badge>
                </td>
                <td className="align-right">
                  <strong>{money(j.value)}</strong>
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={`View ${j.id}`}
                    onClick={() => {
                      setSelected(j.id);
                      setModal("detail");
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <div className="empty-state">
            <Search size={28} />
            <h3>No jobs found</h3>
            <p>Try a different search or status.</p>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="dashboard-app">
      <header className="dash-header clay">
        <Brand admin />
        <nav>
          <Link href="/">
            Explore services <ArrowUpRight size={14} />
          </Link>
          <a href="/#how-it-works">How it works</a>
        </nav>
        <div className="dash-header-actions">
          <span className="demo-badge">Demo workspace</span>
          <button
            className="icon-button notification-button"
            onClick={() => setNotify(!notify)}
            aria-label="View notifications"
            aria-expanded={notify}
          >
            <Bell size={21} />
            {unassigned + pending + open > 0 && <i />}
          </button>
          <button
            className="admin-avatar"
            onClick={() => go("settings")}
            aria-label="Open profile settings"
          >
            {settings.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </button>
          <button
            className="icon-button mobile-toggle"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle dashboard navigation"
            aria-expanded={menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {notify && (
          <div className="notification-popover">
            <h3>Your attention, please.</h3>
            <button
              onClick={() => {
                go("jobs");
                setFilter("Unassigned");
                setNotify(false);
              }}
            >
              <BriefcaseBusiness size={19} />
              <span>
                {unassigned} jobs need an artisan
                <small>Open dispatch to assign someone.</small>
              </span>
            </button>
            <button
              onClick={() => {
                go("artisans");
                setArtisanFilter("Pending");
                setNotify(false);
              }}
            >
              <ShieldCheck size={19} />
              <span>
                {pending} applications to review
                <small>Meet your next skilled hands.</small>
              </span>
            </button>
            <button
              onClick={() => {
                go("disputes");
                setNotify(false);
              }}
            >
              <TriangleAlert size={19} />
              <span>{open} open support cases</span>
            </button>
          </div>
        )}
      </header>
      <div className="dash-layout">
        {menu && (
          <button
            className="sidebar-overlay"
            aria-label="Close navigation"
            onClick={() => setMenu(false)}
          />
        )}
        <aside className={`sidebar ${menu ? "sidebar-open" : ""}`}>
          <div className="sidebar-inner">
            <span className="sidebar-label">YOUR WORKSPACE</span>
            <nav aria-label="Dashboard navigation">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={tab === t.key ? "active" : ""}
                  aria-current={tab === t.key ? "page" : undefined}
                  onClick={() => go(t.key)}
                >
                  <t.icon size={19} />
                  <span>{t.name}</span>
                  {t.key === "jobs" && unassigned > 0 && <b>{unassigned}</b>}
                  {t.key === "artisans" && pending > 0 && (
                    <b className="mint-count">{pending}</b>
                  )}
                  {t.key === "disputes" && open > 0 && (
                    <b className="peach-count">{open}</b>
                  )}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="sidebar-help">
                <span className="help-icon">
                  <CircleHelp size={21} />
                </span>
                <strong>A helping hand?</strong>
                <p>Find your way around Fix-it.</p>
                <Link href="/#faq">
                  Visit help centre <ArrowUpRight size={15} />
                </Link>
              </div>
              <Link className="leave-demo" href="/login/">
                <LogOut size={18} /> Leave demo
              </Link>
              <span className="sidebar-version">
                <span className="status-dot" /> Fix-it workspace · v2.0
              </span>
            </div>
          </div>
        </aside>
        <main className="dash-main">
          <div className="dash-title">
            <div>
              <div className="breadcrumbs">
                Workspace <ChevronRight size={12} /> {current.name}
              </div>
              <h1>
                {tab === "overview"
                  ? "A little overview. A lot of clarity."
                  : current.name}
              </h1>
              <p>
                {
                  (
                    {
                      overview:
                        "Keep people, repairs and everyday operations moving.",
                      jobs: "The right person, in the right place, at the right time.",
                      artisans:
                        "Good people are at the heart of a good repair.",
                      customers: "A clear view of the people who count on you.",
                      payments: "Every payment and payout, all in one place.",
                      disputes: "A little understanding goes a long way.",
                      services:
                        "Keep your repair catalogue clear and up to date.",
                      reports: "See what’s working. Find what comes next.",
                      settings:
                        "Make this workspace feel a little more like you.",
                    } as Record<string, string>
                  )[tab]
                }
              </p>
            </div>
            <div className="title-actions">
              {["jobs", "overview"].includes(tab) ? (
                <button
                  className="button button-blue"
                  onClick={() => setModal("job")}
                >
                  <Plus size={17} /> Create job
                </button>
              ) : tab === "reports" || tab === "payments" ? (
                <button
                  className="button button-white"
                  onClick={() =>
                    exportCSV(
                      `fixit-${tab}.csv`,
                      tab === "payments"
                        ? [
                            ["Artisan", "Bank", "Amount", "Status"],
                            ...payouts.map((p) => [
                              p.name,
                              p.bank,
                              p.value,
                              p.status,
                            ]),
                          ]
                        : [
                            ["Reference", "Service", "Status", "Value"],
                            ...jobs.map((j) => [
                              j.id,
                              j.service,
                              j.status,
                              j.value,
                            ]),
                          ],
                    )
                  }
                >
                  <Download size={17} /> Export CSV
                </button>
              ) : null}
            </div>
          </div>
          <div className="demo-notice">
            <span>
              <span className="status-dot" /> Interactive preview
            </span>{" "}
            Sample data · changes are saved in this browser only.
          </div>
          {tab === "overview" && (
            <>
              <section className="dashboard-banner pattern-dark">
                <div>
                  <span className="eyebrow mint-text">
                    THE EVERYDAY, TAKEN CARE OF.
                  </span>
                  <h2>
                    A clear view.
                    <br />A happier marketplace.
                  </h2>
                  <p>
                    Good jobs start with good coordination.
                    <br />
                    Let’s make today run a little smoother.
                  </p>
                  <button
                    className="button button-mint"
                    onClick={() => go("jobs")}
                  >
                    Open dispatch <ArrowUpRight size={17} />
                  </button>
                </div>
                <Toolbox small />
                <div className="banner-status">
                  <span className="status-dot" /> Your workspace, all together
                </div>
              </section>
              <div className="stats-grid">
                {[
                  {
                    label: "Total jobs",
                    value: jobs.length,
                    note: `${unassigned} waiting for their perfect match`,
                    icon: BriefcaseBusiness,
                    tone: "lilac",
                  },
                  {
                    label: "Booking value",
                    value: money(total),
                    note: "Across all sample bookings",
                    icon: Wallet,
                    tone: "mint",
                  },
                  {
                    label: "Fix-it revenue",
                    value: money(revenue),
                    note: "Illustrative 10% of completed jobs",
                    icon: ArrowDownLeft,
                    tone: "yellow",
                  },
                  {
                    label: "Approved artisans",
                    value: artisans.filter((a) => a.status === "Approved")
                      .length,
                    note: `${pending} new applications to review`,
                    icon: Users,
                    tone: "peach",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`stat-card clay pattern-card ${s.tone}`}
                  >
                    <div>
                      <span>{s.label}</span>
                      <span className={`small-icon ${s.tone}`}>
                        <s.icon size={20} />
                      </span>
                    </div>
                    <strong>{s.value}</strong>
                    <p>{s.note}</p>
                  </div>
                ))}
              </div>
              <div className="overview-middle">
                <section className="panel attention-panel">
                  <div className="panel-title">
                    <h2>A little attention needed</h2>
                    <span className="muted">Let’s keep things moving.</span>
                  </div>
                  {[
                    {
                      n: unassigned,
                      title: "Jobs waiting for an artisan",
                      note: "Match a job with a helping hand.",
                      key: "jobs",
                      tone: "yellow",
                    },
                    {
                      n: pending,
                      title: "Artisan applications",
                      note: "Review the newest skilled hands.",
                      key: "artisans",
                      tone: "mint",
                    },
                    {
                      n: open,
                      title: "Open support cases",
                      note: "Help get things back on track.",
                      key: "disputes",
                      tone: "peach",
                    },
                    {
                      n: payouts.filter((p) => p.status === "Pending").length,
                      title: "Payouts to approve",
                      note: "Review pending withdrawal requests.",
                      key: "payments",
                      tone: "blue",
                    },
                  ].map((a) => (
                    <button
                      className="attention-row"
                      key={a.key}
                      onClick={() => go(a.key)}
                    >
                      <span className={`attention-count ${a.tone}`}>{a.n}</span>
                      <span>
                        <strong>{a.title}</strong>
                        <small>{a.note}</small>
                      </span>
                      <ChevronRight size={17} />
                    </button>
                  ))}
                </section>
                <section className="panel category-panel">
                  <div className="panel-title">
                    <h2>Repairs at a glance</h2>
                    <span className="subtle-tag">Sample bookings</span>
                  </div>
                  <div className="category-bars">
                    {services.slice(0, 5).map((s, i) => {
                      const count = jobs.filter((j) =>
                        j.service
                          .toLowerCase()
                          .includes(
                            ["sink", "electrical", "AC ", "generator", "door"][
                              i
                            ].toLowerCase(),
                          ),
                      ).length;
                      return (
                        <div key={s.name}>
                          <div>
                            <span>{s.name}</span>
                            <strong>{count}</strong>
                          </div>
                          <span className="bar-track">
                            <i
                              style={{
                                width: `${(count / Math.max(jobs.length, 1)) * 100}%`,
                              }}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <button className="text-button" onClick={() => go("reports")}>
                    View reports <ArrowUpRight size={15} />
                  </button>
                </section>
              </div>
              <section className="panel jobs-panel">
                <div className="panel-title">
                  <div>
                    <h2>The jobs, in motion.</h2>
                    <p>A quick look at your latest repairs.</p>
                  </div>
                  <button className="text-button" onClick={() => go("jobs")}>
                    View all jobs <ArrowUpRight size={16} />
                  </button>
                </div>
                {jobTable(jobs.slice(0, 4))}
              </section>
              <section className="workspace-health">
                <div>
                  <ShieldCheck size={22} />
                  <strong>Built around better everyday operations.</strong>
                </div>
                <span>
                  Dispatch · Verify · Resolve · Grow <ArrowRight size={16} />
                </span>
              </section>
            </>
          )}
          {tab === "jobs" && (
            <>
              <div className="toolbar">
                <div className="segmented">
                  {[
                    "All",
                    "Unassigned",
                    "Active",
                    "Scheduled",
                    "Completed",
                  ].map((s) => (
                    <button
                      key={s}
                      className={filter === s ? "selected" : ""}
                      onClick={() => {
                        setFilter(s);
                        setPage(1);
                      }}
                    >
                      {s}
                      {s === "Unassigned" && <span>{unassigned}</span>}
                    </button>
                  ))}
                </div>
                <label className="table-search">
                  <Search size={17} />
                  <input
                    aria-label="Search jobs"
                    placeholder="Search jobs, people, references…"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </label>
              </div>
              <section className="panel">
                <div className="panel-title">
                  <h2>
                    All repair jobs{" "}
                    <span className="count-pill">{matching.length}</span>
                  </h2>
                  <span className="muted">Latest first</span>
                </div>
                {jobTable(matching.slice((page - 1) * 5, page * 5))}
                <div className="pagination">
                  <span>
                    {matching.length
                      ? `${(page - 1) * 5 + 1}–${Math.min(page * 5, matching.length)}`
                      : "0"}{" "}
                    of {matching.length} jobs
                  </span>
                  <div>
                    <button
                      className="icon-button"
                      aria-label="Previous page"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span>Page {page}</span>
                    <button
                      className="icon-button"
                      aria-label="Next page"
                      disabled={page * 5 >= matching.length}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
          {tab === "artisans" && (
            <>
              <div className="toolbar">
                <div className="segmented">
                  {[
                    "All",
                    "Pending",
                    "Approved",
                    "Rejected",
                    "More info requested",
                  ].map((x) => (
                    <button
                      key={x}
                      className={artisanFilter === x ? "selected" : ""}
                      onClick={() => setArtisanFilter(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
                <label className="table-search">
                  <Search size={17} />
                  <input
                    placeholder="Find an artisan…"
                    aria-label="Search artisans"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>
              <div className="artisan-grid">
                {artisans
                  .filter(
                    (a) =>
                      (artisanFilter === "All" || a.status === artisanFilter) &&
                      `${a.name} ${a.trade} ${a.area}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                  )
                  .map((a, i) => (
                    <article key={a.id} className="panel artisan-card">
                      <div className="artisan-card-head">
                        <div
                          className={`person-avatar ${["mint", "lilac", "peach"][i % 3]}`}
                        >
                          {a.initials}
                        </div>
                        <Badge>{a.status}</Badge>
                      </div>
                      <h3>{a.name}</h3>
                      <p>{a.trade} specialist</p>
                      <div className="artisan-details">
                        <span>
                          <MapPinIcon />
                          {a.area}
                        </span>
                        <span>
                          <Star size={15} />
                          {a.rating}
                        </span>
                      </div>
                      <button
                        className="button button-white"
                        onClick={() => {
                          setSelected(a.id);
                          setReviewNote(reviewNotes[a.id] || "");
                          setModal("artisan");
                        }}
                      >
                        {a.status === "Pending"
                          ? "Review application"
                          : "View profile"}
                        <ArrowUpRight size={17} />
                      </button>
                    </article>
                  ))}
              </div>
              {!artisans.some(
                (a) =>
                  (artisanFilter === "All" || a.status === artisanFilter) &&
                  `${a.name} ${a.trade} ${a.area}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
              ) && (
                <div className="empty-state panel">
                  No artisans match your filters.
                </div>
              )}
            </>
          )}
          {tab === "customers" && (
            <section className="panel">
              <div className="panel-title">
                <h2>The people behind the repairs</h2>
                <label className="table-search">
                  <Search size={17} />
                  <input
                    aria-label="Search customers"
                    placeholder="Search customers…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Area</th>
                      <th>Bookings</th>
                      <th>Total booked</th>
                      <th>Latest job</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter((j) =>
                        `${j.customer} ${j.area}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((j) => (
                        <tr key={j.customer}>
                          <td>
                            <span className="tiny-avatar">
                              {j.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                            <strong>{j.customer}</strong>
                          </td>
                          <td>{j.area}</td>
                          <td>
                            {
                              jobs.filter((x) => x.customer === j.customer)
                                .length
                            }
                          </td>
                          <td>
                            {money(
                              jobs
                                .filter((x) => x.customer === j.customer)
                                .reduce((a, x) => a + x.value, 0),
                            )}
                          </td>
                          <td>
                            <button
                              className="text-button"
                              onClick={() => {
                                setSelected(j.id);
                                setModal("detail");
                              }}
                            >
                              {j.id} <ArrowUpRight size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {tab === "payments" && (
            <>
              <div className="stats-grid three">
                {[
                  {
                    label: "Awaiting payout",
                    value: money(
                      payouts
                        .filter((p) => p.status === "Pending")
                        .reduce((a, p) => a + p.value, 0),
                    ),
                    tone: "lilac",
                  },
                  {
                    label: "Payouts marked approved",
                    value: money(
                      payouts
                        .filter((p) => p.status === "Approved")
                        .reduce((a, p) => a + p.value, 0),
                    ),
                    tone: "mint",
                  },
                  {
                    label: "Sample platform revenue",
                    value: money(revenue),
                    tone: "yellow",
                  },
                ].map((s) => (
                  <div
                    className={`stat-card clay pattern-card ${s.tone}`}
                    key={s.label}
                  >
                    <div>
                      {s.label}
                      <Wallet size={20} />
                    </div>
                    <strong>{s.value}</strong>
                    <p>Illustrative values · no live money movement</p>
                  </div>
                ))}
              </div>
              <section className="panel">
                <div className="panel-title">
                  <div>
                    <h2>Withdrawals to review</h2>
                    <p>Review each request before approving.</p>
                  </div>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Artisan</th>
                        <th>Bank</th>
                        <th>Amount</th>
                        <th>Checks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((p, i) => (
                        <tr key={p.name}>
                          <td>
                            <strong>{p.name}</strong>
                          </td>
                          <td>{p.bank}</td>
                          <td>{money(p.value)}</td>
                          <td>
                            <Badge>
                              {p.status === "Review"
                                ? "Review"
                                : p.status === "Approved"
                                  ? "Approved"
                                  : "Checks passed"}
                            </Badge>
                          </td>
                          <td>
                            {p.status === "Approved" ? (
                              <span className="green-text">
                                <CheckCheck size={17} /> Approved
                              </span>
                            ) : (
                              <button
                                className="button button-small button-soft"
                                onClick={() => {
                                  setSelected(String(i));
                                  setModal("detail");
                                }}
                              >
                                {p.status === "Review"
                                  ? "Review request"
                                  : "Review & approve"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="panel-footnote">
                  <ShieldCheck size={16} /> Approvals in this demo update local
                  status only. No bank transfer is made.
                </div>
              </section>
            </>
          )}
          {tab === "disputes" && (
            <>
              <div className="toolbar">
                <div className="segmented">
                  {["All", "Open", "Resolved"].map((s) => (
                    <button
                      className={filter === s ? "selected" : ""}
                      key={s}
                      onClick={() => setFilter(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="dispute-list">
                {disputes
                  .filter((d) => filter === "All" || d.status === filter)
                  .map((d) => (
                    <article className="panel dispute-card" key={d.id}>
                      <span className="clay-icon peach">
                        <TriangleAlert size={24} />
                      </span>
                      <div>
                        <span className="ref">
                          {d.id} · {d.job}
                        </span>
                        <h3>{d.title}</h3>
                        <p>{d.customer} · Customer support</p>
                        {d.status === "Resolved" && resolutionNotes[d.id] && (
                          <p>Resolution: {resolutionNotes[d.id]}</p>
                        )}
                      </div>
                      <Badge>{d.status}</Badge>
                      {d.status === "Open" && (
                        <button
                          className="button button-white"
                          onClick={() => {
                            setSelected(d.id);
                            setModal("detail");
                          }}
                        >
                          Review case <ArrowUpRight size={16} />
                        </button>
                      )}
                    </article>
                  ))}
              </div>
              {!disputes.some(
                (d) => filter === "All" || d.status === filter,
              ) && (
                <div className="empty-state panel">
                  <ShieldCheck />
                  <h3>All clear here.</h3>
                  <p>No cases in this view.</p>
                </div>
              )}
            </>
          )}
          {tab === "services" && (
            <>
              <p className="section-helper">
                Illustrative call-out fees. Final repair quotes are agreed
                separately.
              </p>
              <div className="pricing-grid">
                {services.map((s, i) => (
                  <form
                    className={`pricing-card clay ${s.tone}`}
                    key={s.name}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const value = Number(
                        new FormData(e.currentTarget).get("price"),
                      );
                      setPricing(pricing.map((p, n) => (n === i ? value : p)));
                      setNotice(`${s.name} call-out fee saved in this demo.`);
                    }}
                  >
                    <div className="service-card-top">
                      <span className={`clay-icon ${s.tone}`}>
                        <s.icon size={25} />
                      </span>
                      <Badge>Active</Badge>
                    </div>
                    <h3>{s.name}</h3>
                    <label>
                      Call-out fee (NGN)
                      <input
                        type="number"
                        min="0"
                        step="100"
                        name="price"
                        required
                        defaultValue={pricing[i]}
                        key={pricing[i]}
                      />
                    </label>
                    <button className="text-button" type="submit">
                      Save price <Check size={16} />
                    </button>
                  </form>
                ))}
              </div>
            </>
          )}
          {tab === "reports" && (
            <>
              <div className="toolbar">
                <p className="muted">
                  Calculated from your current demo bookings.
                </p>
                <label className="report-select">
                  Period
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                  >
                    <option>All sample dates</option>
                    <option>Completed jobs only</option>
                  </select>
                </label>
              </div>
              {(() => {
                const data =
                  reportPeriod === "Completed jobs only" ? completed : jobs;
                const sum = data.reduce((a, j) => a + j.value, 0);
                return (
                  <>
                    <div className="stats-grid three">
                      {[
                        {
                          label: "Bookings",
                          value: data.length,
                          tone: "lilac",
                        },
                        {
                          label: "Booking value",
                          value: money(sum),
                          tone: "mint",
                        },
                        {
                          label: "Average job value",
                          value: money(data.length ? sum / data.length : 0),
                          tone: "yellow",
                        },
                      ].map((s) => (
                        <div
                          className={`stat-card clay pattern-card ${s.tone}`}
                          key={s.label}
                        >
                          <div>{s.label}</div>
                          <strong>{s.value}</strong>
                          <p>{reportPeriod}</p>
                        </div>
                      ))}
                    </div>
                    <section className="panel report-panel">
                      <div className="panel-title">
                        <h2>Booking value by area</h2>
                        <span className="subtle-tag">NGN</span>
                      </div>
                      <div className="report-bars">
                        {Array.from(new Set(data.map((j) => j.area))).map(
                          (area) => {
                            const v = data
                              .filter((j) => j.area === area)
                              .reduce((a, j) => a + j.value, 0);
                            return (
                              <div key={area}>
                                <span>{area}</span>
                                <div className="bar-track">
                                  <i
                                    style={{
                                      width: `${(v / Math.max(sum, 1)) * 100}%`,
                                    }}
                                  />
                                </div>
                                <strong>{money(v)}</strong>
                              </div>
                            );
                          },
                        )}
                      </div>
                      <p className="panel-footnote">
                        Values come from illustrative bookings and are not live
                        business results.
                      </p>
                    </section>
                    <section className="panel">
                      <div className="panel-title">
                        <h2>Booking breakdown</h2>
                        <button
                          className="text-button"
                          onClick={() =>
                            exportCSV("fixit-report.csv", [
                              ["Area", "Service", "Status", "Value"],
                              ...data.map((j) => [
                                j.area,
                                j.service,
                                j.status,
                                j.value,
                              ]),
                            ])
                          }
                        >
                          Download this view <Download size={16} />
                        </button>
                      </div>
                      {jobTable(data)}
                    </section>
                  </>
                );
              })()}
            </>
          )}
          {tab === "settings" && (
            <div className="settings-grid">
              <form
                className="panel settings-form form-stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  setSettings({
                    name: String(f.get("name")),
                    email: String(f.get("email")),
                    city: String(f.get("city")),
                    emailAlerts: f.has("emailAlerts"),
                    pushAlerts: f.has("pushAlerts"),
                  });
                  setNotice("Your demo preferences have been saved.");
                }}
              >
                <div className="panel-title">
                  <h2>Your profile & preferences</h2>
                </div>
                <div className="profile-preview">
                  <span className="person-avatar blue">
                    {settings.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{settings.name}</strong>
                    <p>Demo workspace administrator</p>
                  </div>
                </div>
                <label>
                  Full name
                  <input name="name" required defaultValue={settings.name} />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={settings.email}
                  />
                </label>
                <label>
                  Default city
                  <select name="city" defaultValue={settings.city}>
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Port Harcourt</option>
                  </select>
                </label>
                <hr />
                <h3>Notification preferences</h3>
                <label className="toggle-row">
                  <span>
                    <strong>Email updates</strong>
                    <small>Job activity and new applications</small>
                  </span>
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    defaultChecked={settings.emailAlerts}
                  />
                </label>
                <label className="toggle-row">
                  <span>
                    <strong>Workspace notifications</strong>
                    <small>Important updates while you work</small>
                  </span>
                  <input
                    type="checkbox"
                    name="pushAlerts"
                    defaultChecked={settings.pushAlerts}
                  />
                </label>
                <p className="muted small-text">
                  Preview preferences are stored locally. Email and push
                  delivery are not connected.
                </p>
                <button className="button button-blue">
                  Save preferences <Check size={17} />
                </button>
              </form>
              <div>
                <div className="panel settings-note">
                  <ShieldCheck className="blue-text" size={30} />
                  <h3>Your workspace, clearly.</h3>
                  <p>
                    This is a separate operations interface with illustrative
                    data. A production admin account must be authorised by your
                    backend.
                  </p>
                  <Link href="/login/" className="text-button">
                    Go to secure sign-in <ArrowUpRight size={17} />
                  </Link>
                </div>
                <div className="panel settings-note">
                  <h3>Start fresh</h3>
                  <p>
                    Restore the original sample jobs, artisans, payouts and
                    cases in this browser.
                  </p>
                  <button
                    className="button button-white"
                    onClick={() => {
                      setSelected("reset");
                      setModal("detail");
                    }}
                  >
                    Reset demo data
                  </button>
                </div>
              </div>
            </div>
          )}
          <footer className="dashboard-footer">
            <span>
              © {new Date().getFullYear()} Fix-it · Everyday repairs. Expert
              hands.
            </span>
            <Link href="/">
              Back to the good stuff <ArrowUpRight size={15} />
            </Link>
          </footer>
        </main>
      </div>
      <nav
        className="mobile-bottom-nav"
        aria-label="Quick dashboard navigation"
      >
        {tabs
          .filter((t) =>
            ["overview", "jobs", "artisans", "payments"].includes(t.key),
          )
          .map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => go(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
            >
              <t.icon size={20} />
              <span>
                {t.key === "jobs"
                  ? "Jobs"
                  : t.key === "payments"
                    ? "Money"
                    : t.name}
              </span>
            </button>
          ))}
      </nav>
      {notice && (
        <div className="toast" role="status">
          <CircleCheckIcon />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}
      {modal === "job" && (
        <Modal title="Create a repair job" onClose={() => setModal(null)}>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const j: Job = {
                id: `FX-${Date.now().toString().slice(-6)}`,
                service: String(f.get("service")),
                customer: String(f.get("customer")),
                area: String(f.get("area")),
                value: Number(f.get("value")),
                date: String(f.get("date")),
                artisan: "Unassigned",
                status: "Unassigned",
              };
              setJobs([j, ...jobs]);
              setModal(null);
              setNotice(`${j.id} created. Ready to find a helping hand.`);
              go("jobs");
            }}
          >
            <p className="muted">
              A sample job for this browser’s demo workspace.
            </p>
            <label>
              Customer name
              <input name="customer" required placeholder="Full name" />
            </label>
            <label>
              Repair / service
              <input
                name="service"
                required
                placeholder="e.g. AC not cooling"
                list="job-services"
              />
              <datalist id="job-services">
                {services.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </datalist>
            </label>
            <div className="form-grid">
              <label>
                Area
                <input name="area" required placeholder="e.g. Lekki" />
              </label>
              <label>
                Quoted value (NGN)
                <input
                  name="value"
                  type="number"
                  min="0"
                  required
                  placeholder="18000"
                />
              </label>
            </div>
            <label>
              Preferred date
              <input
                type="date"
                name="date"
                required
                min={new Date().toISOString().slice(0, 10)}
              />
            </label>
            <button className="button button-blue">
              Create demo job <Plus size={17} />
            </button>
          </form>
        </Modal>
      )}
      {modal === "artisan" && selectedArtisan && (
        <Modal
          title={
            selectedArtisan.status === "Pending"
              ? "Review application"
              : "Artisan profile"
          }
          onClose={() => setModal(null)}
        >
          <div className="application-profile">
            <span className="person-avatar mint">
              {selectedArtisan.initials}
            </span>
            <div>
              <h3>{selectedArtisan.name}</h3>
              <p>
                {selectedArtisan.trade} · {selectedArtisan.area}
              </p>
              <Badge>{selectedArtisan.status}</Badge>
            </div>
          </div>
          <div className="verification-grid">
            {[
              "Identity check",
              "Trade certificate",
              "Bank account",
              "Work portfolio",
            ].map((x) => (
              <div key={x}>
                <ShieldCheck size={18} />
                <strong>{x}</strong>
                <small>Sample application · document not supplied</small>
              </div>
            ))}
          </div>
          <p className="form-notice">
            This is an interface preview. No real identity documents have been
            verified.
          </p>
          <label className="standalone-label">
            Review notes
            <textarea
              id="review-note"
              placeholder="Leave a note for this application…"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </label>
          <div className="modal-actions">
            {["Rejected", "More info requested", "Approved"].map((status) => (
              <button
                className={`button ${status === "Approved" ? "button-blue" : "button-white"}`}
                key={status}
                onClick={() => {
                  setReviewNotes({
                    ...reviewNotes,
                    [selectedArtisan.id]: reviewNote,
                  });
                  setArtisans(
                    artisans.map((a) =>
                      a.id === selectedArtisan.id ? { ...a, status } : a,
                    ),
                  );
                  setModal(null);
                  setNotice(`Application updated: ${status.toLowerCase()}.`);
                }}
              >
                {status === "Approved"
                  ? "Approve in demo"
                  : status === "Rejected"
                    ? "Reject"
                    : "Request info"}
              </button>
            ))}
          </div>
        </Modal>
      )}
      {modal === "detail" && (
        <Modal
          title={
            tab === "payments"
              ? "Review payout request"
              : tab === "disputes"
                ? "Review support case"
                : selected === "reset"
                  ? "Reset demo workspace?"
                  : "Repair job details"
          }
          onClose={() => setModal(null)}
        >
          {selected === "reset" ? (
            <>
              <p>
                Restore the sample data and clear your demo changes? This only
                affects this browser.
              </p>
              <div className="modal-actions">
                <button
                  className="button button-white"
                  onClick={() => setModal(null)}
                >
                  Keep my changes
                </button>
                <button
                  className="button button-blue"
                  onClick={() => {
                    setJobs(initialJobs);
                    setArtisans(initialArtisans);
                    setPayouts(seedPayouts);
                    setDisputes(seedDisputes);
                    setPricing(services.map((s) => s.price));
                    setReviewNotes({});
                    setResolutionNotes({});
                    setModal(null);
                    setNotice("Demo data restored.");
                  }}
                >
                  Reset sample data
                </button>
              </div>
            </>
          ) : tab === "payments" ? (
            (() => {
              const p = payouts[Number(selected)];
              return (
                <>
                  <div className="payout-review">
                    <span className="clay-icon mint">
                      <Wallet size={27} />
                    </span>
                    <h3>{money(p.value)}</h3>
                    <p>
                      {p.name} · {p.bank}
                    </p>
                  </div>
                  <div className="form-notice">
                    Sample payout only. Confirming updates the local approval
                    status and does not transfer funds.
                  </div>
                  {p.status === "Review" && (
                    <p className="form-notice">
                      Bank account details need review. In production, verify
                      these details before authorising payment.
                    </p>
                  )}
                  <button
                    className="button button-blue full-width"
                    onClick={() => {
                      setPayouts(
                        payouts.map((x, i) =>
                          i === Number(selected)
                            ? { ...x, status: "Approved" }
                            : x,
                        ),
                      );
                      setModal(null);
                      setNotice(
                        "Sample payout marked approved. No money was transferred.",
                      );
                    }}
                  >
                    Mark approved in demo <Check size={18} />
                  </button>
                </>
              );
            })()
          ) : tab === "disputes" ? (
            (() => {
              const d = disputes.find((d) => d.id === selected)!;
              return (
                <form
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setResolutionNotes({
                      ...resolutionNotes,
                      [d.id]: String(
                        new FormData(e.currentTarget).get("resolution"),
                      ),
                    });
                    setDisputes(
                      disputes.map((x) =>
                        x.id === d.id ? { ...x, status: "Resolved" } : x,
                      ),
                    );
                    setModal(null);
                    setNotice("Sample support case marked resolved.");
                  }}
                >
                  <span className="ref">
                    {d.id} · {d.job}
                  </span>
                  <h3>{d.title}</h3>
                  <p>{d.customer} has asked for help with this repair.</p>
                  <label>
                    Resolution note
                    <textarea
                      name="resolution"
                      required
                      minLength={10}
                      placeholder="Explain how this case has been resolved…"
                    />
                  </label>
                  <button className="button button-blue">
                    Mark resolved <Check size={17} />
                  </button>
                </form>
              );
            })()
          ) : selectedJob ? (
            <>
              <div className="job-detail-heading">
                <span className="ref">{selectedJob.id}</span>
                <Badge>{selectedJob.status}</Badge>
                <h3>{selectedJob.service}</h3>
                <p>
                  {selectedJob.customer} · {selectedJob.area}
                </p>
              </div>
              <div className="job-detail-info">
                <span>
                  Quoted value<strong>{money(selectedJob.value)}</strong>
                </span>
                <span>
                  Preferred date<strong>{selectedJob.date}</strong>
                </span>
              </div>
              <form
                className="form-stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const artisan = String(f.get("artisan"));
                  const status = String(f.get("status"));
                  if (artisan === "Unassigned" && status !== "Unassigned") {
                    setNotice(
                      "Choose an artisan before changing the job status.",
                    );
                    return;
                  }
                  setJobs(
                    jobs.map((j) =>
                      j.id === selectedJob.id
                        ? {
                            ...j,
                            artisan,
                            status:
                              artisan !== "Unassigned" &&
                              status === "Unassigned"
                                ? "Scheduled"
                                : status,
                          }
                        : j,
                    ),
                  );
                  setModal(null);
                  setNotice("Repair job updated in your demo workspace.");
                }}
              >
                <label>
                  Assign an artisan
                  <select name="artisan" defaultValue={selectedJob.artisan}>
                    <option>Unassigned</option>
                    {artisans
                      .filter((a) => a.status === "Approved")
                      .map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name} · {a.trade}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Job status
                  <select name="status" defaultValue={selectedJob.status}>
                    {[
                      "Unassigned",
                      "Scheduled",
                      "On the way",
                      "In progress",
                      "Completed",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <button className="button button-blue">
                  Save job changes <Check size={17} />
                </button>
              </form>
            </>
          ) : (
            <p>Choose a record to view its details.</p>
          )}
        </Modal>
      )}
    </div>
  );
}
function MapPinIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}
function CircleCheckIcon() {
  return (
    <span className="check-disc">
      <Check size={17} />
    </span>
  );
}
