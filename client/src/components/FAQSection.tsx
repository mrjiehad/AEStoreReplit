import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section id="faq" className="min-h-screen bg-gradient-to-br from-[#0d1d35] via-black to-[#0d1d35] flex items-center py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)',
        backgroundSize: '120px 120px',
      }} />

      {/* Floating Help Icons */}
      <HelpCircle className="absolute top-10 left-10 w-16 h-16 text-neon-yellow/10 animate-float" />
      <HelpCircle className="absolute bottom-20 right-10 w-20 h-20 text-neon-yellow/10 animate-float-delayed" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Section Label */}
        <div className="text-center mb-4">
          <div className="inline-block">
            <div className="text-neon-yellow font-rajdhani font-black text-sm tracking-[0.3em] uppercase px-8 py-4 border-4 border-neon-yellow/50 bg-neon-yellow/10 transform -skew-x-12">
              <span className="inline-block transform skew-x-12">SUPPORT</span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-bebas text-center mb-6 tracking-wider uppercase text-neon-yellow animate-neon-pulse"
          style={{
            textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700, 6px 6px 0px #000',
            WebkitTextStroke: '2px #FFD700',
          }}
          data-testid="text-faq-title"
        >
          NEED ANSWERS?
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-300 font-rajdhani text-xl md:text-2xl mb-16 font-semibold">
          Everything you need to know about AECOIN and our services
        </p>

        {/* FAQ Accordion - Neon Style */}
        <Accordion type="single" collapsible className="space-y-6 mb-20">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-gradient-to-r from-neon-yellow/10 to-transparent border-4 border-neon-yellow/30 rounded-2xl px-8 data-[state=open]:border-neon-yellow data-[state=open]:neon-border transition-all transform hover:scale-105"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger
                className="text-left font-bebas text-white hover:text-neon-yellow hover:no-underline text-xl md:text-2xl py-6"
                data-testid={`faq-question-${index}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 font-rajdhani pt-2 pb-6 text-lg" data-testid={`faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Support Section - Gaming Style */}
        <div className="bg-gradient-to-r from-neon-yellow/20 via-neon-yellow/10 to-neon-yellow/20 border-4 border-neon-yellow rounded-3xl py-16 px-8 text-center relative overflow-hidden neon-border-strong">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-neon-yellow/10 via-transparent to-transparent blur-2xl" />
          
          <h3 className="text-3xl md:text-5xl font-bebas text-white mb-4 uppercase tracking-wider relative z-10 text-glow-strong">
            Still Have Questions?
          </h3>
          <p className="text-gray-300 font-rajdhani text-xl md:text-2xl mb-10 relative z-10 font-semibold">
            Our expert support team is available 24/7 to help you with any issues
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Button className="bg-gradient-to-r from-neon-yellow via-yellow-400 to-neon-yellow hover:from-yellow-400 hover:to-neon-yellow text-black font-black uppercase text-lg px-12 h-16 rounded-xl font-bebas tracking-widest border-4 border-yellow-600 transform hover:scale-110 transition-all animate-gradient">
              <MessageCircle className="w-6 h-6 mr-3" />
              LIVE CHAT SUPPORT
            </Button>
            <Button className="bg-black border-4 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-black font-black uppercase text-lg px-12 h-16 rounded-xl font-bebas tracking-widest transform hover:scale-110 transition-all">
              <Mail className="w-6 h-6 mr-3" />
              EMAIL SUPPORT
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
