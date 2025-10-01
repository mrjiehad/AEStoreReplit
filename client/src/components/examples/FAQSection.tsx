import { FAQSection } from "../FAQSection";

export default function FAQSectionExample() {
  const faqs = [
    {
      question: "How fast will I receive my codes?",
      answer: "Instantly after payment confirmation. Your AECOIN code will be delivered to your email within seconds.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept FPX, ToyyibPay, Billplz, Visa, and Mastercard for your convenience.",
    },
    {
      question: "Can I get a refund?",
      answer: "Refunds are only available for unused codes within 24 hours of purchase. Once redeemed, codes cannot be refunded.",
    },
    {
      question: "How do I redeem codes?",
      answer: "Simply enter your code in the GTA Online redeem menu to instantly add AECOIN to your account.",
    },
  ];

  return <FAQSection faqs={faqs} />;
}
