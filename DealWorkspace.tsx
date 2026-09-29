import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Brain,
  ShieldAlert,
  Target,
  Users,
  Zap,
  FileText,
  Mail,
  Mic,
  Database,
  Upload,
  CheckCircle2,
  RefreshCw,
  History,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import {
  analyzeDealById,
  getDeals,
  ingestDealSource,
  getDealSources,
  getDealHindsight,
} from "../services/api";

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

interface HindsightResponse {
  success?: boolean;
  deal_id?: number;
  insights?: HindsightInsight[];
  historical_deal_count?: number;
}

const DealWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Deal Memory
  const [sourceType, setSourceType] = useState("meeting");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceContent, setSourceContent] = useState("");
  const [sources, setSources] = useState<any[]>([]);

  const [savingSource, setSavingSource] = useState(false);
  const [sourceSaved, setSourceSaved] = useState(false);

  // AI Analysis
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Hindsight
  const [hindsight, setHindsight] =
    useState<HindsightResponse | null>(null);

  const [hindsightLoading, setHindsightLoading] =
    useState(false);

  // Load Deal
  useEffect(() => {
    const loadDeal = async () => {
      try {
        const data = await getDeals();

        const deals = Array.isArray(data)
          ? data
          : data.deals || [];

        const selectedDeal = deals.find(
          (item: any) =>
            Number(item.id) === Number(id)
        );

        setDeal(selectedDeal || null);
      } catch (error) {
        console.error(
          "Failed to load deal:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDeal();
    }
  }, [id]);

  // Load Deal Memory
  const loadSources = async () => {
    if (!id) return;

    try {
      const data = await getDealSources(
        Number(id)
      );

      setSources(data.sources || []);
    } catch (error) {
      console.error(
        "Failed to load deal sources:",
        error
      );
    }
  };

  useEffect(() => {
    loadSources();
  }, [id]);

  // Load Hindsight
  const loadHindsight = async () => {
    if (!id) return;

    try {
      setHindsightLoading(true);

      const data = await getDealHindsight(
        Number(id)
      );

      setHindsight(data);
    } catch (error) {
      console.error(
        "Failed to load Hindsight:",
        error
      );

      setHindsight(null);
    } finally {
      setHindsightLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadHindsight();
    }
  }, [id]);

  // Save normal Deal Memory
  const handleSaveSource = async () => {
    if (!id) return;

    if (!sourceTitle.trim()) {
      alert("Please enter a source title.");
      return;
    }

    if (!sourceContent.trim()) {
      alert("Please enter the source content.");
      return;
    }

    try {
      setSavingSource(true);
      setSourceSaved(false);

      await ingestDealSource(
        Number(id),
        {
          source_type: sourceType,
          title: sourceTitle,
          content: sourceContent,
        }
      );

      await loadSources();

      // Refresh Hindsight after adding memory
      await loadHindsight();

      setSourceTitle("");
      setSourceContent("");

      setSourceSaved(true);

      setTimeout(() => {
        setSourceSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save deal source:",
        error
      );

      alert("Failed to save deal memory.");
    } finally {
      setSavingSource(false);
    }
  };

  // Upload PDF / DOCX / TXT
  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !id) return;

    try {
      setSavingSource(true);
      setSourceSaved(false);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `http://127.0.0.1:8000/api/deals/${id}/upload-document`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Document upload failed"
        );
      }

      await loadSources();

      await loadHindsight();

      setSourceSaved(true);

      setTimeout(() => {
        setSourceSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Document upload failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload document."
      );
    } finally {
      setSavingSource(false);

      event.target.value = "";
    }
  };

  // Analyze complete Deal Memory
  const handleAnalyze = async () => {
    if (!id) return;

    try {
      setAnalyzing(true);

      const data = await analyzeDealById(
        Number(id)
      );

      setAnalysis(data.analysis);

      // Refresh Hindsight because new
      // analysis can create additional memory
      await loadHindsight();
    } catch (error) {
      console.error(
        "Failed to analyze deal:",
        error
      );

      alert("Failed to analyze deal.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Source icon
  const getSourceIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail size={18} />;

      case "meeting":
        return <Mic size={18} />;

      case "document":
        return <FileText size={18} />;

      case "crm":
        return <Database size={18} />;

      default:
        return <FileText size={18} />;
    }
  };

  // Source label
  const getSourceLabel = (type: string) => {
    switch (type) {
      case "email":
        return "Email";

      case "meeting":
        return "Meeting";

      case "document":
        return "Document";

      case "crm":
        return "CRM Note";

      default:
        return "Source";
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw
            size={18}
            className="animate-spin"
          />
          Loading deal workspace...
        </div>
      </div>
    );
  }

  // Deal not found
  if (!deal) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">

        <button
          type="button"
          onClick={() => navigate("/deals")}
          className="flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Deals
        </button>

        <div className="mt-12 text-center">

          <h1 className="text-2xl font-semibold">
            Deal not found
          </h1>

          <p className="mt-2 text-slate-400">
            The selected deal could not be loaded.
          </p>

        </div>
      </div>
    );
  }

  const hindsightInsights =
    hindsight?.insights || [];

  const hindsightAlerts =
    hindsightInsights.filter(
      (insight) =>
        insight.type
          ?.toLowerCase()
          .includes("hindsight alert")
    );

  const hindsightPatterns =
    hindsightInsights.filter(
      (insight) =>
        !insight.type
          ?.toLowerCase()
          .includes("hindsight alert")
    );

  const allMemories = Array.from(
    new Set(
      hindsightInsights.flatMap(
        (insight) =>
          insight.hindsight_memories || []
      )
    )
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate("/deals")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to Deals
        </button>

        {/* DEAL HEADER */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Brain size={24} />
                </div>

                <div>

                  <p className="text-sm text-slate-400">
                    Deal Workspace
                  </p>

                  <h1 className="text-2xl md:text-3xl font-bold">
                    {deal.company}
                  </h1>

                </div>

              </div>

              <p className="mt-4 text-slate-400">
                {deal.product}
              </p>

            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-3 font-medium transition"
            >

              <Zap size={18} />

              {analyzing
                ? "Analyzing..."
                : "Analyze Deal"}

            </button>

          </div>

          {/* DEAL STATS */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">

              <p className="text-xs text-slate-500">
                Deal Value
              </p>

              <p className="mt-1 font-semibold">
                {deal.value}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">

              <p className="text-xs text-slate-500">
                Stage
              </p>

              <p className="mt-1 font-semibold">
                {deal.stage}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">

              <p className="text-xs text-slate-500">
                Health
              </p>

              <p className="mt-1 font-semibold">
                {deal.health}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">

              <p className="text-xs text-slate-500">
                Memory Sources
              </p>

              <p className="mt-1 font-semibold">
                {sources.length}
              </p>

            </div>

          </div>

        </div>

        {/* HINDSIGHT QUICK STATUS */}

        <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="p-3 rounded-xl bg-indigo-500/10">
                <Sparkles
                  size={22}
                  className="text-indigo-400"
                />
              </div>

              <div>

                <h2 className="font-semibold">
                  Hindsight Intelligence
                </h2>

                <p className="text-sm text-slate-400">
                  DealMind learns from historical deals
                  to identify patterns in this deal.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={loadHindsight}
              disabled={hindsightLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm hover:bg-slate-800 transition disabled:opacity-50"
            >

              <RefreshCw
                size={16}
                className={
                  hindsightLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh Hindsight

            </button>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">

              <p className="text-xs text-slate-500">
                Historical Deals
              </p>

              <p className="mt-1 text-xl font-bold">
                {hindsight?.historical_deal_count || 0}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">

              <p className="text-xs text-slate-500">
                Hindsight Patterns
              </p>

              <p className="mt-1 text-xl font-bold">
                {hindsightPatterns.length}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">

              <p className="text-xs text-slate-500">
                Hindsight Alerts
              </p>

              <p className="mt-1 text-xl font-bold text-amber-400">
                {hindsightAlerts.length}
              </p>

            </div>

          </div>

        </div>

        {/* HINDSIGHT ALERTS */}

        {hindsightAlerts.length > 0 && (

          <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="p-3 rounded-xl bg-amber-500/10">

                <AlertTriangle
                  size={22}
                  className="text-amber-400"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Hindsight Alerts
                </h2>

                <p className="text-sm text-slate-400">
                  Historical patterns that require attention
                  in the current deal.
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {hindsightAlerts.map(
                (insight, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-amber-500/20 bg-slate-950/60 p-5"
                  >

                    <div className="flex items-start gap-3">

                      <ShieldAlert
                        size={20}
                        className="text-amber-400 mt-1"
                      />

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold">
                            {insight.title}
                          </h3>

                          {insight.impact && (
                            <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-400">
                              {insight.impact}
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-sm text-slate-400 leading-6">
                          {insight.description}
                        </p>

                        {insight.recommendation && (

                          <div className="mt-4 rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4">

                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                              Recommended Action
                            </p>

                            <p className="mt-1 text-sm text-slate-300 leading-6">
                              {insight.recommendation}
                            </p>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* HINDSIGHT PATTERNS */}

        {hindsightPatterns.length > 0 && (

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="p-3 rounded-xl bg-purple-500/10">

                <History
                  size={22}
                  className="text-purple-400"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Historical Deal Patterns
                </h2>

                <p className="text-sm text-slate-400">
                  What happened in similar deals before.
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {hindsightPatterns.map(
                (insight, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                  >

                    <div className="flex items-start gap-3">

                      <Brain
                        size={20}
                        className="text-indigo-400 mt-1"
                      />

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold">
                            {insight.title}
                          </h3>

                          <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-xs text-indigo-300">
                            {insight.type}
                          </span>

                        </div>

                        <p className="mt-2 text-sm text-slate-400 leading-6">
                          {insight.description}
                        </p>

                        {insight.historical_outcomes && (

                          <div className="flex flex-wrap gap-2 mt-4">

                            <span className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                              Won:{" "}
                              {insight.historical_outcomes.won || 0}
                            </span>

                            <span className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                              Lost:{" "}
                              {insight.historical_outcomes.lost || 0}
                            </span>

                            <span className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                              Stalled:{" "}
                              {insight.historical_outcomes.stalled || 0}
                            </span>

                          </div>

                        )}

                        {insight.recommendation && (

                          <div className="mt-4 rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-4">

                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                              DealMind Recommendation
                            </p>

                            <p className="mt-1 text-sm text-slate-300 leading-6">
                              {insight.recommendation}
                            </p>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* HINDSIGHT MEMORIES */}

        {allMemories.length > 0 && (

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="p-3 rounded-xl bg-cyan-500/10">

                <Database
                  size={22}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Retrieved Hindsight Memories
                </h2>

                <p className="text-sm text-slate-400">
                  Relevant memories recalled from Hindsight.
                </p>

              </div>

            </div>

            <div className="space-y-3">

              {allMemories.map(
                (memory, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4"
                  >

                    <div className="flex items-start gap-3">

                      <Brain
                        size={17}
                        className="text-cyan-400 mt-1"
                      />

                      <p className="text-sm text-slate-300 leading-6">
                        {memory}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* ADD DEAL MEMORY */}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

          <div className="flex items-start gap-4 mb-6">

            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Upload size={22} />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Add Deal Memory
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Add emails, meetings, documents, or CRM
                notes to make DealMind smarter.
              </p>

            </div>

          </div>

          {/* SOURCE TYPE */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">

            {/* MEETING */}

            <button
              type="button"
              onClick={() =>
                setSourceType("meeting")
              }
              className={`rounded-xl border p-4 text-left transition ${
                sourceType === "meeting"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
              }`}
            >

              <Mic
                size={20}
                className="mb-2 text-indigo-400"
              />

              <p className="font-medium">
                Meeting
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Meeting notes
              </p>

            </button>

            {/* EMAIL */}

            <button
              type="button"
              onClick={() =>
                setSourceType("email")
              }
              className={`rounded-xl border p-4 text-left transition ${
                sourceType === "email"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
              }`}
            >

              <Mail
                size={20}
                className="mb-2 text-indigo-400"
              />

              <p className="font-medium">
                Email
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Customer emails
              </p>

            </button>

            {/* DOCUMENT */}

            <label
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${
                sourceType === "document"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
              }`}
            >

              <FileText
                size={20}
                className="mb-2 text-indigo-400"
              />

              <p className="font-medium">
                Document
              </p>

              <p className="text-xs text-slate-500 mt-1">
                PDF, DOCX & TXT files
              </p>

              <input
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(event) => {
                  setSourceType("document");
                  handleDocumentUpload(event);
                }}
                disabled={savingSource}
              />

            </label>

            {/* CRM */}

            <button
              type="button"
              onClick={() =>
                setSourceType("crm")
              }
              className={`rounded-xl border p-4 text-left transition ${
                sourceType === "crm"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
              }`}
            >

              <Database
                size={20}
                className="mb-2 text-indigo-400"
              />

              <p className="font-medium">
                CRM Note
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Sales notes
              </p>

            </button>

          </div>

          {/* TITLE */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source Title
            </label>

            <input
              type="text"
              value={sourceTitle}
              onChange={(event) =>
                setSourceTitle(
                  event.target.value
                )
              }
              placeholder={`Example: Acme ${getSourceLabel(
                sourceType
              )}`}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500"
            />

          </div>

          {/* CONTENT */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source Content
            </label>

            <textarea
              value={sourceContent}
              onChange={(event) =>
                setSourceContent(
                  event.target.value
                )
              }
              placeholder="Paste meeting notes, customer email, proposal text, CRM notes, or other deal information..."
              rows={7}
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500"
            />

          </div>

          {/* SAVE */}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            <button
              type="button"
              onClick={handleSaveSource}
              disabled={
                savingSource ||
                sourceType === "document"
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-3 font-medium transition"
            >

              {savingSource ? (
                "Saving..."
              ) : (
                <>
                  <Upload size={18} />
                  Save to Deal Memory
                </>
              )}

            </button>

            {sourceSaved && (

              <div className="flex items-center gap-2 text-emerald-400 text-sm">

                <CheckCircle2 size={18} />

                Memory added successfully

              </div>

            )}

          </div>

        </div>

        {/* DEAL MEMORY LIST */}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Brain size={22} />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Deal Memory
              </h2>

              <p className="text-sm text-slate-400">
                Everything DealMind knows about this deal.
              </p>

            </div>

          </div>

          {sources.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">

              <Database
                size={32}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-slate-400">
                No additional deal memory yet.
              </p>

              <p className="text-sm text-slate-600 mt-1">
                Add a meeting, email, document, or CRM note above.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {sources.map((source) => (

                <div
                  key={source.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                >

                  <div className="flex items-start gap-4">

                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">

                      {getSourceIcon(
                        source.source_type
                      )}

                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                        <h3 className="font-semibold">
                          {source.title}
                        </h3>

                        <span className="w-fit rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                          {getSourceLabel(
                            source.source_type
                          )}
                        </span>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400 whitespace-pre-wrap">
                        {source.content}
                      </p>

                      {source.created_at && (

                        <p className="mt-4 text-xs text-slate-600">

                          Added{" "}

                          {new Date(
                            source.created_at
                          ).toLocaleString()}

                        </p>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* AI ANALYSIS */}

        {analysis && (

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Zap size={22} />
              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  DealMind Intelligence
                </h2>

                <p className="text-sm text-slate-400">
                  Analysis generated from the complete Deal Memory.
                </p>

              </div>

            </div>

            {/* SUMMARY */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                <p className="text-xs text-slate-500">
                  Deal Health
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {analysis.deal_health ||
                    "Unknown"}
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                <p className="text-xs text-slate-500">
                  Sentiment
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {analysis.sentiment ||
                    "Unknown"}
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                <p className="text-xs text-slate-500">
                  Competitors
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {analysis.competitors?.length ||
                    0}
                </p>

              </div>

            </div>

            {/* RISKS */}

            {analysis.risks?.length > 0 && (

              <div className="mb-6">

                <div className="flex items-center gap-2 mb-3">

                  <ShieldAlert
                    size={18}
                    className="text-red-400"
                  />

                  <h3 className="font-semibold">
                    Risks
                  </h3>

                </div>

                <div className="space-y-3">

                  {analysis.risks.map(
                    (
                      risk: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="rounded-xl border border-red-500/10 bg-red-500/5 p-4"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <p className="font-medium">
                            {risk.title}
                          </p>

                          <span className="text-xs text-red-400">
                            {risk.severity}
                          </span>

                        </div>

                        <p className="text-sm text-slate-400 mt-2">
                          {risk.description}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {/* BUYING SIGNALS */}

            {analysis.buying_signals?.length > 0 && (

              <div className="mb-6">

                <div className="flex items-center gap-2 mb-3">

                  <Target
                    size={18}
                    className="text-emerald-400"
                  />

                  <h3 className="font-semibold">
                    Buying Signals
                  </h3>

                </div>

                <div className="space-y-2">

                  {analysis.buying_signals.map(
                    (
                      signal: string,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-sm text-slate-300"
                      >
                        {signal}
                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {/* STAKEHOLDERS */}

            {analysis.stakeholders?.length > 0 && (

              <div className="mb-6">

                <div className="flex items-center gap-2 mb-3">

                  <Users
                    size={18}
                    className="text-blue-400"
                  />

                  <h3 className="font-semibold">
                    Stakeholders
                  </h3>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {analysis.stakeholders.map(
                    (
                      stakeholder: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                      >

                        <p className="font-medium">
                          {stakeholder.name}
                        </p>

                        <p className="text-sm text-indigo-400 mt-1">
                          {stakeholder.role}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                          {stakeholder.focus}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {/* NEXT BEST ACTION */}

            {analysis.next_best_action && (

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">

                <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  Next Best Action
                </p>

                <p className="mt-2 text-slate-200 leading-7">
                  {analysis.next_best_action}
                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default DealWorkspace;