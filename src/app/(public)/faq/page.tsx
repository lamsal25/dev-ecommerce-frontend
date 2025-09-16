"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { getAllFAQs } from "@/app/(protected)/actions/faq";
import { BenefitsOfChoosingUs } from "@/components/benefitsOfChoosingUS";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const dynamic = 'force-dynamic'

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await getAllFAQs();
        if (response.error) throw new Error(response.error);
        setFaqs(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  const filteredFAQs = faqs.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>FAQs - DCart Marketplace</title>
        <meta name="description" content="Frequently asked questions" />
      </Head>

      <header className="bg-primary/90 py-16 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">Frequently Asked Questions</h1>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our services and platform.
          </p>

          <div className="max-w-2xl mx-auto relative bg-white rounded-lg">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-5 py-3 rounded-lg border-0 shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-18 py-12">
        {/* FAQ Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-primary">
              FAQs
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg m-6 text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery
                ? "No FAQs match your search. Try different keywords."
                : "No FAQs available at this time."}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="transition-all  hover:bg-gray-50/50"
                >
                  <button
                    aria-expanded={activeId === faq.id}
                    aria-controls={`faq-${faq.id}`}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-4 mt-0.5 flex-shrink-0">
                        <QuestionIcon className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <h2 className="font-medium text-secondary">
                        {faq.question}
                      </h2>
                    </div>
                    <motion.span
                      animate={{ rotate: activeId === faq.id ? 180 : 0 }}
                      className="text-gray-400 ml-4 flex-shrink-0"
                    >
                      <ChevronDownIcon />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {activeId === faq.id && (
                      <motion.div
                        id={`faq-${faq.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 pb-5 text-gray-600 ml-10"
                      >
                        <div className="prose prose-sm max-w-none">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<UsersIcon />}
            value="10,000+"
            label="Happy Customers"
          />
          <StatCard
            icon={<QuestionCountIcon />}
            value={faqs.length}
            label="Answered Questions"
          />
          <StatCard
            icon={<SupportIcon />}
            value="24/7"
            label="Support Available"
          />
        </div>

        {/* Help Tips Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">
            Helpful Tips
          </h2>
          <div className="grid gap-6">
            <TipCard
              title="Getting Started"
              content="Our platform is designed to be intuitive. Most users find they can accomplish their goals within minutes of signing up."
              icon={<RocketIcon />}
              color="blue"
            />
            <TipCard
              title="Troubleshooting"
              content="If you encounter issues, try refreshing the page or clearing your browser cache before contacting support."
              icon={<ToolIcon />}
              color="green"
            />
            <TipCard
              title="Best Practices"
              content="For optimal performance, we recommend using the latest version of Chrome, Firefox, or Edge browsers."
              icon={<StarIcon />}
              color="purple"
            />
          </div>
        </section>


        {/* Contact Section */}
        <section className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-semibold text-primary mb-3">
              Need more help?
            </h3>
            <p className="mb-6 text-secondary">
              Our support team is ready to assist you with any questions you may
              have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors shadow-md hover:shadow-lg">
                <MailIcon className="mr-2 w-5 h-5" />
                Email Support
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md border border-gray-200">
                <PhoneIcon className="mr-2 w-5 h-5" />
                Call Support
              </button>
            </div>
          </div>
        </section>

      </main>
      {/* New Section */}
      <BenefitsOfChoosingUs />
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
    <div className="flex justify-center mb-3">
      <div className="p-3 rounded-full bg-blue-100 text-primary">{icon}</div>
    </div>
    <div className="text-3xl font-bold text-secondary mb-1">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

// Tip Card Component
const TipCard = ({
  title,
  content,
  icon,
  color,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple";
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex">
      <div
        className={`p-3 rounded-lg ${colorClasses[color]} mr-4 flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
};

// Icons
const ChevronDownIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

const QuestionIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const UsersIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const QuestionCountIcon = ({
  className = "w-6 h-6",
}: {
  className?: string;
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const SupportIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
      clipRule="evenodd"
    />
  </svg>
);

const RocketIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M11.933 13.069s7.059-5.094 6.276-10.924a.465.465 0 00-.112-.268.436.436 0 00-.263-.115C12.137.961 7.16 8.184 7.16 8.184c-4.318-.517-4.004.344-5.974 5.076-.377.902.234 1.213.904.95l2.148-.811 2.59 2.648-.793 2.199c-.272.686.055 1.311.938.926 4.624-2.016 5.466-1.694 4.96-6.112z" />
  </svg>
);

const ToolIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const PhoneIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

export default FAQPage;
