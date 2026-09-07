import { StaticPage } from './StaticPage';

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" subtitle="Your privacy is important to us" sections={[
      { heading: '1. Information We Collect', body: <p>We collect information you provide directly, such as your name, email, and order details. We also collect technical data including IP address, browser type, and usage patterns to improve our services.</p> },
      { heading: '2. How We Use Your Information', body: <p>Your information is used to process orders, deliver subscriptions, communicate with you about your orders, improve our services, and prevent fraud. We do not sell your personal information to third parties.</p> },
      { heading: '3. Data Security', body: <p>We implement industry-standard security measures to protect your personal information. Passwords are hashed using bcrypt, and all data is stored securely. However, no method of transmission over the Internet is 100% secure.</p> },
      { heading: '4. Cookies', body: <p>Aboni uses cookies and local storage to maintain your session, remember language preferences, and improve user experience. You can disable cookies in your browser settings, but some features may not function properly.</p> },
      { heading: '5. Data Retention', body: <p>We retain your account information and order history for as long as your account is active. Inactive accounts may be deleted after 2 years. Transaction records are kept for legal and accounting purposes.</p> },
      { heading: '6. Your Rights', body: <p>You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. To exercise these rights, contact us at support@aboni.dz.</p> },
      { heading: '7. Third-Party Services', body: <p>We do not share your data with third parties except as necessary to deliver our services (e.g., payment verification) or as required by law. Third-party providers have their own privacy policies.</p> },
      { heading: '8. Children\'s Privacy', body: <p>Aboni is not intended for users under 16 years old. We do not knowingly collect personal information from children. If you believe a child has provided us with information, contact us for removal.</p> },
    ]} />
  );
}
