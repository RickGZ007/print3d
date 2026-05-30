import { useState, useEffect, useRef } from "react";
import { Crosshair, Layers, Zap, Upload, CheckCircle, Printer, MessageCircle, Mail, ChevronRight, Star, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { projetosApi, coresApi, materiaisApi, configApi } from "../services/api";

// ─── CONFIGURE AQUI ──────────────────────────────────────────────────────────
const WHATSAPP_MSG = "Olá! Gostaria de solicitar um orçamento de impressão 3D.";

const WHATSAPP_NUMEROS = [
  { label: "Vendas",    numero: "5541997993826" }, // ← troque pelo seu número 
  { label: "Suporte",   numero: "554187900202" }, // ← troque pelo seu número 
  { label: "Orçamento", numero: "5541997993826" }, // ← troque pelo seu número 
];

// Primeiro número usado nos botões do Hero e Footer
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMEROS[0].numero}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
// ─────────────────────────────────────────────────────────────────────────────

const TODAS = "Todos";

function PropBar({ label, valor }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-surface2 rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${(valor / 5) * 100}%` }} />
      </div>
      <span className="text-xs text-muted w-4 text-right">{valor}/5</span>
    </div>
  );
}

// ─── COMPONENTE DO CARD WHATSAPP COM DROPDOWN ─────────────────────────────────
function WhatsAppCard() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Botão principal */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex flex-col items-center gap-4 p-8 surface hover:border-[#25D366]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#25D366]/10 w-full"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#25D366]/10 border border-[#25D366]/20 group-hover:bg-[#25D366]/20 transition-colors">
          <svg className="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold text-primary text-sm mb-1">WhatsApp</p>
          <p className="text-xs text-muted flex items-center justify-center gap-1">
            Escolha um número <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </p>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-60 surface shadow-2xl shadow-black/60 overflow-hidden">
          <p className="text-[10px] text-muted uppercase tracking-widest px-4 py-2.5 border-b border-border">
            Selecione o contato
          </p>
          {WHATSAPP_NUMEROS.map((n) => (
            <a
              key={n.numero + n.label}
              href={`https://wa.me/${n.numero}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface2 transition-colors group/item"
            >
              <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-primary group-hover/item:text-[#25D366] transition-colors">{n.label}</p>
                <p className="text-[10px] text-muted font-mono">
                  +{n.numero.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "$1 ($2) $3-$4")}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const PASSOS = [
  { icon: Upload,      titulo: "Envie seu arquivo",   desc: "STL, OBJ ou STEP. Aceitamos projetos prontos ou ajudamos a criar." },
  { icon: Layers,      titulo: "Escolha o material",  desc: "Material será escolhido conforme a necessidade do projeto. Ex: Se enfeite será PLA, projeto que demandam a utilização em lugares mais quentes como cozinha ou carro será usado PETG ou ABS." },
  { icon: CheckCircle, titulo: "Receba o orçamento",  desc: "Resposta em até 24h com prazo e valor exatos." },
  { icon: Printer,     titulo: "Impressão & entrega", desc: "Produção rápida com controle de qualidade antes do envio." },
];

export default function LandingPage() {
  const [projetos,        setProjetos]        = useState([]);
  const [cores,           setCores]           = useState([]);
  const [materiais,       setMateriais]       = useState([]);
  const [sobreTitulo,     setSobreTitulo]     = useState("Feitos para fazer");
  const [sobreTexto,      setSobreTexto]      = useState("");
  const [loadingProjetos, setLoadingProjetos] = useState(true);
  const [categoriaAtiva,  setCategoriaAtiva]  = useState(TODAS);

  useEffect(() => {
    projetosApi.listar().then(setProjetos).catch(console.error).finally(() => setLoadingProjetos(false));
    coresApi.listar().then(setCores).catch(console.error);
    materiaisApi.listarAtivos().then(setMateriais).catch(console.error);
    configApi.getMultiple(["sobre_titulo", "sobre_texto"]).then((data) => {
      if (data.sobre_titulo) setSobreTitulo(data.sobre_titulo);
      if (data.sobre_texto)  setSobreTexto(data.sobre_texto);
    }).catch(console.error);
  }, []);

  const categorias        = [TODAS, ...new Set(projetos.map((p) => p.categoria))];
  const projetosFiltrados = categoriaAtiva === TODAS ? projetos : projetos.filter((p) => p.categoria === categoriaAtiva);

  return (
    <div className="bg-page text-primary min-h-screen font-sans">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-accent rounded-full pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent-muted border border-accent/30 rounded-full px-3 py-1 text-xs font-semibold text-accent mb-6">
              <Star className="w-3 h-3 fill-accent" /> Impressão 3D profissional
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Transformamos suas{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">Ideias</span>{" "}
              em realidade
            </h1>
            <p className="text-lg text-secondary mb-10 max-w-xl leading-relaxed">
              Do arquivo ao objeto: Impressão 3D de alta qualidade e precisão para a indústria, prototipagem, design, decoração, chaveiros e brinquedos.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="btn-primary shadow-lg shadow-accent/30 text-base px-6 py-3.5">
                <MessageCircle className="w-5 h-5" /> Solicitar orçamento grátis
              </a>
              <a href="#portfolio"
                onClick={(e) => { e.preventDefault(); document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" }); }}
                className="btn-secondary text-base px-6 py-3.5">
                Ver projetos <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20">
            {[
              { icon: Crosshair, titulo: "Alta Precisão",         desc: "Tolerância de ±0.2mm e camadas de até 0.1mm." },
              { icon: Layers,    titulo: "Variedade de Materiais", desc: "PLA, ABS, PETG, TPU, Resina e mais." },
              { icon: Zap,       titulo: "Entrega Rápida",         desc: "Peças simples prontas em 24–48h." },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="flex items-start gap-4 bg-surface/60 border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                <div className="w-10 h-10 bg-accent-muted border border-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-sm mb-1">{titulo}</h3>
                  <p className="text-xs text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="portfolio" className="py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Portfólio</p>
            <h2 className="text-4xl sm:text-5xl font-black text-primary mb-4">Projetos realizados</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {categorias.map((cat) => (
              <button key={cat} onClick={() => setCategoriaAtiva(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoriaAtiva === cat
                    ? "bg-accent text-btn-primary-text"
                    : "bg-surface text-secondary hover:bg-surface2 hover:text-primary border border-border"
                }`}>{cat}</button>
            ))}
          </div>
          {loadingProjetos ? (
            <div className="flex items-center justify-center py-20 gap-3 text-secondary">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Carregando projetos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetosFiltrados.map((p) => <ProjectCard key={p.id} projeto={p} />)}
              {projetosFiltrados.length === 0 && (
                <p className="text-secondary text-sm col-span-3 text-center py-16">Nenhum projeto nesta categoria ainda.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* MATERIAIS */}
      <section id="materiais" className="py-24 bg-surface/40 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Materiais</p>
            <h2 className="text-4xl sm:text-5xl font-black text-primary mb-4">O material certo para cada projeto</h2>
          </div>
          {materiais.length === 0 ? (
            <p className="text-secondary text-sm">Nenhum material cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {materiais.map((mat) => (
                <div key={mat.id} className="surface p-6 hover:border-accent/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-black text-primary">{mat.nome}</h3>
                    {mat.destaque && (
                      <span className="text-xs bg-accent-muted text-accent border border-accent/20 px-2 py-1 rounded-full font-semibold">{mat.destaque}</span>
                    )}
                  </div>
                  <p className="text-sm text-secondary mb-5 leading-relaxed">{mat.descricao}</p>
                  <div className="flex flex-col gap-2.5">
                    {["resistencia", "acabamento", "facilidade", "flexibilidade"].map((prop) => (
                      <PropBar key={prop} label={prop.charAt(0).toUpperCase() + prop.slice(1)} valor={mat[prop]} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Cores disponíveis em estoque</h3>
            <div className="flex flex-wrap gap-3">
              {cores.filter((c) => c.em_estoque).map((cor) => (
                <div key={cor.id} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-9 h-9 rounded-full border-2 border-white/10 group-hover:border-accent/50 transition-all group-hover:scale-110"
                    style={{ backgroundColor: cor.hex }} title={cor.nome} />
                  <span className="text-[10px] text-muted group-hover:text-secondary transition-colors">{cor.nome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Processo</p>
            <h2 className="text-4xl sm:text-5xl font-black text-primary">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />
            {PASSOS.map(({ icon: Icon, titulo, desc }, i) => (
              <div key={titulo} className="relative flex flex-col items-center text-center gap-4 p-6 surface hover:border-accent/30 transition-colors">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-btn-primary-text text-xs font-black">{i + 1}</div>
                <div className="w-12 h-12 bg-accent-muted border border-accent/20 rounded-xl flex items-center justify-center mt-2">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-primary text-sm">{titulo}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-24 bg-surface/40 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Sobre nós</p>
          <h2 className="text-4xl font-black text-primary mb-6">{sobreTitulo}</h2>
          <p className="text-secondary leading-relaxed text-lg mb-10">{sobreTexto}</p>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-24 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Contato</p>
          <h2 className="text-4xl font-black text-primary mb-4">Fale com a gente</h2>
          <p className="text-secondary text-base mb-12">
            Escolha o canal de preferência — respondemos rapidamente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* WhatsApp com dropdown de 3 números */}
            <WhatsAppCard />

            {/* Instagram */}
            <a href="https://www.instagram.com/studiogc3d/?hl=es"
              target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 surface hover:border-[#E1306C]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E1306C]/10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#E1306C]/10 border border-[#E1306C]/20 group-hover:bg-[#E1306C]/20 transition-colors">
                <svg className="w-7 h-7 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.433 1.441 1.433c.795 0 1.439-.638 1.439-1.433 0-.795-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-primary text-sm mb-1">Instagram</p>
                <p className="text-xs text-muted">Siga nosso trabalho</p>
              </div>
            </a>

            {/* Gmail */}
            <a href="mailto:studiogc@studiogc.com.br"
              className="group flex flex-col items-center gap-4 p-8 surface hover:border-[#EA4335]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EA4335]/10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#EA4335]/10 border border-[#EA4335]/20 group-hover:bg-[#EA4335]/20 transition-colors">
                <svg className="w-7 h-7 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.909 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-primary text-sm mb-1">E-mail</p>
                <p className="text-xs text-muted">Para orçamentos detalhados</p>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-footer-border py-8 bg-footer-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-footer-text">
          <span className="font-black text-secondary">Studiogc<span className="text-accent">3D</span></span>
          <span>© {new Date().getFullYear()}  PRINT3D. Desenvolvido por RickGZ007 & ER Codeworks.  </span>
          <div className="flex items-center gap-4">
            
           {/* <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="hover:text-success transition-colors flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>*/}

          {/*  <a href="mailto:SEU_EMAIL@gmail.com"
              className="hover:text-accent transition-colors flex items-center gap-1">
              <Mail className="w-4 h-4" /> E-mail
            </a>
          */}

          </div>
        </div>
      </footer>
    </div>
  );
}