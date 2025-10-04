import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section id="faq" className="min-h-screen bg-[#000000] flex items-center py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-3">
          <span className="text-neon-yellow font-rajdhani font-semibold text-sm tracking-widest uppercase">
            SUPPORT
          </span>
        </div>

        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-bebas text-center mb-4 tracking-wider uppercase text-white"
          data-testid="text-faq-title"
        >
          NEED ANSWERS?
        </h2>

        <p className="text-center text-gray-300 font-rajdhani text-lg mb-12">
          Everything you need to know about AECOIN and our services
        </p>

        <Accordion type="single" collapsible className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-[#000000] border border-white/10 px-6 data-[state=open]:border-neon-yellow/50 transition-all"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger
                className="text-left font-rajdhani font-bold text-white hover:text-neon-yellow hover:no-underline text-base md:text-lg py-5"
                data-testid={`faq-question-${index}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 font-rajdhani pt-2 pb-5" data-testid={`faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="bg-gradient-to-r from-neon-yellow/10 to-neon-yellow/5 border border-neon-yellow/30 py-12 px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bebas text-white mb-3 uppercase">
            Still Have Questions?
          </h3>
          <p className="text-gray-300 font-rajdhani text-lg mb-8">
            Our expert support team is available 24/7 to help you with any issues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-neon-yellow hover:bg-neon-yellow/90 text-black font-rajdhani font-bold uppercase text-sm px-8 h-12">
              <MessageCircle className="w-5 h-5 mr-2" />
              LIVE CHAT SUPPORT
            </Button>
            <Button
              variant="outline"
              className="border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 font-rajdhani font-bold uppercase text-sm px-8 h-12"
            >
              <Mail className="w-5 h-5 mr-2" />
              EMAIL SUPPORT
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
