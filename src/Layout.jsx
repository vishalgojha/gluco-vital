import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "@/api/base44Client";
import { Home, History, User, Menu, X, MessageCircle, LogOut, Trophy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentPageName !== "Landing") {
      base44.auth.me().then(setUser).catch(() => {});
    }
  }, [currentPageName]);

  const navItems = [
    { name: "Home", icon: Home, page: "Home" },
    { name: "Reports", icon: FileText, page: "Reports" },
    { name: "Achievements", icon: Trophy, page: "Achievements" },
    { name: "History", icon: History, page: "History" },
    { name: "Profile", icon: User, page: "Profile" },
  ];

  // Show Landing page without layout for unauthenticated users
  if (currentPageName === "Landing") {
    return children;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --soothing-bg: #f0f7f4;
          --soothing-primary: #5b9a8b;
          --soothing-primary-light: #8fc0b7;
          --soothing-accent: #7eb8a8;
          --soothing-warm: #e8d5c4;
        }
        body {
          background: linear-gradient(135deg, #f0f7f4 0%, #e8f4f0 50%, #faf6f2 100%) !important;
        }
        .shadow-sm, .shadow, .shadow-md, .shadow-lg {
          box-shadow: 0 2px 15px rgba(91, 154, 139, 0.08) !important;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f0f7f4; }
        ::-webkit-scrollbar-thumb { background: #8fc0b7; border-radius: 4px; }
      ` }} />
      <div className="min-h-screen bg-[#f0f7f4]">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#f8faf9]/90 backdrop-blur-lg border-b border-[#5b9a8b]/10">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8] flex items-center justify-center shadow-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-[#3d6b5f]">VitalSpark</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-[#f8faf9] border-b border-[#5b9a8b]/10 shadow-lg">
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      currentPageName === item.page
                        ? "bg-[#5b9a8b]/10 text-[#3d6b5f]"
                        : "text-[#5a6b66] hover:bg-[#5b9a8b]/5"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => base44.auth.logout()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#c47c7c] hover:bg-[#c47c7c]/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          )}
        </header>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[#f8faf9] border-r border-[#5b9a8b]/10 flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5b9a8b] to-[#7eb8a8] flex items-center justify-center shadow-md shadow-[#5b9a8b]/20">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-[#3d6b5f]">VitalSpark</h1>
                <p className="text-xs text-[#7a9990]">Your Health, Ignited</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    currentPageName === item.page
                      ? "bg-gradient-to-r from-[#5b9a8b]/15 to-[#7eb8a8]/10 text-[#3d6b5f] shadow-sm"
                      : "text-[#5a6b66] hover:bg-[#5b9a8b]/5"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    currentPageName === item.page ? "text-[#5b9a8b]" : ""
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Section */}
          {user && (
            <div className="p-4 border-t border-[#5b9a8b]/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5b9a8b]/20 to-[#7eb8a8]/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#5b9a8b]">
                    {user.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3d6b5f] truncate">{user.full_name}</p>
                  <p className="text-xs text-[#7a9990] truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => base44.auth.logout()}
                className="w-full justify-start text-[#7a9990] hover:text-[#c47c7c] hover:bg-[#c47c7c]/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </aside>

        {/* Main Content */}
                  <main className="lg:ml-64 pt-16 lg:pt-0">
                    {children}
                  </main>

                  {/* Add to Home Screen Prompt */}
                  <AddToHomeScreen />
                </div>
              </>
            );
          }