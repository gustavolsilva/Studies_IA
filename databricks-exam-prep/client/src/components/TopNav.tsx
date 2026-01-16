import { Link, useLocation } from "wouter";

export default function TopNav() {
  const [location] = useLocation();
  return (
    <header
      aria-label="Top Navigation"
      className="bg-background border-b border-border sticky top-0 z-30"
    >
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-primary font-semibold">
          Databricks Exam Prep
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-4 text-sm">
            <li>
              <Link href="/mode-selection" className={"hover:underline " + (location === "/mode-selection" ? "text-primary font-semibold" : "")}>Simulados</Link>
            </li>
            <li>
              <Link href="/history" className={"hover:underline " + (location.startsWith("/history") ? "text-primary font-semibold" : "")}>Histórico</Link>
            </li>
            <li>
              <Link href="/compare" className={"hover:underline " + (location === "/compare" ? "text-primary font-semibold" : "")}>Comparar</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
