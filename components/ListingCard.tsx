"use client";

import { useState } from "react";
import type { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

// One category → one accent color (subtle, not loud)
const CAT_COLORS: Record<string, string> = {
  "Books & Notes":         "#4e9af1",
  "Electronics":           "#a78bfa",
  "Lab Equipment":         "#34d399",
  "Stationery":            "#fb923c",
  "Clothing & Accessories":"#f472b6",
  "Sports & Fitness":      "#fbbf24",
  "Tools":                 "#94a3b8",
  "Other":                 "#64748b",
};

export default function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const [showContact, setShowContact] = useState(false);

  const accent = CAT_COLORS[listing.category] ?? "#f5a623";

  const formattedDate = new Date(listing.created_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  });

  return (
    <article
      className="fade-up"
      style={{
        animationDelay: `${0.08 + index * 0.045}s`,
        background: "var(--bg-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 10,
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hi)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Category chip + date */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          fontWeight: 500,
          color: accent,
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          borderRadius: 6,
          padding: "3px 8px",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}>
          {listing.category}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--ink-faint)",
        }}>
          {formattedDate}
        </span>
      </div>

      {/* Item name */}
      <h2 style={{
        fontFamily: "var(--font-mono)",
        fontSize: "1rem",
        fontWeight: 500,
        color: "var(--ink)",
        lineHeight: 1.3,
        margin: 0,
        letterSpacing: "-0.01em",
      }}>
        {listing.item_name}
      </h2>

      {/* Description */}
      <p style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.82rem",
        color: "var(--ink-muted)",
        lineHeight: 1.6,
        margin: 0,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {listing.description}
      </p>

      {/* Lender */}
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.73rem",
        color: "var(--ink-faint)",
        margin: 0,
        marginTop: "auto",
      }}>
        ↳ {listing.lender_name}
      </p>

      {/* Contact reveal */}
      <button
        onClick={() => setShowContact((v) => !v)}
        aria-expanded={showContact}
        aria-controls={`contact-${listing.id}`}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: showContact ? "var(--amber-glow)" : "var(--bg-subtle)",
          border: `1px solid ${showContact ? "var(--amber)" : "var(--border)"}`,
          borderRadius: "var(--radius)",
          color: showContact ? "var(--amber)" : "var(--ink-muted)",
          fontFamily: "var(--font-mono)", fontSize: "0.75rem",
          padding: "8px 12px", cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <span>{showContact ? "↑ hide contact" : "↓ show contact"}</span>
        <span style={{ opacity: 0.5, fontSize: "0.65rem" }}>
          {showContact ? "▲" : "▼"}
        </span>
      </button>

      {showContact && (
        <div
          id={`contact-${listing.id}`}
          style={{
            background: "var(--amber-glow)",
            border: "1px solid var(--amber)",
            borderRadius: "var(--radius)",
            padding: "10px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            color: "var(--amber-text)",
            wordBreak: "break-all",
            letterSpacing: "0.01em",
          }}
        >
          {listing.contact_info}
        </div>
      )}
    </article>
  );
}
