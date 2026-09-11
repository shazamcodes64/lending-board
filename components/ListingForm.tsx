"use client";

import { useState, useId } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, VALIDATION, type NewListing } from "@/lib/types";

interface ListingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

type FormFields = NewListing;
type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY_FORM: FormFields = {
  item_name: "", description: "", category: "", lender_name: "", contact_info: "",
};

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  const v = VALIDATION;

  const itemName = fields.item_name.trim();
  if (!itemName) errors.item_name = "required";
  else if (itemName.length < v.item_name.min || itemName.length > v.item_name.max)
    errors.item_name = `${v.item_name.min}–${v.item_name.max} chars`;

  const desc = fields.description.trim();
  if (!desc) errors.description = "required";
  else if (desc.length < v.description.min || desc.length > v.description.max)
    errors.description = `${v.description.min}–${v.description.max} chars`;

  if (!fields.category) errors.category = "pick one";

  const lender = fields.lender_name.trim();
  if (!lender) errors.lender_name = "required";
  else if (lender.length < v.lender_name.min || lender.length > v.lender_name.max)
    errors.lender_name = `${v.lender_name.min}–${v.lender_name.max} chars`;

  const contact = fields.contact_info.trim();
  if (!contact) errors.contact_info = "required";
  else if (contact.length < v.contact_info.min || contact.length > v.contact_info.max)
    errors.contact_info = `${v.contact_info.min}–${v.contact_info.max} chars`;

  return errors;
}

