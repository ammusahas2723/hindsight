import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Crown,
  History,
  Mail,
  RefreshCw,
  ShieldCheck,
  Target,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getDeals,
  getDealSources,
  getDealHindsight,
} from "../services/api";

type Deal = {
  id: number;
  company: string;
  product: string;
  value: string;
  stage: string;
  health: string;
  source_text?: string;
};

type Source = {
  id: number;
  source_type: string;
  title?: string;
  content: string;
};

type HindsightInsight = {
  type?: string;
  title?: string;
  description?: string;
  impact?: string;
  recommendation?: string;
  historical_deals?: string[];
  hindsight_memories?: string[];
};

type Stakeholder = {
  name: string;
  role: string;
  influence: string;
  priority: string;
  concerns: string[];
  signals: string[];
  icon: React.ReactNode;
};

const Stakeholders = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [hindsight, setHindsight] = useState<
    HindsightInsight[]
  >([]);

  const [selectedDealId, setSelectedDealId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  /* ---------------- LOAD DEALS ---------------- */

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);

      const data = await getDeals();

      const dealList: Deal[] = Array.isArray(data)
        ? data
        : data.deals || data.items || [];

      setDeals(dealList);

      if (dealList.length > 0) {
        setSelectedDealId(dealList[0].id);
      }
    } catch (error) {
      console.error(
        "Failed to load deals:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD DEAL INTELLIGENCE ---------------- */

  useEffect(() => {
    if (selectedDealId) {
      loadDealIntelligence(selectedDealId);
    }
  }, [selectedDealId]);

  const loadDealIntelligence = async (
    dealId: number
  ) => {
    try {
      const [
        sourcesResponse,
        hindsightResponse,
      ] = await Promise.all([
        getDealSources(dealId),
        getDealHindsight(dealId),
      ]);

      const sourceList: Source[] =
        Array.isArray(sourcesResponse)
          ? sourcesResponse
          : sourcesResponse.sources ||
            sourcesResponse.items ||
            [];

      setSources(sourceList);

      setHindsight(
        hindsightResponse?.insights || []
      );
    } catch (error) {
      console.error(
        "Failed to load stakeholder intelligence:",
        error
      );

      setSources([]);
      setHindsight([]);
    }
  };

  const refresh = async () => {
    if (!selectedDealId) return;

    try {
      setRefreshing(true);

      await loadDealIntelligence(
        selectedDealId
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* ---------------- SELECTED DEAL ---------------- */

  const selectedDeal = deals.find(
    (deal) => deal.id === selectedDealId
  );

  /* ---------------- COMPLETE MEMORY ---------------- */

  const completeText = useMemo(() => {
    if (!selectedDeal) return "";

    return [
      selectedDeal.company,
      selectedDeal.product,
      selectedDeal.stage,
      selectedDeal.health,
      selectedDeal.source_text || "",
      ...sources.map(
        (source) => source.content || ""
      ),
      ...hindsight.map(
        (insight) =>
          `${insight.title || ""} ${
            insight.description || ""
          } ${
            insight.recommendation || ""
          }`
      ),
    ]
      .join("\n")
      .toLowerCase();
  }, [
    selectedDeal,
    sources,
    hindsight,
  ]);

  const has = (words: string[]) =>
    words.some((word) =>
      completeText.includes(word)
    );

  /* ---------------- STAKEHOLDER DETECTION ---------------- */

  const stakeholders = useMemo<
    Stakeholder[]
  >(() => {
    const result: Stakeholder[] = [];

    /* CFO */

    if (
      has([
        "cfo",
        "chief financial",
        "financial",
        "commercial",
        "pricing",
        "discount",
        "budget",
        "roi",
        "purchase approval",
      ])
    ) {
      result.push({
        name: "CFO",
        role: "Commercial Decision Maker",
        influence: "Very High",
        priority: "Pricing & ROI",
        concerns: [
          "Pricing",
          "Discount",
          "Commercial approval",
          "Business value",
        ],
        signals: [
          "Participating in commercial discussion",
          "Final approval influence detected",
          "Pricing discussion detected",
        ],
        icon: <Crown size={22} />,
      });
    }

    /* IT DIRECTOR */

    if (
      has([
        "it director",
        "it team",
        "technical",
        "technical approval",
        "implementation",
        "deployment",
        "integration",
        "architecture",
      ])
    ) {
      result.push({
        name: "IT Director",
        role: "Technical Approver",
        influence: "High",
        priority: "Implementation",
        concerns: [
          "Technical feasibility",
          "Implementation timeline",
          "Integration",
          "Deployment",
        ],
        signals: [
          "Technical approval required",
          "Implementation discussed",
          "Deployment concerns detected",
        ],
        icon: (
          <BriefcaseBusiness size={22} />
        ),
      });
    }

    /* SECURITY */

    if (
      has([
        "security manager",
        "security team",
        "security",
        "soc 2",
        "data protection",
        "compliance",
        "security review",
        "security approval",
      ])
    ) {
      result.push({
        name: "Security Manager",
        role: "Security & Compliance Reviewer",
        influence: "High",
        priority: "Security Approval",
        concerns: [
          "SOC 2 compliance",
          "Data protection",
          "Security documentation",
          "Security approval",
        ],
        signals: [
          "Security review required",
          "Compliance documentation requested",
          "Security concern detected",
        ],
        icon: (
          <ShieldCheck size={22} />
        ),
      });
    }

    /* SALES */

    if (
      has([
        "sales",
        "sales manager",
        "sales representative",
        "account executive",
        "account manager",
        "deal owner",
      ])
    ) {
      result.push({
        name: "Sales Team",
        role: "Deal Owner",
        influence: "High",
        priority: "Deal Progress",
        concerns: [
          "Closing the deal",
          "Customer objections",
          "Next steps",
          "Commercial progress",
        ],
        signals: [
          "Managing customer communication",
          "Proposal activity detected",
          "Deal progress activity detected",
        ],
        icon: <Zap size={22} />,
      });
    }

    /* PROCUREMENT */

    if (
      has([
        "procurement",
        "purchasing",
        "purchase team",
        "vendor management",
        "vendor approval",
      ])
    ) {
      result.push({
        name: "Procurement",
        role: "Purchasing Stakeholder",
        influence: "High",
        priority: "Commercial Terms",
        concerns: [
          "Pricing",
          "Contract terms",
          "Vendor approval",
          "Payment terms",
        ],
        signals: [
          "Purchasing activity detected",
          "Commercial terms discussed",
        ],
        icon: <Target size={22} />,
      });
    }

    /* CUSTOMER EXECUTIVE */

    if (
      has([
        "ceo",
        "chief executive",
        "executive sponsor",
        "vp",
        "vice president",
        "executive approval",
      ])
    ) {
      result.push({
        name: "Executive Sponsor",
        role: "Executive Decision Maker",
        influence: "Very High",
        priority: "Business Outcome",
        concerns: [
          "Strategic value",
          "Business outcome",
          "ROI",
          "Executive approval",
        ],
        signals: [
          "Executive involvement detected",
          "Strategic decision influence detected",
        ],
        icon: <Crown size={22} />,
      });
    }

    /* FALLBACK */

    if (result.length === 0) {
      result.push({
        name: "Customer Team",
        role: "Key Stakeholder Group",
        influence: "Medium",
        priority: "Requirements",
        concerns: [
          "Customer requirements",
          "Decision criteria",
          "Open questions",
        ],
        signals: [
          "Stakeholder information needs to be collected",
        ],
        icon: <Users size={22} />,
      });
    }

    return result;
  }, [completeText]);

  /* ---------------- HISTORICAL STAKEHOLDER INSIGHTS ---------------- */

  const stakeholderInsights =
    hindsight.filter((insight) => {
      const text = `
        ${insight.title || ""}
        ${insight.description || ""}
        ${insight.recommendation || ""}
      `.toLowerCase();

      return (
        text.includes("stakeholder") ||
        text.includes("decision") ||
        text.includes("cfo") ||
        text.includes("security manager") ||
        text.includes("it director")
      );
    });

  const historicalMemories = Array.from(
    new Set(
      stakeholderInsights.flatMap(
        (insight) =>
          insight.hindsight_memories || []
      )
    )
  );

  const highInfluenceCount =
    stakeholders.filter(
      (person) =>
        person.influence === "High" ||
        person.influence === "Very High"
    ).length;

  const decisionMakerCount =
    stakeholders.filter(
      (person) =>
        person.role
          .toLowerCase()
          .includes("decision")
    ).length;

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="flex items-center gap-3 text-slate-400">

          <RefreshCw
            size={20}
            className="animate-spin"
          />

          Loading stakeholder intelligence...

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Intelligence
          </button>

        </div>

        {/* TITLE */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-3 mb-2">

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">

                <Users
                  className="text-indigo-400"
                  size={26}
                />

              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Stakeholder Intelligence
                </h1>

                <p className="text-slate-400 mt-1">
                  Understand who influences the deal,
                  what they care about, and what could
                  block approval.
                </p>

              </div>

            </div>

          </div>

          <select
            value={selectedDealId ?? ""}
            onChange={(e) =>
              setSelectedDealId(
                Number(e.target.value)
              )
            }
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
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

        {!selectedDeal ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">

            <Users
              size={42}
              className="mx-auto text-slate-600 mb-4"
            />

            <h2 className="text-xl font-semibold mb-2">
              No deals available
            </h2>

            <p className="text-slate-400">
              Create a deal and add deal memory
              first.
            </p>

          </div>

        ) : (

          <>

            {/* DEAL SUMMARY */}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">

              <SummaryCard
                label="Company"
                value={selectedDeal.company}
              />

              <SummaryCard
                label="Deal Stage"
                value={selectedDeal.stage}
              />

              <SummaryCard
                label="Stakeholders"
                value={String(
                  stakeholders.length
                )}
              />

              <SummaryCard
                label="High Influence"
                value={String(
                  highInfluenceCount
                )}
              />

              <SummaryCard
                label="Decision Makers"
                value={String(
                  decisionMakerCount
                )}
              />

            </div>

            {/* INTELLIGENCE BANNER */}

            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 mb-8">

              <div className="flex items-start gap-4">

                <div className="p-3 rounded-xl bg-indigo-500/10">

                  <Zap
                    className="text-indigo-400"
                    size={22}
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-lg">
                    AI Stakeholder Map
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    DealMind analyzed the current deal
                    memory, uploaded sources, and
                    Hindsight context to identify
                    stakeholder roles and concerns.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {sources.length} sources analyzed
                    </span>

                    <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {hindsight.length} Hindsight insights
                    </span>

                    <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                      Memory connected
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* STAKEHOLDER CARDS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {stakeholders.map(
                (person) => (

                  <div
                    key={person.name}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          {person.icon}
                        </div>

                        <div>

                          <h3 className="text-lg font-semibold">
                            {person.name}
                          </h3>

                          <p className="text-sm text-slate-400">
                            {person.role}
                          </p>

                        </div>

                      </div>

                      <span
                        className={`text-xs px-3 py-1.5 rounded-full border ${
                          person.influence ===
                          "Very High"
                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                            : person.influence ===
                              "High"
                            ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                            : "text-slate-400 bg-slate-800 border-slate-700"
                        }`}
                      >
                        {person.influence}
                      </span>

                    </div>

                    {/* PRIORITY */}

                    <div className="mt-6">

                      <p className="text-xs uppercase text-slate-500 mb-2">
                        Primary Priority
                      </p>

                      <div className="flex items-center gap-2 text-sm font-medium">

                        <Target
                          size={16}
                          className="text-indigo-400"
                        />

                        {person.priority}

                      </div>

                    </div>

                    {/* CONCERNS */}

                    <div className="mt-6">

                      <p className="text-xs uppercase text-slate-500 mb-3">
                        Key Concerns
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {person.concerns.map(
                          (concern) => (

                            <span
                              key={concern}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                            >
                              {concern}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                    {/* SIGNALS */}

                    <div className="mt-6">

                      <p className="text-xs uppercase text-slate-500 mb-3">
                        Detected Signals
                      </p>

                      <div className="space-y-2">

                        {person.signals.map(
                          (signal) => (

                            <div
                              key={signal}
                              className="flex items-center gap-2 text-sm text-slate-300"
                            >

                              <CheckCircle2
                                size={15}
                                className="text-emerald-400 shrink-0"
                              />

                              {signal}

                            </div>

                          )
                        )}

                      </div>

                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">

                      <div className="flex items-center gap-2 text-xs text-slate-500">

                        <UserRound
                          size={14}
                        />

                        Detected from deal intelligence

                      </div>

                      <ChevronRight
                        size={17}
                        className="text-slate-600"
                      />

                    </div>

                  </div>

                )
              )}

            </div>

            {/* HINDSIGHT STAKEHOLDER INTELLIGENCE */}

            {stakeholderInsights.length >
              0 && (

              <section className="mt-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">

                <div className="flex items-start gap-4">

                  <div className="p-3 rounded-xl bg-purple-500/10">

                    <History
                      size={22}
                      className="text-purple-400"
                    />

                  </div>

                  <div className="flex-1">

                    <h2 className="text-lg font-semibold">
                      Hindsight Stakeholder Intelligence
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      DealMind found historical
                      stakeholder patterns connected
                      to this deal.
                    </p>

                    <div className="space-y-4 mt-5">

                      {stakeholderInsights
                        .slice(0, 4)
                        .map(
                          (
                            insight,
                            index
                          ) => (

                            <div
                              key={index}
                              className="rounded-xl bg-slate-950/50 border border-purple-500/10 p-4"
                            >

                              <div className="flex items-center gap-2">

                                <span className="text-xs text-purple-400">
                                  {insight.impact ||
                                    "Historical Pattern"}
                                </span>

                              </div>

                              <h3 className="font-semibold mt-2">
                                {insight.title ||
                                  "Historical stakeholder pattern"}
                              </h3>

                              <p className="text-sm text-slate-400 mt-2">
                                {insight.description ||
                                  "A related stakeholder pattern was found in previous deal history."}
                              </p>

                              {insight.recommendation && (

                                <div className="mt-3 text-sm text-slate-300">

                                  <span className="text-purple-400 font-medium">
                                    Recommendation:
                                  </span>{" "}

                                  {
                                    insight.recommendation
                                  }

                                </div>

                              )}

                            </div>

                          )
                        )}

                    </div>

                  </div>

                </div>

              </section>

            )}

            {/* RETRIEVED MEMORIES */}

            {historicalMemories.length >
              0 && (

              <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

                <div className="flex items-center gap-3">

                  <History
                    size={20}
                    className="text-indigo-400"
                  />

                  <div>

                    <h2 className="font-semibold">
                      Retrieved Hindsight Memories
                    </h2>

                    <p className="text-xs text-slate-500">
                      Historical memory relevant to
                      stakeholder management.
                    </p>

                  </div>

                </div>

                <div className="space-y-3 mt-5">

                  {historicalMemories
                    .slice(0, 5)
                    .map(
                      (memory, index) => (

                        <div
                          key={index}
                          className="flex gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800"
                        >

                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">

                            <History
                              size={14}
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

              </section>

            )}

            {/* ACTION INSIGHT */}

            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

              <div className="flex gap-4">

                <div className="p-3 rounded-xl bg-emerald-500/10 h-fit">

                  <Mail
                    size={21}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-lg">
                    Recommended Stakeholder Action
                  </h2>

                  <p className="text-sm text-slate-400 mt-2 max-w-3xl">
                    Keep high-influence stakeholders
                    aligned before moving the deal to
                    the next stage. Address each
                    stakeholder's specific concern instead
                    of sending the same message to
                    everyone.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">

                    <span className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                      Map decision makers
                    </span>

                    <span className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                      Address blockers early
                    </span>

                    <span className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                      Personalize communication
                    </span>

                    <span className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                      Use historical lessons
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );
};


/* ---------------- SUMMARY CARD ---------------- */

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

      <p className="text-xs text-slate-500 uppercase">
        {label}
      </p>

      <p className="text-lg font-semibold mt-2">
        {value}
      </p>

    </div>
  );
}


export default Stakeholders;