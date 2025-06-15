export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <p className="mb-6">
              This Cookie Policy explains how WebSync ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website, use our AI-powered website monitoring platform, or interact with our mobile applications. This policy should be read alongside our Privacy Policy and Terms of Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
            
            <p className="mb-6">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website or use an application. They help websites remember information about your visit, such as your preferences and login status, making your next visit easier and the site more useful to you.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Cookies</h2>
            
            <p className="mb-4">WebSync uses cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Keep you signed in to your monitoring dashboard</li>
              <li>Remember your dashboard preferences and customizations</li>
              <li>Store your alert notification settings</li>
              <li>Analyze how you use our service to improve performance</li>
              <li>Provide personalized monitoring recommendations</li>
              <li>Enhance the security of your account</li>
              <li>Remember your mobile app preferences</li>
              <li>Optimize our AI algorithms based on usage patterns</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Essential Cookies</h3>
            <p className="mb-4">These cookies are necessary for the website to function properly and cannot be disabled.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold">Cookie Name</th>
                    <th className="text-left py-2 font-semibold">Purpose</th>
                    <th className="text-left py-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">websync_session</td>
                    <td className="py-2">Maintains your login session</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">csrf_token</td>
                    <td className="py-2">Security protection against attacks</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">auth_token</td>
                    <td className="py-2">Authentication verification</td>
                    <td className="py-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">websync_preferences</td>
                    <td className="py-2">Dashboard layout and settings</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Functional Cookies</h3>
            <p className="mb-4">These cookies enhance functionality and personalization but are not essential for basic operation.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold">Cookie Name</th>
                    <th className="text-left py-2 font-semibold">Purpose</th>
                    <th className="text-left py-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">dashboard_theme</td>
                    <td className="py-2">Remember dark/light mode preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">timezone_preference</td>
                    <td className="py-2">Display times in your local timezone</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">alert_settings</td>
                    <td className="py-2">Notification preferences and thresholds</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">graph_preferences</td>
                    <td className="py-2">Chart types and display options</td>
                    <td className="py-2">6 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Analytics Cookies</h3>
            <p className="mb-4">These cookies help us understand how you use WebSync so we can improve our service.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold">Cookie Name</th>
                    <th className="text-left py-2 font-semibold">Purpose</th>
                    <th className="text-left py-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">_ga</td>
                    <td className="py-2">Google Analytics - distinguish users</td>
                    <td className="py-2">2 years</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">_ga_XXXXXXXXXX</td>
                    <td className="py-2">Google Analytics - session tracking</td>
                    <td className="py-2">2 years</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">websync_analytics</td>
                    <td className="py-2">Internal usage analytics</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">feature_usage</td>
                    <td className="py-2">Track feature adoption and usage</td>
                    <td className="py-2">6 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Performance Cookies</h3>
            <p className="mb-4">These cookies help us optimize our AI algorithms and service performance.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold">Cookie Name</th>
                    <th className="text-left py-2 font-semibold">Purpose</th>
                    <th className="text-left py-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">ai_optimization</td>
                    <td className="py-2">Optimize AI prediction accuracy</td>
                    <td className="py-2">3 months</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">monitoring_patterns</td>
                    <td className="py-2">Improve monitoring algorithms</td>
                    <td className="py-2">6 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">performance_metrics</td>
                    <td className="py-2">Dashboard loading optimization</td>
                    <td className="py-2">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Third-Party Cookies</h2>
            
            <p className="mb-4">We may use third-party services that set cookies on our behalf:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Google Analytics</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Helps us understand website usage and user behavior</li>
              <li>Provides insights into feature adoption and performance</li>
              <li>Data is anonymized and aggregated</li>
              <li>You can opt-out using Google's opt-out browser add-on</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Stripe (Payment Processing)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Processes subscription payments securely</li>
              <li>Prevents fraudulent transactions</li>
              <li>Required for billing functionality</li>
              <li>Subject to Stripe's privacy policy</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Intercom (Customer Support)</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Powers our in-app chat support</li>
              <li>Remembers your support conversation history</li>
              <li>Personalizes support experience</li>
              <li>Subject to Intercom's privacy policy</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Mobile App Data</h2>
            
            <p className="mb-4">Our iOS and Android apps use similar technologies to cookies:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Local Storage:</strong> App preferences and cached monitoring data</li>
              <li><strong>Push Notification Tokens:</strong> Deliver alerts to your device</li>
              <li><strong>Device Identifiers:</strong> Secure authentication and app analytics</li>
              <li><strong>Offline Data:</strong> Display monitoring data when offline</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Browser Settings</h3>
            <p className="mb-4">You can control cookies through your browser settings:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">WebSync Cookie Preferences</h3>
            <p className="mb-4">You can manage your cookie preferences in your account settings:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Navigate to Account Settings → Privacy & Cookies</li>
              <li>Toggle analytics and performance cookies on/off</li>
              <li>Choose your data retention preferences</li>
              <li>Export or delete your stored preferences</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> Disabling essential cookies may affect the functionality of your WebSync dashboard and monitoring services. Some features may not work properly without these cookies.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Do Not Track</h2>
            
            <p className="mb-6">
              Some browsers include a "Do Not Track" feature that lets you tell websites you don't want to be tracked. Currently, there is no industry standard for how to respond to Do Not Track signals. We continue to monitor developments in this area and may update our practices accordingly.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Retention</h2>
            
            <p className="mb-4">We retain cookie data for the following periods:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Stored for the duration specified in each cookie</li>
              <li><strong>Analytics Data:</strong> Anonymized and retained for up to 26 months</li>
              <li><strong>Preference Cookies:</strong> Retained until you change settings or delete them</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">International Transfers</h2>
            
            <p className="mb-6">
              Some of our third-party service providers may transfer and process cookie data outside your country of residence. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses and adequacy decisions where applicable.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Updates to This Policy</h2>
            
            <p className="mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            
            <p className="mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Email:</strong>websyncai@gmail.com</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This Cookie Policy is specifically designed for WebSync's AI-powered website monitoring platform, covering our web dashboard, mobile applications, and all monitoring-related services.
              </p>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>GDPR & CCPA Compliance:</strong> This policy is designed to comply with GDPR, CCPA, and other major privacy regulations. Users in applicable jurisdictions have additional rights regarding their cookie data as outlined in our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}