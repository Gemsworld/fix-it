"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Home,
  MapPin,
  ShieldCheck,
  Signal,
  UserRound,
  Wifi,
  BatteryFull,
  Wrench,
} from "lucide-react";
import { services } from "@/lib/data";

type Store = "apple" | "google";
function storeURL(store: Store) {
  const raw =
    store === "apple"
      ? process.env.NEXT_PUBLIC_APP_STORE_URL
      : process.env.NEXT_PUBLIC_PLAY_STORE_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" &&
      (store === "apple"
        ? url.hostname === "apps.apple.com"
        : url.hostname === "play.google.com")
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function StoreButtons({
  onUnavailable,
}: {
  onUnavailable: (store: Store) => void;
}) {
  return (
    <div className="store-buttons">
      {(["apple", "google"] as const).map((store) => {
        const content = (
          <>
            <span className="store-symbol" aria-hidden="true">
              {store === "apple" ? (
                <svg viewBox="0 0 24 28" fill="currentColor">
                  <path d="M19.4 14.7c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.4-4.4-2.4-1.9-.2-3.7 1.1-4.6 1.1-1 0-2.5-1.1-4.1-1.1C6.8 7.8 4.9 9 3.8 10.8c-2.1 3.7-.5 9.2 1.5 12.2 1 1.5 2.2 3.1 3.7 3 1.5-.1 2.1-1 4-1 1.8 0 2.3 1 4 1 1.6-.1 2.6-1.5 3.6-3a13 13 0 0 0 1.6-3.3c-.1 0-2.8-1.1-2.8-5zM16.3 5.7c.8-1.1 1.4-2.5 1.3-4-.1 0-2.7.2-4 1.7-.8.9-1.5 2.4-1.4 3.8 1.5.1 3.1-.7 4.1-1.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 26 28">
                  <path fill="#63CD8D" d="M1 1 15 14 1 27Z" />
                  <path fill="#8BBEFF" d="M1 1 19 11 15 14Z" />
                  <path fill="#F5D36C" d="m19 11 6 3-6 3-4-3Z" />
                  <path fill="#EF8A84" d="M1 27 15 14l4 3Z" />
                </svg>
              )}
            </span>
            <span>
              <small>
                {store === "apple" ? "Download on the" : "GET IT ON"}
              </small>
              <strong>{store === "apple" ? "App Store" : "Google Play"}</strong>
            </span>
          </>
        );
        const url = storeURL(store);
        return url ? (
          <a
            className="store-badge"
            key={store}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              store === "apple"
                ? "Download Fix-it on the App Store"
                : "Get Fix-it on Google Play"
            }
          >
            {content}
          </a>
        ) : (
          <button
            className="store-badge"
            key={store}
            onClick={() => onUnavailable(store)}
            aria-label={
              store === "apple"
                ? "App Store download information"
                : "Google Play download information"
            }
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

export function StoreAvailability({ compact = false }: { compact?: boolean }) {
  const ready = Boolean(storeURL("apple") && storeURL("google"));
  return (
    <div className={compact ? "cta-store-note" : "download-availability"}>
      {!compact && <span className="status-dot" />}
      {ready
        ? "Available for iOS & Android."
        : "iOS & Android · store links coming soon"}
    </div>
  );
}

export function PhonePreview({
  onService,
}: {
  onService: (service: string) => void;
}) {
  const [tab, setTab] = useState("Home");
  return (
    <div className="app-hero-visual">
      <div className="app-visual-halo pattern-mint" aria-hidden="true" />
      <div
        className="phone-device"
        aria-label="Interactive Fix-it app screen preview"
      >
        <div className="phone-camera" aria-hidden="true" />
        <div className="phone-status" aria-hidden="true">
          <strong>9:41</strong>
          <span>
            <Signal size={10} />
            <Wifi size={10} />
            <BatteryFull size={13} />
          </span>
        </div>
        <div className="phone-content">
          <header className="phone-top">
            <div>
              <span className="phone-greeting">YOUR EVERYDAY, SORTED.</span>
              <strong>
                {tab === "Home"
                  ? "Hello, Alex."
                  : tab === "Bookings"
                    ? "Your repairs."
                    : tab === "Help"
                      ? "A helping hand."
                      : "Your space."}
              </strong>
            </div>
            <span className="phone-avatar">AO</span>
          </header>
          {tab === "Home" ? (
            <>
              <div className="phone-location">
                <MapPin size={11} /> Lekki, Lagos <span>Change in app</span>
              </div>
              <div className="phone-welcome">
                <span>HOME, HANDLED.</span>
                <h3>
                  Small fixes.
                  <br />
                  Big relief.
                </h3>
                <div className="phone-welcome-icon">
                  <Wrench size={38} />
                </div>
                <button onClick={() => onService("Plumbing")}>
                  Request a repair <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="phone-section-title">
                <strong>What needs fixing?</strong>
                <span>Services</span>
              </div>
              <div className="phone-services">
                {services.slice(0, 6).map((s) => (
                  <button
                    key={s.name}
                    className={s.tone}
                    onClick={() => onService(s.name)}
                  >
                    <s.icon size={19} strokeWidth={1.7} />
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
              <div className="phone-section-title">
                <strong>Your next repair</strong>
                <button onClick={() => setTab("Bookings")}>
                  View all <ChevronRight size={10} />
                </button>
              </div>
              <div className="phone-booking">
                <span className="phone-booking-icon">
                  <Wrench size={19} />
                </span>
                <div>
                  <strong>AC service</strong>
                  <small>Today · 2:00 PM</small>
                </div>
                <span className="phone-job-status">On the way</span>
              </div>
            </>
          ) : tab === "Bookings" ? (
            <div className="phone-tab-content">
              <span className="phone-preview-label">ILLUSTRATIVE BOOKING</span>
              <div className="phone-booking expanded">
                <span className="phone-booking-icon">
                  <Wrench size={20} />
                </span>
                <div>
                  <strong>AC service</strong>
                  <small>Today · 2:00 PM · Lekki</small>
                </div>
              </div>
              <div className="phone-job-timeline">
                {[
                  "Request confirmed",
                  "Quote approved",
                  "Artisan on the way",
                ].map((t) => (
                  <div key={t}>
                    <span>
                      <Check size={11} />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
              <p>A little care. A lot more cool.</p>
              <button
                className="phone-primary-action"
                onClick={() => onService("AC & HVAC")}
              >
                Plan another repair <ArrowUpRight size={12} />
              </button>
            </div>
          ) : tab === "Help" ? (
            <div className="phone-tab-content">
              <CircleHelp size={35} />
              <h3>Let’s clear things up.</h3>
              <p>Find answers about quotes, artisans and your next repair.</p>
              <a className="phone-primary-action" href="#faq">
                Questions & answers <ArrowUpRight size={12} />
              </a>
              <div className="phone-tip">
                <ShieldCheck size={20} />
                <p>You approve the quote before work starts.</p>
              </div>
            </div>
          ) : (
            <div className="phone-tab-content">
              <span className="phone-profile-avatar">AO</span>
              <h3>Make yourself at home.</h3>
              <p>Your requests, repair updates and account in one place.</p>
              <Link href="/login/" className="phone-primary-action">
                Sign in to Fix-it <ArrowUpRight size={12} />
              </Link>
              <Link href="/signup/" className="phone-create-link">
                Create an account
              </Link>
            </div>
          )}
        </div>
        <nav
          className="phone-bottom-nav"
          aria-label="App screen preview navigation"
        >
          {[
            { name: "Home", icon: Home },
            { name: "Bookings", icon: CalendarDays },
            { name: "Help", icon: CircleHelp },
            { name: "Profile", icon: UserRound },
          ].map((t) => (
            <button
              key={t.name}
              className={tab === t.name ? "active" : ""}
              onClick={() => setTab(t.name)}
              aria-pressed={tab === t.name}
            >
              <t.icon size={16} />
              <span>{t.name}</span>
            </button>
          ))}
        </nav>
        <div className="phone-home-indicator" aria-hidden="true" />
      </div>
      <div className="app-verified-note">
        <span>
          <Check size={11} />
        </span>{" "}
        GOOD HANDS. LESS HASSLE.
      </div>
      <p className="app-preview-caption">
        A little look inside the Fix-it app.
      </p>
    </div>
  );
}
