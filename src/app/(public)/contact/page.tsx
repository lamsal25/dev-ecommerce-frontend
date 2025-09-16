'use client'

import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'
import { SiGitter, SiInstagram } from 'react-icons/si'
export const dynamic = "force-dynamic"; 
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Here you would typically integrate with your backend or a service like Formspree
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSubmitSuccess(true)
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            })
        } catch (error) {
            console.error('Submission error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        <h1 className="text-4xl text-secondary md:text-5xl font-bold mb-4">We'd Love to Hear From You</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Our team is here to help with any questions about our products, orders, or your shopping experience.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white rounded-xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>

                            {submitSuccess ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                                    <p className="text-green-600">Our team will get back to you within 24 hours.</p>
                                    <button
                                        onClick={() => setSubmitSuccess(false)}
                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="Order Inquiry">Order Inquiry</option>
                                            <option value="Product Question">Product Question</option>
                                            <option value="Shipping Information">Shipping Information</option>
                                            <option value="Returns & Exchanges">Returns & Exchanges</option>
                                            <option value="Feedback">Feedback</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </span>
                                            ) : 'Send Message'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaPhoneAlt className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Phone Support</h3>
                                            <p className="text-gray-600 mt-1">24/7 customer service</p>
                                            <a href="tel:+18005551234" className="text-blue-600 hover:text-blue-800 font-medium block mt-2">
                                                +1 (800) 555-1234
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaEnvelope className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
                                            <p className="text-gray-600 mt-1">Typically responds within 24 hours</p>
                                            <a href="mailto:support@yourstore.com" className="text-blue-600 hover:text-blue-800 font-medium block mt-2">
                                                support@yourstore.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaMapMarkerAlt className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Our Headquarters</h3>
                                            <p className="text-gray-600 mt-1">Visit our office</p>
                                            <address className="not-italic text-gray-800 font-medium mt-2">
                                                123 Commerce Street<br />
                                                San Francisco, CA 94103<br />
                                                United States
                                            </address>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaClock className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Business Hours</h3>
                                            <p className="text-gray-600 mt-1">Monday - Friday</p>
                                            <p className="text-gray-800 font-medium mt-2">9:00 AM - 6:00 PM (PST)</p>
                                            <p className="text-gray-600 mt-1">Weekends</p>
                                            <p className="text-gray-800 font-medium mt-2">10:00 AM - 4:00 PM (PST)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Google Maps Embed */}
                    <div className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="h-96 w-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.041019984347!2d85.3123293150611!3d27.71724598279159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909d5b1f3f1%3A0x5e3b0b8c2f2f3e9f!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Our Location"
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800">Visit Our Store</h3>
                            <p className="text-gray-600 mt-2">Come see our products in person at our flagship store in San Francisco.</p>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800">Store Hours:</h4>
                                    <ul className="mt-2 space-y-1 text-gray-600">
                                        <li>Monday-Friday: 10AM-8PM</li>
                                        <li>Saturday: 10AM-9PM</li>
                                        <li>Sunday: 11AM-7PM</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Amenities:</h4>
                                    <ul className="mt-2 space-y-1 text-gray-600">
                                        <li>Free parking available</li>
                                        <li>Wheelchair accessible</li>
                                        <li>In-store pickup</li>
                                        <li>Personal shopping assistance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16 bg-white rounded-xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <button className="flex justify-between items-center w-full text-left">
                                    <h3 className="text-lg font-semibold text-gray-800">How can I track my order?</h3>
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="mt-2 text-gray-600">
                                    <p>Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number on our website or the carrier's website to track your package in real-time.</p>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <button className="flex justify-between items-center w-full text-left">
                                    <h3 className="text-lg font-semibold text-gray-800">What is your return policy?</h3>
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
                                    <h3 className="text-lg font-semibold text-gray-800">Do you offer international shipping?</h3>
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="mt-2 text-gray-600">
                                    <p>Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination. Duties and taxes may apply depending on your country's regulations.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <a href="/faq" className="text-blue-600 hover:text-blue-800 font-medium">
                                View all FAQs &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}