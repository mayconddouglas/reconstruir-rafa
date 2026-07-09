import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Mail, MapPin, Send } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  // Form Fields
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    local: ''
  });

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

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
    if (!formData.local.trim()) {
      newErrors.local = 'Local da obra é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const getWhatsAppLink = () => {
    const text = `*SOLICITAÇÃO DE ORÇAMENTO - RECONSTRUIR ENGENHARIA*\n` +
      `-----------------------------------------\n` +
      `*Cliente:* ${formData.nome}\n` +
      `*E-mail:* ${formData.email}\n` +
      `*Telefone:* ${formData.telefone}\n` +
      `*Local da Obra:* ${formData.local}\n` +
      `\n` +
      `_Enviado via site oficial Reconstruir_`;

    return `https://wa.me/5581999999999?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    window.open(getWhatsAppLink(), '_blank');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      local: ''
    });
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl z-10 p-6 md:p-8"
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
              <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                <div>
                  <span className="font-mono text-[9px] text-primary tracking-widest uppercase block mb-1">
                    // SOLICITAÇÃO DE ORÇAMENTO
                  </span>
                  <h3 className="font-heading text-xl font-medium text-white">
                    Solicite um Orçamento
                  </h3>
                </div>
                
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Fechar formulário"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="nome" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                    <User className="w-3 h-3 text-primary" /> Nome Completo
                  </label>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => handleFieldChange('nome', e.target.value)}
                    className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.nome ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                  />
                  {errors.nome && <p className="text-[10px] text-red-400 font-mono">{errors.nome}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-primary" /> E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                  />
                  {errors.email && <p className="text-[10px] text-red-400 font-mono">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="telefone" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-primary" /> Telefone / WhatsApp
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => handleFieldChange('telefone', e.target.value)}
                    className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.telefone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                  />
                  {errors.telefone && <p className="text-[10px] text-red-400 font-mono">{errors.telefone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="local" className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-primary" /> Local da Obra
                  </label>
                  <input
                    id="local"
                    type="text"
                    placeholder="Cidade e Bairro (Ex: Recife, Boa Viagem)"
                    value={formData.local}
                    onChange={(e) => handleFieldChange('local', e.target.value)}
                    className={`w-full h-11 bg-neutral-950 border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none transition-colors ${errors.local ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                  />
                  {errors.local && <p className="text-[10px] text-red-400 font-mono">{errors.local}</p>}
                </div>

                <div className="pt-6 mt-6">
                  <button
                    type="submit"
                    className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Enviar para o WhatsApp
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
