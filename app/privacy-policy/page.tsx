import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-blue-600 text-white dark:bg-blue-800">
          <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-blue-100 dark:text-blue-200">Last updated: May 1, 2023</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
              <p className="lead">
                At NeoCharge, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website or use our services.
              </p>

              <h2>Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when you register for an account, make a
                transaction, or communicate with us. This may include:
              </p>
              <ul>
                <li>Personal identification information (name, email address, phone number, etc.)</li>
                <li>Billing information (payment method details, billing address, etc.)</li>
                <li>Account credentials (username, password, etc.)</li>
                <li>Transaction information (services purchased, payment amounts, etc.)</li>
                <li>Communications (customer support inquiries, feedback, etc.)</li>
              </ul>

              <p>
                We also automatically collect certain information when you visit, use, or navigate our website. This
                information does not reveal your specific identity but may include:
              </p>
              <ul>
                <li>Device and usage information (IP address, browser type, operating system, etc.)</li>
                <li>Usage patterns (pages visited, time spent on pages, etc.)</li>
                <li>Location information (general geographic location based on IP address)</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send administrative information, such as updates to our terms and policies</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Protect our services and users</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>How We Share Your Information</h2>
              <p>We may share your information with:</p>
              <ul>
                <li>
                  Service providers who perform services on our behalf (payment processors, hosting providers, etc.)
                </li>
                <li>
                  Business partners with whom we offer co-branded services or engage in joint marketing activities
                </li>
                <li>
                  Third parties in connection with a business transaction (merger, acquisition, sale of assets, etc.)
                </li>
                <li>Law enforcement or other authorities when required by law or to protect our rights</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information from
                unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over
                the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>

              <h2>Your Rights and Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul>
                <li>Access and update your information through your account settings</li>
                <li>Request access to, correction of, or deletion of your personal information</li>
                <li>Object to or restrict the processing of your personal information</li>
                <li>Data portability (receiving your data in a structured, commonly used format)</li>
                <li>Withdraw consent where we rely on consent to process your information</li>
              </ul>

              <h2>Cookies and Similar Technologies</h2>
              <p>
                We use cookies and similar technologies to collect information about your browsing activities and to
                distinguish you from other users of our website. You can control cookies through your browser settings
                and other tools.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal
                information from children. If you become aware that a child has provided us with personal information,
                please contact us.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@neocharge.com">privacy@neocharge.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
