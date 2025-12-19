import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileImage, Upload, Calendar as CalendarIcon, AlertTriangle, CheckCircle, Loader2, X } from "lucide-react";
import { format, differenceInMonths, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PrescriptionUpload({ profile, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [prescriptionDate, setPrescriptionDate] = useState(
    profile?.prescription_date ? new Date(profile.prescription_date) : null
  );
  const [prescriptionNotes, setPrescriptionNotes] = useState(profile?.prescription_notes || "");
  const [prescriptionClinic, setPrescriptionClinic] = useState(profile?.prescription_clinic || "");
  const [validMonths, setValidMonths] = useState(profile?.prescription_valid_months || 3);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error("Please upload an image or PDF file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Update profile with prescription image
      await onUpdate({
        prescription_image_url: file_url
      });
      
      toast.success("Prescription uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload prescription");
    } finally {
      setUploading(false);
    }
  };

  const handleSavePrescriptionDetails = async () => {
    await onUpdate({
      prescription_date: prescriptionDate ? format(prescriptionDate, 'yyyy-MM-dd') : null,
      prescription_notes: prescriptionNotes,
      prescription_clinic: prescriptionClinic,
      prescription_valid_months: validMonths
    });
    toast.success("Prescription details saved!");
  };

  const getPrescriptionAge = () => {
    if (!profile?.prescription_date) return null;
    
    const prescDate = new Date(profile.prescription_date);
    const now = new Date();
    const monthsOld = differenceInMonths(now, prescDate);
    const daysOld = differenceInDays(now, prescDate);
    
    if (monthsOld >= 12) {
      return { text: `${Math.floor(monthsOld / 12)} year${monthsOld >= 24 ? 's' : ''} old`, status: 'expired' };
    } else if (monthsOld >= (validMonths || 3)) {
      return { text: `${monthsOld} months old`, status: 'expired' };
    } else if (monthsOld >= (validMonths || 3) - 1) {
      return { text: `${monthsOld} months old`, status: 'expiring' };
    } else if (daysOld < 30) {
      return { text: `${daysOld} days old`, status: 'recent' };
    } else {
      return { text: `${monthsOld} months old`, status: 'valid' };
    }
  };

  const prescriptionAge = getPrescriptionAge();

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileImage className="w-5 h-5 text-orange-500" />
          Prescription Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prescription Image */}
        <div>
          <Label>Prescription Image</Label>
          <div className="mt-2">
            {profile?.prescription_image_url ? (
              <div className="relative">
                <div className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center gap-4">
                    <img 
                      src={profile.prescription_image_url} 
                      alt="Prescription" 
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-700">Prescription attached</p>
                      {prescriptionAge && (
                        <div className={cn(
                          "flex items-center gap-1.5 mt-1 text-sm",
                          prescriptionAge.status === 'expired' && "text-red-600",
                          prescriptionAge.status === 'expiring' && "text-amber-600",
                          prescriptionAge.status === 'valid' && "text-green-600",
                          prescriptionAge.status === 'recent' && "text-blue-600"
                        )}>
                          {prescriptionAge.status === 'expired' && <AlertTriangle className="w-4 h-4" />}
                          {prescriptionAge.status === 'expiring' && <AlertTriangle className="w-4 h-4" />}
                          {prescriptionAge.status === 'valid' && <CheckCircle className="w-4 h-4" />}
                          {prescriptionAge.status === 'recent' && <CheckCircle className="w-4 h-4" />}
                          <span>{prescriptionAge.text}</span>
                          {prescriptionAge.status === 'expired' && " - Consider getting a new prescription"}
                          {prescriptionAge.status === 'expiring' && " - Expiring soon"}
                        </div>
                      )}
                      <a 
                        href={profile.prescription_image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        View full image
                      </a>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <span>Replace</span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-slate-400 mx-auto animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Click to upload prescription</p>
                      <p className="text-xs text-slate-400 mt-1">Supports images & PDF (max 5MB)</p>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Prescription Date */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Prescription Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1.5",
                    !prescriptionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {prescriptionDate ? format(prescriptionDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={prescriptionDate}
                  onSelect={setPrescriptionDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Valid For (months)</Label>
            <Input
              type="number"
              min="1"
              max="12"
              value={validMonths}
              onChange={(e) => setValidMonths(parseInt(e.target.value) || 3)}
              className="mt-1.5"
            />
            <p className="text-xs text-slate-500 mt-1">Typical: 3 months for diabetes medications</p>
          </div>
        </div>

        {/* Clinic Info */}
        <div>
          <Label>Clinic / Hospital Name</Label>
          <Input
            value={prescriptionClinic}
            onChange={(e) => setPrescriptionClinic(e.target.value)}
            placeholder="e.g., Apollo Hospital, Dr. Smith's Clinic"
            className="mt-1.5"
          />
        </div>

        {/* Notes */}
        <div>
          <Label>Prescription Notes</Label>
          <Textarea
            value={prescriptionNotes}
            onChange={(e) => setPrescriptionNotes(e.target.value)}
            placeholder="Any special instructions from your doctor..."
            className="mt-1.5 h-24"
          />
        </div>

        {/* Alert for old prescription */}
        {prescriptionAge?.status === 'expired' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Prescription may be outdated</p>
                <p className="text-sm text-red-600 mt-1">
                  Your prescription is {prescriptionAge.text}. Please consult your doctor for an updated prescription 
                  to ensure your medications are still appropriate.
                </p>
              </div>
            </div>
          </div>
        )}

        {prescriptionAge?.status === 'expiring' && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Prescription expiring soon</p>
                <p className="text-sm text-amber-600 mt-1">
                  Consider scheduling an appointment with your doctor for a prescription review.
                </p>
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleSavePrescriptionDetails} className="w-full">
          Save Prescription Details
        </Button>
      </CardContent>
    </Card>
  );
}