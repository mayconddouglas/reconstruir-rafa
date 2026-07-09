/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ReactNode } from 'react';
import { ArrowRight, CheckCircle, ChevronRight, ChevronLeft, ChevronDown, Star, Menu, MessageCircle, Phone, X, Instagram, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import QuoteModal from './components/QuoteModal';
import { BackToTopButton } from './components/BackToTopButton';

const NAV_LINKS = [
  { id: 'sobre', label: 'Sobre Nós' },
  { id: 'servicos', label: 'Especialidades' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'depoimentos', label: 'Depoimentos' },
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
    bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=50&fm=webp",
  },
  {
    id: 2,
    name: "Juliana Mendes",
    role: "Diretora de Operações, Sede Concept",
    text: "Reformar nossa sede corporativa de 1.200m² sem interromper nossas atividades diárias parecia impossível. A engenharia da Reconstruir executou a obra com tal precisão, silêncio e organização que foi surpreendente.",
    rating: 5,
    code: "SYS // TST-02",
    tag: "OBRA COMERCIAL COMPLEXA",
    bgImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=50&fm=webp",
  },
  {
    id: 3,
    name: "Ricardo Vasconcelos",
    role: "Arquiteto e Designer de Interiores",
    text: "Como arquiteto, prezo pelo detalhamento milimétrico. A Reconstruir foi a única construtora que de fato respeitou as especificações de projeto, as paginações complexas e as soluções de iluminação indireta que desenhei.",
    rating: 5,
    code: "SYS // TST-03",
    tag: "PARCERIA TÉCNICA // ARQUITETURA",
    bgImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=50&fm=webp",
  },
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

      {/* Image Container with Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          src={imgUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover origin-center"
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

const aboutItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
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

function RevealItem({ children, className = "", variants = staggerItemVariants }: { children: ReactNode; className?: string; variants?: any }) {
  return (
    <motion.div
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isHoveringTestimonials, setIsHoveringTestimonials] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutScrollYRaw } = useScroll({
    target: aboutRef,
    offset: ["start start", "end end"]
  });

  const aboutScrollY = useSpring(aboutScrollYRaw, { stiffness: 80, damping: 20, restDelta: 0.001 });

  // Intro texts
  const introOpacity = useTransform(aboutScrollY, [0.35, 0.4], [1, 0]);
  const introPointerEvents = useTransform(aboutScrollY, (v) => (v > 0.4 ? "none" : "auto"));
  const opacityS1 = useTransform(aboutScrollY, [0, 0.05, 0.15], [0, 0, 1]);
  const opacityS2 = useTransform(aboutScrollY, [0, 0.15, 0.25], [0, 0, 1]);
  const yS1 = useTransform(aboutScrollY, [0, 0.05, 0.15], [40, 40, 0]);
  const yS2 = useTransform(aboutScrollY, [0, 0.15, 0.25], [40, 40, 0]);

  // Card 1
  const radiusC1 = useTransform(aboutScrollY, [0.4, 0.55], [0, 150]);
  const clipPathC1 = useMotionTemplate`circle(${radiusC1}% at center)`;
  const scaleC1 = useTransform(aboutScrollY, [0.4, 0.6], [0.8, 1]);
  const opacityC1 = useTransform(aboutScrollY, [0.4, 0.45], [0, 1]);
  const pointerEventsC1 = useTransform(aboutScrollY, (v) => (v > 0.4 && v < 0.6 ? "auto" : "none"));

  // Card 2
  const radiusC2 = useTransform(aboutScrollY, [0.6, 0.75], [0, 150]);
  const clipPathC2 = useMotionTemplate`circle(${radiusC2}% at center)`;
  const scaleC2 = useTransform(aboutScrollY, [0.6, 0.8], [0.8, 1]);
  const opacityC2 = useTransform(aboutScrollY, [0.6, 0.65], [0, 1]);
  const pointerEventsC2 = useTransform(aboutScrollY, (v) => (v > 0.6 && v < 0.8 ? "auto" : "none"));

  // Card 3
  const radiusC3 = useTransform(aboutScrollY, [0.8, 0.95], [0, 150]);
  const clipPathC3 = useMotionTemplate`circle(${radiusC3}% at center)`;
  const scaleC3 = useTransform(aboutScrollY, [0.8, 1.0], [0.8, 1]);
  const opacityC3 = useTransform(aboutScrollY, [0.8, 0.85], [0, 1]);
  const pointerEventsC3 = useTransform(aboutScrollY, (v) => (v > 0.8 ? "auto" : "none"));

  const { scrollYProgress: portfolioScrollY } = useScroll({
    target: portfolioScrollRef,
    offset: ["start start", "end end"]
    });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        setTranslateX(Math.max(0, scrollWidth - clientWidth));
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    const timer1 = setTimeout(handleResize, 150);
    const timer2 = setTimeout(handleResize, 600);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const portfolioX = useTransform(portfolioScrollY, [0, 1], [0, -translateX]);

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
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1613490908592-fd5a121345d7?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=480&q=50&fm=webp"
  ];

  const col2Images = [
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=480&q=50&fm=webp"
  ];

  const col3Images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=480&q=50&fm=webp",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=480&q=50&fm=webp"
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
      
      const hero = heroRef.current;
      let shouldShowNav = false;
      if (hero) {
        shouldShowNav = hero.getBoundingClientRect().bottom <= 100;
      } else {
        shouldShowNav = window.scrollY > window.innerHeight * 0.5;
      }
      setShowNav(shouldShowNav);
      if (!shouldShowNav) {
        setIsMobileMenuOpen(false);
      }
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
      <AnimatePresence>
        {showNav && (
          <motion.nav 
            initial={{ y: -50, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
            }}
            exit={{ y: -50, opacity: 0 }}
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
            className="md:hidden text-foreground p-1.5 z-50 relative pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>
        )}
      </AnimatePresence>

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
            {/* Minimalist Background Video */}
            <div className="absolute inset-0 z-0 opacity-25">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              >
                <source src="https://videos.pexels.com/video-files/3773486/3773486-sd_640_360_30fps.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black opacity-87" />
            </div>
            
            {/* Gradient masks for seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-10" />
            
            {/* Ambient light blobs */}
            <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] mix-blend-screen animate-pulse z-20" style={{ animationDuration: '8s' }} />
            <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[120px] mix-blend-screen animate-pulse z-20" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-20" />
          </div>

          {/* Centered Hero Typography block */}
          <div className="flex-grow min-h-[70vh] md:min-h-[65vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto relative z-30 w-full py-8 md:py-12">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center space-y-8"
            >
              <motion.h1 
                variants={itemVariants}
                className="font-heading text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance leading-[1.1] text-center"
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
                className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed font-light text-balance"
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
          <div className="w-full relative z-30 py-12 md:py-20 overflow-hidden select-none">
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
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <hr className="border-border" />
        </div>

        {/* About Section */}
        <section id="sobre" ref={aboutRef} className="relative w-full h-[400vh] scroll-mt-32">
          {/* Sticky container that fits the viewport */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background">
            
            {/* Intro Content */}
            <motion.div 
              style={{ opacity: introOpacity, pointerEvents: introPointerEvents as any }}
              className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-10 z-10"
            >
              <div className="max-w-4xl lg:max-w-5xl mx-auto w-full">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center relative">
                  {/* Left Column (Sticky Indicator) */}
                  <div className="lg:col-span-4 space-y-1.5">
                    <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                      (01) Sobre Nós
                    </span>
                    <p className="text-muted-foreground text-xs md:text-sm font-light uppercase tracking-widest block">
                      Precisão & Rigor.
                    </p>
                  </div>

                  {/* Right Column (Intro Texts) */}
                  <div className="lg:col-span-8 space-y-8 md:space-y-10 relative flex flex-col justify-center">
                    <motion.div style={{ opacity: opacityS1, y: yS1 }}>
                      <h3 className="font-heading text-2xl md:text-4xl lg:text-[2.75rem] font-light tracking-tight text-balance leading-[1.3] text-foreground">
                        Enquanto muitos focam apenas em fazer o serviço, nós nos preocupamos com a <span className="text-white font-normal">excelência de cada detalhe</span>.
                      </h3>
                    </motion.div>
                    <motion.div style={{ opacity: opacityS2, y: yS2 }}>
                      <p className="text-base md:text-lg font-light text-muted-foreground/95 leading-relaxed max-w-2xl">
                        Há 10 anos a RECONSTRUIR transforma projetos em realidade guiando cada etapa com rigor normativo, garantia total e respeito absoluto ao seu investimento.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 1: 10 Anos */}
            <motion.div 
              style={{ clipPath: clipPathC1, opacity: opacityC1, pointerEvents: pointerEventsC1 as any }}
              className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-20 px-4"
            >
              <motion.div style={{ scale: scaleC1 }} className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Clock className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                    Experiência Comprovada
                  </span>
                  <h4 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-foreground tracking-tight">10 Anos</h4>
                  <p className="text-lg md:text-2xl text-muted-foreground/80 leading-relaxed font-light max-w-2xl mx-auto">
                    Sólida experiência no mercado de obras e reformas. Nossa jornada é marcada pela excelência e entrega pontual de cada projeto.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Card 2: Garantia Total */}
            <motion.div 
              style={{ clipPath: clipPathC2, opacity: opacityC2, pointerEvents: pointerEventsC2 as any }}
              className="absolute inset-0 flex items-center justify-center bg-[#EAE6E1] text-neutral-900 z-30 px-4"
            >
              <motion.div style={{ scale: scaleC2 }} className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-neutral-800/10 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-neutral-800" />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-600 font-medium block">
                    Confiança & Segurança
                  </span>
                  <h4 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-neutral-950 tracking-tight">Garantia Total</h4>
                  <p className="text-lg md:text-2xl text-neutral-700 leading-relaxed font-normal max-w-2xl mx-auto">
                    Pós-venda ativo e compromisso real com a satisfação. Estaremos ao seu lado mesmo depois que a obra for finalizada.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Card 3: Padrão NBR */}
            <motion.div 
              style={{ clipPath: clipPathC3, opacity: opacityC3, pointerEvents: pointerEventsC3 as any }}
              className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-40 px-4"
            >
              <motion.div style={{ scale: scaleC3 }} className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                    Qualidade Técnica
                  </span>
                  <h4 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-foreground tracking-tight">Padrão NBR</h4>
                  <p className="text-lg md:text-2xl text-muted-foreground/80 leading-relaxed font-light max-w-2xl mx-auto">
                    Rigidez e respeito integral às normas técnicas nacionais. A segurança estrutural do seu projeto não é negociável.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Expertise Section */}
        <section id="servicos" className="px-4 sm:px-6 md:px-10 lg:px-12 scroll-mt-32">
          <div className="max-w-4xl lg:max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
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
                          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=60&fm=webp" 
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
                          src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=60&fm=webp" 
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

                <div className="grid md:grid-cols-2 gap-4">
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
                            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=60&fm=webp" 
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
                      className="relative group overflow-hidden rounded-2xl bg-[#853C2D] border-none shadow-[0_12px_24px_-8px_rgba(133,60,45,0.35)] transition-all duration-500 p-1"
                    >
                      {/* Left structural "Blade" indicator */}
                      <motion.div 
                        className="absolute left-0 bg-white/25 group-hover:bg-white transition-colors duration-500"
                        initial={{ height: "32px", width: "2px", top: "24px" }}
                        variants={{
                          hover: { height: "100%", width: "3.5px", top: "0px" }
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                      
                      <div className="space-y-4">
                        <div className="h-[180px] md:h-[200px] lg:h-[240px] overflow-hidden rounded-[1.25rem] relative m-2">
                          <img 
                            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=500&q=60&fm=webp" 
                            alt="Revestimentos" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                        </div>
                        <div className="p-6 pt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-100/70">Pisos & Revestimentos</span>
                            <span className="font-mono text-[9px] text-orange-200/40 group-hover:text-white/60 transition-colors duration-500">
                              SYS // RV-04
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="font-heading text-lg font-medium text-white">Revestimentos</h3>
                            <p className="text-xs md:text-sm text-orange-50/90 leading-relaxed font-normal">
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
        <section 
          id="portfolio" 
          ref={portfolioScrollRef}
          className="relative h-[250vh] sm:h-[300vh] w-full"
        >
          <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden px-4 sm:px-6 md:px-10 lg:px-12 py-10">
            <div className="max-w-5xl mx-auto w-full space-y-8 md:space-y-12">
              {/* Header block spanning the entire width */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                <div className="space-y-1.5 max-w-2xl">
                  <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                    (03) Portfólio
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-light tracking-tight text-foreground leading-[1.2] text-balance">
                    Projetos executados sob o rigor da <span className="text-white font-normal">máxima precisão</span>.
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline font-mono text-[10px] text-muted-foreground/30 uppercase tracking-widest">// Role para baixo</span>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 text-primary text-[10px] font-mono uppercase tracking-wider hover:text-primary/80 transition-colors"
                  >
                    Ver no Instagram <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Dynamic Horizontal Track */}
              <div className="relative w-full overflow-hidden" ref={scrollRef}>
                <motion.div 
                  style={{ x: portfolioX }} 
                  className="flex gap-6 md:gap-8 w-max pr-12 py-2"
                >
                  <div className="w-[340px] sm:w-[460px] md:w-[560px] lg:w-[600px] flex-shrink-0">
                    <PortfolioCard 
                      idCode="// PROJETO RES-01"
                      area="450m²"
                      title="Residência Minimalista de Alto Padrão"
                      imgUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=50&fm=webp"
                      widthClass="w-full"
                      heightClass="h-[320px] sm:h-[380px] md:h-[460px] lg:h-[480px]"
                      index={0}
                    />
                  </div>

                  <div className="w-[340px] sm:w-[460px] md:w-[560px] lg:w-[600px] flex-shrink-0">
                    <PortfolioCard 
                      idCode="// PROJETO COM-02"
                      area="1.200m²"
                      title="Sede Corporativa Concept"
                      imgUrl="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=50&fm=webp"
                      widthClass="w-full"
                      heightClass="h-[320px] sm:h-[380px] md:h-[460px] lg:h-[480px]"
                      index={1}
                    />
                  </div>

                  <div className="w-[340px] sm:w-[460px] md:w-[560px] lg:w-[600px] flex-shrink-0">
                    <PortfolioCard 
                      idCode="// PROJETO INT-03"
                      area="180m²"
                      title="Apartamento Loft Industrial"
                      imgUrl="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=50&fm=webp"
                      widthClass="w-full"
                      heightClass="h-[320px] sm:h-[380px] md:h-[460px] lg:h-[480px]"
                      index={2}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="px-4 sm:px-6 md:px-10 lg:px-12 scroll-mt-32">
          <div className="max-w-4xl lg:max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
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

                      {/* Dynamic Background Image Transition based on Active Testimonial's Project */}
                      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTestimonial}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 0.07, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 w-full h-full bg-cover bg-center filter grayscale contrast-[1.3] brightness-50"
                            style={{ backgroundImage: `url(${TESTIMONIALS[activeTestimonial].bgImage})` }}
                          />
                        </AnimatePresence>
                        {/* Soft vignette overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950/60 opacity-80" />
                      </div>

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

        {/* CTA Section */}
        <section id="contato" className="px-4 sm:px-6 md:px-10 lg:px-12 scroll-mt-32">
          <div className="max-w-4xl lg:max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Column (Sticky Indicator) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-3 space-y-1.5 lg:sticky lg:top-32"
              >
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-medium block">
                  (05) Contato
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
      <footer className="border-t border-white/5 bg-neutral-950/20 backdrop-blur-sm pt-20 pb-12 px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="max-w-4xl lg:max-w-5xl mx-auto">
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
      <BackToTopButton />
    </div>
  );
}

