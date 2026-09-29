
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Deals from "./pages/AnalyzeDeal";
import NewDeals from "./pages/Deals";
import DealWorkspace from "./pages/DealWorkspace";

import Memory from "./pages/Memory";
import RiskCenter from "./pages/RiskCenter";
import Reports from "./pages/Reports";
import Stakeholders from "./pages/Stakeholders";
import Changes from "./pages/Changes";
import Assistant from "./pages/Assistant";
import Simulator from "./pages/Simulator";
import ProposalAnalyzer from "./pages/ProposalAnalyzer";
import AnalyzeDeal from "./pages/AnalyzeDeal";
import Hindsight from "./pages/Hindsight";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

          {/* Main */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/deals"
            element={<Deals />}
          />

          <Route
            path="/deals/new"
            element={<NewDeals />}
          />

          <Route
            path="/deals/:id"
            element={<DealWorkspace />}
          />

          {/* Intelligence */}
          <Route
            path="/memory"
            element={<Memory />}
          />

          <Route
            path="/risk"
            element={<RiskCenter />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/stakeholders"
            element={<Stakeholders />}
          />

          <Route
            path="/changes"
            element={<Changes />}
          />

          <Route
            path="/hindsight"
            element={<Hindsight />}
          />

          {/* AI Tools */}
          <Route
            path="/assistant"
            element={<Assistant />}
          />

          <Route
            path="/simulator"
            element={<Simulator />}
          />

          <Route
            path="/proposal-analyzer"
            element={<ProposalAnalyzer />}
          />

          <Route
            path="/analyze"
            element={<AnalyzeDeal />}
          />

        </Route>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

