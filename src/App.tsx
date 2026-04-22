/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import { 
  Scale, 
  Gavel, 
  ShieldCheck, 
  Users, 
  Clock, 
  FileCheck, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowUp,
  MessageCircle,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';

// --- Components ---

const GoldParticleHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

const TypingEffect = () => {
  const phrases = ["Direito Trabalhista", "Direito Civil", "Direito Previdenciário"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span className="text-gold font-serif typing-cursor inline-block min-h-[1.2em]">
      {phrases[index].substring(0, subIndex)}
    </span>
  );
};

const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/\D/g, ''));

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-3xl md:text-5xl font-serif text-gold mb-2">
        {count}{value.includes('+') ? '+' : ''}
      </div>
      <div className="text-xs md:text-sm uppercase tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
};

const SectionHeader = ({ title }: { title: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className="flex flex-col items-center mb-16 text-center">
      <h2 className="text-3xl md:text-5xl font-serif mb-4">{title}</h2>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: isInView ? 100 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-0.5 bg-gold"
      />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Contato', href: '#contato' },
  ];

  const testimonials = [
    {
      name: "Carlos Eduardo Santos",
      role: "Direito Trabalhista",
      text: "O Dr. Vilmar conseguiu converter uma situação impossível em vitória. Sua ética e profissionalismo são exemplares. Recomendo fortemente.",
      rating: 5
    },
    {
      name: "Maria Helena Oliveira",
      role: "Direito Previdenciário",
      text: "Fui muito bem atendida em meu processo de aposentadoria. O Dr. Vilmar explicou cada etapa com paciência e clareza. Excelente advogado.",
      rating: 5
    },
    {
      name: "Antônio Ferreira",
      role: "Direito Civil",
      text: "Profissional extremamente competente e dedicado. O atendimento humanizado fez toda a diferença no momento em que eu mais precisei.",
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-gold/30 selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-50" style={{ scaleX }} />

      {/* Header / Navbar */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'glass-nav py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-xl md:text-2xl font-serif font-bold text-gold tracking-tight">Advocacia Vilmar Ferreira</span>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">Excelência e Ética Jurídica</span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm uppercase tracking-widest hover:text-gold transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/5516988308292" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-2 bg-whatsapp hover:bg-whatsapp/90 text-white text-sm font-bold rounded shadow-lg transition-transform hover:scale-105"
            >
              Agendar Consulta
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-nav overflow-hidden"
            >
              <div className="py-8 px-6 flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-lg font-serif hover:text-gold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <a 
                  href="https://wa.me/5516988308292" 
                  className="w-full py-4 bg-whatsapp text-white text-center rounded font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agendar pelo WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <GoldParticleHero />
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />

        <div className="relative z-10 max-w-5xl text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="gold-line mx-auto md:mx-0" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 leading-[1.1]">
              Justiça com <span className="text-gold">Ética</span> e <span className="text-gold">Compromisso</span>.
            </h1>
            
            <div className="text-xl md:text-2xl min-h-[1.5em] mb-8 text-slate-400">
              <TypingEffect />
            </div>

            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto md:mx-0">
              Há mais de três décadas defendendo seus direitos com excelência jurídica e resultados comprovados.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <a 
                href="https://wa.me/5516988308292" 
                className="w-full sm:w-auto px-8 py-4 bg-whatsapp hover:brightness-110 text-white rounded font-bold transition-all"
              >
                Agendar Consulta
              </a>
              <a 
                href="#servicos" 
                className="w-full sm:w-auto px-8 py-4 border border-gold/40 hover:bg-gold/10 text-white rounded font-bold transition-all"
              >
                Ver Serviços
              </a>
            </div>

            <div className="flex justify-center md:justify-start gap-8">
              <AnimatedCounter value="32+" label="Anos de Carreira" />
              <AnimatedCounter value="500+" label="Clientes" />
              <AnimatedCounter value="1000+" label="Casos" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="bg-navy-medium border border-gold/30 p-8 rounded-xl relative">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-navy-dark border-2 border-gold rounded-full flex items-center justify-center text-gold text-2xl font-serif">
                  VF
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white">Dr. Vilmar Ferreira</h4>
                  <p className="text-sm text-slate-400">Direito & Administração desde 1992</p>
                  <div className="mt-3 px-3 py-1 border border-gold bg-gold/10 text-gold text-[10px] font-bold tracking-widest rounded uppercase">
                    OAB Registro Ativo
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-navy-dark border-l-4 border-gold rounded-r-lg">
                  <h5 className="text-gold font-serif text-sm">Próximo Agendamento</h5>
                  <p className="text-white font-bold">Disponível via WhatsApp</p>
                </div>
                <div className="p-4 bg-navy-dark border-l-4 border-gold/30 rounded-r-lg opacity-60">
                  <h5 className="text-slate-400 font-serif text-sm">Consultoria Gratuita</h5>
                  <p className="text-white">Confira as condições</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/60"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-1 h-12 border border-gold/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-24 bg-navy-medium relative px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Foto Placeholder */}
            <div className="aspect-[3/4] bg-navy-dark rounded-lg border-2 border-gold/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={180} className="text-gold/10 group-hover:scale-110 transition-transform duration-700" />
              </div>
              
              {/* Badge */}
              <div className="absolute bottom-12 right-12 z-20">
                <div className="bg-navy p-4 rounded-lg border border-gold shadow-2xl">
                  <div className="text-gold font-bold mb-1">OAB</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300">Registro Ativo</div>
                </div>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-gold/30 rounded-tl-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-gold/30 rounded-br-3xl pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold uppercase tracking-[0.4em] text-sm mb-4 block">A Trajetória</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 italic">Dr. Vilmar Ferreira</h2>
            
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed mb-10">
              <p>
                Graduado em Direito em 1992, o Dr. Vilmar Ferreira consolidou sua carreira através de décadas de dedicação à justiça e ao atendimento de excelência aos seus clientes.
              </p>
              <p>
                Com formação multidisciplinar em Direito e Administração de Empresas, traz uma visão estratégica e jurídica diferenciada, focada em resultados concretos e segurança institucional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Award className="text-gold" />, title: "Experiência", text: "Mais de 32 anos de atuação" },
                { icon: <ShieldCheck className="text-gold" />, title: "Ética", text: "Compromisso inabalável" },
                { icon: <BookOpen className="text-gold" />, title: "Formação", text: "Direito e Administração" },
                { icon: <Briefcase className="text-gold" />, title: "Resultado", text: "Foco na solução eficaz" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-serif text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section id="servicos" className="py-24 px-6 bg-navy relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Áreas de Atuação" />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Gavel size={40} className="text-gold" />,
                title: "Direito Trabalhista",
                items: ["Rescisão indevida", "Horas extras", "Assédio moral", "FGTS e Verbas"],
                whatsapp: "Quero saber sobre Direito Trabalhista"
              },
              {
                icon: <Scale size={40} className="text-gold" />,
                title: "Direito Civil",
                items: ["Contratos", "Responsabilidade Civil", "Indenizações", "Família e Sucessões"],
                whatsapp: "Quero saber sobre Direito Civil"
              },
              {
                icon: <ShieldCheck size={40} className="text-gold" />,
                title: "Direito Previdenciário",
                items: ["Aposentadoria", "Auxílio-doença", "Pensão por Morte", "BPC/LOAS"],
                whatsapp: "Quero saber sobre Direito Previdenciário"
              }
            ].map((service, idx) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="premium-card group h-full flex flex-col"
              >
                <div className="mb-8 group-hover:scale-110 transition-transform duration-500 origin-left">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-serif mb-6">{service.title}</h3>
                <ul className="space-y-4 mb-10 flex-grow">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center text-slate-400 group-hover:text-slate-200 transition-colors">
                      <ChevronRight size={16} className="text-gold mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href={`https://wa.me/5516988308292?text=${encodeURIComponent(service.whatsapp)}`}
                  className="inline-flex items-center text-gold font-bold hover:gap-2 transition-all p-2 -ml-2"
                >
                  Saiba mais <ChevronRight size={18} className="ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos CAROUSEL */}
      <section id="depoimentos" className="py-24 px-6 bg-navy-medium overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="A Voz dos Nossos Clientes" />

          <div className="relative h-[400px] md:h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-navy p-8 md:p-12 rounded-2xl border border-gold/20 shadow-2xl text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-navy-medium rounded-full border-2 border-gold p-4 mb-6 relative">
                    <Users className="text-gold/40 w-full h-full" />
                    <div className="absolute -bottom-1 -right-1 bg-gold text-navy p-1 rounded-full text-[8px] font-bold">
                      <MessageCircle size={12} />
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star text-gold text-sm" />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl italic text-slate-300 mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </p>

                  <div>
                    <h4 className="text-lg font-serif text-white">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-sm text-gold uppercase tracking-widest">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentTestimonial === idx ? 'bg-gold w-8' : 'bg-gold/30 hover:bg-gold/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-gold/20 z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 rounded-3xl border border-gold/30 bg-navy-dark/40 backdrop-blur-xl shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Agende sua consulta agora</h2>
            <p className="text-xl text-slate-300 mb-12">Atendimento rápido, discreto e humanizado diretamente com o Dr. Vilmar Ferreira.</p>
            
            <a 
              href="https://wa.me/5516988308292" 
              className="inline-flex items-center px-12 py-6 bg-whatsapp hover:scale-105 active:scale-95 text-white font-bold text-xl rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.3)] transition-all"
            >
              <MessageCircle size={28} className="mr-4" />
              Solicitar Atendimento
            </a>
            
            <div className="mt-12 flex flex-wrap justify-center gap-10 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center space-x-2"><Clock size={20} /> <span>Horário Flexível</span></div>
              <div className="flex items-center space-x-2"><ShieldCheck size={20} /> <span>Sigilo Total</span></div>
              <div className="flex items-center space-x-2"><FileCheck size={20} /> <span>Análise de Documentos</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rodapé / Footer */}
      <footer id="contato" className="bg-navy-dark pt-20 pb-10 px-6 border-t-[3px] border-gold">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col mb-8">
              <div className="gold-line" />
              <span className="text-2xl font-serif font-bold text-gold mb-1">Advocacia Vilmar Ferreira</span>
              <span className="text-xs uppercase tracking-[0.3em] opacity-40">Excelência e Ética desde 1992</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md mb-8">
              Comprometidos com a justiça e a defesa intransigente dos direitos dos nossos clientes em todo o estado. Experiência que traz segurança para o seu futuro.
            </p>
            <div className="flex space-x-6">
              {[
                { icon: "fa-instagram", href: "#" },
                { icon: "fa-facebook", href: "#" },
                { icon: "fa-linkedin", href: "#" }
              ].map((social, i) => (
                <a key={i} href={social.href} className="text-xl text-slate-400 hover:text-gold transition-all hover:-translate-y-1">
                  <i className={`fa-brands ${social.icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-gold text-xl mb-8">Links Rápidos</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-400 hover:text-gold transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-gold text-xl mb-8">Contato</h4>
            <div className="space-y-6 text-slate-400">
              <a href="https://wa.me/5516988308292" className="flex items-start space-x-3 hover:text-gold transition-colors">
                <span className="mt-1">📧</span>
                <span>contato@vilmarferreira.adv.br</span>
              </a>
              <div className="flex items-start space-x-3">
                <span className="mt-1">📍</span>
                <span>Ribeirão Preto - SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm italic">
          <p>© 2025 Advocacia Vilmar Ferreira. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold">Política de Privacidade</a>
            <a href="#" className="hover:text-gold">Termos de Uso</a>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Scroll to Top) */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gold text-navy rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <a 
        href="https://wa.me/5516988308292" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-24 right-8 z-50 w-14 h-14 bg-whatsapp text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
      >
        <MessageCircle size={30} />
      </a>
    </div>
  );
}
