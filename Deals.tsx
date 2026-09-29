import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Package,
  DollarSign,
  Layers3,
  Activity,
  FileText,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { createDeal } from "../services/api";

function NewDeal() {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [stage, setStage] = useState("Discovery");
  const [health, setHealth] = useState("Healthy");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateDeal = async () => {
    setError("");
    setSuccess("");

    if (!company.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (!product.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (!dealValue.trim()) {
      setError("Please enter the deal value.");
      return;
    }

    if (!notes.trim()) {
      setError("Please add some initial deal notes.");
      return;
    }

    try {
      setLoading(true);

      const createdDeal = await createDeal({
        company: company.trim(),
        product: product.trim(),
        value: dealValue.trim(),
        stage,
        health,
        source_text: notes.trim(),
      });

      setSuccess("Deal created successfully.");

      setTimeout(() => {
        navigate(`/deals/${createdDeal.id}`);
      }, 700);

    } catch (err) {
      console.error("Failed to create deal:", err);
      setError(
        "Unable to create the deal. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* BACK */}

        <button
          onClick={() => navigate("/deals")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Deals
        </button>

        {/* HEADER */}

        <div className="mb-8">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Sparkles
                size={21}
                className="text-cyan-400"
              />
            </div>

            <div>

              <p className="text-sm text-cyan-400 font-medium">
                Deal Intelligence
              </p>

              <h1 className="text-3xl font-bold">
                Create New Deal
              </h1>

            </div>

          </div>

          <p className="text-slate-400 max-w-2xl">
            Create a deal and give DealMind its initial context.
            This information becomes the foundation of the deal's memory.
          </p>

        </div>

        {/* MAIN CARD */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* CARD HEADER */}

          <div className="px-7 py-6 border-b border-slate-800">

            <h2 className="text-lg font-semibold">
              Deal Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Enter the basic information about this opportunity.
            </p>

          </div>

          <div className="p-7 space-y-7">

            {/* BASIC INFORMATION */}

            <div>

              <div className="flex items-center gap-2 mb-4">

                <Building2
                  size={17}
                  className="text-cyan-400"
                />

                <h3 className="font-semibold">
                  Basic Information
                </h3>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <InputField
                  label="Company"
                  placeholder="e.g. ACME Technologies"
                  value={company}
                  onChange={setCompany}
                  icon={<Building2 size={17} />}
                />

                <InputField
                  label="Product"
                  placeholder="e.g. DealMind Enterprise"
                  value={product}
                  onChange={setProduct}
                  icon={<Package size={17} />}
                />

                <InputField
                  label="Deal Value"
                  placeholder="e.g. $85,000"
                  value={dealValue}
                  onChange={setDealValue}
                  icon={<DollarSign size={17} />}
                />

                {/* STAGE */}

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deal Stage
                  </label>

                  <div className="relative">

                    <Layers3
                      size={17}
                      className="absolute left-3.5 top-3.5 text-slate-500"
                    />

                    <select
                      value={stage}
                      onChange={(e) =>
                        setStage(e.target.value)
                      }
                      className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    >
                      <option value="Discovery">
                        Discovery
                      </option>

                      <option value="Qualification">
                        Qualification
                      </option>

                      <option value="Evaluation">
                        Evaluation
                      </option>

                      <option value="Proposal">
                        Proposal
                      </option>

                      <option value="Negotiation">
                        Negotiation
                      </option>

                      <option value="Closed Won">
                        Closed Won
                      </option>

                      <option value="Closed Lost">
                        Closed Lost
                      </option>

                      <option value="Stalled">
                        Stalled
                      </option>

                    </select>

                  </div>

                </div>

                {/* HEALTH */}

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deal Health
                  </label>

                  <div className="relative">

                    <Activity
                      size={17}
                      className="absolute left-3.5 top-3.5 text-slate-500"
                    />

                    <select
                      value={health}
                      onChange={(e) =>
                        setHealth(e.target.value)
                      }
                      className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    >
                      <option value="Healthy">
                        Healthy
                      </option>

                      <option value="Moderate Risk">
                        Moderate Risk
                      </option>

                      <option value="At Risk">
                        At Risk
                      </option>

                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* INITIAL MEMORY */}

            <div>

              <div className="flex items-center gap-2 mb-4">

                <FileText
                  size={17}
                  className="text-cyan-400"
                />

                <div>

                  <h3 className="font-semibold">
                    Initial Deal Memory
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Add the information DealMind should remember about this deal.
                  </p>

                </div>

              </div>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder={`Example:

Customer is evaluating our enterprise platform.

The IT team has raised security and implementation concerns.

The CFO is involved in the commercial decision.

Customer is comparing us with Salesforce.

They requested revised pricing and security documentation.`}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 outline-none resize-none focus:border-cyan-500/50"
              />

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">

                <Sparkles size={14} />

                <span>
                  These notes will become part of the deal's persistent memory.
                </span>

              </div>

            </div>

            {/* ERROR */}

            {error && (

              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">

                <Activity
                  size={18}
                  className="text-red-400 mt-0.5"
                />

                <p className="text-sm text-red-300">
                  {error}
                </p>

              </div>

            )}

            {/* SUCCESS */}

            {success && (

              <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">

                <CheckCircle2
                  size={18}
                  className="text-emerald-400 mt-0.5"
                />

                <p className="text-sm text-emerald-300">
                  {success}
                </p>

              </div>

            )}

          </div>

          {/* FOOTER */}

          <div className="px-7 py-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="text-xs text-slate-500">
              You can add emails, meetings and documents later.
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => navigate("/deals")}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateDeal}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm transition"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Create Deal
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

        {/* MEMORY FLOW */}

        <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center gap-2 mb-3">

            <Sparkles
              size={17}
              className="text-cyan-400"
            />

            <h3 className="font-semibold">
              What happens next?
            </h3>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <FlowItem
              number="01"
              title="Remember"
              text="DealMind stores the initial deal context."
            />

            <FlowItem
              number="02"
              title="Analyze"
              text="AI extracts risks, signals and stakeholders."
            />

            <FlowItem
              number="03"
              title="Learn"
              text="Future deal activity strengthens the memory."
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      <div className="relative">

        <div className="absolute left-3.5 top-3.5 text-slate-500">
          {icon}
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50"
        />

      </div>

    </div>
  );
}

function FlowItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

      <div className="text-xs text-cyan-400 font-bold mb-2">
        {number}
      </div>

      <h4 className="font-semibold text-sm">
        {title}
      </h4>

      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        {text}
      </p>

    </div>
  );
}

export default NewDeal;