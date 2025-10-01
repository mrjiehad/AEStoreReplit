import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section id="faq" className="py-20 bg-card">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bebas text-center mb-12 md:mb-16 tracking-wider uppercase text-neon-yellow px-4"
          data-testid="text-faq-title"
        >
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border border-border rounded-sm px-6 data-[state=open]:border-neon-yellow transition-all"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger
                className="text-left font-rajdhani font-bold text-neon-yellow hover:no-underline text-base md:text-lg"
                data-testid={`faq-question-${index}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground pt-2" data-testid={`faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
