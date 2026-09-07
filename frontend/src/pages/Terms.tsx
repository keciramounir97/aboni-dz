import { StaticPage } from './StaticPage';

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" subtitle="Last updated: January 2026" sections={[
      { heading: '1. Acceptance of Terms', body: <p>By accessing and using Aboni, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p> },
      { heading: '2. Account Registration', body: <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account and password. Aboni cannot be liable for any loss or damage from your failure to comply with this obligation.</p> },
      { heading: '3. Orders & Payments', body: <p>When you place an order, you agree to pay the listed price using one of our accepted payment methods. Orders are processed after payment verification. We reserve the right to refuse or cancel any order at our discretion.</p> },
      { heading: '4. Subscription Delivery', body: <p>Upon payment approval, we deliver subscription credentials to your account. Delivery times vary but typically range from 5 minutes to 2 hours. Credentials should be kept private and not shared with others.</p> },
      { heading: '5. Refund Policy', body: <p>If a subscription is not working as described, contact us within 24 hours for a replacement or refund. Refunds are issued at our discretion based on the nature of the issue. See our Refund Policy for details.</p> },
      { heading: '6. Prohibited Use', body: <p>You agree not to use Aboni for any unlawful purpose, including fraud, abuse, or resale of credentials. Any violation may result in account suspension and legal action.</p> },
      { heading: '7. Limitation of Liability', body: <p>Aboni is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the amount paid for the subscription in question.</p> },
      { heading: '8. Changes to Terms', body: <p>We reserve the right to modify these terms at any time. Changes are effective immediately upon posting. Continued use of Aboni constitutes acceptance of the updated terms.</p> },
    ]} />
  );
}
