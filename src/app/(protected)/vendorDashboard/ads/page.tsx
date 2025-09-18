import Link from "next/link"
import AdRequestForm from "./components/adRequestForm"

export default function AdRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="  text-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl text-secondary font-bold mb-4">Advertise With Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Reach thousands of potential customers by showcasing your products on our platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-lg p-6">
              {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Ad Campaign</h2> */}
              <AdRequestForm />
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            {/* Why Advertise Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-primary">Why Advertise With Us?</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reach over 500,000 monthly active shoppers</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Target specific customer segments</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time performance analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Competitive pricing with flexible budgets</span>
                </li>
              </ul>
            </div>

            {/* Pricing Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium text-primary mb-4">Advertising Packages</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Homepage Banner</span>
                    <span className="text-primary">$500/week</span>
                  </div>
                  <p className="text-sm text-gray-500">Premium visibility on our homepage</p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Sidebar Ad</span>
                    <span className="text-primary">$250/week</span>
                  </div>
                  <p className="text-sm text-gray-500">Displayed across all category pages</p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Product Page</span>
                    <span className="text-primary">$150/week</span>
                  </div>
                  <p className="text-sm text-gray-500">Target specific product audiences</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email Newsletter</span>
                    <span className="text-primary">$300/campaign</span>
                  </div>
                  <p className="text-sm text-gray-500">Featured in our weekly newsletter</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <blockquote>
                <p className="text-gray-600 italic mb-4">
                  "Our sales increased by 40% after running ads on this platform. The targeting options and analytics helped us optimize our campaign for maximum ROI."
                </p>
                <footer className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full mr-3"
                    src="https://randomuser.me/api/portraits/women/42.jpg"
                    alt="Sarah Johnson"
                  />
                  <div>
                    <p className="text-gray-900 font-medium">Sarah Johnson</p>
                    <p className="text-gray-500 text-sm">Marketing Director, Fashion Boutique</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">How long does ad approval take?</h3>
              <p className="text-gray-600">
                Most ads are reviewed within 24-48 hours. During peak seasons, it may take up to 72 hours. You'll receive an email notification once your ad is approved or if any changes are needed.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">What image formats do you accept?</h3>
              <p className="text-gray-600">
                We accept JPG, PNG, and GIF files up to 5MB in size. Each ad position has specific dimension requirements which are shown when you select the position in the form.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Can I edit my ad after submission?</h3>
              <p className="text-gray-600">
                Yes, you can request edits to your ad before it's approved. After approval, changes may require re-approval. Contact our support team for assistance with active campaigns.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">How do payments work?</h3>
              <p className="text-gray-600">
                We accept all major credit cards. Payment is processed when your ad is approved. For long-term campaigns, we offer monthly billing options with discounted rates.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-primary rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl text-secondary font-bold mb-4">Need Help With Your Campaign?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Our advertising specialists can help you create an effective campaign tailored to your business goals.
          </p>
          <Link href="/contact">
            <button className="bg-secondary px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
              Contact Our Ad Team
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}