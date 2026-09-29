import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getDeals,
  getDealHindsight,
  getDealChanges,
} from "../services/api";

interface Deal {
  id: number;
  company: string;
  product: string;
  value: string;
  health: string;
  stage: string;
  source_text?: string;
}

interface HindsightInsight {
  type: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  historical_deals?: string[];
  hindsight_memories?: string[];
}

interface DealIntelligence {
  deal: Deal;
  hindsight: HindsightInsight[];
  changes: any[];
}

function Dashboard() {
  const navigate = useNavigate();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [intelligence, setIntelligence] = useState<
    DealIntelligence[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDeals();

      const dealList: Deal[] = Array.isArray(data)
        ? data
        : data.deals || [];

      setDeals(dealList);

      const intelligenceResults =
        await Promise.all(
          dealList.map(async (deal) => {
            try {
              const [hindsightResponse, changesResponse] =
                await Promise.all([
                  getDealHindsight(deal.id),
                  getDealChanges(deal.id),
                ]);

              return {
                deal,
                hindsight:
                  hindsightResponse?.insights || [],
                changes:
                  changesResponse?.changes || [],
              };
            } catch (error) {
              console.error(
                `Failed intelligence for deal ${deal.id}:`,
                error
              );

              return {
                deal,
                hindsight: [],
                changes: [],
              };
            }
          })
        );

      setIntelligence(intelligenceResults);
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  /* ---------------- REAL METRICS ---------------- */

  const metrics = useMemo(() => {
    let pipelineValue = 0;

    deals.forEach((deal) => {
      const numericValue = Number(
        String(deal.value)
          .replace(/[$,\s]/g, "")
          .replace(/K/i, "000")
          .replace(/M/i, "000000")
      );

      if (!Number.isNaN(numericValue)) {
        pipelineValue += numericValue;
      }
    });

    const activeDeals = deals.filter(
      (deal) =>
        !deal.stage
          ?.toLowerCase()
          .includes("closed")
    ).length;

    const riskDeals = deals.filter((deal) => {
      const health =
        deal.health?.toLowerCase() || "";

      return (
        health.includes("risk") ||
        health.includes("attention") ||
        health.includes("danger")
      );
    }).length;

    const allInsights =
      intelligence.flatMap(
        (item) => item.hindsight
      );

    const alerts = allInsights.filter(
      (insight) =>
        insight.type
          ?.toLowerCase()
          .includes("hindsight alert")
    );

    return {
      pipelineValue,
      activeDeals,
      riskDeals,
      alerts: alerts.length,
      allInsights,
    };
  }, [deals, intelligence]);

  /* ---------------- PRIORITY DEALS ---------------- */

  const priorityDeals = useMemo(() => {
    const riskWords = [
      "risk",
      "attention",
      "danger",
      "critical",
      "blocker",
    ];

    return [...deals]
      .sort((a, b) => {
        const aRisk = riskWords.some((word) =>
          a.health?.toLowerCase().includes(word)
        );

        const bRisk = riskWords.some((word) =>
          b.health?.toLowerCase().includes(word)
        );

        return Number(bRisk) - Number(aRisk);
      })
      .slice(0, 5);
  }, [deals]);

  /* ---------------- HINDSIGHT ALERTS ---------------- */

  const hindsightAlerts = useMemo(() => {
    return intelligence.flatMap((item) =>
      item.hindsight
        .filter((insight) =>
          insight.type
            ?.toLowerCase()
            .includes("hindsight alert")
        )
        .map((insight) => ({
          ...insight,
          deal: item.deal,
        }))
    );
  }, [intelligence]);

  /* ---------------- RECENT CHANGES ---------------- */

  const recentChanges = useMemo(() => {
    return intelligence
      .flatMap((item) =>
        item.changes.map((change: any) => ({
          ...change,
          deal: item.deal,
        }))
      )
      .slice(0, 5);
  }, [intelligence]);

  /* ---------------- NEXT ACTIONS ---------------- */

  const nextActions = useMemo(() => {
    return hindsightAlerts
      .filter(
        (item) => item.recommendation
      )
      .slice(0, 4);
  }, [hindsightAlerts]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw
            size={20}
            className="animate-spin"
          />
          Loading Deal Intelligence...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <p className="text-sm text-slate-400">
              Deal Intelligence Dashboard
            </p>

            <h1 className="text-3xl font-bold mt-1 text-white">
              Deal Command Center
            </h1>

            <p className="text-slate-400 mt-2">
              Understand what is happening across your
              deals and what needs attention.
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="border border-slate-700 bg-slate-900 text-slate-200 px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              onClick={() => navigate("/analyze")}
              className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition"
            >
              <Brain size={18} />
              Analyze New Deal
            </button>

          </div>

        </div>

        {/* OVERVIEW CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <MetricCard
            icon={<DollarSign size={19} />}
            label="Pipeline Value"
            value={formatCurrency(
              metrics.pipelineValue
            )}
            change="From active deal records"
          />

          <MetricCard
            icon={<Target size={19} />}
            label="Active Deals"
            value={String(
              metrics.activeDeals
            )}
            change={`${deals.length} total deals`}
          />

          <MetricCard
            icon={<ShieldAlert size={19} />}
            label="Deals at Risk"
            value={String(
              metrics.riskDeals
            )}
            change={`${metrics.alerts} Hindsight alerts`}
            danger={
              metrics.riskDeals > 0 ||
              metrics.alerts > 0
            }
          />

          <MetricCard
            icon={<TrendingUp size={19} />}
            label="Hindsight Insights"
            value={String(
              metrics.allInsights.length
            )}
            change="Historical intelligence"
          />

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* PRIORITY DEALS */}

          <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-800 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">
                  Priority Deals
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Deals requiring attention based on
                  current health and intelligence.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/deals")
                }
                className="text-sm text-slate-300 font-medium flex items-center gap-1 hover:text-white transition"
              >
                View all
                <ArrowRight size={15} />
              </button>

            </div>

            <div className="divide-y divide-slate-800">

              {priorityDeals.length === 0 ? (

                <EmptyState text="No deals available yet." />

              ) : (

                priorityDeals.map((deal) => {

                  const health =
                    deal.health?.toLowerCase() ||
                    "";

                  const healthType =
                    health.includes("risk") ||
                    health.includes("attention")
                      ? "danger"
                      : health.includes(
                          "moderate"
                        )
                      ? "warning"
                      : "success";

                  return (
                    <button
                      key={deal.id}
                      onClick={() =>
                        navigate(
                          `/deals/${deal.id}`
                        )
                      }
                      className="w-full p-5 flex items-center justify-between hover:bg-slate-800/50 transition text-left"
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-slate-200">
                          {deal.company
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="font-semibold text-white">
                            {deal.company}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {deal.product}
                          </p>

                          <div className="flex items-center gap-3 mt-2">

                            <span className="text-xs text-slate-500">
                              {deal.stage}
                            </span>

                            <span className="text-xs text-slate-600">
                              •
                            </span>

                            <span className="text-xs text-slate-400">
                              {deal.health}
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-white">
                          {deal.value}
                        </p>

                        <Status
                          text={deal.health}
                          type={healthType}
                        />

                      </div>

                    </button>
                  );
                })
              )}

            </div>

          </section>

          {/* RISK OVERVIEW */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center gap-2">

              <ShieldAlert
                size={19}
                className="text-indigo-400"
              />

              <h2 className="font-bold text-white">
                Deal Risk Overview
              </h2>

            </div>

            <p className="text-sm text-slate-400 mt-1">
              Current risk distribution.
            </p>

            <div className="mt-7 flex justify-center">

              <div className="relative w-40 h-40 rounded-full border-[18px] border-slate-800 flex items-center justify-center">

                <div className="text-center">

                  <p className="text-3xl font-bold text-white">
                    {metrics.riskDeals}
                  </p>

                  <p className="text-xs text-slate-500">
                    At Risk
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-4 mt-7">

              <RiskRow
                label="High Risk"
                value={String(
                  hindsightAlerts.filter(
                    (item) =>
                      item.impact
                        ?.toLowerCase()
                        .includes("critical") ||
                      item.impact
                        ?.toLowerCase()
                        .includes("high")
                  ).length
                )}
                width="75%"
              />

              <RiskRow
                label="Medium Risk"
                value={String(
                  deals.filter((deal) =>
                    deal.health
                      ?.toLowerCase()
                      .includes("moderate")
                  ).length
                )}
                width="50%"
              />

              <RiskRow
                label="Healthy"
                value={String(
                  deals.filter((deal) =>
                    deal.health
                      ?.toLowerCase()
                      .includes("healthy")
                  ).length
                )}
                width="80%"
              />

            </div>

            <button
              onClick={() =>
                navigate("/risk")
              }
              className="w-full mt-6 border border-slate-700 rounded-xl py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
            >
              Open Risk Center
            </button>

          </section>

        </div>

        {/* HINDSIGHT ALERTS */}

        {hindsightAlerts.length > 0 && (

          <section className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mt-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">

                <AlertTriangle
                  size={22}
                  className="text-amber-400"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-white">
                  Hindsight Alerts
                </h2>

                <p className="text-sm text-slate-400">
                  Historical patterns that may require
                  attention in current deals.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

              {hindsightAlerts
                .slice(0, 4)
                .map((item, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      navigate(
                        `/deals/${item.deal.id}`
                      )
                    }
                    className="text-left rounded-xl border border-amber-500/10 bg-slate-950/50 p-4 hover:bg-slate-900 transition"
                  >

                    <div className="flex items-start gap-3">

                      <ShieldAlert
                        size={18}
                        className="text-amber-400 mt-1"
                      />

                      <div>

                        <p className="text-xs text-amber-400">
                          {item.deal.company}
                        </p>

                        <h3 className="font-semibold mt-1">
                          {item.title}
                        </h3>

                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                          {item.description}
                        </p>

                      </div>

                    </div>

                  </button>

                ))}

            </div>

          </section>

        )}

        {/* WHAT CHANGED + NEXT ACTIONS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* WHAT CHANGED */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center gap-2">

              <Clock
                size={19}
                className="text-indigo-400"
              />

              <h2 className="text-xl font-bold text-white">
                What Changed?
              </h2>

            </div>

            <p className="text-sm text-slate-400 mt-1">
              Important changes detected across deal activity.
            </p>

            <div className="space-y-4 mt-6">

              {recentChanges.length === 0 ? (

                <EmptyState text="No recent changes detected." />

              ) : (

                recentChanges.map(
                  (change: any, index) => (

                    <ChangeItem
                      key={index}
                      company={
                        change.deal.company
                      }
                      text={
                        change.title ||
                        change.description ||
                        change.change ||
                        "Deal activity changed."
                      }
                      time={
                        change.time ||
                        change.created_at ||
                        "Recent"
                      }
                      icon={
                        <Clock size={17} />
                      }
                    />

                  )
                )

              )}

            </div>

            <button
              onClick={() =>
                navigate("/changes")
              }
              className="flex items-center gap-1 text-sm text-slate-300 font-medium mt-6 hover:text-white transition"
            >
              View All Changes
              <ArrowRight size={15} />
            </button>

          </section>

          {/* NEXT ACTIONS */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center gap-2">

              <Sparkles
                size={19}
                className="text-indigo-400"
              />

              <h2 className="text-xl font-bold text-white">
                Next Best Actions
              </h2>

            </div>

            <p className="text-sm text-slate-400 mt-1">
              Actions suggested from historical intelligence.
            </p>

            <div className="space-y-3 mt-6">

              {nextActions.length === 0 ? (

                <EmptyState text="No Hindsight actions available yet." />

              ) : (

                nextActions.map(
                  (item, index) => (

                    <ActionItem
                      key={index}
                      priority={
                        item.impact ||
                        "Recommended"
                      }
                      title={`${item.deal.company}: ${item.title}`}
                      description={
                        item.recommendation
                      }
                      onClick={() =>
                        navigate(
                          `/deals/${item.deal.id}`
                        )
                      }
                    />

                  )
                )

              )}

            </div>

            <button
              onClick={() =>
                navigate("/assistant")
              }
              className="flex items-center gap-1 text-sm text-slate-300 font-medium mt-6 hover:text-white transition"
            >
              Ask DealMind
              <ArrowRight size={15} />
            </button>

          </section>

        </div>

        {/* AI INSIGHT */}

        <section className="bg-slate-900 border border-indigo-500/20 text-white rounded-2xl p-6 mt-6">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">

              <Brain
                size={22}
                className="text-indigo-400"
              />

            </div>

            <div>

              <p className="text-xs text-indigo-400 uppercase tracking-wider">
                DealMind Intelligence
              </p>

              <h2 className="text-lg font-bold mt-1 text-white">
                {hindsightAlerts.length > 0
                  ? "Historical deal patterns are highlighting areas that need attention."
                  : "DealMind is continuously learning from your deal history."}
              </h2>

              <p className="text-sm text-slate-400 mt-2 leading-6 max-w-4xl">

                {hindsightAlerts.length > 0
                  ? `${hindsightAlerts.length} Hindsight alert${
                      hindsightAlerts.length === 1
                        ? ""
                        : "s"
                    } ${
                      hindsightAlerts.length === 1
                        ? "is"
                        : "are"
                    } currently connected to your active deal history. Open a deal to review the historical context and recommended action.`
                  : "As more deals, meetings, emails and documents are added, DealMind can recall historical patterns and surface relevant intelligence."}

              </p>

              <button
                onClick={() =>
                  navigate("/hindsight")
                }
                className="mt-4 flex items-center gap-2 text-sm text-indigo-400 font-medium hover:text-indigo-300 transition"
              >
                Explore Hindsight Intelligence
                <ChevronRight size={16} />
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


/* ---------------- HELPERS ---------------- */

function formatCurrency(
  value: number
) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(
      value / 1000
    )}K`;
  }

  return `$${value.toLocaleString()}`;
}


/* ---------------- COMPONENTS ---------------- */

function MetricCard({
  icon,
  label,
  value,
  change,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  danger?: boolean;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">

      <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-indigo-400">
        {icon}
      </div>

      <p className="text-sm text-slate-400 mt-5">
        {label}
      </p>

      <p className="text-2xl font-bold mt-1 text-white">
        {value}
      </p>

      <p
        className={`text-xs mt-2 ${
          danger
            ? "text-red-400"
            : "text-slate-500"
        }`}
      >
        {change}
      </p>

    </div>
  );
}


function Status({
  text,
  type,
}: {
  text: string;
  type: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20",

    warning:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

    success:
      "bg-green-500/10 text-green-400 border border-green-500/20",
  };

  return (
    <span
      className={`inline-block text-[11px] px-2.5 py-1 rounded-lg mt-2 ${
        styles[type] ||
        styles.warning
      }`}
    >
      {text}
    </span>
  );
}


function RiskRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>

      <div className="flex justify-between text-xs mb-2">

        <span className="text-slate-400">
          {label}
        </span>

        <span className="font-semibold text-slate-200">
          {value}
        </span>

      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

        <div
          className="h-full bg-indigo-500 rounded-full"
          style={{ width }}
        />

      </div>

    </div>
  );
}


function ChangeItem({
  company,
  text,
  time,
  icon,
}: {
  company: string;
  text: string;
  time: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">

      <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shrink-0 text-slate-300">
        {icon}
      </div>

      <div className="flex-1">

        <div className="flex justify-between gap-3">

          <p className="text-sm font-semibold text-white">
            {company}
          </p>

          <span className="text-[11px] text-slate-500">
            {time}
          </span>

        </div>

        <p className="text-xs text-slate-400 mt-1">
          {text}
        </p>

      </div>

    </div>
  );
}


function ActionItem({
  priority,
  title,
  description,
  onClick,
}: {
  priority: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border border-slate-800 rounded-xl p-4 hover:bg-slate-800/60 transition"
    >

      <div className="flex items-start justify-between gap-3">

        <div className="flex gap-3">

          <div className="mt-0.5 text-indigo-400">
            <CheckCircle2 size={17} />
          </div>

          <div>

            <p className="text-sm font-semibold text-white">
              {title}
            </p>

            <p className="text-xs text-slate-400 mt-1 leading-5">
              {description}
            </p>

          </div>

        </div>

        <span className="text-[10px] px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
          {priority}
        </span>

      </div>

    </button>
  );
}


function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

export default Dashboard;