export default function ListingForm({ onClose, onSuccess }: ListingFormProps) {
  const uid = useId();
  const [fields, setFields] = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fid = (f: keyof FormFields) => `${uid}-${f}`;
  const eid = (f: keyof FormFields) => `${uid}-${f}-err`;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name as keyof FormFields]) setErrors(validate(updated));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const name = e.target.name as keyof FormFields;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(fields));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = Object.keys(EMPTY_FORM).reduce(
      (acc, k) => ({ ...acc, [k]: true }), {} as Record<keyof FormFields, boolean>
    );
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    const { error } = await supabase.from("listings").insert({
      item_name: fields.item_name.trim(),
      description: fields.description.trim(),
      category: fields.category,
      lender_name: fields.lender_name.trim(),
      contact_info: fields.contact_info.trim(),
    });
    setSubmitting(false);

    if (error) { setSubmitError("Couldn't post. Try again."); return; }
    onSuccess();
  }

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        padding: "0 0 0 0",
      }}
    >
      <div style={{
        position: "relative",
        width: "100%", maxWidth: 520,
        background: "var(--bg-raised)",
        border: "1px solid var(--border-hi)",
        borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
        maxHeight: "95dvh",
        overflowY: "auto",
        /* center on desktop */
        margin: "auto",
        borderBottomLeftRadius: "var(--radius-lg)",
        borderBottomRightRadius: "var(--radius-lg)",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border)",
        }}>
          <h2 id={`${uid}-title`} style={{
            fontFamily: "var(--font-mono)", fontWeight: 500,
            fontSize: "0.95rem", color: "var(--ink)", margin: 0,
            letterSpacing: "-0.01em",
          }}>
            <span style={{ color: "var(--amber)" }}>+</span> lend an item
          </h2>
          <button
            onClick={onClose}
            aria-label="Close form"
            style={{
              background: "none", border: "none",
              color: "var(--ink-muted)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 4, borderRadius: 6,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{
          padding: "20px 24px 24px",
          display: "flex", flexDirection: "column", gap: 18,
        }}>

          <Field label="item name" htmlFor={fid("item_name")}
            error={touched.item_name ? errors.item_name : undefined} errId={eid("item_name")}>
            <input id={fid("item_name")} name="item_name" type="text"
              value={fields.item_name} onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g. scientific calculator"
              maxLength={VALIDATION.item_name.max}
              aria-describedby={touched.item_name && errors.item_name ? eid("item_name") : undefined}
              aria-invalid={!!(touched.item_name && errors.item_name)}
              style={iStyle(!!(touched.item_name && errors.item_name))} />
          </Field>

          <Field label="description" htmlFor={fid("description")}
            error={touched.description ? errors.description : undefined} errId={eid("description")}
            hint={`${fields.description.length}/${VALIDATION.description.max}`}>
            <textarea id={fid("description")} name="description" rows={3}
              value={fields.description} onChange={handleChange} onBlur={handleBlur}
              placeholder="condition, when it's available, any notes…"
              maxLength={VALIDATION.description.max}
              aria-describedby={touched.description && errors.description ? eid("description") : undefined}
              aria-invalid={!!(touched.description && errors.description)}
              style={{ ...iStyle(!!(touched.description && errors.description)), resize: "none" }} />
          </Field>

          <Field label="category" htmlFor={fid("category")}
            error={touched.category ? errors.category : undefined} errId={eid("category")}>
            <select id={fid("category")} name="category"
              value={fields.category} onChange={handleChange} onBlur={handleBlur}
              aria-describedby={touched.category && errors.category ? eid("category") : undefined}
              aria-invalid={!!(touched.category && errors.category)}
              style={{ ...iStyle(!!(touched.category && errors.category)), appearance: "none" }}>
              <option value="">pick a category…</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </Field>

          <Field label="your name" htmlFor={fid("lender_name")}
            error={touched.lender_name ? errors.lender_name : undefined} errId={eid("lender_name")}>
            <input id={fid("lender_name")} name="lender_name" type="text"
              value={fields.lender_name} onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g. Arjun K"
              maxLength={VALIDATION.lender_name.max}
              aria-describedby={touched.lender_name && errors.lender_name ? eid("lender_name") : undefined}
              aria-invalid={!!(touched.lender_name && errors.lender_name)}
              style={iStyle(!!(touched.lender_name && errors.lender_name))} />
          </Field>

          <Field label="contact" htmlFor={fid("contact_info")}
            error={touched.contact_info ? errors.contact_info : undefined} errId={eid("contact_info")}
            hint="WhatsApp number or email">
            <input id={fid("contact_info")} name="contact_info" type="text"
              value={fields.contact_info} onChange={handleChange} onBlur={handleBlur}
              placeholder="9876543210 or abc@srmist.edu.in"
              maxLength={VALIDATION.contact_info.max}
              aria-describedby={touched.contact_info && errors.contact_info ? eid("contact_info") : undefined}
              aria-invalid={!!(touched.contact_info && errors.contact_info)}
              style={iStyle(!!(touched.contact_info && errors.contact_info))} />
          </Field>

          {submitError && (
            <p role="alert" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.75rem",
              color: "var(--red)", background: "var(--red-bg)",
              border: "1px solid var(--red)", borderRadius: "var(--radius)",
              padding: "10px 14px", margin: 0,
            }}>
              {submitError}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose} disabled={submitting} style={{
              flex: 1,
              background: "none", border: "1px solid var(--border-hi)",
              borderRadius: "var(--radius)", color: "var(--ink-muted)",
              fontFamily: "var(--font-mono)", fontSize: "0.78rem",
              padding: "10px", cursor: "pointer",
            }}>
              cancel
            </button>
            <button type="submit" disabled={submitting} style={{
              flex: 1,
              background: submitting ? "var(--amber-dim)" : "var(--amber)",
              border: "none", borderRadius: "var(--radius)",
              color: "#0e0f14",
              fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.78rem",
              padding: "10px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              {submitting ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> posting…</> : "post listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── helpers ── */
function iStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "var(--radius)",
    border: `1px solid ${hasError ? "var(--red)" : "var(--border)"}`,
    background: "var(--bg-subtle)",
    color: "var(--ink)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    outline: "none",
    transition: "border-color 0.15s",
  };
}

interface FieldProps {
  label: string; htmlFor: string;
  error?: string; errId: string; hint?: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, errId, hint, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <label htmlFor={htmlFor} style={{
          fontFamily: "var(--font-mono)", fontSize: "0.72rem",
          color: "var(--ink-muted)", letterSpacing: "0.04em", textTransform: "uppercase",
        }}>
          {label}
        </label>
        {error
          ? <span id={errId} role="alert" style={{
              fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--red)",
            }}>{error}</span>
          : hint
          ? <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ink-faint)" }}>{hint}</span>
          : null
        }
      </div>
      {children}
    </div>
  );
}

/* spin keyframe for submit loader */
const _spinStyle = `@keyframes spin { to { transform: rotate(360deg); } }`;
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = _spinStyle;
  document.head.appendChild(s);
}
