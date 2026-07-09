import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check, ChevronRight, ChevronLeft, Calculator, User, Phone, Mail, Layout, HardHat, FileText, Calendar, DollarSign } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [protocolCode, setProtocolCode] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    servico: 'Construção Residencial',
    area: '',
    prazo: '1 a 3 meses',
    orcamento: 'Não definido',
    descricao: '',
    comoConheceu: 'Instagram'
  });

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Generate a technical protocol code on open
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setProtocolCode(`REC-PRT-${randomNum}`);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validateStep = (currentStep: number) => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.nome.trim()) newErrors.nome = 'Nome completo é obrigatório';
      if (!formData.email.trim()) {
        newErrors.email = 'E-mail é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Insira um e-mail válido';
      }
      if (!formData.telefone.trim()) {
        newErrors.telefone = 'Telefone/WhatsApp é obrigatório';
      } else if (formData.telefone.replace(/\D/g, '').length < 10) {
        newErrors.telefone = 'Insira um telefone válido (com DDD)';
      }
    } else if (currentStep === 2) {
      if (!formData.area || Number(formData.area) <= 0) {
        newErrors.area = 'Informe uma área válida maior que zero';
      }
      if (!formData.descricao.trim()) {
        newErrors.descricao = 'Por favor, descreva brevemente seu projeto';
      } else if (formData.descricao.trim().length < 15) {
        newErrors.descricao = 'A descrição deve ter pelo menos 15 caracteres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const submitPhases = [
    "Analisando escopo de engenharia...",
    "Estruturando viabilidade físico-financeira...",
    "Registrando protocolo de atendimento..."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    setSubmitPhase(0);

    // Simulate technical calculation/saving steps
    const timer1 = setTimeout(() => setSubmitPhase(1), 1000);
    const timer2 = setTimeout(() => setSubmitPhase(2), 2200);
    const timer3 = setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Save to local storage for CRM-like features
      try {
        const existingQuotes = JSON.parse(localStorage.getItem('reconstruir_quotes') || '[]');
        const newQuote = {
          protocol: protocolCode,
          date: new Date().toISOString(),
          ...formData
        };
        localStorage.setItem('reconstruir_quotes', JSON.stringify([newQuote, ...existingQuotes]));
      } catch (err) {
        console.error("Erro ao salvar no localStorage:", err);
      }
    }, 3500);
  };

  // Create WhatsApp message link with formatted markdown
  const getWhatsAppLink = () => {
    const text = `*SOLICITAÇÃO DE ORÇAMENTO - RECONSTRUIR ENGENHARIA*\n` +
      `-----------------------------------------\n` +
      `*Protocolo:* \`${protocolCode}\`\n` +
      `*Cliente:* ${formData.nome}\n` +
      `*E-mail:* ${formData.email}\n` +
      `*Telefone:* ${formData.telefone}\n` +
      `\n` +
      `*DADOS DA OBRA:*\n` +
      `*Serviço:* ${formData.servico}\n` +
      `*Área Estimada:* ${formData.area} m²\n` +
      `*Prazo Pretendido:* ${formData.prazo}\n` +
      `*Estimativa de Orçamento:* ${formData.orcamento}\n` +
      `\n` +
      `*Descrição:* \n_"${formData.descricao}"_\n` +
      `\n` +
      `_Enviado via site oficial Reconstruir_`;

    return `https://wa.me/5581999999999?text=${encodeURIComponent(text)}`;
  };

  const resetForm = () => {
    setStep(1);
    setIsSubmitting(false);
    setIsSuccess(false);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      servico: 'Construção Residencial',
      area: '',
      prazo: '1 a 3 meses',
      orcamento: 'Não definido',
      descricao: '',
      comoConheceu: 'Instagram'
    });
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop blurring the background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
          />

          {/* Modal Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl z-10 p-1"
          >
            {/* Outer high-tech frame borders */}
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-primary" />
            <div className="absolute top-0 right-0 w-8 h-[1px] bg-primary" />
            <div className="absolute top-0 right-0 w-[1px] h-8 bg-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-primary" />
            <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-primary" />
            <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-primary" />

            {/* Aesthetic grid paper pattern inside */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />

            <div className="relative z-10 p-6 md:p-8 bg-neutral-950/90 rounded-[14px]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                <div>
                  <span className="font-mono text-[9px] text-primary tracking-widest uppercase block">
                    // SOLICITAÇÃO DE ORÇAMENTO
                  </span>
                  <h3 className="font-heading text-lg md:text-xl font-medium text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    Parâmetros de Engenharia
                  </h3>
                </div>
                
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300"
                  aria-label="Fechar formulário"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Stepper (Only show if not success/submitting) */}
              {!isSubmitting && !isSuccess && (
                <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 mb-6 text-[10px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 1 ? 'bg-primary text-primary-foreground font-bold' : 'bg-neutral-800 text-muted-foreground'}`}>1</span>
                    <span className={step === 1 ? 'text-white' : ''}>DADOS PESSOAIS</span>
                  </div>
                  <div className="h-[1px] bg-white/10 flex-grow mx-4" />
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 2 ? 'bg-primary text-primary-foreground font-bold' : 'bg-neutral-800 text-muted-foreground'}`}>2</span>
                    <span className={step === 2 ? 'text-white' : ''}>ESCOPO DA OBRA</span>
                  </div>
                  <div className="hidden sm:flex h-[1px] bg-white/10 flex-grow mx-4" />
                  <span className="hidden sm:inline-block text-[9px] text-muted-foreground/40">{protocolCode}</span>
                </div>
              )}

              {/* Form Content States */}
              <div className="min-h-[340px]">
                {/* 1. Submitting technical calculation animation */}
                {isSubmitting && (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-[340px]">
                    <div className="relative w-16 h-16 mb-8">
                      {/* Rotating blueprints circles */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute inset-2 border border-blue-500/10 border-b-blue-400 rounded-full"
                      />
                      <Calculator className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={submitPhase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[10px] text-primary tracking-widest uppercase">
                          // PROCESSAMENTO DE DADOS
                        </span>
                        <h4 className="font-heading text-base font-light text-foreground">
                          {submitPhases[submitPhase]}
                        </h4>
                        <p className="text-xs text-muted-foreground font-mono">
                          {protocolCode} // EST-MTRX
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* 2. Success state */}
                {isSuccess && (
                  <div className="flex flex-col justify-between h-[340px] py-2">
                    <div className="flex flex-col items-center justify-center text-center my-auto">
                      <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                        <Check className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase mb-1.5">
                        // PROTOCOLO GERADO COM SUCESSO
                      </span>
                      <h4 className="font-heading text-xl md:text-2xl font-light text-white mb-3">
                        Orçamento Solicitado!
                      </h4>
                      <p className="text-muted-foreground text-xs md:text-sm max-w-md font-light leading-relaxed mb-6">
                        Registramos sua solicitação sob o protocolo <strong className="font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{protocolCode}</strong>.
                        Nossa equipe técnica entrará em contato em até 24 horas úteis.
                      </p>

                      {/* Technical specifications table recap */}
                      <div className="w-full bg-neutral-900/35 border border-white/5 rounded-lg p-3.5 text-left font-mono text-[9px] text-muted-foreground grid grid-cols-2 gap-x-6 gap-y-1.5 max-w-lg">
                        <div><span className="text-muted-foreground/50">SERVIÇO:</span> {formData.servico.toUpperCase()}</div>
                        <div><span className="text-muted-foreground/50">ÁREA ESTIMADA:</span> {formData.area} M²</div>
                        <div><span className="text-muted-foreground/50">PRAZO:</span> {formData.prazo.toUpperCase()}</div>
                        <div><span className="text-muted-foreground/50">INVESTIMENTO:</span> {formData.orcamento.toUpperCase()}</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/5 w-full">
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-11 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/10"
                      >
                        Enviar pelo WhatsApp
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          resetForm();
                          onClose();
                        }}
                        className="w-full h-11 rounded-full border border-white/10 hover:bg-white/5 text-foreground text-xs font-mono uppercase tracking-wider flex items-center justify-center transition-all duration-300"
                      >
                        Concluído
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Step 1 Form */}
                {!isSubmitting && !isSuccess && step === 1 && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-xs font-light leading-relaxed mb-4">
                      Por favor, preencha os seus dados de contato básicos para que nossa equipe de engenharia e arquitetura consiga falar diretamente com você.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label htmlFor="nome" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <User className="w-3 h-3 text-primary" /> Nome Completo
                        </label>
                        <input
                          id="nome"
                          type="text"
                          placeholder="Ex: Carlos Silva"
                          value={formData.nome}
                          onChange={(e) => handleFieldChange('nome', e.target.value)}
                          className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.nome ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                        />
                        {errors.nome && <p className="text-[10px] text-red-400 font-mono">{errors.nome}</p>}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-primary" /> E-mail de Contato
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="carlos@email.com"
                          value={formData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                        />
                        {errors.email && <p className="text-[10px] text-red-400 font-mono">{errors.email}</p>}
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label htmlFor="telefone" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-primary" /> Telefone / WhatsApp
                        </label>
                        <input
                          id="telefone"
                          type="tel"
                          placeholder="(81) 99999-9999"
                          value={formData.telefone}
                          onChange={(e) => handleFieldChange('telefone', e.target.value)}
                          className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.telefone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                        />
                        {errors.telefone && <p className="text-[10px] text-red-400 font-mono">{errors.telefone}</p>}
                      </div>

                      {/* How did you hear about us */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label htmlFor="comoConheceu" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Layout className="w-3 h-3 text-primary" /> Como conheceu a Reconstruir?
                        </label>
                        <select
                          id="comoConheceu"
                          value={formData.comoConheceu}
                          onChange={(e) => handleFieldChange('comoConheceu', e.target.value)}
                          className="w-full h-11 bg-neutral-950 border border-white/10 rounded-lg px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        >
                          <option value="Instagram">Instagram</option>
                          <option value="Pesquisa Google">Pesquisa Google</option>
                          <option value="Indicação">Indicação de Cliente / Amigo</option>
                          <option value="Linkedin">LinkedIn</option>
                          <option value="Outros">Outros meios</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/5 mt-8">
                      <button
                        onClick={handleNext}
                        className="h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all duration-300"
                      >
                        Continuar
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Step 2 Form */}
                {!isSubmitting && !isSuccess && step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-muted-foreground text-xs font-light leading-relaxed mb-4">
                      Defina os parâmetros técnicos do seu projeto. Essas informações permitem que nós elaboremos uma análise prévia de viabilidade de engenharia.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Service select */}
                      <div className="space-y-1.5">
                        <label htmlFor="servico" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <HardHat className="w-3 h-3 text-primary" /> Tipo de Serviço
                        </label>
                        <select
                          id="servico"
                          value={formData.servico}
                          onChange={(e) => handleFieldChange('servico', e.target.value)}
                          className="w-full h-11 bg-neutral-950 border border-white/10 rounded-lg px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        >
                          <option value="Construção Residencial">Construção Residencial Completa</option>
                          <option value="Reforma Comercial">Reforma Comercial / Corporativa</option>
                          <option value="Reforma Residencial">Reforma Residencial de Alto Padrão</option>
                          <option value="Design de Interiores">Projeto de Interiores & Arquitetura</option>
                          <option value="Projetos Técnicos">Projetos de Engenharia & Consultoria</option>
                        </select>
                      </div>

                      {/* Area input */}
                      <div className="space-y-1.5">
                        <label htmlFor="area" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Calculator className="w-3 h-3 text-primary" /> Área Estimada (m²)
                        </label>
                        <input
                          id="area"
                          type="number"
                          placeholder="Ex: 150"
                          value={formData.area}
                          onChange={(e) => handleFieldChange('area', e.target.value)}
                          className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.area ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                        />
                        {errors.area && <p className="text-[10px] text-red-400 font-mono">{errors.area}</p>}
                      </div>

                      {/* Delivery Deadline */}
                      <div className="space-y-1.5">
                        <label htmlFor="prazo" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-primary" /> Prazo Estimado de Execução
                        </label>
                        <select
                          id="prazo"
                          value={formData.prazo}
                          onChange={(e) => handleFieldChange('prazo', e.target.value)}
                          className="w-full h-11 bg-neutral-950 border border-white/10 rounded-lg px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        >
                          <option value="Urgente (Imediato)">Urgente (Imediato)</option>
                          <option value="1 a 3 meses">1 a 3 meses</option>
                          <option value="3 a 6 meses">3 a 6 meses</option>
                          <option value="Mais de 6 meses">Mais de 6 meses</option>
                          <option value="Apenas Planejamento">Fase de Planejamento / Ideação</option>
                        </select>
                      </div>

                      {/* Budget Availability */}
                      <div className="space-y-1.5">
                        <label htmlFor="orcamento" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3 text-primary" /> Orçamento Disponível (Aprox)
                        </label>
                        <select
                          id="orcamento"
                          value={formData.orcamento}
                          onChange={(e) => handleFieldChange('orcamento', e.target.value)}
                          className="w-full h-11 bg-neutral-950 border border-white/10 rounded-lg px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        >
                          <option value="Até R$ 50k">Até R$ 50.000</option>
                          <option value="R$ 50k - R$ 150k">R$ 50.000 - R$ 150.000</option>
                          <option value="R$ 150k - R$ 500k">R$ 150.000 - R$ 500.000</option>
                          <option value="Acima de R$ 500k">Acima de R$ 500.000</option>
                          <option value="Não definido">Prefiro não estimar / Não definido</option>
                        </select>
                      </div>

                      {/* Description input */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label htmlFor="descricao" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-primary" /> Descrição Curta do Projeto
                        </label>
                        <textarea
                          id="descricao"
                          rows={3}
                          placeholder="Ex: Reforma total de um apartamento residencial de 3 quartos, englobando demolição de paredes, nova paginação de piso em porcelanato e troca de toda a instalação elétrica."
                          value={formData.descricao}
                          onChange={(e) => handleFieldChange('descricao', e.target.value)}
                          className={`w-full bg-neutral-950 border rounded-lg p-3 text-xs text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors resize-none ${errors.descricao ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                        />
                        {errors.descricao && <p className="text-[10px] text-red-400 font-mono">{errors.descricao}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8 w-full">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="h-11 px-5 rounded-full border border-white/10 hover:bg-white/5 text-foreground text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                      </button>
                      
                      <button
                        type="submit"
                        className="h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all duration-300"
                      >
                        Registrar Solicitação
                        <Calculator className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
