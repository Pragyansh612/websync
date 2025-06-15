export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <p className="mb-6">
              Welcome to WebSync, the AI-powered website monitoring platform. These Terms of Service ("Terms") govern your use of our services, website, and mobile applications. By accessing or using WebSync, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Service Description</h2>
            
            <p className="mb-4">WebSync provides comprehensive website monitoring services including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Real-time Monitoring:</strong> 24/7 website monitoring from our global network with customizable check intervals as low as 10 seconds</li>
              <li><strong>AI-Powered Analysis:</strong> Advanced AI algorithms for predictive anomaly detection, pattern recognition, and automated root cause analysis</li>
              <li><strong>Performance Analytics:</strong> Interactive graphs, historical data analysis, and customizable dashboards</li>
              <li><strong>Alert System:</strong> Instant notifications via email and mobile push notifications with customizable thresholds</li>
              <li><strong>SSL Monitoring:</strong> Certificate validity monitoring with expiration alerts and security vulnerability checks</li>
              <li><strong>Mobile Applications:</strong> iOS and Android apps with push notifications and responsive dashboard access</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Account Registration and Eligibility</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Eligibility</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>You must be at least 18 years old to use WebSync</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>One person or entity may not maintain multiple free accounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Account Security</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>We recommend enabling multi-factor authentication</li>
              <li>You must not share your account credentials with others</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Permitted Use</h3>
            <p className="mb-4">You may use WebSync to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Monitor websites that you own or have explicit permission to monitor</li>
              <li>Analyze performance data for legitimate business purposes</li>
              <li>Receive alerts and notifications about website status</li>
              <li>Access historical monitoring data within your subscription limits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Prohibited Activities</h3>
            <p className="mb-4">You must not:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Monitor websites without proper authorization</li>
              <li>Use our service to perform DDoS attacks or excessive requests</li>
              <li>Attempt to reverse engineer or circumvent our AI algorithms</li>
              <li>Share or resell access to our monitoring data</li>
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt our services or servers</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Subscription Plans and Billing</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Subscription Terms</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Subscription fees are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days' notice to existing customers</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Monitoring Limits</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Each plan includes specific limits on monitored websites and check frequency</li>
              <li>Exceeding limits may result in additional charges or service restrictions</li>
              <li>Historical data retention varies by subscription plan</li>
              <li>AI analysis features may have usage limitations based on your plan</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cancellation</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>You may cancel your subscription at any time</li>
              <li>Cancellation takes effect at the end of your current billing period</li>
              <li>You retain access to paid features until the end of your billing period</li>
              <li>We may retain your data for 30 days after cancellation</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. AI and Data Processing</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">AI-Powered Features</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Our AI algorithms continuously learn from monitoring data to improve accuracy</li>
              <li>Predictive analytics are based on historical patterns and may not be 100% accurate</li>
              <li>AI recommendations are advisory and should be evaluated by qualified personnel</li>
              <li>We do not guarantee the accuracy of AI-generated insights or predictions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Processing</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>We process monitoring data to provide our services and improve our algorithms</li>
              <li>Anonymized data may be used for machine learning model training</li>
              <li>We comply with applicable data protection laws and regulations</li>
              <li>You retain ownership of your website data and monitoring configurations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Service Availability and Performance</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Level</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>We strive to maintain 99.9% uptime for our monitoring services</li>
              <li>Scheduled maintenance will be announced in advance when possible</li>
              <li>Our global monitoring network provides redundancy and reliability</li>
              <li>Mobile apps and dashboard access are subject to the same availability standards</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Limitations</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Monitoring accuracy depends on network conditions and target website availability</li>
              <li>SSL certificate monitoring relies on publicly available certificate information</li>
              <li>Alert delivery times may vary based on notification method and external factors</li>
              <li>AI predictions are estimates and should not be relied upon as guarantees</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Our Rights</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>WebSync, our logo, and proprietary technology are protected by intellectual property laws</li>
              <li>Our AI algorithms, monitoring infrastructure, and software are proprietary</li>
              <li>You may not copy, modify, or reverse engineer our services</li>
              <li>All improvements and enhancements to our service remain our property</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Your Rights</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>You retain ownership of your website content and data</li>
              <li>You grant us permission to monitor your specified websites</li>
              <li>You may export your monitoring data at any time</li>
              <li>Your monitoring configurations and custom settings remain yours</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Privacy and Data Protection</h2>
            
            <p className="mb-6">
              Our Privacy Policy, which is incorporated by reference into these Terms, explains how we collect, use, and protect your information. By using WebSync, you consent to our data practices as described in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Service Disclaimers</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>WebSync is provided "as is" without warranties of any kind</li>
              <li>We do not guarantee that our service will be error-free or uninterrupted</li>
              <li>AI predictions and analysis are estimates and may not be accurate</li>
              <li>We are not responsible for the availability or performance of monitored websites</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Limitation of Liability</h3>
            <p className="mb-4">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Our total liability is limited to the amount you paid in the last 12 months</li>
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>We are not responsible for data loss or business interruption</li>
              <li>You are responsible for implementing your own backup and redundancy measures</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Indemnification</h2>
            
            <p className="mb-6">
              You agree to indemnify and hold WebSync harmless from any claims, damages, or expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Termination by You</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>You may terminate your account at any time</li>
              <li>Termination does not entitle you to a refund of prepaid fees</li>
              <li>You are responsible for exporting any data you wish to retain</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Termination by Us</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>We may suspend or terminate accounts for Terms violations</li>
              <li>We may terminate accounts for non-payment after reasonable notice</li>
              <li>We may discontinue the service with 90 days' notice</li>
              <li>Upon termination, your data will be deleted according to our data retention policy</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Modifications to Terms</h2>
            
            <p className="mb-6">
              We may modify these Terms from time to time. We will provide notice of material changes via email or through our service. Your continued use after changes constitutes acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Governing Law and Disputes</h2>
            
            <ul className="list-disc pl-6 mb-6">
              <li>These Terms are governed by law</li>
              <li>Disputes will be resolved through binding arbitration when possible</li>
              <li>You may seek injunctive relief in courts of competent jurisdiction</li>
              <li>Class action lawsuits are waived to the extent permitted by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
            
            <p className="mb-4">
              For questions about these Terms or our services, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Email:</strong>websyncai@gmail.com</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These terms are specifically tailored for WebSync's AI-powered website monitoring platform, including our unique features such as predictive analytics, global monitoring network, comprehensive alerting system, and mobile applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}