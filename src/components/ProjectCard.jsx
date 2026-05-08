import { Package, Target } from "lucide-react";
import { resolveImageUrl } from "../services/imageUtils";

const BADGE = {
  Industrial:   "bg-badge-industrial-bg  text-badge-industrial-text",
  Decoração:    "bg-badge-decoration-bg  text-badge-decoration-text",
  Prototipagem: "bg-badge-prototype-bg   text-badge-prototype-text",
  Medicina:     "bg-badge-medicine-bg    text-badge-medicine-text",
  Educação:     "bg-badge-education-bg   text-badge-education-text",
};

const MATERIAL_COLOR = {
  PLA:   "text-success",
  ABS:   "text-accent",
  PETG:  "text-[#22d3ee]",
  TPU:   "text-[#a78bfa]",
  Resina:"text-[#fb7185]",
};

export default function ProjectCard({ projeto }) {
  const imagemUrl = resolveImageUrl(projeto.imagem);

  return (
    <article className="project-card group">
      <div className="relative overflow-hidden aspect-video bg-surface2">
        <img src={imagemUrl} alt={projeto.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy" referrerPolicy="no-referrer" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${BADGE[projeto.categoria] || "bg-surface2 text-secondary"}`}>
          {projeto.categoria}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-primary font-bold text-base leading-tight group-hover:text-accent transition-colors">
          {projeto.titulo}
        </h3>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Package className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Material: <strong className={MATERIAL_COLOR[projeto.material] || "text-primary"}>{projeto.material}</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-secondary">
            <Target className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{projeto.finalidade}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
