type Partner = {
  name: string;
  logoSrc: string;
  website?: string;
  category?: string;
};

const PARTNERS: Partner[] = [
  { name: "Cardio", logoSrc: "/partners/cardio.png", category: "Clínica" },
  { name: "Imago", logoSrc: "/partners/imago.png", category: "Imagem" },
  { name: "Diagno Radiologia", logoSrc: "/partners/diagno.png", category: "Radiologia" },
  { name: "Ótica Nossa Sra. das Dores", logoSrc: "/partners/otica-nossa-senhora.png", category: "Ótica" },
  { name: "Farmácia Dia e Noite", logoSrc: "/partners/farmacia-dia-e-noite.png", category: "Farmácia" },
  { name: "Unianálises", logoSrc: "/partners/unianalisis.png", category: "Laboratório" },
  { name: "ISA Ótica", logoSrc: "/partners/isa-otica.png", category: "Ótica" },
  { name: "Micheila Henrique", logoSrc: "/partners/micheila-henrique.png", category: "Dermatologia" },
  { name: "Pague Menos", logoSrc: "/partners/pague-menos.png", category: "Farmácia" },
  { name: "Humana", logoSrc: "/partners/humana.png", category: "Imagem" },
];

export default function PartnersGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-center">
      {PARTNERS.map((p) => {
        const Card = (
          <div className="rounded-3xl bg-white/70 backdrop-blur border border-border shadow-sm p-6 hover:shadow-md transition-shadow h-32 flex items-center justify-center">
            <img
              src={p.logoSrc}
              alt={p.name}
              className="max-h-16 max-w-[200px] object-contain"
              loading="lazy"
            />
          </div>
        );

        return p.website ? (
          <a
            key={p.name}
            href={p.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir site de ${p.name}`}
          >
            {Card}
          </a>
        ) : (
          <div key={p.name}>{Card}</div>
        );
      })}
    </div>
  );
}
