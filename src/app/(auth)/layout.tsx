export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-bg)" }}>
      <div className="w-full max-w-md">
        {/* Logo + titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "var(--gradient-neotechno)" }}>
            <span className="text-2xl font-bold text-white font-display">RS</span>
          </div>
          <h1 className="text-gradient font-display text-2xl font-bold">RS-Builder</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            by NéoTechno Formation
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
