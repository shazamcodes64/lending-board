"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, Plus, AlertCircle, RefreshCw, PackageOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, type Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import ListingForm from "@/components/ListingForm";
import LoadingState from "@/components/LoadingState";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { setLoadError("Couldn't load listings."); setLoading(false); return; }
    setListings((data as Listing[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  useEffect(() => {
    if (!formOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFormOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [formOpen]);

  const filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    return (
      (!q || l.item_name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) &&
      (!category || l.category === category)
    );
  });

  return (
    <>
      <div style={{ minHeight: "100dvh" }}>

        {/* ── Header ── */}
        <header style={{
          background: "linear-gradient(180deg, #0e0f14 0%, #0e0f14cc 100%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", height: 60,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                fontSize: "1.05rem",
                color: "var(--amber)",
                letterSpacing: "-0.02em",
              }}>
                gc-srm/
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 300,
                fontSize: "1.05rem",
                color: "var(--ink-muted)",
                letterSpacing: "-0.01em",
              }}>
                lending-board
              </span>
            </div>

            <button
              onClick={() => setFormOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--amber)", color: "#0e0f14",
                border: "none", borderRadius: "var(--radius)",
                fontFamily: "var(--font-mono)", fontWeight: 500,
                fontSize: "0.8rem", padding: "8px 14px",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "var(--amber-dim)")}
              onMouseOut={e => (e.currentTarget.style.background = "var(--amber)")}
            >
              <Plus size={13} />
              + lend item
            </button>
          </div>
        </header>

        <main style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem" }}>

          {/* ── Search + filter ── */}
          <div className="fade-up" style={{
            display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "2rem",
            animationDelay: "0.05s",
          }}>
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
              <Search size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--ink-faint)", pointerEvents: "none",
              }} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search items…"
                aria-label="Search listings"
                style={inputStyle}
              />
            </div>
            <div style={{ position: "relative", flex: "0 0 200px" }}>
              <SlidersHorizontal size={13} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--ink-faint)", pointerEvents: "none",
              }} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                style={{ ...inputStyle, paddingLeft: 34, appearance: "none", cursor: "pointer" }}
              >
                <option value="">all categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Content states ── */}
          {loading ? (
            <LoadingState />
          ) : loadError ? (
            <div style={centeredState}>
              <div style={{ background: "var(--red-bg)", borderRadius: "50%", padding: 16, marginBottom: 12 }}>
                <AlertCircle size={28} style={{ color: "var(--red)" }} />
              </div>
              <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                {loadError}
              </p>
              <button onClick={fetchListings} style={ghostBtnStyle}>
                <RefreshCw size={13} /> retry
              </button>
            </div>
          ) : filtered.length === 0 && listings.length === 0 ? (
            <div style={centeredState}>
              <div style={{ background: "var(--amber-glow)", borderRadius: "50%", padding: 20, marginBottom: 16 }}>
                <PackageOpen size={32} style={{ color: "var(--amber)" }} />
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "var(--ink)", marginBottom: 4 }}>
                nothing here yet
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: 20, maxWidth: 280, textAlign: "center" }}>
                Be the first student to lend something to the community.
              </p>
              <button onClick={() => setFormOpen(true)} style={amberBtnStyle}>
                + lend an item
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ ...centeredState, gap: 10 }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--ink-muted)" }}>
                no matches found
              </p>
              <button onClick={() => { setSearch(""); setCategory(""); }} style={ghostBtnStyle}>
                clear filters
              </button>
            </div>
          ) : (
            <>
              {(search || category) && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                  color: "var(--ink-faint)", marginBottom: 16 }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </p>
              )}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}>
                {filtered.map((listing, i) => (
                  <ListingCard key={listing.id} listing={listing} index={i} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {formOpen && (
        <ListingForm onClose={() => setFormOpen(false)} onSuccess={() => { setFormOpen(false); fetchListings(); }} />
      )}
    </>
  );
}

/* ── shared inline style fragments ── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
  borderRadius: "var(--radius)",
  border: "1px solid var(--border)",
  background: "var(--bg-subtle)",
  color: "var(--ink)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  outline: "none",
  transition: "border-color 0.15s",
};

const centeredState: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", paddingTop: "6rem", paddingBottom: "6rem", gap: 8,
};

const ghostBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  background: "transparent",
  border: "1px solid var(--border-hi)",
  borderRadius: "var(--radius)",
  color: "var(--ink-muted)",
  fontFamily: "var(--font-mono)", fontSize: "0.78rem",
  padding: "7px 14px", cursor: "pointer", marginTop: 4,
};

const amberBtnStyle: React.CSSProperties = {
  background: "var(--amber)", color: "#0e0f14",
  border: "none", borderRadius: "var(--radius)",
  fontFamily: "var(--font-mono)", fontWeight: 500,
  fontSize: "0.8rem", padding: "9px 18px", cursor: "pointer",
};
