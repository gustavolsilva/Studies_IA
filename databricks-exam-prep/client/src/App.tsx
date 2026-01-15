import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ModeSelection from "./pages/ModeSelection";
import ExamMode from "./pages/ExamMode";
import PracticeMode from "./pages/PracticeMode";
import HistoryPage from "./pages/HistoryPage";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/mode-selection"} component={ModeSelection} />
      <Route path={"/exam-mode"} component={ExamMode} />
      <Route path={"/practice-mode"} component={PracticeMode} />
      <Route path={"/history"} component={HistoryPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Databricks Brand Theme
// Light Mode: Oat Light (#F9F7F4) background with Navy (#0B2026) text and Lava (#FF3621) accents
// Dark Mode: Navy (#0B2026) background with Oat Light text and Lava accents
// Switchable theme with system preference detection

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="system"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
