"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Check, X, Wrench } from "lucide-react";
export function Brand({
  light = false,
  admin = false,
}: {
  light?: boolean;
  admin?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Fix-it home"
    >
      <img src="/logo.svg" width="39" height="39" alt="" />
      <span>
        Fix-it<span className="brand-dot">.</span>
        {admin && <small>OPERATIONS</small>}
      </span>
    </Link>
  );
}
export function Toolbox({ small = false }: { small?: boolean }) {
  return (
    <div className={`toolbox-scene ${small ? "small" : ""}`} aria-hidden="true">
      <div className="scene-ring ring-one" />
      <div className="scene-ring ring-two" />
      <div className="tool-handle" />
      <div className="toolbox-back" />
      <div className="tool wrench">
        <Wrench strokeWidth={2.5} />
      </div>
      <div className="tool screwdriver">
        <div />
      </div>
      <div className="toolbox-body">
        <span className="toolbox-seam" />
        <div className="toolbox-lock" />
        <span className="toolbox-plus">+</span>
      </div>
      <div className="toolbox-foot" />
      <div className="clay-shield">
        <Check size={37} strokeWidth={3} />
      </div>
      <div className="scene-spark spark-one">✦</div>
      <div className="scene-spark spark-two">✦</div>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header>
        <h2>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={22} />
        </button>
      </header>
      {children}
    </dialog>
  );
}
export function Footer() {
  return (
    <footer className="site-footer pattern-dark">
      <div className="footer-top">
        <div>
          <Brand light />
          <h3>
            Less hassle.
            <br />
            More happy homes.
          </h3>
          <p>Everyday repairs. Expert hands.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <a href="/#services">Our services</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#artisans">For artisans</a>
        </div>
        <div>
          <h4>Your workspace</h4>
          <Link href="/login/">
            Sign in <ArrowUpRight size={15} />
          </Link>
          <Link href="/dashboard/">Dashboard demo</Link>
          <Link href="/signup/">Create an account</Link>
        </div>
        <div>
          <h4>Good to know</h4>
          <a href="/#faq">Questions & answers</a>
          <Link href="/legal/">Privacy & terms</Link>
          <a href="/#services">Explore repair categories</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Fix-it. All rights reserved.</span>
      </div>
    </footer>
  );
}
