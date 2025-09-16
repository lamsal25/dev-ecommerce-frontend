"use client"

import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { NumberTicker } from '@/components/magicui/number-ticker';
import Link from 'next/link';

// Animation variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } }
};

const slideInFromLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const slideInFromRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function AboutUs() {
    return (
        <>
            <Head>
                <title>DCart</title>
                <meta name="description" content="Learn about our multi-vendor e-commerce platform and our mission to connect buyers with quality sellers" />
            </Head>

            <div className="min-h-screen ">
                {/* Hero Section */}
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={fadeIn}
                    className="relative text-white py-20 md:py-32 overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')]"></div>
                    </div>

                    <div className="container mx-auto px-6 text-center relative">
                        <motion.div variants={item} className="flex flex-col items-center justify-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-4xl">
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold">
                                    Our Marketplace Story
                                </span>
                            </h1>
                            <div className="text-lg md:text-xl text-gray-700 font-medium">
                                <TypewriterEffectSmooth
                                    words={[{ text: "Connecting buyers with the best vendors worldwide" }]}
                                />
                            </div>
                        </motion.div>
                    </div>


                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 origin-top-left"></div>
                </motion.section>

                {/* Our Mission */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={slideInFromLeft}
                                className="md:w-1/2 mb-10 md:mb-0"
                            >
                                <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-xl">
                                    <Image
                                        src="/mission.jpg"
                                        alt="Our Mission"
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition duration-500 hover:scale-105"
                                        priority
                                    />
                                </div>
                            </motion.div>
                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={slideInFromRight}
                                className="md:w-1/2 md:pl-12"
                            >
                                <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-6">Our Mission</h2>
                                <p className="text-gray-600 mb-6 text-lg">
                                    We're revolutionizing e-commerce by creating a platform where independent vendors can thrive
                                    and customers can discover unique products from around the world. Our mission is to empower
                                    small businesses while providing shoppers with an unparalleled selection.
                                </p>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-blue-50 p-6 rounded-lg border-l-4 border-orange-500"
                                >
                                    <p className="text-blue-800 italic">
                                        "To build the most trusted multi-vendor marketplace where quality meets convenience."
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 md:py-24 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <motion.h2
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={item}
                            className="text-3xl md:text-4xl font-semibold text-center text-primary mb-16"
                        >
                            By The Numbers
                        </motion.h2>
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={container}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                        >
                            <motion.div
                                variants={item}
                                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                            >
                                <div className="text-5xl font-medium text-blue-600 mb-4">
                                    <NumberTicker
                                        value={10000}
                                        startValue={9000}
                                        className="whitespace-pre-wrap text-blue-600 tracking-tighter"
                                    />+
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Active Vendors</h3>
                                <p className="text-gray-500">Quality sellers from 50+ countries</p>
                            </motion.div>
                            <motion.div
                                variants={item}
                                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                            >
                                <div className="text-5xl font-medium text-blue-600 mb-4">
                                    <NumberTicker
                                        value={2000}
                                        startValue={1000}
                                        className="whitespace-pre-wrap text-blue-600 tracking-tighter"
                                    />+
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Happy Customers</h3>
                                <p className="text-gray-500">Served with 98% satisfaction rate</p>
                            </motion.div>
                            <motion.div
                                variants={item}
                                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                            >
                                <div className="text-5xl font-medium text-blue-600 mb-4">
                                    <NumberTicker
                                        value={5000}
                                        startValue={4000}
                                        className="whitespace-pre-wrap text-blue-600 tracking-tighter"
                                    />+
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Products Listed</h3>
                                <p className="text-gray-500">From handmade to high-tech</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <motion.h2
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={item}
                            className="text-3xl md:text-4xl font-semibold text-center text-primary mb-16"
                        >
                            How Our Marketplace Works
                        </motion.h2>
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={container}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <motion.div
                                variants={item}
                                className="text-center p-6 hover:bg-gray-50 rounded-lg transition duration-300"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-blue-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                                >
                                    <span className="text-blue-600 text-2xl font-bold">1</span>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-secondary mb-3">Vendors Join</h3>
                                <p className="text-gray-600">
                                    Quality sellers apply to join our curated marketplace and set up their shops.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={item}
                                className="text-center p-6 hover:bg-gray-50 rounded-lg transition duration-300"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-blue-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                                >
                                    <span className="text-blue-600 text-2xl font-bold">2</span>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-secondary mb-3">Customers Shop</h3>
                                <p className="text-gray-600">
                                    Buyers discover unique products from multiple sellers in one seamless experience.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={item}
                                className="text-center p-6 hover:bg-gray-50 rounded-lg transition duration-300"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-blue-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                                >
                                    <span className="text-blue-600 text-2xl font-bold">3</span>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-secondary mb-3">Secure Transactions</h3>
                                <p className="text-gray-600">
                                    We handle payments securely and ensure smooth order fulfillment.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 md:py-24 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <motion.h2
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={item}
                            className="text-3xl md:text-4xl font-bold text-center text-primary mb-4"
                        >
                            Meet The Team
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={item}
                            className="text-center text-secondary max-w-2xl mx-auto mb-16 text-lg"
                        >
                            The passionate people behind our marketplace's success
                        </motion.p>
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={container}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
                        >
                            {[
                                { name: "Alex Johnson", role: "Founder & CEO", image: "/team.jpg" },
                                { name: "Sarah Williams", role: "Head of Vendor Success", image: "/team.jpg" },
                                { name: "Michael Chen", role: "CTO", image: "/team.jpg" },
                                { name: "Priya Patel", role: "Marketing Director", image: "/team.jpg" },
                            ].map((member, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                                >
                                    <div className="relative h-64 md:h-72">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition duration-300 ease-in-out"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                                        <p className="text-blue-800">{member.role}</p>
                                    </div>
                                </motion.div>

                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <motion.section
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={scaleUp}
                    className="py-20 md:py-28"
                >
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Ready to Join Our Marketplace?</h2>
                        <p className="text-xl mb-8 max-w-4xl mx-auto text-black">
                            Whether you're a vendor looking to grow your business or a shopper seeking unique products, we've got you covered.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/vendorApplicationForm" passHref>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-300"
                                >
                                    Become a Vendor
                                </motion.button>
                            </Link>
                            <Link href="/viewAllProduct" passHref>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition duration-300"
                                >
                                    Start shopping
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </div>
        </>
    );
}