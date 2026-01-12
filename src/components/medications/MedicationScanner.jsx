import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Barcode, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function MedicationScanner({ onMedicationFound, open, onOpenChange }) {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setLookupResult(null);

    try {
      // Upload image first
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Use AI to extract medication info from packaging
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this medication packaging image and extract the following information:
1. Medication/Drug name (generic and brand name if visible)
2. Dosage/Strength (e.g., 500mg, 100 units/ml)
3. Form (tablet, capsule, injection, syrup, etc.)
4. Manufacturer name
5. Any visible barcode/NDC number
6. Quantity per pack
7. Key warnings or instructions visible

Be accurate and only extract what you can clearly see. If something is not visible, say "not visible".`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            medication_name: { type: "string" },
            brand_name: { type: "string" },
            generic_name: { type: "string" },
            dosage: { type: "string" },
            strength: { type: "string" },
            form: { type: "string" },
            manufacturer: { type: "string" },
            barcode_ndc: { type: "string" },
            quantity_per_pack: { type: "number" },
            warnings: { type: "string" },
            instructions: { type: "string" }
          }
        }
      });

      setLookupResult({
        success: true,
        data: result,
        source: "image"
      });
    } catch (error) {
      console.error("Scan error:", error);
      setLookupResult({
        success: false,
        error: "Could not extract medication details. Try a clearer image."
      });
    } finally {
      setScanning(false);
    }
  };

  const handleManualLookup = async () => {
    if (!manualCode.trim()) return;

    setScanning(true);
    setLookupResult(null);

    try {
      // Use AI with internet to look up medication by barcode/NDC
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Look up medication information for barcode/NDC: ${manualCode}
        
Return detailed medication information including:
- Generic and brand names
- Common dosages
- Drug class
- Common uses
- Important warnings
- Typical directions`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            medication_name: { type: "string" },
            brand_name: { type: "string" },
            generic_name: { type: "string" },
            drug_class: { type: "string" },
            common_dosages: { type: "array", items: { type: "string" } },
            uses: { type: "string" },
            warnings: { type: "string" },
            directions: { type: "string" },
            found: { type: "boolean" }
          }
        }
      });

      if (result.found === false || !result.medication_name) {
        setLookupResult({
          success: false,
          error: "Could not find medication with this code. Try scanning the packaging instead."
        });
      } else {
        setLookupResult({
          success: true,
          data: result,
          source: "barcode"
        });
      }
    } catch (error) {
      console.error("Lookup error:", error);
      setLookupResult({
        success: false,
        error: "Lookup failed. Please try again."
      });
    } finally {
      setScanning(false);
    }
  };

  const handleUseMedication = () => {
    if (lookupResult?.success && lookupResult.data) {
      onMedicationFound({
        medication_name: lookupResult.data.medication_name || lookupResult.data.brand_name,
        generic_name: lookupResult.data.generic_name,
        dosage: lookupResult.data.dosage || lookupResult.data.common_dosages?.[0] || "",
        strength: lookupResult.data.strength || "",
        notes: lookupResult.data.warnings || lookupResult.data.instructions || "",
        pills_per_strip: lookupResult.data.quantity_per_pack || 10
      });
      onOpenChange(false);
      setLookupResult(null);
      setManualCode("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-violet-500" />
            Scan Medication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Camera Capture */}
          <div className="space-y-2">
            <Label>Take photo of medication packaging</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
              className="w-full h-24 border-dashed flex flex-col gap-2"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                  <span className="text-sm">Analyzing image...</span>
                </>
              ) : (
                <>
                  <Camera className="w-6 h-6 text-slate-400" />
                  <span className="text-sm text-slate-500">Tap to capture or upload</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Manual Barcode Entry */}
          <div className="space-y-2">
            <Label>Enter barcode/NDC number manually</Label>
            <div className="flex gap-2">
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g., 0069-3150-66"
              />
              <Button
                onClick={handleManualLookup}
                disabled={scanning || !manualCode.trim()}
              >
                {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup"}
              </Button>
            </div>
          </div>

          {/* Results */}
          {lookupResult && (
            <div className={`p-4 rounded-xl border ${
              lookupResult.success 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}>
              {lookupResult.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Medication Found</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {lookupResult.data.medication_name || lookupResult.data.brand_name}</p>
                    {lookupResult.data.generic_name && (
                      <p><strong>Generic:</strong> {lookupResult.data.generic_name}</p>
                    )}
                    {lookupResult.data.dosage && (
                      <p><strong>Dosage:</strong> {lookupResult.data.dosage}</p>
                    )}
                    {lookupResult.data.drug_class && (
                      <p><strong>Class:</strong> {lookupResult.data.drug_class}</p>
                    )}
                    {lookupResult.data.warnings && (
                      <p className="text-amber-700"><strong>⚠️ Note:</strong> {lookupResult.data.warnings}</p>
                    )}
                  </div>
                  <Button onClick={handleUseMedication} className="w-full bg-green-600 hover:bg-green-700">
                    Use This Medication
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{lookupResult.error}</span>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 space-y-1">
            <p><strong>Tips for best results:</strong></p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Ensure good lighting</li>
              <li>Include the drug name and dosage in the photo</li>
              <li>Hold camera steady and close to the packaging</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}