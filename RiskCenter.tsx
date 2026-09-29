import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  Zap,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDeals } from "../services/api";

interface Deal {
  id: number;
  company: string;
  product: string;
  value: string;
  stage: string;
  health: string;
  source_text?: string;
}

interface Risk {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  action: string;
  icon: React.ReactNode;
}

function RiskCenter() {
  const navigate = useNavigate();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await getDeals();

      const dealList = Array.isArray(data)
        ? data
        : data.deals || data.items || [];

      setDeals(dealList);

      if (dealList.length > 0) {
        setSelectedDealId(dealList[dealList.length - 1].id);
      }
    } catch (error) {
      console.error("Failed to load deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDeal = deals.find(
    (deal) => deal.id === selectedDealId
  );

  const text = selectedDeal
    ? `
      ${selectedDeal.company}
      ${selectedDeal.product}
      ${selectedDeal.stage}
      ${selectedDeal.health}
      ${selectedDeal.source_text || ""}
    `.toLowerCase()
    : "";

  const has = (words: string[]) =>
    words.some((word) => text.includes(word));

  const risks: Risk[] = [];

  if (
    has([
      "security",
      "soc 2",
      "data protection",
      "compliance",
      "security review",
    ])
  ) {
    risks.push({
      title: "Security Approval Risk",
      description:
        "The customer has an active security or compliance concern that could delay approval.",
      impact: "High",
      action:
        "Provide security documentation and address the security team's questions before commercial closure.",
      icon: <ShieldAlert size={22} />,
    });
  }

  if (
    has([
      "pricing",
      "price",
      "discount",
      "cost",
      "budget",
    ])
  ) {
    risks.push({
      title: "Pricing Risk",
      description:
        "Pricing or discount discussions may create friction during the negotiation stage.",
      impact: "High",
      action:
        "Clarify pricing expectations, discount limits, and commercial value early.",
      icon: <DollarSign size={22} />,
    });
  }

  if (
    has([
      "competitor",
      "salesforce",
      "alternative",
      "competing",
    ])
  ) {
    risks.push({
      title: "Competitive Risk",
      description:
        "The customer is evaluating another solution or competitor.",
      impact: "Medium",
      action:
        "Identify the customer's comparison criteria and clearly communicate product differentiation.",
      icon: <Target size={22} />,
    });
  }

  if (
    has([
      "30 days",
      "implementation",
      "deployment",
      "timeline",
      "deadline",
    ])
  ) {
    risks.push({
      title: "Implementation Timeline Risk",
      description:
        "The customer has a specific implementation or deployment expectation.",
      impact: "Medium",
      action:
        "Confirm implementation owners, dependencies, resources, and delivery timeline.",
      icon: <Clock size={22} />,
    });
  }

  if (
    has([
      "cfo",
      "decision maker",
      "approval",
      "final approval",
    ])
  ) {
    risks.push({
      title: "Decision-Maker Dependency",
      description:
        "Final approval depends on an important stakeholder.",
      impact: "Medium",
      action:
        "Keep the decision maker aligned with business value, pricing, and remaining risks.",
      icon: <Users size={22} />,
    });
  }

  if (risks.length === 0) {
    risks.push({
      title: "No Major Risk Detected",
      description:
        "DealMind did not detect a strong risk signal from the available deal memory.",
      impact: "Low",
      action:
        "Continue collecting deal information to improve risk detection.",
      icon: <CheckCircle2 size={22} />,
    });
  }

  const highRisks = risks.filter(
    (risk) => risk.impact === "High"
  ).length;

  const mediumRisks = risks.filter(
    (risk) => risk.impact === "Medium"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-3">

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <ShieldAlert
                  size={26}
                  className="text-red-400"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Deal Intelligence
                </p>

                <h1 className="text-3xl font-bold">
                  Risk Center
                </h1>

                <p className="text-slate-400 mt-1">
                  Identify deal risks before they become blockers.
                </p>
              </div>

            </div>
          </div>

          {/* Deal selector */}
          <select
            value={selectedDealId ?? ""}
            onChange={(event) =>
              setSelectedDealId(Number(event.target.value))
            }
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
          >
            {deals.map((deal) => (
              <option key={deal.id} value={deal.id}>
                {deal.company} — {deal.product}
              </option>
            ))}
          </select>

        </div>

        {loading ? (
          <div className="text-slate-400">
            Loading risk intelligence...
          </div>
        ) : !selectedDeal ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <AlertTriangle
              size={42}
              className="mx-auto text-slate-600 mb-4"
            />

            <h2 className="text-xl font-semibold">
              No deals available
            </h2>

            <p className="text-slate-400 mt-2">
              Create a deal and add deal memory first.
            </p>
          </div>
        ) : (
          <>
            {/* Current Deal */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 mb-6">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Current Deal
              </p>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">

                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedDeal.company}
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    {selectedDeal.product}
                  </p>
                </div>

                <div className="flex gap-3">

                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
                    {selectedDeal.stage}
                  </span>

                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
                    {selectedDeal.value}
                  </span>

                </div>

              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    High Risks
                  </p>

                  <AlertTriangle
                    size={20}
                    className="text-red-400"
                  />
                </div>

                <p className="text-3xl font-bold mt-3">
                  {highRisks}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Requires immediate attention
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    Medium Risks
                  </p>

                  <Zap
                    size={20}
                    className="text-amber-400"
                  />
                </div>

                <p className="text-3xl font-bold mt-3">
                  {mediumRisks}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Monitor and manage
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    Total Signals
                  </p>

                  <ShieldAlert
                    size={20}
                    className="text-indigo-400"
                  />
                </div>

                <p className="text-3xl font-bold mt-3">
                  {risks.length}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Detected by DealMind
                </p>
              </div>

            </div>

            {/* Risk list */}
            <div className="mb-8">

              <div className="flex items-center gap-3 mb-5">
                <ShieldAlert
                  size={21}
                  className="text-red-400"
                />

                <h2 className="text-xl font-semibold">
                  Detected Deal Risks
                </h2>
              </div>

              <div className="space-y-4">

                {risks.map((risk, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition"
                  >

                    <div className="flex flex-col md:flex-row gap-5">

                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          risk.impact === "High"
                            ? "bg-red-500/10 text-red-400"
                            : risk.impact === "Medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {risk.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                          <h3 className="text-lg font-semibold">
                            {risk.title}
                          </h3>

                          <span
                            className={`w-fit px-3 py-1 rounded-full text-xs border ${
                              risk.impact === "High"
                                ? "text-red-400 bg-red-500/10 border-red-500/20"
                                : risk.impact === "Medium"
                                ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            }`}
                          >
                            {risk.impact} Impact
                          </span>

                        </div>

                        <p className="text-sm text-slate-400 mt-3 leading-6">
                          {risk.description}
                        </p>

                        {/* Recommendation */}
                        <div className="mt-5 rounded-xl bg-slate-950/70 border border-slate-800 p-4">

                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2
                              size={16}
                              className="text-indigo-400"
                            />

                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Recommended Action
                            </p>
                          </div>

                          <p className="text-sm text-slate-300 leading-6">
                            {risk.action}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* Risk intelligence explanation */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-7">

              <div className="flex items-center gap-3 mb-3">
                <Zap
                  size={21}
                  className="text-indigo-400"
                />

                <h2 className="font-semibold">
                  DealMind Risk Intelligence
                </h2>
              </div>

              <p className="text-slate-400 leading-7">
                DealMind continuously examines deal memory for
                security concerns, pricing pressure, competitive
                threats, stakeholder dependencies, and timeline
                risks. The goal is to surface potential blockers
                early so the sales team can act before the deal
                reaches a critical stage.
              </p>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default RiskCenter;