
import { useEffect, useState } from "react";
import {
  FileBarChart,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Users,
  Target,
  History,
  ArrowRight,
  Brain,
  Loader2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import {
  getDeals,
  getIntelligenceReport,
} from "../services/api";

interface Deal {
  id: number;
  company: string;
  product: string;
  value: string;
  stage: string;
  health: string;
}

interface Report {
  success: boolean;

  deal: {
    id: number;
    company: string;
    product: string;
    value: string;
    stage: string;
    health: string;
    sentiment: string;
  };

  executive_summary: string;
  priority: string;

  metrics: {
    risk_count: number;
    high_risk_count: number;
    buying_signal_count: number;
    stakeholder_count: number;
    competitor_count: number;
    change_count: number;
    hindsight_count: number;
  };

  key_insights: string[];
  risks: any[];
  buying_signals: string[];
  pain_points: string[];
  stakeholders: any[];
  competitors: string[];
  urgency: string[];
  changes: any[];
  hindsight: any[];
  recommended_actions: string[];
  next_best_action: string;
}

export default function Reports() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);

  const [report, setReport] =
    useState<Report | null>(null);

  const [loadingDeals, setLoadingDeals] =
    useState(true);

  const [loadingReport, setLoadingReport] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoadingDeals(true);

      const data = await getDeals();

      setDeals(data);

      if (data.length > 0) {
        setSelectedDeal(data[0].id);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load deals. Make sure the backend is running."
      );
    } finally {
      setLoadingDeals(false);
    }
  };

  const generateReport = async () => {
    if (!selectedDeal) {
      setError("Please select a deal first.");
      return;
    }

    try {
      setLoadingReport(true);
      setError("");

      const data =
        await getIntelligenceReport(
          selectedDeal
        );

      setReport(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to generate the intelligence report."
      );
    } finally {
      setLoadingReport(false);
    }
  };

  const selectedDealData = deals.find(
    (deal) => deal.id === selectedDeal
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="mb-8">

          <div className="flex flex-wrap items-center gap-3 mb-4">

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
              <Sparkles size={15} />
              DealMind Intelligence
            </div>

            <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm">
              Executive Report
            </div>

          </div>

          <h1 className="text-3xl md:text-4xl font-bold">
            Intelligence Reports
          </h1>

          <p className="text-slate-400 mt-2 max-w-3xl">
            Generate a complete intelligence report from DealMind's
            deal memory, risks, stakeholders, competitive signals,
            changes and historical insights.
          </p>

        </div>

        {/* DEAL SELECTOR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-end gap-5">

            <div className="flex-1">

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Deal
              </label>

              <select
                value={selectedDeal ?? ""}
                onChange={(e) => {
                  setSelectedDeal(
                    Number(e.target.value)
                  );

                  setReport(null);
                  setError("");
                }}
                disabled={loadingDeals}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
              >
                {deals.map((deal) => (
                  <option
                    key={deal.id}
                    value={deal.id}
                  >
                    {deal.company} — {deal.product}
                  </option>
                ))}
              </select>

            </div>

            {selectedDealData && (
              <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-semibold">
                      {selectedDealData.company}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {selectedDealData.product}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {selectedDealData.value}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {selectedDealData.stage}
                    </p>
                  </div>

                </div>

              </div>
            )}

            <button
              type="button"
              onClick={generateReport}
              disabled={
                loadingReport ||
                loadingDeals ||
                !selectedDeal
              }
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-300 font-medium transition"
            >
              {loadingReport ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Generating...
                </>
              ) : (
                <>
                  <FileBarChart size={18} />
                  Generate Report
                </>
              )}
            </button>

          </div>

          {error && (
            <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

        </div>

        {/* EMPTY STATE */}
        {!report && !loadingReport && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-14 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-5">
              <FileBarChart
                size={30}
                className="text-slate-500"
              />
            </div>

            <h2 className="text-lg font-semibold text-slate-300">
              Generate a Deal Intelligence Report
            </h2>

            <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
              Select a deal above and DealMind will combine all
              available intelligence into one executive-ready report.
            </p>

          </div>
        )}

        {/* REPORT */}
        {report && (
          <div>

            {/* REPORT HEADER */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 mb-6">

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                <div>

                  <div className="flex items-center gap-3 mb-3">

                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <Brain size={22} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        {report.deal.company}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {report.deal.product}
                      </p>
                    </div>

                  </div>

                  <p className="text-sm text-slate-400 max-w-3xl leading-6">
                    {report.executive_summary}
                  </p>

                </div>

                <div className="flex flex-col items-start lg:items-end gap-2">

                  <span className="text-xs text-slate-500">
                    Deal Priority
                  </span>

                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      report.priority === "High"
                        ? "bg-red-500/10 text-red-300 border border-red-500/20"
                        : report.priority === "Medium"
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    }`}
                  >
                    {report.priority}
                  </span>

                </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                <Badge text={report.deal.stage} />

                <Badge text={report.deal.sentiment} />

                <Badge text={report.deal.health} />

                <Badge text={report.deal.value} />

              </div>

            </div>

            {/* METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">

              <Metric
                label="Risks"
                value={report.metrics.risk_count}
                icon={<ShieldAlert size={17} />}
              />

              <Metric
                label="High Risk"
                value={report.metrics.high_risk_count}
                icon={<AlertTriangle size={17} />}
              />

              <Metric
                label="Buying Signals"
                value={report.metrics.buying_signal_count}
                icon={<TrendingUp size={17} />}
              />

              <Metric
                label="Stakeholders"
                value={report.metrics.stakeholder_count}
                icon={<Users size={17} />}
              />

              <Metric
                label="Competitors"
                value={report.metrics.competitor_count}
                icon={<Target size={17} />}
              />

              <Metric
                label="Changes"
                value={report.metrics.change_count}
                icon={<RefreshCw size={17} />}
              />

              <Metric
                label="Hindsight"
                value={report.metrics.hindsight_count}
                icon={<History size={17} />}
              />

            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* KEY INSIGHTS */}
              <ReportCard
                title="Key Insights"
                subtitle="Important signals detected across the deal"
                icon={<Brain size={20} />}
                iconClass="text-purple-400 bg-purple-500/10"
              >
                {report.key_insights.length > 0 ? (
                  report.key_insights.map(
                    (item, index) => (
                      <Item
                        key={index}
                        text={item}
                      />
                    )
                  )
                ) : (
                  <Empty text="No major insights detected." />
                )}
              </ReportCard>

              {/* RISKS */}
              <ReportCard
                title="Risk Center"
                subtitle="Potential blockers requiring attention"
                icon={<ShieldAlert size={20} />}
                iconClass="text-red-400 bg-red-500/10"
              >
                {report.risks.length > 0 ? (
                  report.risks.map(
                    (risk, index) => (
                      <Item
                        key={index}
                        text={
                          risk.title ||
                          risk.description ||
                          String(risk)
                        }
                        danger
                      />
                    )
                  )
                ) : (
                  <Empty text="No major risks detected." />
                )}
              </ReportCard>

              {/* BUYING SIGNALS */}
              <ReportCard
                title="Buying Signals"
                subtitle="Evidence of customer engagement"
                icon={<TrendingUp size={20} />}
                iconClass="text-emerald-400 bg-emerald-500/10"
              >
                {report.buying_signals.length > 0 ? (
                  report.buying_signals.map(
                    (item, index) => (
                      <Item
                        key={index}
                        text={item}
                        success
                      />
                    )
                  )
                ) : (
                  <Empty text="No strong buying signals detected." />
                )}
              </ReportCard>

              {/* STAKEHOLDERS */}
              <ReportCard
                title="Stakeholder Intelligence"
                subtitle="People influencing the deal"
                icon={<Users size={20} />}
                iconClass="text-blue-400 bg-blue-500/10"
              >
                {report.stakeholders.map(
                  (stakeholder, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <p className="text-sm font-medium text-slate-200">
                        {stakeholder.name}
                      </p>

                      <p className="text-xs text-blue-400 mt-1">
                        {stakeholder.role}
                      </p>

                      <p className="text-xs text-slate-500 mt-2">
                        {stakeholder.focus}
                      </p>
                    </div>
                  )
                )}
              </ReportCard>

              {/* CHANGES */}
              <ReportCard
                title="What Changed?"
                subtitle="Latest deal movement"
                icon={<RefreshCw size={20} />}
                iconClass="text-amber-400 bg-amber-500/10"
              >
                {report.changes.length > 0 ? (
                  report.changes.map(
                    (change, index) => (
                      <Item
                        key={index}
                        text={
                          change.title ||
                          change.description ||
                          String(change)
                        }
                      />
                    )
                  )
                ) : (
                  <Empty text="No major changes detected." />
                )}
              </ReportCard>

              {/* HINDSIGHT */}
              <ReportCard
                title="Hindsight Intelligence"
                subtitle="Lessons from historical deal patterns"
                icon={<History size={20} />}
                iconClass="text-purple-400 bg-purple-500/10"
              >
                {report.hindsight.length > 0 ? (
                  report.hindsight
                    .slice(0, 4)
                    .map(
                      (item, index) => (
                        <Item
                          key={index}
                          text={
                            item.title ||
                            item.lesson ||
                            item.description ||
                            String(item)
                          }
                        />
                      )
                    )
                ) : (
                  <Empty text="No historical patterns detected." />
                )}
              </ReportCard>

            </div>

            {/* COMPETITORS */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Target size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Competitive Intelligence
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Competitive pressure identified in the deal
                  </p>
                </div>

              </div>

              {report.competitors.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {report.competitors.map(
                    (competitor) => (
                      <span
                        key={competitor}
                        className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm"
                      >
                        {competitor}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <Empty text="No specific competitors detected." />
              )}

            </div>

            {/* NEXT BEST ACTION */}
            <div className="mt-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/5 p-6">

              <div className="flex items-start gap-4">

                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <Sparkles size={22} />
                </div>

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-2 mb-2">

                    <h3 className="font-semibold">
                      Next Best Action
                    </h3>

                    <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs">
                      DealMind Recommendation
                    </span>

                  </div>

                  <p className="text-sm text-slate-300 leading-6">
                    {report.next_best_action}
                  </p>

                </div>

                <ArrowRight
                  size={20}
                  className="text-blue-400 hidden md:block"
                />

              </div>

            </div>

            {/* RECOMMENDED ACTIONS */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Recommended Actions
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Practical actions for the sales team
                  </p>
                </div>

              </div>

              <div className="space-y-3">

                {report.recommended_actions.map(
                  (action, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-semibold shrink-0">
                        {index + 1}
                      </div>

                      <p className="text-sm text-slate-300 leading-6">
                        {action}
                      </p>
                    </div>
                  )
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}


/* ----------------------------- */
/* COMPONENTS                    */
/* ----------------------------- */

function Badge({
  text,
}: {
  text: string;
}) {
  return (
    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
      {text}
    </span>
  );
}


function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="text-2xl font-bold mt-3">
        {value}
      </p>

    </div>
  );
}


function ReportCard({
  title,
  subtitle,
  icon,
  iconClass,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">

      <div className="p-5 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className={`p-2.5 rounded-xl ${iconClass}`}>
            {icon}
          </div>

          <div>
            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {subtitle}
            </p>
          </div>

        </div>

      </div>

      <div className="p-5 space-y-3">
        {children}
      </div>

    </div>
  );
}


function Item({
  text,
  danger = false,
  success = false,
}: {
  text: string;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">

      {danger ? (
        <AlertTriangle
          size={16}
          className="text-red-400 mt-1 shrink-0"
        />
      ) : success ? (
        <CheckCircle2
          size={16}
          className="text-emerald-400 mt-1 shrink-0"
        />
      ) : (
        <ArrowRight
          size={16}
          className="text-blue-400 mt-1 shrink-0"
        />
      )}

      <p className="text-sm text-slate-300 leading-6">
        {text}
      </p>

    </div>
  );
}


function Empty({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-500">
      {text}
    </div>
  );
}

