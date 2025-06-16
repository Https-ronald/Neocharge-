import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-blue-600 text-white dark:bg-blue-800">
          <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-blue-100 dark:text-blue-200">Last updated: May 1, 2023</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
              <p className="lead">
                These Terms of Service ("Terms") govern your access to and use of the NeoCharge website and services.
                Please read these Terms carefully before using our services.
              </p>

              <h2>Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you
                do not agree to these Terms, you may not access or use our services.
              </p>

              <h2>Description of Services</h2>
              <p>
                NeoCharge provides a platform for digital payments, including airtime recharge, data bundles, TV
                subscriptions, and electricity bill payments. We may add, modify, or remove features from time to time.
              </p>

              <h2>Account Registration</h2>
              <p>
                To use certain features of our services, you may need to create an account. You agree to provide
                accurate, current, and complete information during the registration process and to update such
                information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your account credentials and for all activities that occur under
                your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h2>User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use our services for any illegal purpose or in violation of any laws</li>
                <li>Violate or infringe other people's rights</li>
                <li>Interfere with or disrupt our services</li>
                <li>Attempt to gain unauthorized access to our services or systems</li>
                <li>Use our services to transmit harmful code or content</li>
                <li>Impersonate any person or entity</li>
                <li>Engage in any fraudulent activity</li>
              </ul>

              <h2>Payment Terms</h2>
              <p>
                By making a payment through our services, you agree to pay all charges at the prices then in effect for
                your purchase. You authorize us to charge your chosen payment method for these charges.
              </p>
              <p>
                We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or
                received payment. We also reserve the right to refuse any order placed through our services.
              </p>

              <h2>Service Fees</h2>
              <p>
                We charge service fees for certain transactions as described on our Pricing page. We reserve the right
                to change our service fees at any time, with or without notice.
              </p>

              <h2>Refunds</h2>
              <p>
                Our refund policy varies depending on the service. Generally, we do not provide refunds for completed
                transactions. However, if a transaction fails or a service is not delivered, we will investigate and may
                issue a refund at our discretion.
              </p>

              <h2>Intellectual Property</h2>
              <p>
                Our services and all content and materials included on our website, including but not limited to text,
                graphics, logos, images, and software, are the property of NeoCharge or its licensors and are protected
                by copyright, trademark, and other intellectual property laws.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, NeoCharge shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul>
                <li>Your access to or use of or inability to access or use our services</li>
                <li>Any conduct or content of any third party on our services</li>
                <li>Any content obtained from our services</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>

              <h2>Disclaimer of Warranties</h2>
              <p>
                Our services are provided "as is" and "as available" without warranties of any kind, either express or
                implied, including, but not limited to, implied warranties of merchantability, fitness for a particular
                purpose, or non-infringement.
              </p>

              <h2>Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services at any time, without prior notice or
                liability, for any reason, including if you violate these Terms.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                We may revise these Terms from time to time. The most current version will always be posted on our
                website. By continuing to access or use our services after revisions become effective, you agree to be
                bound by the revised Terms.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to
                its conflict of law provisions.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:terms@neocharge.com">terms@neocharge.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
