import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  History,
  ShieldAlert,
  Users,
} from "lucide-react";
import api from "../services/api";

type Insight = {
  type: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  historical_deals?: string[];
  historical_outcomes?: {
    won?: number;
    lost?: number;
    stalled?: number;
  };
  hindsight_memories?: string[];
};

export default function Hindsight() {
  const [dealId, setDealId] = useState("4");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [historicalCount, setHistoricalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHindsight = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        `/api/deals/${dealId}/hindsight`
      );

      setInsights(response.data.insights || []);

      setHistoricalCount(
        response.data.historical_deal_count || 0
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load Hindsight intelligence."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHindsight();
  }, []);

  /* Separate Hindsight Alerts from normal insights */
  const alerts: Insight[] = insights.filter(
    (insight) =>
      insight.type.toLowerCase() === "hindsight alert"
  );

  const normalInsights: Insight[] = insights.filter(
    (insight) =>
      insight.type.toLowerCase() !== "hindsight alert"
  );

  /* Collect unique memories retrieved from Hindsight */
  const allMemories: string[] = Array.from(
    new Set(
      insights.flatMap(
        (insight) =>
          insight.hindsight_memories || []
      )
    )
  );

  const getIcon = (type: string) => {
    const value = type.toLowerCase();

    if (value.includes("security")) {
      return <ShieldAlert size={22} />;
    }

    if (value.includes("stakeholder")) {
      return <Users size={22} />;
    }

    if (value.includes("historical")) {
      return <History size={22} />;
    }

    if (value.includes("memory")) {
      return <Brain size={22} />;
    }

    return <AlertTriangle size={22} />;
  };

  const getImpactClass = (impact: string) => {
    const value = impact.toLowerCase();

    if (value === "critical") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    if (value === "high") {
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    }

    if (value === "medium") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }

    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Brain
                size={26}
                className="text-indigo-400"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Hindsight Intelligence
              </h1>

              <p className="text-slate-400 mt-1">
                Learn from historical deals before making the next decision.
              </p>
            </div>

          </div>

          <div className="flex gap-3">

            <input
              value={dealId}
              onChange={(e) =>
                setDealId(e.target.value)
              }
              className="w-24 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 outline-none focus:border-indigo-500"
              placeholder="Deal ID"
            />

            <button
              onClick={loadHindsight}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition font-medium"
            >
              {loading
                ? "Analyzing..."
                : "Analyze Deal"}
            </button>

          </div>

        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-400">
              Historical Deals
            </p>

            <p className="text-3xl font-bold mt-2">
              {historicalCount}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Compared with current deal
            </p>

          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-400">
              Intelligence Signals
            </p>

            <p className="text-3xl font-bold mt-2">
              {insights.length}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Patterns and alerts identified
            </p>

          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-400">
              Memory Engine
            </p>

            <div className="flex items-center gap-2 mt-3">

              <CheckCircle2
                size={20}
                className="text-emerald-400"
              />

              <span className="text-emerald-400 font-medium">
                Hindsight Connected
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-2">
              Historical memory actively retrieved
            </p>

          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* HINDSIGHT MEMORY */}
        {allMemories.length > 0 && (
          <div className="mb-8">

            <div className="flex items-center gap-3 mb-4">

              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Brain
                  size={22}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Hindsight Memory
                </h2>

                <p className="text-sm text-slate-400">
                  Historical knowledge recalled from the Hindsight memory engine.
                </p>
              </div>

              <span className="ml-auto px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                {allMemories.length} memories
              </span>

            </div>

            <div className="bg-slate-900/70 border border-indigo-500/20 rounded-2xl p-5">

              <div className="space-y-3">

                {allMemories.map(
                  (memory, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800"
                    >

                      <div className="mt-0.5 shrink-0">
                        <Brain
                          size={18}
                          className="text-indigo-400"
                        />
                      </div>

                      <p className="text-sm text-slate-300 leading-6">
                        {memory}
                      </p>

                    </div>
                  )
                )}

              </div>

              <div className="mt-5 pt-4 border-t border-slate-800">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  <span className="text-xs text-emerald-400 font-medium">
                    Retrieved from Hindsight Cloud
                  </span>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* HINDSIGHT ALERTS */}
        {alerts.length > 0 && (
          <div className="mb-8">

            <div className="flex items-center gap-3 mb-4">

              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle
                  size={22}
                  className="text-red-400"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Hindsight Alerts
                </h2>

                <p className="text-sm text-slate-400">
                  Important warnings discovered from historical deal memory.
                </p>
              </div>

              <span className="ml-auto px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {alerts.length} alerts
              </span>

            </div>

            <div className="space-y-4">

              {alerts.map(
                (alert, index) => (

                  <div
                    key={index}
                    className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6"
                  >

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div className="flex gap-4">

                        <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                          <AlertTriangle size={22} />
                        </div>

                        <div>

                          <p className="text-xs uppercase tracking-wider text-red-400 font-semibold">
                            Hindsight Alert
                          </p>

                          <h3 className="text-xl font-semibold mt-1">
                            {alert.title}
                          </h3>

                        </div>

                      </div>

                      <span
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${getImpactClass(
                          alert.impact
                        )}`}
                      >
                        {alert.impact} Impact
                      </span>

                    </div>

                    <p className="text-slate-300 leading-7 mt-5">
                      {alert.description}
                    </p>

                    <div className="mt-5 p-4 rounded-xl bg-red-500/5 border border-red-500/10">

                      <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-2">
                        Recommended Action
                      </p>

                      <p className="text-slate-200 leading-6">
                        {alert.recommendation}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>
        )}

        {/* NORMAL INSIGHTS */}
        {normalInsights.length > 0 && (
          <div className="space-y-5">

            {normalInsights.map(
              (insight, index) => (

                <div
                  key={index}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div className="flex gap-4">

                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">

                        {getIcon(insight.type)}

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                          {insight.type}
                        </p>

                        <h2 className="text-xl font-semibold mt-1">
                          {insight.title}
                        </h2>

                      </div>

                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${getImpactClass(
                        insight.impact
                      )}`}
                    >
                      {insight.impact} Impact
                    </span>

                  </div>

                  <div className="mt-5">

                    <p className="text-slate-300 leading-7">
                      {insight.description}
                    </p>

                  </div>

                  <div className="mt-5 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">

                    <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-2">
                      Recommended Action
                    </p>

                    <p className="text-slate-200 leading-6">
                      {insight.recommendation}
                    </p>

                  </div>

                  {/* HISTORICAL OUTCOMES */}
                  {insight.historical_outcomes &&
                    Object.keys(
                      insight.historical_outcomes
                    ).length > 0 && (

                      <div className="mt-5">

                        <p className="text-sm font-semibold mb-3">
                          Historical Outcomes
                        </p>

                        <div className="flex flex-wrap gap-3">

                          <span className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
                            Won:{" "}
                            {insight.historical_outcomes.won || 0}
                          </span>

                          <span className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm">
                            Lost:{" "}
                            {insight.historical_outcomes.lost || 0}
                          </span>

                          <span className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm">
                            Stalled:{" "}
                            {insight.historical_outcomes.stalled || 0}
                          </span>

                        </div>

                      </div>
                    )}

                  {/* SIMILAR HISTORICAL DEALS */}
                  {insight.historical_deals &&
                    insight.historical_deals.length > 0 && (

                      <div className="mt-5">

                        <p className="text-sm font-semibold mb-3">
                          Similar Historical Deals
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {insight.historical_deals.map(
                            (company, companyIndex) => (

                              <span
                                key={companyIndex}
                                className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm"
                              >
                                {company}
                              </span>

                            )
                          )}

                        </div>

                      </div>
                    )}

                  {/* RETRIEVED MEMORIES */}
                  {insight.hindsight_memories &&
                    insight.hindsight_memories.length > 0 && (

                      <div className="mt-5">

                        <p className="text-sm font-semibold mb-3">
                          Retrieved Hindsight Memories
                        </p>

                        <div className="space-y-2">

                          {insight.hindsight_memories.map(
                            (memory, memoryIndex) => (

                              <div
                                key={memoryIndex}
                                className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-400"
                              >
                                {memory}
                              </div>

                            )
                          )}

                        </div>

                      </div>
                    )}

                </div>

              )
            )}

          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-16">

            <div className="w-10 h-10 mx-auto border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />

            <p className="text-slate-400 mt-4">
              Searching historical deal memory...
            </p>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          insights.length === 0 &&
          !error && (

            <div className="text-center py-20">

              <Brain
                size={40}
                className="mx-auto text-slate-600"
              />

              <h3 className="text-lg font-semibold mt-4">
                No hindsight insights yet
              </h3>

              <p className="text-slate-500 mt-2">
                Analyze a deal to retrieve historical intelligence.
              </p>

            </div>
          )}

      </div>
    </div>
  );
}