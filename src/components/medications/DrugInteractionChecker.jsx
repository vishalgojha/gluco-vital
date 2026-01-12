import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Shield, CheckCircle, Loader2, Info, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function DrugInteractionChecker({ medications = [], open, onOpenChange }) {
  const [checking, setChecking] = useState(false);
  const [interactions, setInteractions] = useState(null);

  const checkInteractions = async () => {
    if (medications.length < 2) {
      toast.info("Need at least 2 medications to check interactions");
      return;
    }

    setChecking(true);
    setInteractions(null);

    try {
      const medList = medications.map(m => m.medication_name || m.name).join(", ");
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a pharmacist assistant. Check for drug interactions between these medications: ${medList}

For each potential interaction found:
1. List the two drugs involved
2. Severity (major, moderate, minor)
3. Description of the interaction
4. Clinical recommendation

Also provide:
- General safety notes for this combination
- Any food/lifestyle interactions to be aware of

Be thorough but only report clinically significant interactions.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            interactions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  drug1: { type: "string" },
                  drug2: { type: "string" },
                  severity: { type: "string", enum: ["major", "moderate", "minor"] },
                  description: { type: "string" },
                  recommendation: { type: "string" }
                }
              }
            },
            food_interactions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  drug: { type: "string" },
                  food_item: { type: "string" },
                  effect: { type: "string" }
                }
              }
            },
            general_notes: { type: "string" },
            overall_safety: { type: "string", enum: ["safe", "caution", "consult_doctor"] }
          }
        }
      });

      setInteractions(result);
    } catch (error) {
      console.error("Interaction check error:", error);
      toast.error("Failed to check interactions");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (open && medications.length >= 2 && !interactions) {
      checkInteractions();
    }
  }, [open]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "major": return "bg-red-100 text-red-700 border-red-200";
      case "moderate": return "bg-amber-100 text-amber-700 border-amber-200";
      case "minor": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "major": return <AlertTriangle className="w-4 h-4" />;
      case "moderate": return <Info className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getOverallIcon = (safety) => {
    switch (safety) {
      case "safe": return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "caution": return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "consult_doctor": return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default: return <Shield className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-500" />
            Drug Interaction Check
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Medications Being Checked */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-2">Checking interactions for:</p>
            <div className="flex flex-wrap gap-2">
              {medications.map((med, idx) => (
                <span key={idx} className="px-2 py-1 bg-white rounded-full text-xs border border-slate-200">
                  {med.medication_name || med.name}
                </span>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {checking && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-2" />
              <p className="text-sm text-slate-500">Checking interactions...</p>
            </div>
          )}

          {/* Results */}
          {interactions && !checking && (
            <div className="space-y-4">
              {/* Overall Safety */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                interactions.overall_safety === "safe" ? "bg-green-50 border-green-200" :
                interactions.overall_safety === "caution" ? "bg-amber-50 border-amber-200" :
                "bg-red-50 border-red-200"
              }`}>
                {getOverallIcon(interactions.overall_safety)}
                <div>
                  <p className="font-medium">
                    {interactions.overall_safety === "safe" ? "No Major Concerns" :
                     interactions.overall_safety === "caution" ? "Use With Caution" :
                     "Consult Your Doctor"}
                  </p>
                  <p className="text-sm mt-1">{interactions.general_notes}</p>
                </div>
              </div>

              {/* Drug-Drug Interactions */}
              {interactions.interactions?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Drug Interactions</h4>
                  {interactions.interactions.map((int, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(int.severity)}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {getSeverityIcon(int.severity)}
                        <span className="font-medium text-sm">
                          {int.drug1} + {int.drug2}
                        </span>
                        <span className="ml-auto text-xs uppercase font-medium px-2 py-0.5 rounded-full bg-white/50">
                          {int.severity}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{int.description}</p>
                      <p className="text-xs mt-2 opacity-75">
                        <strong>Recommendation:</strong> {int.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {interactions.interactions?.length === 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">No Drug Interactions Found</p>
                  <p className="text-sm text-green-600 mt-1">These medications appear safe to take together</p>
                </div>
              )}

              {/* Food Interactions */}
              {interactions.food_interactions?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Food & Lifestyle Notes</h4>
                  {interactions.food_interactions.map((int, idx) => (
                    <div key={idx} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm">
                        <strong>{int.drug}</strong> + <strong>{int.food_item}</strong>
                      </p>
                      <p className="text-xs mt-1 text-amber-700">{int.effect}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Refresh Button */}
              <Button variant="outline" onClick={checkInteractions} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" /> Re-check Interactions
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-3 bg-slate-100 rounded-lg">
            <p className="text-xs text-slate-500">
              <strong>⚠️ Disclaimer:</strong> This tool provides general information only and is not a substitute 
              for professional medical advice. Always consult your doctor or pharmacist about potential drug interactions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}