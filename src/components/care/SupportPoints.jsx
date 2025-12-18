import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Phone, Mail, Plus, Pencil, Trash2, Star, 
  Building2, Stethoscope, FlaskConical, Users, Heart
} from "lucide-react";
import { toast } from "sonner";

const TYPE_CONFIG = {
  pharmacy: { icon: Building2, color: "text-green-600", bg: "bg-green-50", label: "Pharmacy" },
  clinic: { icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50", label: "Clinic" },
  hospital: { icon: Building2, color: "text-red-600", bg: "bg-red-50", label: "Hospital" },
  lab: { icon: FlaskConical, color: "text-purple-600", bg: "bg-purple-50", label: "Lab" },
  caregiver: { icon: Heart, color: "text-pink-600", bg: "bg-pink-50", label: "Caregiver" },
  family_member: { icon: Users, color: "text-amber-600", bg: "bg-amber-50", label: "Family" },
  community_health_worker: { icon: Users, color: "text-teal-600", bg: "bg-teal-50", label: "CHW" },
  diabetes_educator: { icon: Stethoscope, color: "text-indigo-600", bg: "bg-indigo-50", label: "Educator" },
  nutritionist: { icon: Heart, color: "text-lime-600", bg: "bg-lime-50", label: "Nutritionist" },
  other: { icon: MapPin, color: "text-slate-600", bg: "bg-slate-50", label: "Other" }
};

export default function SupportPoints({ userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [formData, setFormData] = useState({
    name: "", type: "pharmacy", contact_name: "", phone: "", whatsapp: "",
    email: "", address: "", city: "", region: "", country: "", services: [], notes: "", is_primary: false
  });
  const queryClient = useQueryClient();

  const { data: supportPoints = [], isLoading } = useQuery({
    queryKey: ['support-points', userEmail],
    queryFn: () => base44.entities.SupportPoint.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, user_email: userEmail };
      if (editingPoint) {
        return base44.entities.SupportPoint.update(editingPoint.id, payload);
      }
      return base44.entities.SupportPoint.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-points'] });
      toast.success(editingPoint ? "Updated!" : "Added!");
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SupportPoint.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-points'] });
      toast.success("Deleted");
    }
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingPoint(null);
    setFormData({
      name: "", type: "pharmacy", contact_name: "", phone: "", whatsapp: "",
      email: "", address: "", city: "", region: "", country: "", services: [], notes: "", is_primary: false
    });
  };

  const handleEdit = (point) => {
    setEditingPoint(point);
    setFormData({ ...point });
    setShowForm(true);
  };

  // Group by type
  const grouped = supportPoints.reduce((acc, point) => {
    if (!acc[point.type]) acc[point.type] = [];
    acc[point.type].push(point);
    return acc;
  }, {});

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#5b9a8b]" />
            My Support Network
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {supportPoints.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No support points added</p>
            <p className="text-xs text-slate-400 mt-1">Add your pharmacy, clinic, caregiver contacts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([type, points]) => {
              const config = TYPE_CONFIG[type] || TYPE_CONFIG.other;
              const Icon = config.icon;
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="text-sm font-medium text-slate-700">{config.label}</span>
                  </div>
                  <div className="space-y-2">
                    {points.map(point => (
                      <div key={point.id} className={`p-3 rounded-lg ${config.bg} border border-slate-100`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{point.name}</span>
                              {point.is_primary && (
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            {point.contact_name && (
                              <p className="text-xs text-slate-600">{point.contact_name}</p>
                            )}
                            {point.address && (
                              <p className="text-xs text-slate-500 mt-1">{point.address}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {point.phone && (
                              <a href={`tel:${point.phone}`} className="p-1.5 hover:bg-white rounded">
                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                              </a>
                            )}
                            <button onClick={() => handleEdit(point)} className="p-1.5 hover:bg-white rounded">
                              <Pencil className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button onClick={() => deleteMutation.mutate(point.id)} className="p-1.5 hover:bg-white rounded">
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                        {point.services?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {point.services.map(s => (
                              <Badge key={s} variant="outline" className="text-xs py-0">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={resetForm}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPoint ? "Edit" : "Add"} Support Point</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Apollo Pharmacy"
                  />
                </div>
                <div>
                  <Label>Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData(p => ({ ...p, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData(p => ({ ...p, contact_name: e.target.value }))}
                    placeholder="Dr. Sharma"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                    placeholder="If different"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData(p => ({ ...p, region: e.target.value }))}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Notes</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Any additional info"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_primary}
                    onChange={(e) => setFormData(p => ({ ...p, is_primary: e.target.checked }))}
                    className="rounded"
                  />
                  <Label className="text-sm">Primary contact for this type</Label>
                </div>
              </div>
              <Button 
                onClick={() => saveMutation.mutate(formData)} 
                disabled={!formData.name || saveMutation.isPending}
                className="w-full"
              >
                {editingPoint ? "Update" : "Add"} Support Point
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}