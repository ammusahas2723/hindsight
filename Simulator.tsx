import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FlaskConical,
  ShieldAlert,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Brain,
  History,
} from "lucide-react";

import { getDeals } from "../services/api";
import api from "../services/api";

interface Deal {
  id: number;
  company: string;
  product: string;
  value: string;
  stage: string;
  health: string;
  source_text?: string;
}

interface HindsightInsight {
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
}

interface SimulatorResponse {
  success: boolean;
  deal_id: number;
  company: string;
  scenario: string;
  impact: string;
  risk: string;
  consequences: string[];
  recommendation: string;
  hindsight?: {
    historical_deal_count: number;
    relevant_insights: HindsightInsight[];
    memory_connected: boolean;
  };
}

function Simulator() {
  const navigate = useNavigate();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  const [securityResolved, setSecurityResolved] =
    useState(false);

  const [discount, setDiscount] = useState(15);

  const [implementationDelay, setImplementationDelay] =
    useState(0);

  const [competitorStrength, setCompetitorStrength] =
    useState(50);

  const [hindsightData, setHindsightData] =
    useState<SimulatorResponse | null>(null);

  const [hindsightLoading, setHindsightLoading] =
    useState(false);

  useEffect(() => {
    loadDeal();
  }, []);

  const loadDeal = async () => {
    try {
      const data = await getDeals();

      if (data && data.length > 0) {
        setDeal(data[data.length - 1]);
      }
    } catch (error) {
      console.error("Failed to load deal:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * LOCAL SIMULATION ENGINE
   */

  const securityRisk = securityResolved ? 0 : 30;

  const pricingRisk =
    discount >= 20
      ? 25
      : discount >= 10
      ? 15
      : 5;

  const implementationRisk =
    implementationDelay >= 30
      ? 25
      : implementationDelay >= 15
      ? 15
      : implementationDelay > 0
      ? 8
      : 0;

  const competitionRisk =
    competitorStrength >= 75
      ? 20
      : competitorStrength >= 50
      ? 12
      : 5;

  const totalRisk =
    securityRisk +
    pricingRisk +
    implementationRisk +
    competitionRisk;

  const riskScore = Math.min(totalRisk, 100);

  const health =
    riskScore <= 25
      ? "Healthy"
      : riskScore <= 50
      ? "Moderate Risk"
      : riskScore <= 75
      ? "At Risk"
      : "Critical";

  /*
   * Build a scenario description from the sliders.
   */
  const buildScenario = () => {
    const parts: string[] = [];

    if (!securityResolved) {
      parts.push(
        "customer security concern remains unresolved"
      );
    } else {
      parts.push(
        "customer security concern is resolved"
      );
    }

    if (discount > 0) {
      parts.push(
        `customer requests ${discount}% discount`
      );
    }

    if (implementationDelay > 0) {
      parts.push(
        `implementation is delayed by ${implementationDelay} days`
      );
    }

    if (competitorStrength >= 75) {
      parts.push(
        "competitor pressure is high"
      );
    } else if (competitorStrength >= 50) {
      parts.push(
        "competitor pressure is moderate"
      );
    } else {
      parts.push(
        "competitor pressure is low"
      );
    }

    return `What if ${parts.join(", ")}?`;
  };

  /*
   * Ask backend + Hindsight about current scenario.
   */
  const runHindsightSimulation = async () => {
    if (!deal) return;

    try {
      setHindsightLoading(true);

      const scenario = buildScenario();

      const response = await api.post(
        `/api/deals/${deal.id}/simulate`,
        {
          scenario,
        }
      );

      setHindsightData(response.data);
    } catch (error) {
      console.error(
        "Hindsight simulation failed:",
        error
      );
    } finally {
      setHindsightLoading(false);
    }
  };

  /*
   * Run Hindsight when scenario controls change.
   */
  useEffect(() => {
    if (!deal) return;

    const timer = setTimeout(() => {
      runHindsightSimulation();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    deal,
    securityResolved,
    discount,
    implementationDelay,
    competitorStrength,
  ]);

  const getRiskColor = () => {
    if (riskScore <= 25) return "text-emerald-400";
    if (riskScore <= 50) return "text-amber-400";
    if (riskScore <= 75) return "text-orange-400";
    return "text-red-400";
  };

  const getRiskBackground = () => {
    if (riskScore <= 25)
      return "bg-emerald-500/10 border-emerald-500/20";

    if (riskScore <= 50)
      return "bg-amber-500/10 border-amber-500/20";

    if (riskScore <= 75)
      return "bg-orange-500/10 border-orange-500/20";

    return "bg-red-500/10 border-red-500/20";
  };

  const getRecommendation = () => {
    if (!securityResolved) {
      return "Resolve the security concern before progressing further into commercial negotiations.";
    }

    if (discount >= 20) {
      return "Review the commercial impact of the discount before approving the revised proposal.";
    }

    if (implementationDelay >= 30) {
      return "Confirm implementation resources and reset the customer's timeline before committing.";
    }

    if (competitorStrength >= 75) {
      return "Strengthen competitive differentiation and address the customer's evaluation criteria.";
    }

    return "Current scenario shows manageable risk. Continue monitoring security, pricing and competitive signals.";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">
          Loading simulator...
        </p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 p-8">

        <div className="max-w-5xl mx-auto">

          <button
            onClick={() => navigate("/deals")}
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Deals
          </button>

          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <FlaskConical
              size={40}
              className="mx-auto text-slate-600 mb-4"
            />

            <h2 className="text-xl font-semibold">
              No deal available
            </h2>

            <p className="text-slate-500 mt-2">
              Create a deal before using the What-If Simulator.
            </p>

            <button
              onClick={() => navigate("/deals/new")}
              className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-3 rounded-xl"
            >
              Create New Deal
            </button>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}

        <div className="mb-8">

          <button
            onClick={() => navigate("/deals")}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition text-sm mb-5"
          >
            <ArrowLeft size={17} />
            Back to Deals
          </button>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <FlaskConical
                size={21}
                className="text-violet-400"
              />
            </div>

            <div>

              <p className="text-sm text-violet-400 font-medium">
                Decision Intelligence
              </p>

              <h1 className="text-3xl font-bold">
                What-If Simulator
              </h1>

            </div>

          </div>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Explore possible deal scenarios and use historical
            Hindsight intelligence to understand similar situations.
          </p>

        </div>

        {/* CURRENT DEAL */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-xs text-slate-500">
                Simulating
              </p>

              <h2 className="text-lg font-semibold mt-1">
                {deal.company}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {deal.product} • {deal.stage}
              </p>

            </div>

            <div className="text-left md:text-right">

              <p className="text-xs text-slate-500">
                Current Deal Value
              </p>

              <p className="text-xl font-bold mt-1">
                {deal.value}
              </p>

            </div>

          </div>

        </div>

        {/* MAIN */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* SCENARIOS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-800">

              <div className="flex items-center gap-2">

                <Brain
                  size={18}
                  className="text-violet-400"
                />

                <h2 className="font-semibold">
                  Scenario Controls
                </h2>

              </div>

              <p className="text-xs text-slate-500 mt-1">
                Adjust the variables to simulate different situations.
              </p>

            </div>

            <div className="p-6 space-y-7">

              {/* SECURITY */}

              <Scenario
                icon={
                  <ShieldAlert
                    size={18}
                    className="text-red-400"
                  />
                }
                title="Security concern"
                description="What if the security concern is resolved?"
              >

                <button
                  onClick={() =>
                    setSecurityResolved(
                      !securityResolved
                    )
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition ${
                    securityResolved
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-slate-950 border-slate-800"
                  }`}
                >

                  <span className="text-sm">
                    {securityResolved
                      ? "Security concern resolved"
                      : "Security concern unresolved"}
                  </span>

                  <div
                    className={`w-10 h-5 rounded-full p-0.5 transition ${
                      securityResolved
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    }`}
                  >

                    <div
                      className={`w-4 h-4 rounded-full bg-white transition ${
                        securityResolved
                          ? "translate-x-5"
                          : ""
                      }`}
                    />

                  </div>

                </button>

              </Scenario>

              {/* DISCOUNT */}

              <Scenario
                icon={
                  <DollarSign
                    size={18}
                    className="text-amber-400"
                  />
                }
                title="Discount request"
                description="What discount is the customer requesting?"
              >

                <div>

                  <div className="flex justify-between mb-2">

                    <span className="text-xs text-slate-500">
                      Discount
                    </span>

                    <span className="text-sm font-semibold text-amber-400">
                      {discount}%
                    </span>

                  </div>

                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(
                        Number(e.target.value)
                      )
                    }
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-[11px] text-slate-600 mt-2">
                    <span>0%</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>

                </div>

              </Scenario>

              {/* IMPLEMENTATION */}

              <Scenario
                icon={
                  <Clock
                    size={18}
                    className="text-orange-400"
                  />
                }
                title="Implementation delay"
                description="What if implementation is delayed?"
              >

                <div>

                  <div className="flex justify-between mb-2">

                    <span className="text-xs text-slate-500">
                      Delay
                    </span>

                    <span className="text-sm font-semibold text-orange-400">
                      {implementationDelay === 0
                        ? "No delay"
                        : `${implementationDelay} days`}
                    </span>

                  </div>

                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={implementationDelay}
                    onChange={(e) =>
                      setImplementationDelay(
                        Number(e.target.value)
                      )
                    }
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-[11px] text-slate-600 mt-2">
                    <span>0</span>
                    <span>30 days</span>
                    <span>60 days</span>
                  </div>

                </div>

              </Scenario>

              {/* COMPETITION */}

              <Scenario
                icon={
                  <Users
                    size={18}
                    className="text-violet-400"
                  />
                }
                title="Competitor strength"
                description="How strong is the competing solution?"
              >

                <div>

                  <div className="flex justify-between mb-2">

                    <span className="text-xs text-slate-500">
                      Competitive pressure
                    </span>

                    <span className="text-sm font-semibold text-violet-400">
                      {competitorStrength}%
                    </span>

                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={competitorStrength}
                    onChange={(e) =>
                      setCompetitorStrength(
                        Number(e.target.value)
                      )
                    }
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-[11px] text-slate-600 mt-2">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>

                </div>

              </Scenario>

            </div>

          </div>

          {/* RESULT */}

          <div className="space-y-5">

            {/* RISK SCORE */}

            <div
              className={`rounded-2xl border p-6 ${getRiskBackground()}`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-slate-500">
                    Simulated Risk
                  </p>

                  <p
                    className={`text-5xl font-bold mt-2 ${getRiskColor()}`}
                  >
                    {riskScore}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    out of 100
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xs text-slate-500">
                    Scenario Health
                  </p>

                  <p
                    className={`font-bold mt-2 ${getRiskColor()}`}
                  >
                    {health}
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">

                  <div
                    className={`h-full transition-all duration-500 ${
                      riskScore <= 25
                        ? "bg-emerald-400"
                        : riskScore <= 50
                        ? "bg-amber-400"
                        : riskScore <= 75
                        ? "bg-orange-400"
                        : "bg-red-400"
                    }`}
                    style={{
                      width: `${riskScore}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* RISK BREAKDOWN */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

              <div className="flex items-center gap-2 mb-5">

                <AlertTriangle
                  size={17}
                  className="text-amber-400"
                />

                <h3 className="font-semibold">
                  Risk Breakdown
                </h3>

              </div>

              <RiskRow
                label="Security"
                value={securityRisk}
              />

              <RiskRow
                label="Pricing"
                value={pricingRisk}
              />

              <RiskRow
                label="Implementation"
                value={implementationRisk}
              />

              <RiskRow
                label="Competition"
                value={competitionRisk}
              />

            </div>

            {/* RECOMMENDATION */}

            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5">

              <div className="flex items-center gap-2 mb-3">

                <Zap
                  size={17}
                  className="text-cyan-400"
                />

                <h3 className="font-semibold">
                  DealMind Recommendation
                </h3>

              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {getRecommendation()}
              </p>

            </div>

            {/* HINDSIGHT STATUS */}

            <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">

                  <Brain
                    size={18}
                    className="text-indigo-400"
                  />

                </div>

                <div>

                  <p className="text-sm font-medium">
                    Hindsight Intelligence
                  </p>

                  <p className="text-xs text-slate-500 mt-1">

                    {hindsightLoading
                      ? "Searching historical deal memory..."
                      : hindsightData?.hindsight?.memory_connected
                      ? "Historical memory connected"
                      : "Waiting for simulation"}

                  </p>

                </div>

                {hindsightData?.hindsight?.memory_connected && (
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400 ml-auto"
                  />
                )}

              </div>

            </div>

          </div>

        </div>

        {/* HINDSIGHT HISTORICAL INTELLIGENCE */}

        {hindsightData &&
          hindsightData.hindsight &&
          hindsightData.hindsight.relevant_insights.length > 0 && (

            <div className="mt-6">

              <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">

                    <History
                      size={20}
                      className="text-indigo-400"
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold">
                      Hindsight Historical Intelligence
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      What happened in similar historical deals.
                    </p>

                  </div>

                  <span className="ml-auto px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">

                    {
                      hindsightData.hindsight
                        .historical_deal_count
                    }{" "}
                    historical deals

                  </span>

                </div>

                <div className="space-y-4">

                  {hindsightData.hindsight.relevant_insights.map(
                    (insight, index) => (

                      <div
                        key={index}
                        className="p-5 rounded-xl bg-slate-950 border border-slate-800"
                      >

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">

                          <div>

                            <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                              {insight.type}
                            </p>

                            <h3 className="text-lg font-semibold mt-1">
                              {insight.title}
                            </h3>

                          </div>

                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              insight.impact
                                .toLowerCase() === "critical"
                                ? "bg-red-500/10 text-red-400"
                                : insight.impact
                                    .toLowerCase() === "high"
                                ? "bg-orange-500/10 text-orange-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {insight.impact}
                          </span>

                        </div>

                        <p className="text-sm text-slate-300 leading-6 mt-4">
                          {insight.description}
                        </p>

                        <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">

                          <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-2">
                            Historical Recommendation
                          </p>

                          <p className="text-sm text-slate-300 leading-6">
                            {insight.recommendation}
                          </p>

                        </div>

                        {insight.historical_outcomes && (
                          <div className="flex flex-wrap gap-2 mt-4">

                            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">
                              Won:{" "}
                              {insight.historical_outcomes.won || 0}
                            </span>

                            <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs">
                              Lost:{" "}
                              {insight.historical_outcomes.lost || 0}
                            </span>

                            <span className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs">
                              Stalled:{" "}
                              {insight.historical_outcomes.stalled || 0}
                            </span>

                          </div>
                        )}

                        {insight.hindsight_memories &&
                          insight.hindsight_memories.length > 0 && (

                            <div className="mt-4">

                              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                                Retrieved Memory
                              </p>

                              <div className="space-y-2">

                                {insight.hindsight_memories.map(
                                  (memory, memoryIndex) => (

                                    <div
                                      key={memoryIndex}
                                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400"
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

              </div>

            </div>
          )}

        {/* EXPLANATION */}

        <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center gap-2 mb-3">

            <TrendingUp
              size={18}
              className="text-violet-400"
            />

            <h3 className="font-semibold">
              Why What-If Simulation?
            </h3>

          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">
            DealMind allows sales teams to explore possible
            scenarios before making a decision. The simulator
            combines current deal conditions with historical
            experience from Hindsight to show how similar
            situations affected previous deals.
          </p>

        </div>

      </div>

    </div>
  );
}

function Scenario({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <div className="flex items-start gap-3 mb-3">

        <div className="mt-0.5">
          {icon}
        </div>

        <div>

          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {description}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}

function RiskRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="mb-4">

      <div className="flex justify-between mb-2">

        <span className="text-xs text-slate-400">
          {label}
        </span>

        <span className="text-xs font-semibold text-slate-300">
          {value}
        </span>

      </div>

      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">

        <div
          className="h-full bg-cyan-400 rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(value * 3, 100)}%`,
          }}
        />

      </div>

    </div>
  );
}

export default Simulator;