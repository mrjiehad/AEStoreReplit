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
          className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 tracking-wide"
          style={{
            color: "#FFD700",
            textShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
          }}
          data-testid="text-faq-title"
        >
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border-2 border-border rounded-md px-6 data-[state=open]:border-neon-yellow transition-all"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger
                className="text-left font-orbitron font-bold text-neon-yellow hover:no-underline"
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
