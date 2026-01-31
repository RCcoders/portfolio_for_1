'use client';
import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Calendar,
  CheckCircle,
  User,
  Building,
  FileText,
  Bot,
  X,
  Minimize2,
  Maximize2,
  Loader,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import GlowCard from '@/components/ui/GlowCard';

// AI Chatbot Component
import { api, Profile } from '@/lib/api'; // Ensure Profile and api are imported

function AIChatbot({ profile }: { profile: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `Hi! I'm ${profile?.name?.split(' ')[0] || 'Raghav'}'s AI assistant. I can help you learn more about his services, experience, or answer any questions about potential projects. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update initial message when profile loads
  useEffect(() => {
    if (profile?.name && messages.length === 1 && messages[0].type === 'bot') {
      setMessages([{
        type: 'bot',
        content: `Hi! I'm ${profile.name.split(' ')[0]}'s AI assistant. I can help you learn more about services, experience, or answer any questions. How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [profile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Mock AI responses - Replace with actual API call
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerMessage = userMessage.toLowerCase();
    const name = profile?.name || 'Raghav';
    const email = profile?.email || 'chawlaraghav78@gmail.com';
    const phone = profile?.mobile_number || '+91 998121 79058';

    // Simple keyword-based responses - replace with actual AI API
    if (lowerMessage.includes('service') || lowerMessage.includes('what do') || lowerMessage.includes('offer')) {
      return `${name} specializes in Data Science, Machine Learning, AI solutions, and Full-Stack Web Development. Services include:\n\n• Custom ML models and AI solutions\n• Data analysis and visualization\n• Web applications (React, Node.js, Python)\n• Automation scripts and tools\n• Cloud deployment (AWS, Vercel)\n• Technical consulting\n\nWhich area interests you most?`;
    }

    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return `${name} is a skilled developer with expertise in:\n\n• Python, JavaScript, React, Node.js\n• Machine Learning frameworks (TensorFlow, PyTorch, Scikit-learn)\n• Data Science tools (Pandas, NumPy, Matplotlib)\n• Cloud platforms and deployment\n• Database management\n\nWould you like to know about any specific technology or project type?`;
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return `Project pricing depends on complexity and requirements. ${name} offers competitive rates and can provide:\n\n• Hourly consulting rates\n• Fixed-price project quotes\n• Retainer agreements\n\nFor an accurate quote, please discuss your specific project requirements.`;
    }

    if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('duration')) {
      return `${name} provides realistic timelines. General estimates:\n\n• Simple automation scripts: 1-3 days\n• Data analysis projects: 1-2 weeks\n• ML model development: 2-4 weeks\n• Web applications: 2-6 weeks\n\nWhat type of project are you considering?`;
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('get in touch')) {
      return `You can reach ${name} through:\n\n📧 Email: ${email}\n📱 Phone: ${phone}\n\nHe typically responds to emails within 24 hours on weekdays.`;
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! Great to meet you! I'm here to help you learn more about ${name}'s services. Feel free to ask anything!`;
    }

    // Default response
    return `That's a great question! I recommend reaching out to ${name} directly for detailed discussions.\n\nYou can:\n• Fill out the contact form on this page\n• Email at ${email}\n• Call at ${phone}\n\nIs there anything specific you'd like to know more about?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(userMessage);

      const aiMessage = {
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage = {
        type: 'bot',
        content: "I apologize, but I'm having trouble responding right now. Please try reaching out directly via email or phone.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-sky-600 to-green-600 hover:from-sky-700 hover:to-green-700 text-white p-4 rounded-full shadow-2xl z-50 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bot className="w-6 h-6" />
            <div className="absolute -top-12 right-0 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Chat with AI Assistant
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden ${isMinimized ? 'h-14' : 'h-96 w-80 md:w-96'
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-sky-600/20 to-green-600/20">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-green-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                  <p className="text-gray-400 text-xs">Online now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${message.type === 'user'
                        ? 'bg-gradient-to-r from-sky-600 to-green-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                        }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700 bg-gray-800">
                  <div className="flex space-x-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-3 py-2 bg-gradient-to-r from-sky-600 to-green-600 hover:from-sky-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ContactPage() {
  const form = useRef<HTMLFormElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    projectType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch the main profile (assuming single user or logic in getProfile)
        const data = await api.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!form.current) return;

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        projectType: "general"
      });
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: profile?.email || 'Loading...',
      description: 'Send me an email anytime',
      link: `mailto:${profile?.email || ''}`,
      color: 'text-blue-400'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: profile?.mobile_number || 'Loading...',
      description: 'Mon-Fri from 9am to 6pm',
      link: `tel:${profile?.mobile_number?.replace(/\s/g, '') || ''}`,
      color: 'text-green-400'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: profile?.location || 'Loading...',
      description: 'India',
      link: '#',
      color: 'text-sky-400'
    },
    {
      icon: Calendar,
      title: 'Schedule Call',
      value: 'Book a Meeting',
      description: 'Let\'s discuss your project',
      link: '#',
      color: 'text-orange-400'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      username: profile?.github ? '@' + profile.github.split('/').pop() : 'Loading...',
      link: profile?.github || '#',
      color: 'hover:text-gray-400'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      username: profile?.name || 'Loading...',
      link: profile?.linkedin || '#',
      color: 'hover:text-blue-400'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      username: profile?.instagram ? '@' + profile.instagram.split('/').pop() : 'Loading...',
      link: profile?.instagram || '#',
      color: 'hover:text-green-500'
    },
    {
      icon: Globe,
      name: 'Twitter/X',
      username: profile?.twitter ? '@' + profile.twitter.split('/').pop() : 'Loading...',
      link: profile?.twitter || '#',
      color: 'hover:text-sky-400'
    }
  ];

  const projectTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'data-science', label: 'Data Science Project' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'deep-learning', label: 'Deep Learning / Neural Networks' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend-api', label: 'Backend/API Development' },
    { value: 'flask-django', label: 'Flask/Django Project' },
    { value: 'streamlit-app', label: 'Streamlit Dashboard / Tool' },
    { value: 'automation', label: 'Python Automation Script' },
    { value: 'chatbot', label: 'Chatbot / LLM Integration' },
    { value: 'cv-nlp', label: 'Computer Vision / NLP' },
    { value: 'cloud', label: 'Cloud Deployment (AWS, Vercel, etc.)' },
    { value: 'consulting', label: 'Tech Consulting / Advice' },
    { value: 'collaboration', label: 'Open Source Collaboration' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Hero Section */}
        <div className="relative">
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get in Touch
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  Let us{' '}
                  <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                    Connect
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
              >
                Ready to transform your ideas into reality? Whether you have a project in mind,
                need consulting, or just want to discuss the latest in AI and data science,
                I would love to hear from you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-400"
              >
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Bot className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Try the AI assistant for quick questions</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlowCard className="p-8 h-full border-white/10 bg-white/5 backdrop-blur-md">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-blue-500/10 rounded-xl mr-4 border border-blue-500/20">
                    <MessageCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                </div>

                {submitStatus === 'success' && (
                  <div className="flex items-center bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-8">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Message sent successfully! I will get back to you soon.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
                    <X className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Something went wrong. Please try again later.</span>
                  </div>
                )}

                <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2 text-blue-400" />
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2 text-blue-400" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Building className="w-4 h-4 inline mr-2 text-blue-400" />
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Your company (optional)"
                      />
                    </div>

                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                        <FileText className="w-4 h-4 inline mr-2 text-blue-400" />
                        Project Type
                      </label>
                      <div className="relative">
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          {projectTypes.map((type) => (
                            <option
                              key={type.value}
                              value={type.value}
                              className="bg-gray-800 text-white py-2"
                            >
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                      placeholder="Tell me about your project, requirements, timeline, or any questions you have..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-600 to-green-600 hover:from-sky-700 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-600/20 hover:shadow-sky-600/40 hover:scale-[1.02] transform"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </GlowCard>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Contact Methods */}
              <GlowCard className="p-6 md:p-8 border-white/10 bg-white/5 backdrop-blur-md">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center md:text-left">Get In Touch</h2>
                <div className="space-y-4 md:space-y-6">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.link}
                      className="flex items-start space-x-3 md:space-x-5 p-3 md:p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/5"
                    >
                      <div className={`${method.color} bg-gray-800/50 p-3 md:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-gray-700/50 flex-shrink-0`}>
                        <method.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors text-sm md:text-base">{method.title}</h3>
                        <p className={`${method.color} font-medium mb-1 text-xs md:text-sm break-words`}>{method.value}</p>
                        <p className="text-gray-400 text-xs md:text-sm">{method.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </GlowCard>

              {/* AI Assistant Info */}
              <div className="bg-gradient-to-r from-sky-600/10 to-green-600/10 p-8 rounded-2xl border border-sky-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center mb-4 relative z-10">
                  <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                    <Bot className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg">AI Assistant Available</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 relative z-10">
                  Got quick questions about my services, experience, or project types?
                  Chat with my AI assistant for instant answers!
                </p>
                <div className="text-xs text-blue-300 font-medium flex items-center relative z-10">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                  Available 24/7 • Instant responses • No signup required
                </div>
              </div>

              {/* Social Links */}
              <GlowCard className="p-8 border-white/10 bg-white/5 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white mb-8">Connect Online</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/60 transition-all duration-300 text-gray-300 border border-gray-700/50 hover:border-gray-600 group ${social.color}`}
                    >
                      <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{social.name}</p>
                        <p className="text-xs opacity-60 font-mono mt-0.5">{social.username}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </GlowCard>

              {/* Availability */}
              <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20">
                <h3 className="text-white font-bold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-emerald-400" />
                  Current Availability
                </h3>
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-emerald-400 font-medium">Available for new projects</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  I am currently accepting new projects and collaborations.
                  Let us discuss how we can work together!
                </p>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "What's your typical project timeline?",
                  answer: "Project timelines vary based on complexity, but most data science projects take 2-6 weeks, while web development projects typically take 1-4 weeks."
                },
                {
                  question: "Do you work with international clients?",
                  answer: "Absolutely! I work with clients globally and am comfortable with remote collaboration across different time zones."
                },
                {
                  question: "What technologies do you specialize in?",
                  answer: "I specialize in Python, Data Science, Machine Learning, AI, and web development with modern frameworks like React and Node.js."
                },
                {
                  question: "Do you provide ongoing support?",
                  answer: "Yes, I offer maintenance and support packages for all projects to ensure they continue to perform optimally over time."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlowCard className="p-8 h-full hover:bg-white/5 transition-colors border-white/5">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start">
                      <span className="text-blue-500 mr-3 text-xl leading-none">•</span>
                      {faq.question}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed pl-6">{faq.answer}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Chatbot Component */}
        <AIChatbot profile={profile} />
      </div>
    </PageTransition>
  );
}
