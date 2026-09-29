import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Brain,
  Sparkles,
  FileText,
  Loader2,
  Zap,
  ShieldAlert,
  Target,
  Users,
  MessageSquare,
  DollarSign,
  Clock3,
  CheckCircle2,
  Database,
  Save,
} from "lucide-react";

import { analyzeDeal, createDeal } from "../services/api";

type Risk = {
  title: string;
  severity: string;
  description: string;
};

type Stakeholder = {
  name: string;
  role: string;
  focus: string;
};

type DealDNA = {
  customer_intent: string;
  primary_blocker: string;
  competitive_pressure: string;
  commercial_stage: string;
  engagement: string;
};

type Intelligence = {
  deal_health: string;
  sentiment: string;
  risks: Risk[];
  buying_signals: string[];
  pain_points: string[];
  stakeholders: Stakeholder[];
  competitors: string[];
  commercial_signals: string[];
  urgency: string[];
  next_best_action: string;
  deal_dna: DealDNA;
};

function AnalyzeDeal() {
  const navigate = useNavigate();

  const [dealContext, setDealContext] = useState(
    `Customer: Acme Corporation

The customer is interested in our platform and requested a proposal.

The CTO is concerned about security and implementation.

The CFO is reviewing pricing and budget approval.

The VP Engineering wants to understand integration and deployment.

The customer is also evaluating Salesforce as a competitor.

They requested revised pricing and a security questionnaire.

The customer wants the revised proposal by Friday.`
  );

  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [stage, setStage] = useState("Evaluation");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [intelligence, setIntelligence] =
    useState<Intelligence | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!dealContext.trim()) {
      setError("Please paste customer information first.");
      return;
    }

    setLoading(true);
    setError("");
    setSaveMessage("");
    setIntelligence(null);

    try {
      const result = await analyzeDeal(dealContext);

      setIntelligence(result.intelligence);

      const customerMatch = dealContext.match(
        /customer:\s*(.+)/i
      );

      if (customerMatch) {
        setCompany(customerMatch[1].trim());
      }

      if (
        dealContext
          .toLowerCase()
          .includes("enterprise ai platform")
      ) {
        setProduct("Enterprise AI Platform");
      }
    } catch (err) {
      console.error(err);

      setError(
        "Could not connect to DealMind. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setDealContext(`Customer: Acme Corporation

Meeting notes:

The customer is evaluating our Enterprise AI Platform.

The CTO raised security concerns twice and asked about data protection.

The CFO joined the latest meeting and requested pricing information.

The customer asked for implementation details and wants a revised proposal by Friday.

Salesforce was mentioned as another solution they are evaluating.

The security questionnaire has been pending for 8 days.

The customer said they like the product but are concerned about the overall price.`);
  };

  const handleCreateDeal = async () => {
    if (!company.trim()) {
      setSaveMessage("Please enter the company name.");
      return;
    }

    if (!product.trim()) {
      setSaveMessage("Please enter the product name.");
      return;
    }

    if (!intelligence) {
      setSaveMessage(
        "Please analyze the customer information first."
      );
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const health =
        intelligence.deal_health === "Stable"
          ? "Healthy"
          : intelligence.deal_health || "Moderate Risk";

      const createdDeal = await createDeal({
        company,
        product,
        value: dealValue || "Not specified",
        stage,
        health,
        source_text: dealContext,
        intelligence_json: JSON.stringify(intelligence),
      });

      setSaveMessage("Deal created successfully!");

      setTimeout(() => {
        navigate(`/deals/${createdDeal.id}`);
      }, 700);
    } catch (err) {
      console.error(err);

      setSaveMessage(
        "Could not create the deal. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition"
          >
            <ArrowLeft
              size={20}
              className="text-slate-300"
            />
          </button>

          <div className="flex-1">

            <div className="flex items-center gap-2 text-cyan-400">

              <Brain size={24} />

              <h1 className="text-3xl font-bold text-white">
                Analyze New Intelligence
              </h1>

            </div>

            <p className="text-slate-400 mt-2">
              Convert raw customer information into structured
              deal intelligence.
            </p>

          </div>

          <div className="hidden md:flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-2">

            <Sparkles
              size={16}
              className="text-cyan-400"
            />

            <span className="text-sm font-medium text-cyan-300">
              DealMind Intelligence Engine
            </span>

          </div>

        </div>

        {/* INPUT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Raw Intelligence */}
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-800 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <FileText
                    size={19}
                    className="text-cyan-400"
                  />

                  <h2 className="text-lg font-bold">
                    Raw Customer Intelligence
                  </h2>

                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Paste meeting notes, emails, transcripts or CRM notes.
                </p>

              </div>

              <button
                onClick={loadExample}
                className="border border-slate-700 bg-slate-800/60 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition"
              >
                Load Example
              </button>

            </div>

            <div className="p-6">

              <textarea
                value={dealContext}
                onChange={(e) =>
                  setDealContext(e.target.value)
                }
                placeholder="Paste customer information here..."
                className="h-80 w-full resize-none bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              />

              {error && (

                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>

              )}

              <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <p className="text-xs text-slate-500">
                  DealMind uses local intelligence rules and does
                  not require a paid AI API.
                </p>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap size={17} />
                      Analyze Intelligence
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

          {/* EXTRACTION */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">

                <Sparkles
                  size={19}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <h2 className="font-bold">
                  Intelligence Extraction
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  What DealMind identifies
                </p>

              </div>

            </div>

            <div className="space-y-3">

              <ExtractionItem
                icon={<ShieldAlert size={16} />}
                title="Risk Signals"
                description="Potential blockers"
              />

              <ExtractionItem
                icon={<Target size={16} />}
                title="Buying Signals"
                description="Evidence of interest"
              />

              <ExtractionItem
                icon={<Users size={16} />}
                title="Stakeholders"
                description="People influencing the deal"
              />

              <ExtractionItem
                icon={<MessageSquare size={16} />}
                title="Pain Points"
                description="Customer problems"
              />

              <ExtractionItem
                icon={<DollarSign size={16} />}
                title="Commercial Signals"
                description="Pricing and budget"
              />

              <ExtractionItem
                icon={<Clock3 size={16} />}
                title="Urgency"
                description="Deadlines and timing"
              />

            </div>

          </div>

        </div>

        {/* RESULTS */}
        {intelligence && (

          <div className="mt-6 space-y-6">

            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <SummaryCard
                icon={<ShieldAlert size={19} />}
                title="Deal Health"
                value={intelligence.deal_health}
              />

              <SummaryCard
                icon={<MessageSquare size={19} />}
                title="Customer Sentiment"
                value={intelligence.sentiment}
              />

              <SummaryCard
                icon={<ShieldAlert size={19} />}
                title="Risk Signals"
                value={`${intelligence.risks.length} detected`}
              />

              <SummaryCard
                icon={<Target size={19} />}
                title="Buying Signals"
                value={`${intelligence.buying_signals.length} detected`}
              />

            </div>

            {/* RISKS + BUYING SIGNALS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

                <SectionTitle
                  icon={<ShieldAlert size={19} />}
                  title="Risk Intelligence"
                />

                <div className="space-y-3 mt-5">

                  {intelligence.risks.length > 0 ? (

                    intelligence.risks.map((risk, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <p className="text-sm font-semibold text-white">
                            {risk.title}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                              risk.severity === "High"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {risk.severity}
                          </span>

                        </div>

                        <p className="mt-2 text-sm text-slate-400 leading-6">
                          {risk.description}
                        </p>

                      </div>

                    ))

                  ) : (

                    <EmptyState text="No major risks detected." />

                  )}

                </div>

              </section>

              <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

                <SectionTitle
                  icon={<Target size={19} />}
                  title="Buying Signals"
                />

                <div className="space-y-3 mt-5">

                  {intelligence.buying_signals.length > 0 ? (

                    intelligence.buying_signals.map(
                      (signal, index) => (

                        <div
                          key={index}
                          className="flex gap-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4"
                        >

                          <CheckCircle2
                            size={18}
                            className="mt-0.5 text-emerald-400 shrink-0"
                          />

                          <p className="text-sm text-slate-300">
                            {signal}
                          </p>

                        </div>

                      )
                    )

                  ) : (

                    <EmptyState text="No strong buying signals detected." />

                  )}

                </div>

              </section>

            </div>

            {/* PAIN + COMPETITORS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

                <SectionTitle
                  icon={<MessageSquare size={19} />}
                  title="Customer Pain Points"
                />

                <div className="flex flex-wrap gap-3 mt-5">

                  {intelligence.pain_points.length > 0 ? (

                    intelligence.pain_points.map(
                      (point, index) => (

                        <span
                          key={index}
                          className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 text-sm text-slate-300"
                        >
                          {point}
                        </span>

                      )

                    )

                  ) : (

                    <EmptyState text="No pain points detected." />

                  )}

                </div>

              </section>

              <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

                <SectionTitle
                  icon={<Target size={19} />}
                  title="Competitive Intelligence"
                />

                <div className="space-y-3 mt-5">

                  {intelligence.competitors.length > 0 ? (

                    intelligence.competitors.map(
                      (competitor, index) => (

                        <div
                          key={index}
                          className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                        >

                          <p className="text-sm font-semibold text-white">
                            {competitor}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Competitor identified in customer information.
                          </p>

                        </div>

                      )
                    )

                  ) : (

                    <EmptyState text="No competitor detected." />

                  )}

                </div>

              </section>

            </div>

            {/* STAKEHOLDERS */}
            <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

              <SectionTitle
                icon={<Users size={19} />}
                title="Stakeholder Intelligence"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

                {intelligence.stakeholders.length > 0 ? (

                  intelligence.stakeholders.map(
                    (person, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                      >

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm font-bold text-cyan-400">
                            {person.role.charAt(0)}
                          </div>

                          <div>

                            <p className="text-sm font-semibold text-white">
                              {person.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {person.role}
                            </p>

                          </div>

                        </div>

                        <p className="mt-4 text-sm text-slate-400 leading-6">
                          {person.focus}
                        </p>

                      </div>

                    )

                  )

                ) : (

                  <EmptyState text="No stakeholders identified." />

                )}

              </div>

            </section>

            {/* DEAL DNA */}
            <section className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-2xl p-6">

              <SectionTitle
                icon={<Brain size={19} />}
                title="Deal DNA"
              />

              <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-4">

                <DNAItem
                  title="Customer Intent"
                  value={intelligence.deal_dna.customer_intent}
                />

                <DNAItem
                  title="Primary Blocker"
                  value={intelligence.deal_dna.primary_blocker}
                />

                <DNAItem
                  title="Competition"
                  value={intelligence.deal_dna.competitive_pressure}
                />

                <DNAItem
                  title="Commercial Stage"
                  value={intelligence.deal_dna.commercial_stage}
                />

                <DNAItem
                  title="Engagement"
                  value={intelligence.deal_dna.engagement}
                />

              </div>

            </section>

            {/* URGENCY + NEXT ACTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

                <SectionTitle
                  icon={<Clock3 size={19} />}
                  title="Urgency & Timing"
                />

                <div className="space-y-3 mt-5">

                  {intelligence.urgency.length > 0 ? (

                    intelligence.urgency.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="flex gap-3 rounded-xl bg-slate-950 border border-slate-800 p-4"
                        >

                          <Clock3
                            size={18}
                            className="text-cyan-400 shrink-0"
                          />

                          <p className="text-sm text-slate-300">
                            {item}
                          </p>

                        </div>

                      )
                    )

                  ) : (

                    <EmptyState text="No specific deadline detected." />

                  )}

                </div>

              </section>

              <section className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-6">

                <SectionTitle
                  icon={<Zap size={19} />}
                  title="Next Best Action"
                />

                <p className="mt-5 leading-7 text-slate-300">
                  {intelligence.next_best_action}
                </p>

              </section>

            </div>

            {/* CREATE DEAL */}
            <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="p-2 rounded-lg bg-emerald-500/10">

                  <Database
                    size={19}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-white">
                    Save to Deal Memory
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Save this analyzed intelligence as a new deal.
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <InputField
                  label="Company"
                  value={company}
                  onChange={setCompany}
                  placeholder="e.g. Acme Corporation"
                />

                <InputField
                  label="Product"
                  value={product}
                  onChange={setProduct}
                  placeholder="e.g. Enterprise AI Platform"
                />

                <InputField
                  label="Deal Value"
                  value={dealValue}
                  onChange={setDealValue}
                  placeholder="e.g. $420K"
                />

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Deal Stage
                  </label>

                  <select
                    value={stage}
                    onChange={(e) =>
                      setStage(e.target.value)
                    }
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-300 px-4 py-3 outline-none focus:border-cyan-500/50"
                  >
                    <option>Discovery</option>
                    <option>Evaluation</option>
                    <option>Proposal</option>
                    <option>Negotiation</option>
                    <option>Closed Won</option>
                    <option>Closed Lost</option>
                  </select>

                </div>

              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">

                {saveMessage && (

                  <p className="text-sm font-medium text-slate-400">
                    {saveMessage}
                  </p>

                )}

                <button
                  onClick={handleCreateDeal}
                  disabled={saving}
                  className="md:ml-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition"
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Creating Deal...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Create Deal
                    </>
                  )}

                </button>

              </div>

            </section>

          </div>

        )}

        {/* EMPTY WORKFLOW */}
        {!intelligence && !loading && (

          <div className="mt-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center gap-2 mb-5">

              <CheckCircle2
                size={19}
                className="text-cyan-400"
              />

              <h2 className="font-bold">
                Intelligence Workflow
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <ProcessStep
                number="01"
                title="Paste"
                description="Add raw customer conversations or notes."
              />

              <ProcessStep
                number="02"
                title="Extract"
                description="DealMind identifies important signals."
              />

              <ProcessStep
                number="03"
                title="Understand"
                description="Signals become structured deal intelligence."
              />

              <ProcessStep
                number="04"
                title="Act"
                description="Use the intelligence to decide what happens next."
              />

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

function ExtractionItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
        {icon}
      </div>

      <div>

        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

      <div className="flex items-center gap-2 text-slate-500">

        {icon}

        <span className="text-xs font-medium">
          {title}
        </span>

      </div>

      <p className="mt-3 text-lg font-bold text-white">
        {value}
      </p>

    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-white">

      <span className="text-cyan-400">
        {icon}
      </span>

      <h2 className="text-lg font-bold">
        {title}
      </h2>

    </div>
  );
}

function DNAItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
        {value}
      </p>

    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-500">
      {text}
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

      <span className="text-xs font-bold text-cyan-400">
        {number}
      </span>

      <h3 className="mt-2 font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-500/50"
      />

    </div>
  );
}

export default AnalyzeDeal;