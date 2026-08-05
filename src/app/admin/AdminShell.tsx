"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Menu, Moon, Sun, X } from "lucide-react";
import { AdminNav } from "@/app/admin/AdminNav";
import { cn } from "@/lib/utils/cn";

const THEME_KEY = "luma-admin-theme";
const COLLAPSE_KEY = "luma-admin-sidebar-collapsed";

type AdminTheme = "light" | "dark";

interface AdminChromeContextValue {
  collapsed: boolean;
  theme: AdminTheme;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  toggleTheme: () => void;
}

const AdminChromeContext = createContext<AdminChromeContextValue | null>(null);

export function useAdminChrome() {
  const ctx = useContext(AdminChromeContext);
  if (!ctx) throw new Error("useAdminChrome must be used within AdminShell");
  return ctx;
}

interface AdminShellProps {
  email: string;
  children: ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  const [theme, setTheme] = useState<AdminTheme>("light");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const storedCollapse = localStorage.getItem(COLLAPSE_KEY);
    // Defer so we don't setState synchronously inside the effect body.
    const id = window.setTimeout(() => {
      if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
      if (storedCollapse === "1") setCollapsed(true);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed, hydrated]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);
  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    [],
  );

  const value = useMemo(
    () => ({
      collapsed,
      theme,
      mobileOpen,
      setMobileOpen,
      toggleCollapsed,
      toggleTheme,
    }),
    [collapsed, theme, mobileOpen, toggleCollapsed, toggleTheme],
  );

  return (
    <AdminChromeContext.Provider value={value}>
      <div
        className="admin-root flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-fg)]"
        data-theme={theme}
      >
        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)] transition-[width,transform] duration-200 ease-[var(--ease-out)]",
            "lg:static lg:translate-x-0",
            collapsed ? "lg:w-[4.5rem]" : "lg:w-60",
            mobileOpen ? "w-60 translate-x-0" : "w-60 -translate-x-full",
          )}
        >
          <div
            className={cn(
              "flex h-14 shrink-0 items-center gap-2 border-b border-[var(--admin-border)] px-3",
              collapsed && "lg:justify-center lg:px-2",
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-brand)] text-white">
              <AdminMark className="h-4 w-4" />
            </div>
            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
              <p className="truncate text-xs font-semibold tracking-wider text-[var(--admin-muted)] uppercase">
                Luma Admin
              </p>
              <p className="truncate text-xs font-medium text-[var(--admin-fg-secondary)]">
                {email}
              </p>
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 text-[var(--admin-muted)] hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-fg)] lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <AdminNav collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />

          <div className="mt-auto space-y-1 border-t border-[var(--admin-border)] p-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--admin-fg-secondary)] transition-colors hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-fg)]",
                collapsed && "lg:justify-center lg:px-0",
              )}
              title={theme === "light" ? "Switch to dark" : "Switch to light"}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              ) : (
                <Sun className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              )}
              <span className={cn(collapsed && "lg:hidden")}>
                {theme === "light" ? "Dark mode" : "Light mode"}
              </span>
            </button>

            <Link
              href="/breakpoint2026"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-fg)]",
                collapsed && "lg:justify-center lg:px-0",
              )}
              title="Back to event"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className={cn(collapsed && "lg:hidden")}>Back to event</span>
            </Link>

            <button
              type="button"
              onClick={toggleCollapsed}
              className={cn(
                "hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-fg)] lg:flex",
                collapsed && "justify-center px-0",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--admin-border)] text-[var(--admin-fg-secondary)] hover:bg-[var(--admin-surface-muted)] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="font-title text-base font-semibold tracking-tight text-[var(--admin-fg)] sm:text-lg">
              Dashboard
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--admin-border)] text-[var(--admin-fg-secondary)] transition-colors hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-fg)]"
                aria-label={
                  theme === "light" ? "Switch to dark mode" : "Switch to light mode"
                }
                title={theme === "light" ? "Dark mode" : "Light mode"}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Sun className="h-4 w-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </header>
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AdminChromeContext.Provider>
  );
}

function AdminMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 133 134"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67" />
    </svg>
  );
}
