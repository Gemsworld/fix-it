"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleCheck,
  Check,
  Wrench,
  Menu,
  ShieldCheck,
  Smartphone,
  X,
  Wallet,
} from "lucide-react";
import { Brand, Footer, Modal } from "./shared";
import { PhonePreview, StoreButtons, StoreAvailability } from "./app-preview";
import { services } from "@/lib/data";
export default function Landing() {
  const [menu, setMenu] = useState(false);
  const [all, setAll] = useState(false);
  const [request, setRequest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [store, setStore] = useState<"apple" | "google" | null>(null);
  const questions = [
    [
      "How does Fix-it work?",
      "Choose your repair category, describe the problem and request an artisan. You review the quote before any work starts, and confirm when the job is complete.",
    ],
    [
      "How are artisans checked?",
      "The planned verification process covers identity, trade information and supporting documents. Look for an approved verification status when choosing an artisan.",
    ],
    [
      "What will my repair cost?",
      "The cost depends on the work. An artisan shares a quote for your approval first. Any call-out fee should be shown before you confirm a booking.",
    ],
    [
      "Where can I use Fix-it?",
      "Lagos, Abuja and Port Harcourt are the intended launch cities. Availability is confirmed when an artisan accepts your request.",
    ],
    [
      "Can I join as an artisan?",
      "Yes. Create an artisan account and submit your trade and location details. Your application is reviewed before you can accept jobs.",
    ],
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="floating-header">
        <Brand />
        <nav
          className={menu ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <a href="#services" onClick={() => setMenu(false)}>
            Services
          </a>
          <a href="#how-it-works" onClick={() => setMenu(false)}>
            How it works
          </a>
          <a href="#artisans" onClick={() => setMenu(false)}>
            For artisans <ArrowUpRight size={13} />
          </a>
          <a href="#faq" onClick={() => setMenu(false)}>
            FAQs
          </a>
        </nav>
        <div className="nav-actions">
          <Link href="/login/" className="login-link">
            Log in
          </Link>
          <Link className="button button-navy nav-cta" href="/signup/">
            Get started <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button mobile-toggle"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
            aria-expanded={menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero page-width">
          <div className="hero-copy">
            <div className="eyebrow-pill">
              <span className="status-dot" /> A little help. A whole lot of
              peace of mind.
            </div>
            <h1>
              Life happens.
              <br />
              Let’s{" "}
              <span className="fix-word">
                fix it.
                <svg viewBox="0 0 240 15" aria-hidden="true">
                  <path
                    d="M5 10Q115 0 235 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="hero-description">
              From the tap that won’t stop to the AC that won’t start. Find
              skilled hands nearby and get back to what matters.
            </p>
            <div className="hero-downloads">
              <StoreButtons onUnavailable={setStore} />
              <StoreAvailability />
            </div>
            <a href="#services" className="hero-services-link">
              Explore our services <ArrowRight size={16} />
            </a>
            <div className="hero-promises">
              <span>
                <ShieldCheck size={18} /> Verified artisans
              </span>
              <span>
                <CircleCheck size={18} /> Quotes upfront
              </span>
              <span>
                <Wallet size={18} /> Pay after approval
              </span>
            </div>
          </div>
          <PhonePreview
            onService={(service) => {
              setRequest(service);
              setSubmitted(false);
            }}
          />
        </section>
        <div className="service-strip">
          <span>SMALL FIXES. BIG RELIEF.</span>
          <b>Home, handled.</b>
          <span className="strip-star">✦</span>
          <b>Skilled hands, nearby.</b>
          <span className="strip-star">✦</span>
          <b>No more “I know a guy.”</b>
          <span className="strip-star">✦</span>
          <b>Just Fix-it.</b>
        </div>
        <section id="services" className="services-section page-width">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A PRO FOR EVERY PROBLEM</span>
              <h2>What needs a little love?</h2>
              <p>One place for the repairs on your to-do list.</p>
            </div>
            <button className="text-button" onClick={() => setAll(!all)}>
              {all ? "Show fewer" : "Explore all services"}{" "}
              <ArrowUpRight size={19} />
            </button>
          </div>
          <div className="service-grid">
            {(all ? services : services.slice(0, 6)).map((s, i) => (
              <button
                key={s.name}
                className={`service-card clay ${s.tone}`}
                onClick={() => {
                  setRequest(s.name);
                  setSubmitted(false);
                }}
              >
                <div className="service-card-top">
                  <span className={`clay-icon ${s.tone}`}>
                    <s.icon size={29} strokeWidth={1.7} />
                  </span>
                  <span className="service-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <span className="service-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </button>
            ))}
          </div>
          <div className="service-note">
            <ShieldCheck size={18} />
            <span>Your home deserves care. You deserve a clear quote.</span>
            <span className="muted">No work starts without your say-so.</span>
          </div>
        </section>
        <section id="how-it-works" className="how-section pattern-light">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="eyebrow">LESS CHASING. MORE LIVING.</span>
                <h2>From “oh no” to all sorted.</h2>
              </div>
              <p className="heading-note">
                Three simple steps.
                <br />
                One less thing on your mind.
              </p>
            </div>
            <div className="steps-grid">
              {[
                {
                  n: "01",
                  icon: Smartphone,
                  title: "Tell us what’s wrong.",
                  text: "Choose a service, tell us the details and pick a time that works for you.",
                  tone: "blue",
                },
                {
                  n: "02",
                  icon: Wrench,
                  title: "Meet your helping hand.",
                  text: "Get matched with a nearby artisan. Review their quote and give the go-ahead.",
                  tone: "mint",
                },
                {
                  n: "03",
                  icon: CircleCheck,
                  title: "Fixed. And feeling good.",
                  text: "Check the work, confirm you’re happy and approve payment. That’s a wrap.",
                  tone: "peach",
                },
              ].map((s) => (
                <div key={s.n} className="step-card">
                  <div className="step-top">
                    <span className={`clay-icon ${s.tone}`}>
                      <s.icon size={28} />
                    </span>
                    <span className="step-number">{s.n}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="care-section page-width">
          <div className="care-visual clay pattern-mint">
            <div className="big-shield">
              <ShieldCheck size={108} strokeWidth={1.3} />
            </div>
            <div className="care-label clay">
              <span className="status-dot" /> A little reassurance, built in.
            </div>
            <div className="care-orbit one" />
            <div className="care-orbit two" />
          </div>
          <div className="care-copy">
            <span className="eyebrow">YOUR SPACE. YOUR PEACE OF MIND.</span>
            <h2>
              Good repairs start
              <br />
              with good people.
            </h2>
            <p>
              Inviting someone into your home is a big deal. We’re building
              Fix-it around the things that make it feel easier.
            </p>
            {[
              [
                "Know who’s coming",
                "Artisan profiles and verification information.",
              ],
              [
                "Know what you’re paying",
                "A clear quote to review before work begins.",
              ],
              [
                "Keep it all together",
                "Your requests, job updates and payment history.",
              ],
            ].map(([a, b]) => (
              <div className="care-item" key={a}>
                <span>
                  <Check size={17} />
                </span>
                <div>
                  <strong>{a}</strong>
                  <p>{b}</p>
                </div>
              </div>
            ))}
            <Link href="/signup/" className="text-button">
              Make yourself at home <ArrowRight size={18} />
            </Link>
          </div>
        </section>
        <section
          id="artisans"
          className="artisan-section page-width pattern-dark"
        >
          <div>
            <span className="eyebrow mint-text">
              YOUR SKILL. YOUR NEXT OPPORTUNITY.
            </span>
            <h2>
              You do the fixing.
              <br />
              We’ll help you find the jobs.
            </h2>
            <p>
              Turn your craft into more opportunities. Join a community of
              skilled artisans helping people close to home.
            </p>
            <Link href="/signup/?role=artisan" className="button button-mint">
              Join as an artisan <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="artisan-benefits">
            {[
              [
                "Jobs in your neighbourhood",
                "Spend less time searching, more time doing.",
              ],
              [
                "Your work, your quote",
                "Share a clear price before the job begins.",
              ],
              [
                "A reputation that grows",
                "Let your skills and completed work speak for you.",
              ],
            ].map(([a, b], i) => (
              <div key={a}>
                <span className="benefit-num">0{i + 1}</span>
                <div>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </div>
                <ArrowUpRight size={20} />
              </div>
            ))}
          </div>
        </section>
        <section id="faq" className="faq-section page-width">
          <div>
            <span className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</span>
            <h2>
              Good questions.
              <br />
              Straight answers.
            </h2>
            <p>A little clarity before you get started.</p>
            <div className="faq-decoration">
              <span className="clay-icon yellow">
                <span>?</span>
              </span>
              <span>
                We’re here to make
                <br />
                repairs feel simpler.
              </span>
            </div>
          </div>
          <div className="faq-list">
            {questions.map(([q, a], i) => (
              <div className={`faq-item ${faq === i ? "active" : ""}`} key={q}>
                <button
                  onClick={() => setFaq(faq === i ? null : i)}
                  aria-expanded={faq === i}
                >
                  {q}
                  <span>{faq === i ? "−" : "+"}</span>
                </button>
                {faq === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </section>
        <section className="final-cta page-width pattern-mint">
          <div>
            <span className="eyebrow">
              LESS TO WORRY ABOUT. MORE TO LOOK FORWARD TO.
            </span>
            <h2>
              A happier home
              <br />
              starts with a little help.
            </h2>
          </div>
          <div>
            <StoreButtons onUnavailable={setStore} />
            <StoreAvailability compact />
          </div>
        </section>
      </main>
      <Footer />
      {request && (
        <Modal
          title={
            submitted
              ? "Request saved for this visit"
              : `Let’s sort your ${request.toLowerCase()}`
          }
          onClose={() => setRequest("")}
        >
          {submitted ? (
            <div className="success-panel">
              <CircleCheck size={45} />
              <h3>You’ve taken the first step.</h3>
              <p>
                This preview keeps your request in this browser. Create an
                account when the live service is connected to book an artisan.
              </p>
              <Link href="/signup/" className="button button-blue">
                Create an account <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                localStorage.setItem(
                  "fixit-repair-request",
                  JSON.stringify({
                    service: request,
                    details: form.get("details"),
                    area: form.get("area"),
                    date: form.get("date"),
                  }),
                );
                setSubmitted(true);
              }}
            >
              <p>
                Tell us a little about the job. This preview saves a request
                locally; it does not dispatch an artisan.
              </p>
              <label>
                What’s happening?
                <textarea
                  name="details"
                  required
                  minLength={10}
                  placeholder="For example, the kitchen tap has been leaking…"
                />
              </label>
              <label>
                Your area
                <input name="area" required placeholder="e.g. Lekki, Lagos" />
              </label>
              <label>
                Preferred date
                <input
                  name="date"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  required
                />
              </label>
              <button className="button button-blue">
                Save repair request <ArrowRight size={18} />
              </button>
            </form>
          )}
        </Modal>
      )}
      {store && (
        <Modal
          title={store === "apple" ? "Fix-it for iPhone" : "Fix-it for Android"}
          onClose={() => setStore(null)}
        >
          <div className="success-panel">
            <Smartphone size={43} />
            <h3>Your next repair, right in your pocket.</h3>
            <p>
              The {store === "apple" ? "App Store" : "Google Play"} download
              link has not been connected yet. Once Fix-it is published, this
              button will take you straight to its official listing.
            </p>
            <Link href="/signup/" className="button button-blue">
              Get started on the web <ArrowUpRight size={17} />
            </Link>
            <button className="text-button" onClick={() => setStore(null)}>
              Keep exploring <ArrowRight size={16} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
