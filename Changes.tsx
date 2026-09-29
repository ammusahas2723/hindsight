import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  FileText,
  Lock,
  RefreshCw,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getDeals, getDealChanges } from "../services/api";

type Deal = {
  id: number;
  company: string;
  product: string;
  value: string;
  stage: string;
  health: string;
};

type ChangeItem = {
  type?: string;
  title?: string;
  description?: string;
  impact?: string;
  recommendation?: string;
};

const Changes = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setError("");

      const data = await getDeals();

      setDeals(data);

      if (data.length > 0) {
        setSelectedDealId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load deals.");
    }
  };

  const analyzeChanges = async () => {
    if (!selectedDealId) {
      setError("Please select a deal first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getDealChanges(selectedDealId);

      console.log("Changes analysis:", result);

      /*
        Different backend versions may return the changes
        under different property names.
      */
      const detected =
        result?.changes ||
        result?.detected_changes ||
        result?.items ||
        [];

      setChanges(Array.isArray(detected) ? detected : []);
    } catch (err) {
      console.error(err);
      setError("Could not analyze changes.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type?: string) => {
    const value = (type || "").toLowerCase();

    if (value.includes("pricing") || value.includes("price")) {
      return <DollarSign size={20} />;
    }

    if (value.includes("security")) {
      return <Lock size={20} />;
    }

    if (value.includes("competitor")) {
      return <Target size={20} />;
    }

    if (value.includes("stakeholder") || value.includes("cfo")) {
      return <Users size={20} />;
    }

    if (value.includes("proposal")) {
      return <FileText size={20} />;
    }

    if (value.includes("urgency")) {
      return <Zap size={20} />;
    }

    return <AlertTriangle size={20} />;
  };

  const getImpactStyle = (impact?: string) => {
    const value = (impact || "").toLowerCase();

    if (
      value.includes("high") ||
      value.includes("critical") ||
      value.includes("risk")
    ) {
      return "text-red-400 bg-red-500/10 border-red-500/20";
    }

    if (value.includes("medium")) {
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }

    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-indigo-400 font-medium">
              DEAL INTELLIGENCE
            </p>

            <h1 className="text-3xl font-bold mt-1">
              What Changed?
            </h1>

            <p className="text-slate-400 mt-2">
              Detect important changes in a deal and understand their impact.
            </p>
          </div>

          <button
            onClick={analyzeChanges}
            disabled={loading || !selectedDealId}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-3 font-medium transition"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />

            {loading ? "Analyzing..." : "Analyze Changes"}
          </button>
        </div>

        {/* DEAL SELECTOR */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Deal
          </label>

          <select
            value={selectedDealId ?? ""}
            onChange={(e) =>
              setSelectedDealId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full md:w-96 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          >
            {deals.length === 0 && (
              <option value="">No deals available</option>
            )}

            {deals.map((deal) => (
              <option key={deal.id} value={deal.id}>
                {deal.company} — {deal.product}
              </option>
            ))}
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && changes.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
            <RefreshCw
              size={40}
              className="mx-auto text-slate-600 mb-4"
            />

            <h2 className="text-xl font-semibold">
              No changes analyzed yet
            </h2>

            <p className="text-slate-500 mt-2">
              Select a deal and click “Analyze Changes” to detect
              new risks, pricing changes, competitor activity and
              other important deal movements.
            </p>
          </div>
        )}

        {/* RESULTS */}
        {changes.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={20}
                className="text-emerald-400"
              />

              <h2 className="text-xl font-semibold">
                Detected Changes
              </h2>
            </div>

            {changes.map((change, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    {getIcon(change.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-indigo-400">
                          {change.type || "Change detected"}
                        </p>

                        <h3 className="text-lg font-semibold mt-1">
                          {change.title || "Important deal change"}
                        </h3>
                      </div>

                      {change.impact && (
                        <span
                          className={`rounded-lg border px-3 py-1 text-xs font-medium ${getImpactStyle(
                            change.impact
                          )}`}
                        >
                          {change.impact}
                        </span>
                      )}
                    </div>

                    {change.description && (
                      <p className="text-slate-400 mt-3 leading-relaxed">
                        {change.description}
                      </p>
                    )}

                    {change.recommendation && (
                      <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                          Recommended Action
                        </p>

                        <p className="text-slate-300 mt-1">
                          {change.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Changes;