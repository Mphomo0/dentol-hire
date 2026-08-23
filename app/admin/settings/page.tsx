"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Card, PageHeader } from "@/components/admin/ui";
import type { BusinessSettings } from "@/lib/types";

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-white/[0.03] px-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-brand/50";

const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500";

const EMPTY: BusinessSettings = {
  address: "",
  phone: "",
  emails: [""],
  vatEnabled: true,
  vatRate: 15,
  vatNumber: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: BusinessSettings) => {
        setSettings(data.emails.length ? data : { ...data, emails: [""] });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function updateEmail(index: number, value: string) {
    setSettings((s) => ({
      ...s,
      emails: s.emails.map((e, i) => (i === index ? value : e)),
    }));
  }

  function addEmail() {
    setSettings((s) => ({ ...s, emails: [...s.emails, ""] }));
  }

  function removeEmail(index: number) {
    setSettings((s) => ({
      ...s,
      emails: s.emails.filter((_, i) => i !== index),
    }));
  }

  async function save() {
    setError(null);
    setSaved(false);

    const cleanEmails = settings.emails.map((e) => e.trim()).filter(Boolean);
    if (!settings.address.trim() || !settings.phone.trim() || !cleanEmails.length) {
      setError("Address, phone and at least one email are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, emails: cleanEmails }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      setSettings(body as BusinessSettings);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader
          title="Settings"
          subtitle="Business details used on quotes and invoices."
        />
        <p className="text-sm text-zinc-500">Loading…</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Business details used on quotes and invoices."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="p-5">
          <h2 className="mb-4 font-display font-semibold text-white">
            Business details
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Address</label>
              <input
                value={settings.address}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, address: e.target.value }))
                }
                placeholder="12 Foundry Road, Wynberg, Sandton, 2090"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input
                value={settings.phone}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder="(011) 234-5678"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Email addresses</label>
              <div className="space-y-2">
                {settings.emails.map((email, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={email}
                      onChange={(e) => updateEmail(i, e.target.value)}
                      type="email"
                      placeholder="hire@dantol.co.za"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => removeEmail(i)}
                      disabled={settings.emails.length === 1}
                      aria-label="Remove email"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addEmail}
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-semibold text-zinc-300 transition-colors hover:border-brand/50 hover:text-brand"
              >
                <Plus className="h-3.5 w-3.5" />
                Add email
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display font-semibold text-white">VAT</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.vatEnabled}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, vatEnabled: e.target.checked }))
                }
                className="h-5 w-5 rounded border-line bg-white/[0.03] accent-brand"
              />
              <span className="text-sm font-medium text-zinc-300">
                Charge VAT on quotes and invoices
              </span>
            </label>

            {settings.vatEnabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>VAT rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={settings.vatRate}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        vatRate: Number(e.target.value),
                      }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>VAT registration number</label>
                  <input
                    value={settings.vatNumber}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, vatNumber: e.target.value }))
                    }
                    placeholder="4820116733"
                    className={inputCls}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {error && (
          <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft px-8 font-semibold text-white shadow-[0_0_28px_rgba(0,121,245,0.4)] transition-all hover:shadow-[0_0_40px_rgba(0,121,245,0.55)] disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save settings
              </>
            )}
          </button>
          {saved && !saving && (
            <span className="text-sm text-signal">Saved.</span>
          )}
        </div>
      </div>
    </>
  );
}
