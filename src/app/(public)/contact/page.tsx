import Head from 'next/head'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
export const dynamic = "force-dynamic";
export default function ContactPage() {

    return (
        <>
            <Head>
                <title>Contact Us | Your E-Commerce Store</title>
                <meta name="description" content="Get in touch with our team for any inquiries, support, or feedback" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-white">
                    <div className="absolute inset-0"></div>
                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <h1 className="text-4xl text-secondary md:text-5xl font-bold mb-4">We&apos;d Love to Hear From You</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Our team is here to help with any questions about our products, orders, or your shopping experience.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaPhoneAlt className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-primary">Phone Support</h3>
                                            <p className="text-gray-600 mt-1">24/7 customer service</p>
                                            <a href="tel:+18005551234" className="text-secondary/90 hover:text-seondary font-medium block mt-2">
                                                +977 9841234567
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaEnvelope className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-primary">Email Us</h3>
                                            <p className="text-gray-600 mt-1">Typically responds within 24 hours</p>
                                            <a href="mailto:support@yourstore.com" className="text-secondary/90 hover:text-secondary font-medium block mt-2">
                                                support@yourstore.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaMapMarkerAlt className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-primary">Our Headquarter</h3>
                                            <p className="text-gray-600 mt-1">Visit our office</p>
                                            <address className="not-italic text-secondary font-medium mt-2">
                                                Kathmandu, Nepal
                                            </address>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaClock className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-primary">Business Hours</h3>
                                            <p className="text-gray-600 mt-1">Sunday - Friday</p>
                                            <p className="text-secondary font-medium mt-2">10:00 AM - 6:00 PM </p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Embed */}
                        <div className=" bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="h-full w-full">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.041019984347!2d85.3123293150611!3d27.71724598279159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909d5b1f3f1%3A0x5e3b0b8c2f2f3e9f!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp" width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    title="Our Location"
                                ></iframe>
                            </div>

                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16 bg-white rounded-xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <button className="flex justify-between items-center w-full text-left">
                                    <h3 className="text-lg font-semibold text-secondary">How can I track my order?</h3>
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="mt-2 text-gray-600">
                                    <p>Once your order ships, you&apos;ll receive a confirmation email with a tracking number. You can use this number on our website or the carrier&apos;s website to track your package in real-time.</p>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <button className="flex justify-between items-center w-full text-left">
                                    <h3 className="text-lg font-semibold text-secondary">What is your return policy?</h3>
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="mt-2 text-gray-600">
                                    <p>We accept returns within 30 days of purchase for most items. Items must be unused, in original packaging with tags attached. Some exclusions apply for final sale items.</p>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <button className="flex justify-between items-center w-full text-left">
                                    <h3 className="text-lg font-semibold text-secondary">Do you offer international shipping?</h3>
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="mt-2 text-gray-600">
                                    <p>Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination. Duties and taxes may apply depending on your country&apos;s regulations.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <a href="/faq" className="text-primary/90 hover:text-primary font-medium">
                                View all FAQs &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}