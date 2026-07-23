"use client";

import React, { useState } from "react";
import { useSunriseStore } from "@/lib/store";
import { PROFILES } from "@/lib/initialData";
import { UserRole } from "@/lib/types";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { Lock, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function LoginModal() {
  const { isLoggedIn, login } = useSunriseStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>("Harit");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (isLoggedIn) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
  };

  // Google OAuth Sign-In via Firebase Client SDK
  const handleGoogleSignIn = async () => {
    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const realIdToken = await user.getIdToken();

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${realIdToken}`,
        },
        body: JSON.stringify({ idToken: realIdToken }),
      });

      const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));

      if (!res.ok || !data.success) {
        setErrorMsg(`[Google Auth Failed ${res.status}]: ${data.error || "Access Denied"}`);
        setIsVerifying(false);
        return;
      }

      login(data.user || selectedRole);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google Sign-In popup was closed before completing.");
      } else {
        setErrorMsg(`[Google Sign-In Error]: ${err.message || "Failed to complete Google Sign-In"}`);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Shared Password Fallback Auth Route
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Please enter the private space password.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/password-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password.trim(), role: selectedRole }),
      });

      const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Incorrect password");
        setIsVerifying(false);
        return;
      }

      login(selectedRole);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {
      setErrorMsg("Failed to connect to authentication server.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1A16]/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#FAF6F0] dark:bg-[#1E1A16] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EDE0D0] dark:border-[#3D352E] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4A857] via-orange-400 to-amber-200 dark:from-[#D4A857] dark:to-orange-700 mx-auto flex items-center justify-center text-3xl shadow-md animate-pulse">
            ☀️
          </div>
          <h2 className="text-2xl font-serif text-[#3A342C] dark:text-[#F7F3ED] font-medium">
            Sunrise • Private Space
          </h2>
          <p className="text-xs font-sans text-[#7A7267] max-w-xs mx-auto">
            Shared between Harit (Gujarat 🇮🇳) & Ameera (Maharashtra 🇮🇳)
          </p>
        </div>

        {/* Account Selector Pills */}
        <div className="space-y-2">
          <label className="text-xs font-sans text-[#7A7267] font-medium">Select Account</label>
          <div className="grid grid-cols-2 gap-3">
            {(["Harit", "Ameera"] as const).map((role) => {
              const p = PROFILES[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center text-center space-y-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#EDE0D0] dark:bg-[#3D352E] border-[#D4A857] font-medium shadow-xs ring-2 ring-[#D4A857]"
                      : "bg-white/80 dark:bg-[#2A241F] border-[#EDE0D0] dark:border-[#3D352E] opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-[#D4A857]" />
                  <div>
                    <p className="text-sm font-serif font-medium text-[#3A342C] dark:text-[#F7F3ED]">{p.name}</p>
                    <p className="text-[10px] font-sans text-[#7A7267]">{p.city}, {p.state} 🇮🇳</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-sans flex items-center gap-2 break-all">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Action: Google OAuth */}
        <div className="space-y-3 font-sans text-xs">
          <button
            type="button"
            disabled={isVerifying}
            onClick={handleGoogleSignIn}
            className="w-full py-3 rounded-full bg-[#D4A857] hover:bg-[#c39746] text-white font-sans text-xs font-semibold shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>🌐</span>{" "}
            {isVerifying ? "Verifying Auth..." : `Sign In with Google (${PROFILES[selectedRole].name})`}
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#EDE0D0] dark:border-[#3D352E]"></div>
            <span className="flex-shrink mx-3 text-[10px] text-[#7A7267] font-sans">OR USE PASSWORD FALLBACK</span>
            <div className="flex-grow border-t border-[#EDE0D0] dark:border-[#3D352E]"></div>
          </div>

          {/* Fallback Form: Password Entry */}
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Enter private space password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] text-xs focus:ring-2 focus:ring-[#D4A857] focus:outline-none text-[#3A342C] dark:text-[#F7F3ED]"
                  required
                />
                <Lock className="w-4 h-4 text-[#7A7267] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-full bg-white dark:bg-[#2A241F] border border-[#EDE0D0] dark:border-[#3D352E] text-[#3A342C] dark:text-[#F7F3ED] text-xs font-sans font-medium flex items-center justify-center gap-2 hover:bg-[#EDE0D0]/50 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-[#D4A857]" /> Unlock as {PROFILES[selectedRole].name}
            </button>
          </form>
        </div>

        <div className="text-center pt-1 border-t border-[#EDE0D0] dark:border-[#3D352E]">
          <p className="text-[10px] font-sans text-[#7A7267] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Dual Google OAuth &amp; Password Gate Active
          </p>
        </div>
      </div>
    </div>
  );
}
