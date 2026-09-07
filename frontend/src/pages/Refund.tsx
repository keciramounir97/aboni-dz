import { StaticPage } from './StaticPage';

export default function RefundPage() {
  return (
    <StaticPage title="Refund Policy" subtitle="We stand behind our subscriptions" sections={[
      { heading: '1. Eligibility for Refunds', body: <p>You are eligible for a refund or replacement if: (a) the subscription credentials do not work as described, (b) the account is suspended or banned before the subscription period ends, or (c) you contact us within 24 hours of delivery with a valid issue.</p> },
      { heading: '2. How to Request a Refund', body: <p>To request a refund, go to your order page and click "Contact Support" or email support@aboni.dz with your order number and a description of the issue. Include screenshots or evidence if possible. Our team will review your request within 24 hours.</p> },
      { heading: '3. Refund Methods', body: <p>Approved refunds are issued via the original payment method. If you paid via CCP or BaridiMob, the refund is sent to the same account. Processing time depends on your bank but typically takes 1-3 business days.</p> },
      { heading: '4. Replacement Policy', body: <p>In most cases, we offer a replacement subscription instead of a monetary refund. This is faster and ensures you get the service you paid for. If a replacement is not available, a full refund will be issued.</p> },
      { heading: '5. Non-Refundable Cases', body: <p>Refunds are not provided if: (a) the subscription was working and you changed your mind, (b) the issue is due to your own account misuse, (c) you shared credentials with others, or (d) the 24-hour window has passed without contacting us.</p> },
      { heading: '6. Dispute Resolution', body: <p>If you are not satisfied with our refund decision, you can escalate the issue by contacting our management team. We are committed to fair and transparent dispute resolution for all our customers.</p> },
    ]} />
  );
}
