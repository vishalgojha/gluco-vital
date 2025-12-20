import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  Users, Plus, UserPlus, Eye, Edit3, Shield, Clock, 
  Mail, Trash2, Pause, Play, AlertTriangle, X, Loader2, Check
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const relationLabels = {
  spouse: "Spouse",
  child: "Son/Daughter",
  parent: "Parent",
  sibling: "Sibling",
  caregiver: "Caregiver",
  friend: "Friend",
  other: "Other"
};

const accessLevelInfo = {
  view_only: {
    label: "View Only",
    description: "Can see readings, trends, and medication schedule",
    icon: Eye,
    color: "bg-blue-100 text-blue-700"
  },
  assist: {
    label: "Assist Mode",
    description: "Can add logs on your behalf (marked as caregiver entry)",
    icon: Edit3,
    color: "bg-amber-100 text-amber-700"
  },
  emergency: {
    label: "Emergency Access",
    description: "Temporary expanded access during critical situations",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-700"
  }
};

export default function CaregiverManager({ userEmail, userName }) {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAccess, setEditingAccess] = useState(null);
  const [formData, setFormData] = useState({
    caregiver_name: "",
    caregiver_phone: "",
    caregiver_email: "",
    relation: "spouse",
    access_level: "view_only",
    alert_preferences: {
      high_sugar: true,
      low_sugar: true,
      missed_medication: false,
      daily_summary: false
    }
  });

  const { data: caregivers = [], isLoading } = useQuery({
    queryKey: ['caregiver-access', userEmail],
    queryFn: () => base44.entities.CaregiverAccess.filter({ patient_email: userEmail }),
    enabled: !!userEmail
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const caregiver = await base44.entities.CaregiverAccess.create({
        ...data,
        patient_email: userEmail,
        patient_name: userName,
        invite_code: inviteCode,
        status: data.caregiver_email ? "active" : "pending",
        granted_at: new Date().toISOString()
      });

      // Send email notification if caregiver has email
      if (data.caregiver_email) {
        try {
          await base44.integrations.Core.SendEmail({
            to: data.caregiver_email,
            subject: `${userName} added you as a caregiver on GlucoVital`,
            body: `Hello ${data.caregiver_name},

${userName} has added you as a trusted caregiver on GlucoVital.fit.

You can now:
${data.access_level === 'view_only' ? '• View their sugar readings and trends\n• See their medication schedule\n• Receive health alerts' : '• View their health data\n• Add logs on their behalf\n• Receive health alerts'}

To access their health dashboard, log in to GlucoVital.fit with this email address.

Access Level: ${data.access_level === 'view_only' ? 'View Only' : 'Assist Mode'}
Relationship: ${relationLabels[data.relation]}

Your privacy is protected - all your actions are logged and ${userName} can revoke access anytime.

With care,
GlucoVital.fit Team`
          });
        } catch (emailError) {
          console.error('Failed to send caregiver email:', emailError);
        }
      }

      return caregiver;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caregiver-access'] });
      toast.success("Caregiver added successfully!");
      setShowAddDialog(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add caregiver")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CaregiverAccess.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caregiver-access'] });
      toast.success("Caregiver access updated");
      setEditingAccess(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CaregiverAccess.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caregiver-access'] });
      toast.success("Caregiver access revoked");
    }
  });

  const resetForm = () => {
    setFormData({
      caregiver_name: "",
      caregiver_phone: "",
      caregiver_email: "",
      relation: "spouse",
      access_level: "view_only",
      alert_preferences: {
        high_sugar: true,
        low_sugar: true,
        missed_medication: false,
        daily_summary: false
      }
    });
  };

  const handleSubmit = () => {
    if (!formData.caregiver_name.trim()) {
      toast.error("Please enter caregiver's name");
      return;
    }
    if (!formData.caregiver_email.trim()) {
      toast.error("Please enter caregiver's email");
      return;
    }
    createMutation.mutate(formData);
  };

  const toggleStatus = (caregiver) => {
    const newStatus = caregiver.status === "active" ? "paused" : "active";
    updateMutation.mutate({ id: caregiver.id, data: { status: newStatus } });
  };

  const activeCaregivers = caregivers.filter(c => c.status === "active" || c.status === "pending");
  const inactiveCaregivers = caregivers.filter(c => c.status === "paused" || c.status === "revoked");

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-violet-500" />
            Family & Caregivers
          </CardTitle>
          <Button 
            onClick={() => setShowAddDialog(true)} 
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Caregiver
          </Button>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Let trusted family members view your health data and help manage your care
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
          </div>
        ) : activeCaregivers.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No caregivers added yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Add a family member to help monitor your health
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCaregivers.map(caregiver => (
              <CaregiverCard 
                key={caregiver.id} 
                caregiver={caregiver}
                onToggleStatus={() => toggleStatus(caregiver)}
                onRevoke={() => deleteMutation.mutate(caregiver.id)}
                onEdit={() => setEditingAccess(caregiver)}
              />
            ))}
          </div>
        )}

        {inactiveCaregivers.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-3">Paused/Revoked</p>
            <div className="space-y-2 opacity-60">
              {inactiveCaregivers.map(caregiver => (
                <CaregiverCard 
                  key={caregiver.id} 
                  caregiver={caregiver}
                  onToggleStatus={() => toggleStatus(caregiver)}
                  onRevoke={() => deleteMutation.mutate(caregiver.id)}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 mt-4">
          <div className="flex gap-2">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-medium">Your Privacy is Protected</p>
              <p className="mt-1">
                Caregivers cannot see private doctor notes or edit your health records. 
                You can revoke access anytime.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Add Caregiver Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a Caregiver</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Caregiver's Name *</Label>
              <Input
                value={formData.caregiver_name}
                onChange={(e) => setFormData(prev => ({ ...prev, caregiver_name: e.target.value }))}
                placeholder="e.g., Ramesh Kumar"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Relationship</Label>
              <Select
                value={formData.relation}
                onValueChange={(value) => setFormData(prev => ({ ...prev, relation: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(relationLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Email (for notifications & app access) *</Label>
              <Input
                type="email"
                value={formData.caregiver_email}
                onChange={(e) => setFormData(prev => ({ ...prev, caregiver_email: e.target.value }))}
                placeholder="email@example.com"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Access Level</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(accessLevelInfo).filter(([key]) => key !== 'emergency').map(([key, info]) => (
                  <div
                    key={key}
                    onClick={() => setFormData(prev => ({ ...prev, access_level: key }))}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.access_level === key 
                        ? 'border-violet-300 bg-violet-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <info.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{info.label}</span>
                      {formData.access_level === key && (
                        <Check className="w-4 h-4 text-violet-600 ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{info.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">
                📧 Caregiver will receive an email invite and can view your health data by logging into GlucoVital with their email.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Add Caregiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function CaregiverCard({ caregiver, onToggleStatus, onRevoke, onEdit, compact }) {
  const accessInfo = accessLevelInfo[caregiver.access_level] || accessLevelInfo.view_only;
  const AccessIcon = accessInfo.icon;

  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    active: "bg-green-100 text-green-700",
    paused: "bg-slate-100 text-slate-600",
    revoked: "bg-red-100 text-red-700"
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
        <div>
          <span className="font-medium text-sm">{caregiver.caregiver_name}</span>
          <span className="text-xs text-slate-400 ml-2">({relationLabels[caregiver.relation]})</span>
        </div>
        <Button size="sm" variant="outline" onClick={onToggleStatus}>
          <Play className="w-3 h-3 mr-1" /> Reactivate
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-violet-600">
              {caregiver.caregiver_name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">{caregiver.caregiver_name}</span>
              <Badge variant="outline" className="text-xs">
                {relationLabels[caregiver.relation]}
              </Badge>
            </div>
            {caregiver.caregiver_email && (
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <Mail className="w-3 h-3" />
                {caregiver.caregiver_email}
              </div>
            )}
          </div>
        </div>
        
        <Badge className={statusColors[caregiver.status]}>
          {caregiver.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <Badge className={accessInfo.color}>
            <AccessIcon className="w-3 h-3 mr-1" />
            {accessInfo.label}
          </Badge>
          {caregiver.last_viewed_at && (
            <span className="text-xs text-slate-400">
              Last viewed: {format(new Date(caregiver.last_viewed_at), "MMM d")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={onToggleStatus}>
            {caregiver.status === "active" ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={onRevoke}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}