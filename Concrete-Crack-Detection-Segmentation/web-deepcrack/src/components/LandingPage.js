import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Shield, Brain, Users, Mail, Phone, Globe, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Crack Detection",
      description: "Combines CNNs, YOLO, LSTM networks, and Random Forest algorithms to pinpoint micro-cracks with surgical precision.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Severity Evaluation",
      description: "Automated scoring of crack dimensions and propagation risk, enabling engineers to prioritize responses effectively.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Healing Efficiency Analysis",
      description: "Tracks healing kinetics with pre/post-repair comparisons, generating recovery metrics and residual risk assessment.",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SHC AI
          </div>
          <div className="hidden md:flex space-x-8 text-white/80">
            <a href="#features" className="hover:text-cyan-400 transition-colors duration-300">Features</a>
            <a href="#research" className="hover:text-cyan-400 transition-colors duration-300">Research</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors duration-300">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-cyan-300 text-sm font-medium mb-8 border border-white/20">
              <Star className="w-4 h-4 mr-2" />
              Revolutionary AI Technology
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Self-Healing
              </span>
              <br />
              <span className="text-white">Concrete AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Empowering engineers with real-time insights into concrete performance through 
              <span className="text-cyan-400 font-semibold"> state-of-the-art AI models</span> that detect, evaluate, and monitor self-healing processes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105" onClick={() => navigate('/home')}>
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="px-8 py-4 border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Animation Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-32 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Cutting-Edge <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover how our AI-powered platform revolutionizes concrete analysis and monitoring
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeFeature === index 
                    ? 'bg-white/20 border-white/30 shadow-2xl' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
                
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-8">
                Pioneering <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Research</span>
              </h2>
              
              <div className="space-y-8">
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">Research Lead</h3>
                  <p className="text-white/80">
                    Led by <span className="text-cyan-400 font-semibold">C. P. Pearlin</span>, PhD candidate at VISTAS, Chennai, 
                    under the supervision of <span className="text-purple-400 font-semibold">Dr. A. D. Sheena</span>, 
                    exploring intelligent systems for advanced construction materials.
                  </p>
                </div>
                
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">Funding & Collaboration</h3>
                  <p className="text-white/80">
                    Financial support and cloud infrastructure provided by 
                    <span className="text-emerald-400 font-semibold"> Acutix Soft LLP</span>, 
                    with academic mentorship from VISTAS, Chennai.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Key Capabilities</h3>
                <div className="space-y-4">
                  {[
                    "Real-time crack detection and localization",
                    "Multi-algorithm fusion for enhanced accuracy",
                    "Automated damage severity classification",
                    "Healing kinetics tracking and analysis",
                    "Risk assessment and prioritization"
                  ].map((capability, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-white/80">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 px-6 py-32 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-8">
            Get in <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {/* Phone Card */}
            <a 
              href="tel:+916369936706" 
              className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
              <p className="text-cyan-400 font-medium text-sm">+91-63699 36706</p>
            </a>
            
            {/* Email Card */}
            <a 
              href="mailto:info@acutixsoft.com" 
              className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
              <p className="text-purple-400 font-medium text-sm">info@acutixsoft.com</p>
            </a>
            
            {/* Website Card */}
            <a 
              href="https://www.acutixsoft.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Visit Us</h3>
              <p className="text-emerald-400 font-medium text-sm">www.acutixsoft.com</p>
            </a>
            
            {/* LinkedIn Card */}
            <a 
              href="https://www.linkedin.com/company/acutix-soft-llp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
              <p className="text-blue-400 font-medium text-sm">LinkedIn</p>
            </a>
          </div>
          
          <div className="mt-16 p-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Acutix Soft LLP</h3>
            <p className="text-white/70 text-lg">Registered under MCA and MSME</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            SHC AI
          </div>
          <p className="text-white/60">
            Revolutionizing concrete analysis through artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}