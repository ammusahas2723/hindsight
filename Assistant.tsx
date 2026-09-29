import { useEffect, useState } from "react";
import { Bot, Send, Brain, Loader2 } from "lucide-react";
import { askDealAssistant, getDeals } from "../services/api";

interface Deal {
  id: number;
  company: string;
  product: string;
  value: string;
  stage: string;
  health: string;
}

export default function Assistant() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);

      if (data.length > 0) {
        setSelectedDeal(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const askAssistant = async () => {
    if (!selectedDeal || !question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const result = await askDealAssistant(
        selectedDeal,
        question
      );

      setAnswer(result.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Unable to connect to the AI Deal Assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Bot className="text-blue-400" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                AI Deal Assistant
              </h1>

              <p className="text-gray-400 mt-1">
                Ask questions using current deal memory and Hindsight.
              </p>
            </div>
          </div>
        </div>

        {/* Deal Selector */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5 mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Select Deal
          </label>

          <select
            value={selectedDeal ?? ""}
            onChange={(e) =>
              setSelectedDeal(Number(e.target.value))
            }
            className="w-full bg-[#081522] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
          >
            {deals.map((deal) => (
              <option key={deal.id} value={deal.id}>
                {deal.company} — {deal.product}
              </option>
            ))}
          </select>
        </div>

        {/* Suggested Questions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {[
            "What is the biggest risk in this deal?",
            "What should I do before the next meeting?",
            "What happened in similar historical deals?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="text-left bg-[#0d1b2a] border border-white/10 rounded-xl p-4 hover:border-blue-500/50 transition"
            >
              <p className="text-sm text-gray-300">
                {q}
              </p>
            </button>
          ))}

        </div>

        {/* Question Box */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">

          <div className="flex gap-3">

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askAssistant();
                }
              }}
              placeholder="Ask anything about this deal..."
              className="flex-1 bg-[#081522] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />

            <button
              onClick={askAssistant}
              disabled={loading || !question.trim()}
              className="px-5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition flex items-center gap-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}

              Ask
            </button>

          </div>
        </div>

        {/* Answer */}
        {answer && (
          <div className="mt-6 bg-[#0d1b2a] border border-blue-500/20 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="p-2 rounded-lg bg-blue-500/10">
                <Brain
                  size={22}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h2 className="font-semibold">
                  DealMind Intelligence
                </h2>

                <p className="text-xs text-green-400">
                  Hindsight connected
                </p>
              </div>

            </div>

            <p className="text-gray-300 leading-7">
              {answer}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}