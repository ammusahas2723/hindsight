import { useEffect, useState } from "react";
import {
  Brain,
  Database,
  FileText,
  History,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

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

interface DealSource {
  id: number;
  source_type: string;
  title: string;
  content: string;
  created_at: string;
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

interface HindsightResponse {
  success: boolean;
  deal_id: number;
  insights: HindsightInsight[];
  historical_deal_count: number;
}

export default function Memory() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] =
    useState<Deal | null>(null);

  const [sources, setSources] =
    useState<DealSource[]>([]);

  const [hindsight, setHindsight] =
    useState<HindsightResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [memoryLoading, setMemoryLoading] =
    useState(false);

  const loadDeals = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/deals/");

      setDeals(response.data);

      if (response.data.length > 0) {
        setSelectedDeal(response.data[0]);
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

  const loadMemory = async (deal: Deal) => {
    try {
      setMemoryLoading(true);

      const [sourcesResponse, hindsightResponse] =
        await Promise.all([
          api.get(
            `/api/deals/${deal.id}/sources`
          ),
          api.post(
            `/api/deals/${deal.id}/hindsight`
          ),
        ]);

      setSources(
        sourcesResponse.data.sources || []
      );

      setHindsight(
        hindsightResponse.data
      );
    } catch (error) {
      console.error(
        "Failed to load deal memory:",
        error
      );

      setSources([]);
      setHindsight(null);
    } finally {
      setMemoryLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  useEffect(() => {
    if (selectedDeal) {
      loadMemory(selectedDeal);
    }
  }, [selectedDeal]);

  const refreshMemory = () => {
    if (selectedDeal) {
      loadMemory(selectedDeal);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw
            className="animate-spin"
            size={20}
          />
          Loading Deal Memory...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Brain
                  size={26}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Deal Memory
                </h1>

                <p className="text-sm text-slate-400">
                  Long-term memory powered by Hindsight
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={refreshMemory}
            disabled={
              memoryLoading ||
              !selectedDeal
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                memoryLoading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Memory
          </button>

        </div>

        {/* DEAL SELECTOR */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">
            <Database
              size={18}
              className="text-indigo-400"
            />

            <h2 className="font-semibold">
              Select Deal
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">

            {deals.map((deal) => (

              <button
                key={deal.id}
                onClick={() =>
                  setSelectedDeal(deal)
                }
                className={`min-w-[220px] text-left p-4 rounded-xl border transition ${
                  selectedDeal?.id === deal.id
                    ? "bg-indigo-500/10 border-indigo-500/50"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >

                <div className="font-semibold">
                  {deal.company}
                </div>

                <div className="text-sm text-slate-400 mt-1">
                  {deal.product}
                </div>

                <div className="flex items-center justify-between mt-3">

                  <span className="text-sm text-slate-300">
                    {deal.value}
                  </span>

                  <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                    {deal.stage}
                  </span>

                </div>

              </button>

            ))}

          </div>

        </div>

        {selectedDeal && (

          <>
            {/* MEMORY STATUS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <div className="flex items-center gap-3">

                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Brain
                      size={20}
                      className="text-indigo-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">
                      Hindsight Memory
                    </p>

                    <p className="font-semibold text-emerald-400">
                      Connected
                    </p>
                  </div>

                </div>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <div className="flex items-center gap-3">

                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FileText
                      size={20}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">
                      Stored Sources
                    </p>

                    <p className="text-xl font-bold">
                      {sources.length}
                    </p>
                  </div>

                </div>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <div className="flex items-center gap-3">

                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <History
                      size={20}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">
                      Historical Deals
                    </p>

                    <p className="text-xl font-bold">
                      {hindsight?.historical_deal_count || 0}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* CURRENT DEAL MEMORY */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <Search
                    size={20}
                    className="text-indigo-400"
                  />

                  <div>
                    <h2 className="font-semibold">
                      Current Deal Memory
                    </h2>

                    <p className="text-xs text-slate-400">
                      Information remembered about this deal
                    </p>
                  </div>

                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-xs text-slate-500">
                      Company
                    </p>

                    <p className="mt-1 font-medium">
                      {selectedDeal.company}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Product
                    </p>

                    <p className="mt-1">
                      {selectedDeal.product}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Deal Value
                    </p>

                    <p className="mt-1">
                      {selectedDeal.value}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Stage
                    </p>

                    <p className="mt-1">
                      {selectedDeal.stage}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Health
                    </p>

                    <p className="mt-1">
                      {selectedDeal.health}
                    </p>
                  </div>

                </div>

              </div>

              {/* ORIGINAL NOTES */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <FileText
                    size={20}
                    className="text-blue-400"
                  />

                  <div>
                    <h2 className="font-semibold">
                      Original Deal Notes
                    </h2>

                    <p className="text-xs text-slate-400">
                      Information stored with the deal
                    </p>
                  </div>

                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-72 overflow-y-auto">

                  {selectedDeal.source_text ? (
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-6">
                      {selectedDeal.source_text}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No original notes available.
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* UPLOADED / INGESTED SOURCES */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-5">

                <Database
                  size={20}
                  className="text-cyan-400"
                />

                <div>
                  <h2 className="font-semibold">
                    Ingested Deal Sources
                  </h2>

                  <p className="text-xs text-slate-400">
                    Emails, documents, meeting notes and other deal information
                  </p>
                </div>

              </div>

              {sources.length === 0 ? (

                <div className="text-center py-10 text-slate-500">
                  No additional sources have been added yet.
                </div>

              ) : (

                <div className="space-y-3">

                  {sources.map((source) => (

                    <div
                      key={source.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="p-2 rounded-lg bg-slate-800">
                            <FileText size={17} />
                          </div>

                          <div>

                            <p className="font-medium">
                              {source.title}
                            </p>

                            <p className="text-xs text-slate-500">
                              {source.source_type}
                            </p>

                          </div>

                        </div>

                        <span className="text-xs text-slate-500">
                          {new Date(
                            source.created_at
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      <p className="text-sm text-slate-400 mt-3 line-clamp-3">
                        {source.content}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* HINDSIGHT INTELLIGENCE */}

            <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                  <div className="p-3 rounded-xl bg-indigo-500/10">
                    <Sparkles
                      size={22}
                      className="text-indigo-400"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Hindsight Intelligence
                    </h2>

                    <p className="text-sm text-slate-400">
                      What DealMind remembers from previous deals
                    </p>
                  </div>

                </div>

                {memoryLoading && (
                  <RefreshCw
                    size={18}
                    className="animate-spin text-indigo-400"
                  />
                )}

              </div>

              {!memoryLoading &&
              hindsight?.insights?.length === 0 ? (

                <div className="text-center py-10">

                  <Brain
                    size={35}
                    className="mx-auto text-slate-600 mb-3"
                  />

                  <p className="text-slate-400">
                    No historical intelligence found yet.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {hindsight?.insights?.map(
                    (insight, index) => (

                      <div
                        key={index}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-5"
                      >

                        <div className="flex items-start gap-3">

                          <div className="mt-1">

                            {insight.type
                              ?.toLowerCase()
                              .includes("alert") ? (
                              <ShieldAlert
                                size={20}
                                className="text-amber-400"
                              />
                            ) : (
                              <Brain
                                size={20}
                                className="text-indigo-400"
                              />
                            )}

                          </div>

                          <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="font-semibold">
                                {insight.title}
                              </h3>

                              <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300">
                                {insight.type}
                              </span>

                              {insight.impact && (
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                                  {insight.impact}
                                </span>
                              )}

                            </div>

                            <p className="text-sm text-slate-400 mt-2 leading-6">
                              {insight.description}
                            </p>

                            {insight.recommendation && (
                              <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">

                                <p className="text-xs text-emerald-400 font-medium">
                                  Recommended Action
                                </p>

                                <p className="text-sm text-slate-300 mt-1">
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

              )}

            </div>

            {/* MEMORY FOOTER */}

            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5">

              <div className="flex items-start gap-3">

                <Brain
                  size={21}
                  className="text-indigo-400 mt-0.5"
                />

                <div>

                  <h3 className="font-medium">
                    DealMind remembers
                  </h3>

                  <p className="text-sm text-slate-400 mt-1 leading-6">
                    Deal information, uploaded documents,
                    AI analysis and historical deal patterns
                    can be connected through Hindsight to
                    improve future decisions.
                  </p>

                </div>

              </div>

            </div>

          </>

        )}

      </div>
    </div>
  );
}