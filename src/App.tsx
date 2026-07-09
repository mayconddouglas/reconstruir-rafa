/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ReactNode } from 'react';
import { ArrowRight, CheckCircle, ChevronRight, ChevronLeft, ChevronDown, Star, Menu, MessageCircle, Phone, X, Instagram, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import QuoteModal from './components/QuoteModal';

const NAV_LINKS = [
  { id: 'sobre', label: 'Sobre Nós' },
  { id: 'servicos', label: 'Especialidades' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contato', label: 'Contato' },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Maurício Albuquerque",
    role: "Proprietário, Residência RES-01",
    text: "O nível de rigor técnico da Reconstruir superou todas as expectativas. O cronograma foi cumprido à risca, com relatórios semanais detalhados e uma equipe impecável no canteiro de obras. Indico sem reservas para obras de alto padrão.",
    rating: 5,
    code: "SYS // TST-01",
    tag: "OBRA RESIDENCIAL DE LUXO",
  },
  {
    id: 2,
    name: "Juliana Mendes",
    role: "Diretora de Operações, Sede Concept",
    text: "Reformar nossa sede corporativa de 1.200m² sem interromper nossas atividades diárias parecia impossível. A engenharia da Reconstruir executou a obra com tal precisão, silêncio e organização que foi surpreendente.",
    rating: 5,
    code: "SYS // TST-02",
    tag: "OBRA COMERCIAL COMPLEXA",
  },
  {
    id: 3,
    name: "Ricardo Vasconcelos",
    role: "Arquiteto e Designer de Interiores",
    text: "Como arquiteto, prezo pelo detalhamento milimétrico. A Reconstruir foi a única construtora que de fato respeitou as especificações de projeto, as paginações complexas e as soluções de iluminação indireta que desenhei.",
    rating: 5,
    code: "SYS // TST-03",
    tag: "PARCERIA TÉCNICA // ARQUITETURA",
  },
];

const FAQS = [
  {
    id: 1,
    question: "Como é calculado o orçamento de uma obra ou reforma?",
    answer: "Nossos orçamentos são baseados em um levantamento quantitativo milimétrico do projeto e na composição de custos unitários (SINAPI e cotações de mercado). Desenvolvemos uma planilha orçamentária transparente, detalhando cada etapa, material e hora técnica de engenharia, eliminando taxas ocultas e imprevistos.",
    code: "SYS // FAQ-01",
    tag: "ORÇAMENTAÇÃO E CUSTOS"
  },
  {
    id: 2,
    question: "A Reconstruir fornece garantia pós-obra?",
    answer: "Sim. Conforme as normas técnicas brasileiras (NBRs) e o Código Civil, oferecemos garantia total de até 5 anos para sistemas estruturais e de impermeabilização, além de garantias específicas para acabamentos e instalações elétricas/hidráulicas descritas em nosso manual de entrega pós-obra.",
    code: "SYS // FAQ-02",
    tag: "GARANTIA E NORMAS NBR"
  },
  {
    id: 3,
    question: "Vocês cuidam da parte de licenciamento e alvarás?",
    answer: "Prestamos assessoria completa na obtenção de alvarás de construção, reforma, licenças ambientais e habite-se junto aos órgãos municipais e condomínios, garantindo que toda a documentação legal e o recolhimento de ART (Anotação de Responsabilidade Técnica) estejam em plena conformidade antes do início dos trabalhos.",
    code: "SYS // FAQ-03",
    tag: "DOCUMENTAÇÃO LEGAL & ART"
  },
  {
    id: 4,
    question: "Como funciona o acompanhamento do cronograma físico-financeiro?",
    answer: "Utilizamos metodologias avançadas de planejamento de engenharia (como a Linha de Balanço e diagramas de Gantt). O cliente tem acesso a relatórios de progresso semanais detalhados com fotos e medições reais, permitindo acompanhar o cumprimento rigoroso de cada etapa programada.",
    code: "SYS // FAQ-04",
    tag: "PLANEJAMENTO & ENGENHARIA"
  },
  {
    id: 5,
    question: "Vocês realizam apenas obras de alto padrão ou também comerciais?",
    answer: "Atuamos tanto no segmento residencial de alto padrão quanto no corporativo/comercial de alta complexidade. Nossa engenharia está capacitada para coordenar cronogramas especiais (como trabalhos noturnos em escritórios) para minimizar o impacto na operação do cliente.",
    code: "SYS // FAQ-05",
    tag: "ESCOPO DE ATUAÇÃO"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ==========================================
// ENHANCEMENT 1: LUXURY SCREEN PRELOADER
// ==========================================
interface LuxuryPreloaderProps {
  onComplete: () => void;
}

function LuxuryPreloader({ onComplete }: LuxuryPreloaderProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 bg-neutral-950 z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle blueprint grid line decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      
      <div className="relative flex flex-col items-center max-w-xs w-full text-center space-y-6 px-6">
        {/* Decorative architectural blade */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "48px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-[1.5px] bg-primary mb-2"
        />

        <div className="space-y-1">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] text-white uppercase"
          >
            RECONSTRUIR
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-medium"
          >
            Estúdio de Engenharia & Arquitetura
          </motion.p>
        </div>

        {/* Luxury loading progress indicator */}
        <div className="w-full h-[1px] bg-white/5 relative overflow-hidden mt-6">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
            className="absolute inset-0 bg-primary origin-left"
          />
        </div>

        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-[9px] font-mono text-muted-foreground/60 tracking-wider block pt-2"
        >
          SISTEMA CARREGANDO // NBR ACTIVE
        </motion.span>
      </div>
    </motion.div>
  );
}

// ==========================================
// ENHANCEMENT 3: PORTFOLIO SCROLL PARALLAX CARD
// ==========================================
interface PortfolioCardProps {
  idCode: string;
  area: string;
  title: string;
  imgUrl: string;
  widthClass: string;
  heightClass: string;
  index: number;
}

function PortfolioCard({ idCode, area, title, imgUrl, widthClass, heightClass, index }: PortfolioCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Local scroll tracking for parallax effect on image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Translate the image slightly as it moves through the viewport
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      variants={{
        hover: { y: -6 }
      }}
      className={`group relative overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 hover:border-primary/25 transition-all duration-500 rounded-2xl ${widthClass} ${heightClass}`}
    >
      {/* Active Blade Transition */}
      <motion.div 
        className="absolute left-0 bg-primary/20 group-hover:bg-primary transition-colors duration-500 z-30"
        initial={{ height: "40px", width: "2px", top: "32px" }}
        variants={{
          hover: { height: "100%", width: "4px", top: "0px" }
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Image Container with Parallax and Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          style={{ y: yParallax }}
          src={imgUrl} 
          alt={title} 
          className="absolute inset-x-0 -top-[15%] -bottom-[15%] w-full h-[130%] object-cover origin-center"
          variants={{
            hover: { scale: 1.04 }
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/25 to-neutral-950/10 pointer-events-none" />
      </div>

      {/* Glassmorphic Caption Banner */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-5 rounded-xl bg-neutral-950/75 backdrop-blur-md border border-white/5 z-20 transition-all duration-500 group-hover:bg-neutral-950/90 group-hover:border-primary/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] md:text-[10px] text-primary uppercase tracking-widest font-semibold">{idCode}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{area}</span>
            </div>
            <h4 className="font-heading text-lg md:text-xl font-light text-foreground group-hover:text-white transition-colors">{title}</h4>
          </div>
          <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-colors duration-300">
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// ENHANCEMENT 4: ELEGANT TEXT REVEAL MASKS
// ==========================================
function RevealHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// NEW ENHANCEMENT: PROGRESSIVE STAGGER REVEAL
// ==========================================
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

interface RevealStaggerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  margin?: string;
}

function RevealStagger({ children, className = "", once = true, margin = "-50px" }: RevealStaggerProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FAQItemProps {
  key?: number | string;
  question: string;
  answer: string;
  code: string;
  tag: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, code, tag, isOpen, onToggle }: FAQItemProps) {
  return (
    <div 
      onClick={onToggle}
      className="relative group overflow-hidden rounded-xl bg-neutral-900/20 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 p-6 md:p-8 cursor-pointer select-none"
    >
      {/* Left structural "Blade" indicator that expands on active/hover */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 ${
          isOpen ? 'bg-primary h-full w-[4px]' : 'bg-primary/20 group-hover:bg-primary/60'
        }`} 
      />

      {/* Architectural blueprint grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

      <div className="relative z-10 space-y-4">
        {/* Top header line */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-primary uppercase tracking-widest">
            // {tag}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
            {code}
          </span>
        </div>

        {/* Question and toggle icon */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-heading text-base md:text-lg font-medium text-foreground group-hover:text-white transition-colors tracking-tight">
            {question}
          </h4>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="p-1 rounded-full border border-white/5 bg-white/5 text-muted-foreground group-hover:text-white group-hover:border-white/10 transition-colors flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Answer with smooth height and opacity transitions using motion */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="text-sm md:text-[15px] text-muted-foreground/85 leading-relaxed font-light pt-4 border-t border-white/5">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isHoveringTestimonials, setIsHoveringTestimonials] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (isHoveringTestimonials) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000); // changes every 6 seconds
    return () => clearInterval(interval);
  }, [isHoveringTestimonials]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);
  
  const col1Images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1613490908592-fd5a121345d7?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=480&q=50"
  ];

  const col2Images = [
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=480&q=50"
  ];

  const col3Images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=480&q=50",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=480&q=50"
  ];

  const fullCol1 = [...col1Images, ...col1Images];
  const fullCol2 = [...col2Images, ...col2Images];
  const fullCol3 = [...col3Images, ...col3Images];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = NAV_LINKS.map(link => document.getElementById(link.id));
      let currentActive = '';
      
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // Check if section is in the top half of the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
            currentActive = section.id;
          }
        }
      }
      setActiveSection(currentActive);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();

  const x1 = useTransform(scrollYProgress, [0, 0.4], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 0.4], ["-30%", "0%"]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic reading progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3.5px] bg-primary origin-left z-[999] pointer-events-none" 
        style={{ scaleX: scrollYProgress }} 
      />

      {/* Luxury Preloader */}
      <AnimatePresence>
        {isLoading && (
          <LuxuryPreloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 pointer-events-none ${
          scrolled ? 'pt-2.5' : 'pt-5 md:pt-6'
        }`}
      >
        <div 
          className={`mx-auto flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 border rounded-full shadow-2xl pointer-events-auto transition-all duration-500 ${
            scrolled 
              ? 'max-w-5xl md:max-w-6xl bg-background/85 backdrop-blur-xl border-white/5 shadow-xl' 
              : 'max-w-5xl md:max-w-6xl bg-background/40 backdrop-blur-md border-white/10 shadow-none'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary-foreground rounded-[3px]" />
            </div>
            <span className="font-heading font-semibold tracking-wider uppercase text-sm">Reconstruir</span>
          </div>
          
          <div className="hidden md:flex items-center relative">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                className={`relative px-4 py-1.5 text-sm font-medium transition-colors z-10 ${
                  activeSection === link.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white/5 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="hidden md:flex">
            <a href="https://wa.me/5581999999999" target="_blank" rel="noreferrer" className="px-3 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 hover:bg-primary/90 transition-all duration-300">
              FALAR NO WHATSAPP
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <button 
            className="md:hidden text-foreground p-1.5 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-4 text-base font-medium mt-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.1), duration: 0.4 }}
                  className={`border-b border-white/5 pb-3.5 ${activeSection === link.id ? 'text-primary' : 'text-foreground/90'}`}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.a 
                href="https://wa.me/5581999999999" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8 h-12 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                Falar no WhatsApp
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="space-y-32 pb-32">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-20 px-4 md:px-6 min-h-screen lg:min-h-[105vh] flex flex-col items-center justify-between overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          </div>

          {/* Centered Hero Typography block */}
          <div className="flex-grow min-h-[70vh] md:min-h-[65vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto relative z-10 w-full py-8 md:py-12">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center space-y-8"
            >
              <motion.h1 
                variants={itemVariants}
                className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-balance leading-[1.1] text-center"
              >
                Não levamos <span className="text-white/40">problemas,</span><br />
                levamos{' '}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent bg-300% animate-gradient">
                    soluções.
                  </span>
                  <svg className="absolute -bottom-3 left-0 w-full h-3 text-primary/30 -z-10 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                      d="M0 5 Q 50 10 100 5" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      fill="transparent" 
                    />
                  </svg>
                </span>
              </motion.h1>

              <motion.p 
                variants={itemVariants} 
                className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-xl leading-relaxed font-light text-balance"
              >
                Há 10 anos executando obras e reformas de alto padrão. Nossa missão é entregar <span className="text-foreground font-medium font-normal">tranquilidade</span> e <span className="text-foreground font-medium font-normal">excelência</span>.
              </motion.p>

              <motion.div variants={itemVariants} className="flex justify-center pt-1">
                <button 
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="group relative h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_25px_-8px_var(--primary)] overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10">SOLICITAR ORÇAMENTO</span>
                  <ArrowRight className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </motion.div>
            </motion.div>

            {/* Elegant Bouncing Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-6 flex flex-col items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium"
            >
              <span>Rolar para explorar</span>
              <div className="w-5 h-8 border border-white/10 rounded-full p-0.5 flex justify-center">
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="w-1 h-1 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Sliding Image Runway Section */}
          <div className="w-full relative py-12 md:py-20 overflow-hidden select-none">
            {/* Dark Side Overlays to blur/fade the horizontal edges */}
            <div className="absolute left-0 inset-y-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col gap-8 w-full max-w-[100vw]">
              {/* Row 1 - Slides left */}
              <motion.div 
                style={{ x: x1 }}
                className="flex gap-6 whitespace-nowrap"
              >
                {[...col1Images, ...col3Images, ...col2Images].map((url, idx) => (
                  <div 
                    key={idx} 
                    className="relative flex-shrink-0 w-[280px] md:w-[380px] aspect-[16/10] rounded-2xl overflow-hidden group shadow-xl border border-white/10 bg-neutral-900"
                  >
                    <img 
                      src={url} 
                      alt={`Reconstruir Projeto - ${idx}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <div>
                        <p className="text-xs text-primary font-mono uppercase tracking-wider mb-1">PROJETO PREMIUM</p>
                        <h4 className="text-white text-sm font-heading font-medium">Reconstruir Engenharia</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Row 2 - Slides right */}
              <motion.div 
                style={{ x: x2 }}
                className="flex gap-6 whitespace-nowrap"
              >
                {[...col2Images, ...col1Images, ...col3Images].map((url, idx) => (
                  <div 
                    key={idx} 
                    className="relative flex-shrink-0 w-[280px] md:w-[380px] aspect-[16/10] rounded-2xl overflow-hidden group shadow-xl border border-white/10 bg-neutral-900"
                  >
                    <img 
                      src={url} 
                      alt={`Reconstruir Projeto - ${idx}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <div>
                        <p className="text-xs text-primary font-mono uppercase tracking-wider mb-1">ACABAMENTO EXTRAORDINÁRIO</p>
                        <h4 className="text-white text-sm font-heading font-medium">Reconstruir Engenharia</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          <hr className="border-border" />
        </div>

        {/* About Section */}
        <section id="sobre" className="px-4 sm:px-8 md:px-12 lg:px-16 scroll-mt-32">
          <div className="max-w-5xl lg:max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column (Sticky Indicator) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3 space-y-1.5 lg:sticky lg:top-32"
              >
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  (01) Sobre Nós
                </span>
                <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                  Construindo confiança.
                </p>
              </motion.div>

              {/* Right Column (Content) */}
              <RevealStagger className="lg:col-span-9 space-y-12">
                <RevealItem>
                  <h3 className="font-heading text-2xl md:text-4xl lg:text-[2.75rem] font-light tracking-tight text-balance leading-[1.2] text-foreground">
                    Enquanto muitos focam apenas em fazer o serviço, nós nos preocupamos com a <span className="text-white font-normal">excelência da execução</span>.
                  </h3>
                </RevealItem>

                <RevealItem className="grid md:grid-cols-2 gap-8 text-muted-foreground/80 leading-relaxed text-sm md:text-[15px] font-light">
                  <p>
                    Trabalhando desde criança e acompanhando meu pai no ramo da construção civil, peguei gosto e decidi seguir por esse caminho. Há 10 anos a RECONSTRUIR transforma projetos em realidade.
                  </p>
                  <p>
                    Sabemos que o cliente muitas vezes opta pelo mais barato e acaba tendo prejuízos. Nosso objetivo é mostrar que qualidade, respeito às normas técnicas e garantia têm um valor agregado que traz paz de espírito.
                  </p>
                </RevealItem>
                
                {/* Lâmina de Engenharia Grid Columns */}
                <div className="grid sm:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                  {/* Card 1: 10 Anos */}
                  <RevealItem>
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="relative group p-6 rounded-xl bg-neutral-900/25 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 overflow-hidden h-full"
                    >
                      {/* Left structural "Blade" indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/20 group-hover:bg-primary transition-all duration-500" />
                      
                      {/* Architectural blueprint grid overlay (subtle) */}
                      <div className="absolute right-4 top-4 font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                        SYS // 0.01
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary/80">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em]">Compromisso</span>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-heading text-lg font-medium text-foreground tracking-tight">10 Anos</h4>
                          <p className="text-xs md:text-sm text-muted-foreground/75 leading-relaxed font-light">
                            De experiência sólida no mercado de obras e reformas de alto padrão.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </RevealItem>

                  {/* Card 2: Garantia Total */}
                  <RevealItem>
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="relative group p-6 rounded-xl bg-neutral-900/25 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 overflow-hidden h-full"
                    >
                      {/* Left structural "Blade" indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/20 group-hover:bg-primary transition-all duration-500" />
                      
                      {/* Architectural blueprint grid overlay (subtle) */}
                      <div className="absolute right-4 top-4 font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                        SYS // 0.02
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary/80">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em]">Confiança</span>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-heading text-lg font-medium text-foreground tracking-tight">Garantia Total</h4>
                          <p className="text-xs md:text-sm text-muted-foreground/75 leading-relaxed font-light">
                            Pós-venda ativo e compromisso absoluto com o resultado final.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </RevealItem>

                  {/* Card 3: Padrão NBR */}
                  <RevealItem>
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="relative group p-6 rounded-xl bg-neutral-900/25 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 overflow-hidden h-full"
                    >
                      {/* Left structural "Blade" indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/20 group-hover:bg-primary transition-all duration-500" />
                      
                      {/* Architectural blueprint grid overlay (subtle) */}
                      <div className="absolute right-4 top-4 font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                        SYS // 0.03
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary/80">
                          <Award className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em]">Segurança</span>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-heading text-lg font-medium text-foreground tracking-tight">Padrão NBR</h4>
                          <p className="text-xs md:text-sm text-muted-foreground/75 leading-relaxed font-light">
                            Obediência rigorosa às normas técnicas nacionais vigentes.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </RevealItem>
                </div>
              </RevealStagger>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section id="servicos" className="px-4 sm:px-8 md:px-12 lg:px-16 scroll-mt-32">
          <div className="max-w-5xl lg:max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column (Sticky Indicator) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3 space-y-1.5 lg:sticky lg:top-32"
              >
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  (02) Especialidades
                </span>
                <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                  O que fazemos de melhor.
                </p>
              </motion.div>

              {/* Right Column (Content) */}
              <RevealStagger className="lg:col-span-9 space-y-8">
                {/* Service 1 */}
                <RevealItem>
                  <motion.div 
                    whileHover="hover"
                    variants={{
                      hover: { y: -4 }
                    }}
                    className="relative group overflow-hidden rounded-2xl bg-neutral-900/20 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 p-1"
                  >
                    {/* Left structural "Blade" indicator */}
                    <motion.div 
                      className="absolute left-0 bg-primary/20 group-hover:bg-primary transition-colors duration-500"
                      initial={{ height: "32px", width: "2px", top: "24px" }}
                      variants={{
                        hover: { height: "100%", width: "3.5px", top: "0px" }
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                    
                    <div className="grid md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-5 h-[240px] md:h-[280px] lg:h-[320px] overflow-hidden rounded-[1.25rem] relative m-2">
                        <img 
                          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=60" 
                          alt="Instalação Elétrica" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                      </div>
                      <div className="md:col-span-7 p-6 md:pr-10 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                            Carro-chefe
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                            SYS // EL-01
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground">Elétrica</h3>
                          <p className="text-xs md:text-sm text-muted-foreground/75 leading-relaxed font-light">
                            Nosso serviço mais procurado. Instalações elétricas seguras, modernas e dimensionadas perfeitamente para sua necessidade, de acordo com as normas técnicas vigentes, evitando qualquer risco ou desperdício de energia.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </RevealItem>

                {/* Service 2 */}
                <RevealItem>
                  <motion.div 
                    whileHover="hover"
                    variants={{
                      hover: { y: -4 }
                    }}
                    className="relative group overflow-hidden rounded-2xl bg-neutral-900/20 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 p-1"
                  >
                    {/* Left structural "Blade" indicator */}
                    <motion.div 
                      className="absolute left-0 bg-primary/20 group-hover:bg-primary transition-colors duration-500"
                      initial={{ height: "32px", width: "2px", top: "24px" }}
                      variants={{
                        hover: { height: "100%", width: "3.5px", top: "0px" }
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                    
                    <div className="grid md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-5 h-[240px] md:h-[280px] lg:h-[320px] overflow-hidden rounded-[1.25rem] relative m-2 md:order-2">
                        <img 
                          src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=60" 
                          alt="Pintura e Acabamento" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                      </div>
                      <div className="md:col-span-7 p-6 md:pl-10 space-y-4 md:order-1">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center justify-center rounded-full bg-white/5 text-muted-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                            Alto Padrão
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                            SYS // PA-02
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground">Pintura & Acabamento</h3>
                          <p className="text-xs md:text-sm text-muted-foreground/75 leading-relaxed font-light">
                            Pintura de alto padrão, interna e externa. Preparamos as superfícies com rigor técnico absoluto para garantir durabilidade extrema e um visual impecável que valoriza o seu imóvel.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </RevealItem>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Service 3 */}
                  <RevealItem>
                    <motion.div 
                      whileHover="hover"
                      variants={{
                        hover: { y: -4 }
                      }}
                      className="relative group overflow-hidden rounded-2xl bg-neutral-900/20 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 p-1"
                    >
                      {/* Left structural "Blade" indicator */}
                      <motion.div 
                        className="absolute left-0 bg-primary/20 group-hover:bg-primary transition-colors duration-500"
                        initial={{ height: "32px", width: "2px", top: "24px" }}
                        variants={{
                          hover: { height: "100%", width: "3.5px", top: "0px" }
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                      
                      <div className="space-y-4">
                        <div className="h-[180px] md:h-[200px] lg:h-[240px] overflow-hidden rounded-[1.25rem] relative m-2">
                          <img 
                            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=60" 
                            alt="Gesso" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                        </div>
                        <div className="p-6 pt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Gesso & Drywall</span>
                            <span className="font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                              SYS // GS-03
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="font-heading text-lg font-medium text-foreground">Gesso</h3>
                            <p className="text-xs md:text-sm text-muted-foreground/75 leading-relaxed font-light">
                              Sancas, rebaixamentos modernos e divisórias elegantes com acabamento liso, simetria exata e nivelamento perfeito.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </RevealItem>

                  {/* Service 4 */}
                  <RevealItem>
                    <motion.div 
                      whileHover="hover"
                      variants={{
                        hover: { y: -4 }
                      }}
                      className="relative group overflow-hidden rounded-2xl bg-neutral-900/20 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 p-1"
                    >
                      {/* Left structural "Blade" indicator */}
                      <motion.div 
                        className="absolute left-0 bg-primary/20 group-hover:bg-primary transition-colors duration-500"
                        initial={{ height: "32px", width: "2px", top: "24px" }}
                        variants={{
                          hover: { height: "100%", width: "3.5px", top: "0px" }
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                      
                      <div className="space-y-4">
                        <div className="h-[180px] md:h-[200px] lg:h-[240px] overflow-hidden rounded-[1.25rem] relative m-2">
                          <img 
                            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=500&q=60" 
                            alt="Revestimentos" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                        </div>
                        <div className="p-6 pt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Pisos & Revestimentos</span>
                            <span className="font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                              SYS // RV-04
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="font-heading text-lg font-medium text-foreground">Revestimentos</h3>
                            <p className="text-xs md:text-sm text-muted-foreground/75 leading-relaxed font-light">
                              Instalação de porcelanatos e pisos com paginação computadorizada precisa, juntas finas e mínimo de perda material.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </RevealItem>
                </div>
              </RevealStagger>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="px-4 sm:px-8 md:px-12 lg:px-16 scroll-mt-32">
          <div className="max-w-5xl lg:max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column (Sticky Indicator) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3 space-y-1.5 lg:sticky lg:top-32"
              >
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  (03) Portfólio
                </span>
                <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                  Estética em concreto e aço.
                </p>
                <div className="pt-8 hidden lg:block">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 text-primary text-[10px] font-mono uppercase tracking-wider hover:text-primary/80 transition-colors"
                  >
                    // Ver no Instagram <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>

              {/* Right Column (Content) */}
              <div className="lg:col-span-9 space-y-12">
                <RevealHeading className="font-heading text-2xl md:text-4xl lg:text-[2.75rem] font-light tracking-tight text-balance leading-[1.2] text-foreground">
                  <h3>
                    Projetos executados sob o rigor da <span className="text-white font-normal">máxima precisão</span>.
                  </h3>
                </RevealHeading>

                <div className="space-y-16 md:space-y-28">
                  {/* Project 1 */}
                  <PortfolioCard 
                    idCode="// PROJETO RES-01"
                    area="450m²"
                    title="Residência Minimalista de Alto Padrão"
                    imgUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=50"
                    widthClass="w-full md:w-[95%]"
                    heightClass="h-[400px] md:h-[520px]"
                    index={0}
                  />

                  {/* Project 2 */}
                  <PortfolioCard 
                    idCode="// PROJETO COM-02"
                    area="1.200m²"
                    title="Sede Corporativa Concept"
                    imgUrl="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=50"
                    widthClass="w-full md:w-[85%] md:ml-auto"
                    heightClass="h-[400px] md:h-[520px]"
                    index={1}
                  />

                  {/* Project 3 */}
                  <PortfolioCard 
                    idCode="// PROJETO INT-03"
                    area="180m²"
                    title="Apartamento Loft Industrial"
                    imgUrl="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=50"
                    widthClass="w-full md:w-[90%]"
                    heightClass="h-[380px] md:h-[480px]"
                    index={2}
                  />
                </div>

                {/* Mobile Instagram link */}
                <div className="pt-4 block lg:hidden text-center">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 text-primary text-[10px] font-mono uppercase tracking-wider hover:text-primary/80 transition-colors"
                  >
                    // Ver mais no Instagram <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="px-4 sm:px-8 md:px-12 lg:px-16 scroll-mt-32">
          <div className="max-w-5xl lg:max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column (Sticky Indicator) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3 space-y-1.5 lg:sticky lg:top-32"
              >
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  (04) Depoimentos
                </span>
                <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                  A voz da confiança.
                </p>
              </motion.div>

              {/* Right Column (Content) */}
              <div className="lg:col-span-9 space-y-12">
                <RevealStagger className="space-y-8">
                  <RevealItem>
                    <h3 className="font-heading text-2xl md:text-4xl lg:text-[2.75rem] font-light tracking-tight text-balance leading-[1.2] text-foreground">
                      O que dizem os nossos clientes sobre a <span className="text-white font-normal">experiência Reconstruir</span>.
                    </h3>
                  </RevealItem>

                  <RevealItem>
                    <div 
                      onMouseEnter={() => setIsHoveringTestimonials(true)}
                      onMouseLeave={() => setIsHoveringTestimonials(false)}
                      className="relative group overflow-hidden rounded-2xl bg-neutral-900/20 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 p-8 md:p-12"
                    >
                      {/* Active Blade Transition */}
                      <motion.div 
                        className="absolute left-0 bg-primary/20 group-hover:bg-primary transition-colors duration-500 z-30"
                        initial={{ height: "40px", width: "2px", top: "32px" }}
                        whileHover={{ height: "100%", width: "4px", top: "0px" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />

                      {/* Aesthetic blueprint grid lines overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

                      <div className="relative z-10 flex flex-col justify-between h-full min-h-[280px]">
                        {/* Rating stars and top decoration */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, idx) => (
                              <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-500">
                            {TESTIMONIALS[activeTestimonial].code}
                          </span>
                        </div>

                        {/* Big quote content with elegant crossfade animation */}
                        <div className="my-8">
                          <AnimatePresence mode="wait">
                            <motion.p 
                              key={activeTestimonial}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="font-heading text-lg md:text-xl font-light text-foreground group-hover:text-white transition-colors leading-relaxed italic"
                            >
                              "{TESTIMONIALS[activeTestimonial].text}"
                            </motion.p>
                          </AnimatePresence>
                        </div>

                        {/* Author details and navigation footer */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-white/5">
                          <div className="min-h-[5rem] sm:min-h-[4.5rem] h-auto">
                            <AnimatePresence mode="wait">
                              <motion.div 
                                key={activeTestimonial}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-1"
                              >
                                <span className="font-mono text-[9px] md:text-[10px] text-primary uppercase tracking-widest font-semibold block">
                                  // {TESTIMONIALS[activeTestimonial].tag}
                                </span>
                                <h4 className="font-heading text-base md:text-lg font-medium text-foreground">{TESTIMONIALS[activeTestimonial].name}</h4>
                                <p className="text-xs text-muted-foreground/75 font-light">{TESTIMONIALS[activeTestimonial].role}</p>
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Navigation Buttons and dots */}
                          <div className="flex items-center gap-4 self-end sm:self-auto">
                            {/* Dot Indicators */}
                            <div className="flex items-center gap-1.5">
                              {TESTIMONIALS.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveTestimonial(idx)}
                                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    activeTestimonial === idx 
                                      ? 'bg-primary w-4' 
                                      : 'bg-white/20 hover:bg-white/40'
                                  }`}
                                  aria-label={`Ir para depoimento ${idx + 1}`}
                                />
                              ))}
                            </div>

                            {/* Arrow Buttons */}
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                                className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300"
                                aria-label="Depoimento anterior"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
                                className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300"
                                aria-label="Próximo depoimento"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RevealItem>
                </RevealStagger>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-4 sm:px-8 md:px-12 lg:px-16 scroll-mt-32">
          <div className="max-w-5xl lg:max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column (Sticky Indicator) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3 space-y-1.5 lg:sticky lg:top-32"
              >
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  (05) FAQ
                </span>
                <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                  Esclarecendo dúvidas técnicas.
                </p>
              </motion.div>

              {/* Right Column (Content) */}
              <div className="lg:col-span-9 space-y-12">
                <RevealStagger className="space-y-8">
                  <RevealItem>
                    <h3 className="font-heading text-2xl md:text-4xl lg:text-[2.75rem] font-light tracking-tight text-balance leading-[1.2] text-foreground">
                      Respostas diretas para as suas <span className="text-white font-normal">principais dúvidas</span>.
                    </h3>
                  </RevealItem>

                  <RevealItem>
                    <div className="space-y-4">
                      {FAQS.map((faq) => (
                        <FAQItem
                          key={faq.id}
                          question={faq.question}
                          answer={faq.answer}
                          code={faq.code}
                          tag={faq.tag}
                          isOpen={openFaq === faq.id}
                          onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                        />
                      ))}
                    </div>
                  </RevealItem>
                </RevealStagger>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contato" className="px-4 sm:px-8 md:px-12 lg:px-16 scroll-mt-32">
          <div className="max-w-5xl lg:max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column (Sticky Indicator) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3 space-y-1.5 lg:sticky lg:top-32"
              >
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  (06) Contato
                </span>
                <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                  Inicie o seu projeto.
                </p>
              </motion.div>

              {/* Right Column (Content Card) */}
              <div className="lg:col-span-9">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  whileHover="hover"
                  variants={{
                    hover: { y: -4 }
                  }}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-900/20 backdrop-blur-sm border border-white/5 hover:border-primary/25 transition-all duration-500 p-8 md:p-12"
                >
                  {/* Active Blade Transition */}
                  <motion.div 
                    className="absolute left-0 bg-primary/20 group-hover:bg-primary transition-colors duration-500 z-30"
                    initial={{ height: "40px", width: "2px", top: "32px" }}
                    variants={{
                      hover: { height: "100%", width: "4.5px", top: "0px" }
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Aesthetic blueprint grid lines overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <RevealStagger className="relative z-10 space-y-8">
                    <div className="space-y-4 text-left">
                      <RevealItem>
                        <h3 className="font-heading text-3xl md:text-5xl font-light tracking-tight text-balance leading-[1.15] text-foreground">
                          Pronto para tirar o seu projeto do <span className="text-white font-normal">papel</span>?
                        </h3>
                      </RevealItem>
                      <RevealItem>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light max-w-2xl">
                          Agende uma visita formal. Apresentamos projetos, discutimos ideias e formulamos um orçamento transparente, sob o rigor do nosso planejamento de engenharia, sem imprevistos ou surpresas.
                        </p>
                      </RevealItem>
                    </div>

                    <RevealItem>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                        <a 
                          href="https://wa.me/5581999999999" 
                          target="_blank"
                          rel="noreferrer"
                          className="h-12 px-6 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/10"
                        >
                          Chamar no WhatsApp
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <button 
                          onClick={() => setIsQuoteModalOpen(true)}
                          className="h-12 px-6 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-foreground text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:border-white/20 transition-all duration-300 cursor-pointer"
                        >
                          Solicitar Orçamento
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </RevealItem>
                  </RevealStagger>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-neutral-950/20 backdrop-blur-sm pt-20 pb-12 px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-5xl lg:max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
            {/* Left Column (Brand Identity & Philosophy) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-1.5">
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  RECONSTRUIR
                </span>
                <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                  Engenharia & Arquitetura.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <div className="w-6 h-6 bg-primary/10 border border-primary/20 rounded flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
                </div>
                <span className="font-heading font-light text-base tracking-widest uppercase text-white">Reconstruir</span>
              </div>
              
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-light max-w-sm">
                Obras e reformas sob o rigor da máxima excelência. Transformamos visões em marcos de concreto e aço.
              </p>
            </div>

            {/* Right Column (Navigation & Details) */}
            <div className="lg:col-span-9 grid sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-8">
              {/* Contato Column */}
              <div className="space-y-4">
                <span className="font-mono text-[9px] md:text-[10px] text-primary uppercase tracking-widest font-semibold block">
                  // CONTATO
                </span>
                <ul className="space-y-3.5 text-xs md:text-sm font-light text-muted-foreground">
                  <li className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-primary/75" />
                    <span>Pernambuco, BR</span>
                  </li>
                  <li className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
                    <Phone className="w-4 h-4 text-primary/75" />
                    <span>(81) 99999-9999</span>
                  </li>
                  <li className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
                    <Mail className="w-4 h-4 text-primary/75" />
                    <span>contato@reconstruir.com</span>
                  </li>
                </ul>
              </div>

              {/* Links Column */}
              <div className="space-y-4">
                <span className="font-mono text-[9px] md:text-[10px] text-primary uppercase tracking-widest font-semibold block">
                  // NAVEGAÇÃO
                </span>
                <ul className="space-y-3 text-xs md:text-sm font-light text-muted-foreground">
                  <li>
                    <a href="#sobre" className="hover:text-white hover:underline decoration-primary/50 underline-offset-4 transition-colors duration-300">
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a href="#servicos" className="hover:text-white hover:underline decoration-primary/50 underline-offset-4 transition-colors duration-300">
                      Nossos Serviços
                    </a>
                  </li>
                  <li>
                    <a href="#portfolio" className="hover:text-white hover:underline decoration-primary/50 underline-offset-4 transition-colors duration-300">
                      Portfólio
                    </a>
                  </li>
                  <li>
                    <a href="#depoimentos" className="hover:text-white hover:underline decoration-primary/50 underline-offset-4 transition-colors duration-300">
                      Depoimentos
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-white hover:underline decoration-primary/50 underline-offset-4 transition-colors duration-300">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Status/Clock/Standards Column */}
              <div className="space-y-4">
                <span className="font-mono text-[9px] md:text-[10px] text-primary uppercase tracking-widest font-semibold block">
                  // ESPECIFICAÇÃO
                </span>
                <div className="space-y-3.5 text-xs font-mono text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span>PADRÃO ISO 9001:2015</span>
                  </p>
                  <p className="text-[11px] leading-relaxed font-light">
                    Planejamento digital inteligente e cronograma à prova de atrasos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Fine Print */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs font-mono text-muted-foreground">
            <p>© {new Date().getFullYear()} RECONSTRUIR. Projetando e executando o amanhã.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors duration-300">TERMOS //</a>
              <a href="#" className="hover:text-white transition-colors duration-300">PRIVACIDADE</a>
            </div>
          </div>
        </div>
      </footer>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}

