export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <p className="mb-6">
              At WebSync, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered website monitoring platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
            <p className="mb-4">When you create an account or use our services, we may collect:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials and authentication data</li>
              <li>Billing and payment information</li>
              <li>Communication preferences for alerts and notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Website Monitoring Data</h3>
            <p className="mb-4">To provide our monitoring services, we collect:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Website URLs and domain information you choose to monitor</li>
              <li>Performance metrics (response times, uptime status, error codes)</li>
              <li>SSL certificate information and expiration dates</li>
              <li>Server response data and HTTP headers</li>
              <li>Geographic location data from our global monitoring network</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">AI Analysis Data</h3>
            <p className="mb-4">Our AI-powered features process:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Historical performance patterns and trends</li>
              <li>Anomaly detection results and predictions</li>
              <li>Root cause analysis findings</li>
              <li>Performance optimization recommendations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Technical Information</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Device information and browser type</li>
              <li>IP addresses and log data</li>
              <li>Usage patterns and feature interactions</li>
              <li>Mobile app usage data and push notification preferences</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Provision</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Monitor your websites 24/7 from our global network</li>
              <li>Perform AI-powered anomaly detection and predictive analysis</li>
              <li>Send real-time alerts and notifications via email and mobile push</li>
              <li>Generate performance analytics and interactive graphs</li>
              <li>Monitor SSL certificate validity and security vulnerabilities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">AI Enhancement</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Improve anomaly detection accuracy through machine learning</li>
              <li>Enhance predictive analytics and pattern recognition</li>
              <li>Provide automated root cause analysis</li>
              <li>Optimize monitoring algorithms for better performance</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Communication</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Send service-related notifications and alerts</li>
              <li>Provide customer support and technical assistance</li>
              <li>Share important updates about our services</li>
              <li>Process billing and account management communications</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Sharing and Disclosure</h2>
            
            <p className="mb-4">We do not sell, trade, or rent your personal information. We may share data only in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Providers</h3>
            <p className="mb-4">We work with trusted third-party providers for:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Cloud hosting and data storage</li>
              <li>Payment processing and billing</li>
              <li>Email delivery and notification services</li>
              <li>Analytics and performance monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Legal Requirements</h3>
            <p className="mb-6">We may disclose information when required by law, court order, or to protect our rights and the safety of our users.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
            
            <p className="mb-4">We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Encryption in transit and at rest</li>
              <li>Secure data centers with physical access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Multi-factor authentication options</li>
              <li>Automated security monitoring and threat detection</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Retention</h2>
            
            <p className="mb-4">We retain your data for the following periods:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Account Information:</strong> Until account deletion plus 30 days</li>
              <li><strong>Monitoring Data:</strong> Up to 2 years for historical analysis</li>
              <li><strong>Performance Metrics:</strong> Varies by subscription plan (30 days to 2 years)</li>
              <li><strong>AI Training Data:</strong> Anonymized data may be retained for model improvement</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
            
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Access and review your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data</li>
              <li>Export your monitoring data</li>
              <li>Opt-out of marketing communications</li>
              <li>Customize alert and notification preferences</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cookies and Tracking</h2>
            
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Maintain your login session</li>
              <li>Remember your dashboard preferences</li>
              <li>Analyze usage patterns to improve our service</li>
              <li>Provide personalized monitoring recommendations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">International Data Transfers</h2>
            
            <p className="mb-6">
              Our global monitoring network means your data may be processed in various countries. We ensure appropriate safeguards are in place for international data transfers and comply with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
            
            <p className="mb-6">
              WebSync is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through our service. Your continued use of WebSync after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Email:</strong>websyncai@gmail.com</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This privacy policy is specifically designed for WebSync's AI-powered website monitoring services. It covers our unique features including predictive analytics, global monitoring network, and comprehensive alerting system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}