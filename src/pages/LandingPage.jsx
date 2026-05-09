import { useState, useEffect } from "react";
import { Crosshair, Layers, Zap, Upload, CheckCircle, Printer, MessageCircle, Mail, ChevronRight, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { projetosApi, coresApi, materiaisApi, configApi } from "../services/api";

const WHATSAPP_NUMBER = "5541999999999";
const WHATSAPP_MSG    = "Olá! Gostaria de solicitar um orçamento.";
const whatsappUrl     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
const TODAS = "Todos";

function PropBar({ label, valor }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-surface2 rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${(valor/5)*100}%` }} />
      </div>
      <span className="text-xs text-muted w-4 text-right">{valor}/5</span>
    </div>
  );
}

const PASSOS = [
  { icon: Upload,      titulo: "Envie seu arquivo",   desc: "STL, OBJ ou STEP. Aceitamos projetos prontos ou ajudamos a criar." },
  { icon: Layers,      titulo: "Escolha o material",  desc: "PLA, ABS, PETG e mais. Consultoria gratuita incluída." },
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
    // Carrega tudo em paralelo
    projetosApi.listar().then(setProjetos).catch(console.error).finally(() => setLoadingProjetos(false));
    coresApi.listar().then(setCores).catch(console.error);
    materiaisApi.listarAtivos().then(setMateriais).catch(console.error);
    configApi.getMultiple(["sobre_titulo", "sobre_texto"]).then((data) => {
      if (data.sobre_titulo) setSobreTitulo(data.sobre_titulo);
      if (data.sobre_texto)  setSobreTexto(data.sobre_texto);
    }).catch(console.error);
  }, []);

  const categorias       = [TODAS, ...new Set(projetos.map((p) => p.categoria))];
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
              <Star className="w-3 h-3 fill-accent" /> Impressão 3D profissional com entrega rápida
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Transformamos suas{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">ideias digitais</span>{" "}
              em realidade física.
            </h1>
            <p className="text-lg text-secondary mb-10 max-w-xl leading-relaxed">
              Do arquivo ao objeto: impressão 3D de alta precisão para indústria, prototipagem e design.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="btn-primary shadow-lg shadow-accent/30 text-base px-6 py-3.5">
                <MessageCircle className="w-5 h-5" /> Solicitar orçamento grátis
              </a>
              <a href="#portfolio" onClick={(e) => { e.preventDefault(); document.querySelector("#portfolio")?.scrollIntoView({ behavior:"smooth" }); }}
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

      {/* MATERIAIS — vêm do Supabase, só os ativos */}
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
                    {["resistencia","acabamento","facilidade","flexibilidade"].map((prop) => (
                      <PropBar key={prop} label={prop.charAt(0).toUpperCase()+prop.slice(1)} valor={mat[prop]} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cores */}
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
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-btn-primary-text text-xs font-black">{i+1}</div>
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

      {/* SOBRE — texto editável pelo admin */}
      <section id="sobre" className="py-24 bg-surface/40 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Sobre nós</p>
          <h2 className="text-4xl font-black text-primary mb-6">{sobreTitulo}</h2>
          <p className="text-secondary leading-relaxed text-lg mb-10">{sobreTexto}</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-base px-8 py-4 shadow-lg shadow-accent/30">
            <MessageCircle className="w-5 h-5" /> Fale com a gente no WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-footer-border py-8 bg-footer-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-footer-text">
          <span className="font-black text-secondary">PRINT<span className="text-accent">3D</span></span>
          <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-success transition-colors flex items-center gap-1"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            <a href="mailto:contato@print3d.com" className="hover:text-accent transition-colors flex items-center gap-1"><Mail className="w-4 h-4" /> E-mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
