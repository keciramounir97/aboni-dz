import { StaticPage } from './StaticPage';

export default function ShippingPage() {
  return (
    <StaticPage title="Shipping & Delivery" subtitle="How we deliver your digital subscriptions" sections={[
      { heading: 'Digital Delivery', body: <p>All Aboni products are digital subscriptions—there is no physical shipping. Your subscription credentials are delivered electronically to your account on our website.</p> },
      { heading: 'Delivery Time', body: <p>Delivery occurs after your payment is approved. Most orders are delivered within 5-30 minutes. Complex or custom accounts may take up to 2 hours. You will receive a notification when your credentials are ready.</p> },
      { heading: 'How to Access Your Credentials', body: <p>Once delivered, your subscription details appear on your order page under "My Orders → Order Details." The credentials include username, password, and any additional information needed to access your subscription.</p> },
      { heading: 'Order Statuses', body: <p>Your order goes through the following statuses: Awaiting Payment → Payment Submitted → Approved → Delivered. You can track your order status in real-time on your orders page. If your order is rejected, you will be notified with the reason.</p> },
      { heading: 'Payment Verification', body: <p>After uploading your payment proof, our team verifies it manually. Verification typically takes 5-15 minutes during business hours. Outside business hours, verification may take longer. You can speed up the process by uploading a clear, complete payment receipt.</p> },
      { heading: 'Issues with Delivery', body: <p>If you do not receive your credentials within 2 hours of payment approval, contact our support team immediately. Include your order number and we will investigate the delay. Most delivery issues are resolved within minutes of contacting support.</p> },
    ]} />
  );
}
