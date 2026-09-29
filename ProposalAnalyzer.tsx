import { useState } from "react";
import {
  FileText,
  ShieldAlert,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { analyzeProposal } from "../services/api";

interface ProposalResult {
  summary?: string;
  risks?: string[];
  pricing?: string[];
  stakeholders?: string[];
  missing_information?: string[];
  recommendations?: string[];
}

export default function ProposalAnalyzer() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<ProposalResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeProposal(content);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Unable to analyze proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <FileText className="text-blue-400" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Proposal Analyzer
              </h1>

              <p className="text-gray-400 mt-1">
                Analyze proposals for risks, pricing, stakeholders and missing information.
              </p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">

          <label className="block text-sm text-gray-400 mb-3">
            Paste Proposal Content
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste proposal, RFP or customer requirements here..."
            rows={12}
            className="w-full bg-[#081522] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 resize-none"
          />

          <button
            onClick={analyze}
            disabled={loading || !content.trim()}
            className="mt-4 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText size={20} />
                Analyze Proposal
              </>
            )}
          </button>

        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* Summary */}
            {result.summary && (
              <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-3">
                  AI Summary
                </h2>

                <p className="text-gray-300 leading-7">
                  {result.summary}
                </p>
              </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <ResultCard
                title="Risks"
                icon={<ShieldAlert size={21} />}
                items={result.risks}
                empty="No major risks detected."
              />

              <ResultCard
                title="Pricing Intelligence"
                icon={<DollarSign size={21} />}
                items={result.pricing}
                empty="No pricing signals detected."
              />

              <ResultCard
                title="Stakeholders"
                icon={<Users size={21} />}
                items={result.stakeholders}
                empty="No stakeholder information detected."
              />

              <ResultCard
                title="Missing Information"
                icon={<AlertTriangle size={21} />}
                items={result.missing_information}
                empty="No obvious missing information."
              />

            </div>

            {/* Recommendations */}
            {result.recommendations &&
              result.recommendations.length > 0 && (
                <div className="bg-[#0d1b2a] border border-green-500/20 rounded-2xl p-6">

                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2
                      size={22}
                      className="text-green-400"
                    />

                    <h2 className="text-xl font-semibold">
                      Recommended Actions
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {result.recommendations.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex gap-3 text-gray-300"
                        >
                          <span className="text-green-400">
                            •
                          </span>

                          <span>{item}</span>
                        </div>
                      )
                    )}
                  </div>

                </div>
              )}

          </div>
        )}

      </div>
    </div>
  );
}

function ResultCard({
  title,
  icon,
  items,
  empty,
}: {
  title: string;
  icon: React.ReactNode;
  items?: string[];
  empty: string;
}) {
  return (
    <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-4">
        <div className="text-blue-400">
          {icon}
        </div>

        <h2 className="font-semibold text-lg">
          {title}
        </h2>
      </div>

      {items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="text-gray-300 text-sm leading-6"
            >
              • {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          {empty}
        </p>
      )}

    </div>
  );
}