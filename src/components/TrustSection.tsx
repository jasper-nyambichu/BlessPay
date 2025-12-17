const partners = [
  { name: "Adventist", abbr: "ADV" },
  { name: "ADRA", abbr: "ADRA" },
  { name: "Loma Linda", abbr: "LLU" },
  { name: "SDA Global", abbr: "SDA" },
  { name: "Hope Channel", abbr: "HOPE" },
  { name: "3ABN", abbr: "3ABN" },
];

const TrustSection = () => {
  return (
    <section id="community" className="py-20 bg-secondary/30 border-y border-border/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Trusted Worldwide
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Partnering with <span className="italic text-gradient-gold">Adventist Organizations</span>
          </h3>
        </div>

        {/* Partners Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group flex items-center justify-center"
            >
              <div className="px-6 py-4 rounded-xl bg-card border border-border/40 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5">
                <span className="font-serif text-lg md:text-xl font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {partner.abbr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;