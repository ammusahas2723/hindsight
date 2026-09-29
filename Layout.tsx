
import { useState } from "react";
import {
  BarChart3,
  Brain,
  FileSearch,
  Gauge,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShieldAlert,
  Users,
  ArrowUp,
  History,
  FileBarChart,
  ChevronDown,
  Settings,
  User,
  Zap,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navigation = [
  {
    section: "Workspace",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Deals",
        path: "/deals",
        icon: BarChart3,
      },
    ],
  },
  {
    section: "Deal Intelligence",
    items: [
      {
        name: "Intelligence Reports",
        path: "/reports",
        icon: FileBarChart,
      },
      {
        name: "Hindsight",
        path: "/hindsight",
        icon: History,
      },
      {
        name: "Deal Memory",
        path: "/memory",
        icon: Brain,
      },
      {
        name: "Risk Center",
        path: "/risk",
        icon: ShieldAlert,
      },
      {
        name: "Stakeholders",
        path: "/stakeholders",
        icon: Users,
      },
      {
        name: "What Changed?",
        path: "/changes",
        icon: ArrowUp,
      },
    ],
  },
  {
    section: "AI Tools",
    items: [
      {
        name: "AI Assistant",
        path: "/assistant",
        icon: MessageSquare,
      },
      {
        name: "What-If Simulator",
        path: "/simulator",
        icon: Gauge,
      },
      {
        name: "Proposal Analyzer",
        path: "/proposal-analyzer",
        icon: FileSearch,
      },
      {
        name: "Analyze Deal",
        path: "/analyze",
        icon: Zap,
      },
    ],
  },
];

function Layout() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("dealmind_user") || "null"
  );

  const userName = user?.name || "DealMind User";
  const userEmail = user?.email || "Sales Intelligence";
  const initial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("dealmind_token");
    localStorage.removeItem("dealmind_user");

    setProfileOpen(false);
    navigate("/dashboard");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* MOBILE HEADER */}

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">

        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Brain size={19} />
          </div>

          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">
              DealMind
            </p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400">
              Intelligence
            </p>
          </div>
        </button>

        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
        >
          {initial}
        </button>

      </header>


      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}


      {/* SIDEBAR */}

      <aside
        className={`
          fixed left-0 top-0 z-[70] flex h-screen w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:z-40 lg:w-64 lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">

          <button
            onClick={() => {
              navigate("/dashboard");
              closeMobileMenu();
            }}
            className="flex items-center text-left"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Brain size={21} />
            </div>

            <div className="ml-3">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                DealMind
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Deal Intelligence
              </p>
            </div>

          </button>

          <button
            onClick={closeMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={19} />
          </button>

        </div>


        {/* AI STATUS */}

        <div className="mx-4 mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Sparkles size={17} />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-xs font-semibold text-slate-800">
                Intelligence Active
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-500">
                  Hindsight connected
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          {navigation.map((group) => (

            <div
              key={group.section}
              className="mb-7"
            >

              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {group.section}
              </p>

              <div className="space-y-1">

                {group.items.map((item) => {

                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >

                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            strokeWidth={isActive ? 2.2 : 1.9}
                          />

                          <span className="flex-1">
                            {item.name}
                          </span>

                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </>
                      )}

                    </NavLink>
                  );

                })}

              </div>

            </div>

          ))}

        </nav>


        {/* USER CARD */}

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initial}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-slate-800">
                {userName}
              </p>

              <p className="truncate text-xs text-slate-400">
                {userEmail}
              </p>

            </div>

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="text-slate-400 hover:text-slate-700"
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

          </div>

        </div>

      </aside>


      {/* MAIN AREA */}

      <main className="min-h-screen lg:ml-64">

        {/* DESKTOP TOP BAR */}

        <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

          <div>

            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Sales Intelligence Workspace
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              AI-powered deal visibility and historical intelligence
            </p>

          </div>


          <div className="relative">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {initial}
              </div>

              <div className="text-left">

                <p className="text-sm font-semibold text-slate-800">
                  {userName}
                </p>

                <p className="text-xs text-slate-400">
                  {userEmail}
                </p>

              </div>

              <ChevronDown
                size={17}
                className={`text-slate-400 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />

            </button>


            {/* PROFILE DROPDOWN */}

            {profileOpen && (

              <div className="absolute right-0 top-14 z-[100] w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                <div className="mb-2 border-b border-slate-100 px-3 py-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
                      {initial}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {userName}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {userEmail}
                      </p>

                    </div>

                  </div>

                </div>


                <button
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <User size={17} />
                  Profile
                </button>


                <button
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <Settings size={17} />
                  Settings
                </button>


                <div className="my-2 border-t border-slate-100" />


                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Exit Workspace
                </button>

              </div>

            )}

          </div>

        </header>


        {/* MOBILE CONTENT SPACING */}

        <div className="pt-16 lg:pt-0">

          <Outlet />

        </div>

      </main>

    </div>
  );
}

export default Layout;

