import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // FAQs
  await knex('faqs').del();
  await knex('faqs').insert([
    {
      question_en: 'How do I receive my subscription after payment?',
      question_fr: 'Comment reçois-je mon abonnement après paiement ?',
      question_ar: 'كيف أستلم اشتراكي بعد الدفع؟',
      answer_en: 'Once your payment is approved, the delivery credentials are instantly added to your order page. You can view them under My Orders → Order details.',
      answer_fr: 'Une fois votre paiement approuvé, les identifiants sont ajoutés instantanément à votre page de commande. Consultez Mes commandes → Détails.',
      answer_ar: 'بمجرد الموافقة على الدفع، تُضاف بيانات التسليم فوراً إلى صفحة طلبك. يمكنك عرضها في طلباتي ← التفاصيل.',
      category: 'orders', sort_order: 1, is_active: true,
    },
    {
      question_en: 'What payment methods do you accept?',
      question_fr: 'Quels modes de paiement acceptez-vous ?',
      question_ar: 'ما طرق الدفع المقبولة؟',
      answer_en: 'We accept local bank transfers (CCP, Edahabia), BaridiMob, and cash via trusted agents. Upload your payment proof and we verify within minutes.',
      answer_fr: 'Nous acceptons les virements locaux (CCP, Edahabia), BaridiMob et le cash via agents de confiance. Téléchargez votre preuve de paiement.',
      answer_ar: 'نقبل التحويلات المصرفية المحلية (CCP، الذهبية)، BaridiMob، والنقد عبر وكلاء موثوقين. ارفع إثبات الدفع.',
      category: 'payment', sort_order: 2, is_active: true,
    },
    {
      question_en: 'How long does delivery take?',
      question_fr: 'Combien de temps prend la livraison ?',
      question_ar: 'كم يستغرق التسليم؟',
      answer_en: 'Most orders are delivered within 5–30 minutes after payment approval. Complex accounts may take up to 2 hours.',
      answer_fr: 'La plupart des commandes sont livrées en 5–30 minutes après approbation. Certains comptes peuvent prendre jusqu\'à 2 heures.',
      answer_ar: 'معظم الطلبات تُسلّم خلال 5-30 دقيقة بعد الموافقة على الدفع. قد تستغرق بعض الحسابات حتى ساعتين.',
      category: 'orders', sort_order: 3, is_active: true,
    },
    {
      question_en: 'Can I get a refund?',
      question_fr: 'Puis-je obtenir un remboursement ?',
      question_ar: 'هل يمكنني الحصول على استرداد؟',
      answer_en: 'If an account is not working as described, contact us within 24 hours for a replacement or refund. See our Refund Policy for details.',
      answer_fr: 'Si un compte ne fonctionne pas comme décrit, contactez-nous sous 24h pour un remplacement ou remboursement. Voir notre politique de remboursement.',
      answer_ar: 'إذا لم يعمل الحساب كما هو موصوف، اتصل بنا خلال 24 ساعة للاستبدال أو الاسترداد. راجع سياسة الاسترداد.',
      category: 'payment', sort_order: 4, is_active: true,
    },
    {
      question_en: 'Do I need an account to order?',
      question_fr: 'Dois-je créer un compte pour commander ?',
      question_ar: 'هل أحتاج إلى حساب للطلب؟',
      answer_en: 'Yes, a free Aboni account is required so we can securely deliver your credentials and track your orders.',
      answer_fr: 'Oui, un compte Aboni gratuit est requis pour la livraison sécurisée et le suivi de vos commandes.',
      answer_ar: 'نعم، يلزم حساب Aboni مجاني لتسليم بياناتك بأمان ومتابعة طلباتك.',
      category: 'account', sort_order: 5, is_active: true,
    },
    {
      question_en: 'Are the subscriptions shared or private?',
      question_fr: 'Les abonnements sont-ils partagés ou privés ?',
      question_ar: 'هل الاشتراكات مشتركة أم خاصة؟',
      answer_en: 'We offer both shared and private accounts depending on the product. Private accounts are clearly labeled in the product description.',
      answer_fr: 'Nous proposons des comptes partagés et privés selon le produit. Les comptes privés sont clairement indiqués.',
      answer_ar: 'نقدم حسابات مشتركة وخاصة حسب المنتج. الحسابات الخاصة موضحة بوضوح في وصف المنتج.',
      category: 'account', sort_order: 6, is_active: true,
    },
  ]);

  // Testimonials
  await knex('testimonials').del();
  await knex('testimonials').insert([
    {
      name: 'Yacine B.', role: 'Verified buyer',
      content_en: 'Got my Netflix account in under 10 minutes. Super fast and reliable service!',
      content_fr: 'J\'ai reçu mon compte Netflix en moins de 10 minutes. Service super rapide et fiable !',
      content_ar: 'استلمت حساب نتفليكس في أقل من 10 دقائق. خدمة سريعة وموثوقة جداً!',
      rating: 5, is_active: true,
    },
    {
      name: 'Amina K.', role: 'Verified buyer',
      content_en: 'Best place for Spotify Premium in Algeria. Prices are fair and support is helpful.',
      content_fr: 'Le meilleur endroit pour Spotify Premium en Algérie. Prix corrects et support utile.',
      content_ar: 'أفضل مكان لسبوتيفاي بريميوم في الجزائر. الأسعار مناسبة والدعم مفيد.',
      rating: 5, is_active: true,
    },
    {
      name: 'Karim M.', role: 'Verified buyer',
      content_en: 'Bought PlayStation Plus, worked perfectly. Will definitely order again.',
      content_fr: 'J\'ai acheté PlayStation Plus, fonctionne parfaitement. Je commanderai à nouveau.',
      content_ar: 'اشتريت بلايستيشن بلس، يعمل بشكل مثالي. سأطلب مرة أخرى بالتأكيد.',
      rating: 5, is_active: true,
    },
    {
      name: 'Sara L.', role: 'Verified buyer',
      content_en: 'The payment proof upload is so easy. Got my Xbox Game Pass delivered instantly.',
      content_fr: 'L\'envoi de la preuve de paiement est si simple. Xbox Game Pass livré instantanément.',
      content_ar: 'رفع إثبات الدفع سهل جداً. وصلني إكس بوكس جيم باس فوراً.',
      rating: 4, is_active: true,
    },
  ]);

  // Blog posts
  await knex('blog_posts').del();
  await knex('blog_posts').insert([
    {
      slug: 'best-streaming-services-algeria-2026',
      title_en: 'Best Streaming Services in Algeria for 2026',
      title_fr: 'Meilleurs services de streaming en Algérie pour 2026',
      title_ar: 'أفضل خدمات البث في الجزائر لعام 2026',
      excerpt_en: 'Discover the top streaming platforms available in Algeria and how to get the best deals.',
      excerpt_fr: 'Découvrez les meilleures plateformes de streaming disponibles en Algérie et les meilleures offres.',
      excerpt_ar: 'اكتشف أفضل منصات البث المتاحة في الجزائر وكيفية الحصول على أفضل العروض.',
      content_en: 'Streaming has become essential entertainment in Algeria. With platforms like Netflix, Spotify, and Disney+, there is something for everyone. In this guide, we cover the best options, pricing in DZD, and how Aboni makes them accessible with local payment methods.\n\n## Netflix\nNetflix remains the king of streaming with its vast library of movies and series. A single account gives you access to HD content across devices.\n\n## Spotify Premium\nFor music lovers, Spotify Premium offers ad-free listening, offline downloads, and unlimited skips.\n\n## Disney+\nDisney+ is perfect for families, bringing together Marvel, Star Wars, Pixar, and National Geographic.',
      content_fr: 'Le streaming est devenu un divertissement essentiel en Algérie. Avec Netflix, Spotify et Disney+, il y en a pour tous les goûts.\n\n## Netflix\nNetflix reste le roi du streaming avec sa vaste bibliothèque.\n\n## Spotify Premium\nPour les mélomanes, Spotify Premium offre une écoute sans publicité, des téléchargements hors ligne.\n\n## Disney+\nDisney+ est parfait pour les familles, réunissant Marvel, Star Wars, Pixar.',
      content_ar: 'أصبح البث ترفيهاً أساسياً في الجزائر. مع نتفليكس وسبوتيفاي وديزني+، هناك ما يناسب الجميع.\n\n## نتفليكس\nنتفليكس يبقى ملك البث بمكتبته الواسعة.\n\n## سبوتيفاي بريميوم\nلمحبي الموسيقى، يقدم سبوتيفاي بريميوم استماعاً بدون إعلانات وتنزيلات دون اتصال.\n\n## ديزني+\nديزني+ مثالي للعائلات، يجمع مارفل وستار وورز وبيكسار.',
      tag: 'guides', is_published: true, published_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    },
    {
      slug: 'how-to-pay-locally-aboni',
      title_en: 'How to Pay Locally on Aboni: A Complete Guide',
      title_fr: 'Comment payer localement sur Aboni : Guide complet',
      title_ar: 'كيف تدفع محلياً على Aboni: دليل كامل',
      excerpt_en: 'Learn all the local payment methods available on Aboni, from CCP to BaridiMob.',
      excerpt_fr: 'Découvrez tous les modes de paiement locaux disponibles sur Aboni, du CCP à BaridiMob.',
      excerpt_ar: 'تعرّف على جميع طرق الدفع المحلية المتاحة على Aboni، من CCP إلى BaridiMob.',
      content_en: 'One of the biggest challenges for Algerian users is paying for digital services. Aboni solves this by accepting local payment methods.\n\n## CCP / Edahabia\nYou can transfer the amount to our CCP account and upload the receipt as proof of payment.\n\n## BaridiMob\nBaridiMob is the fastest method — instant transfers that we can verify immediately.\n\n## Cash via Agents\nWe work with trusted agents across major cities for cash payments.\n\nAfter payment, simply upload your proof in the order page and wait for approval.',
      content_fr: 'L\'un des plus grands défis pour les utilisateurs algériens est de payer les services numériques. Aboni résout cela.\n\n## CCP / Edahabia\nTransférez le montant vers notre compte CCP et téléchargez le reçu.\n\n## BaridiMob\nBaridiMob est la méthode la plus rapide — des transferts instantanés.\n\n## Cash via Agents\nNous travaillons avec des agents de confiance.\n\nAprès le paiement, téléchargez votre preuve sur la page de commande.',
      content_ar: 'أحد أكبر التحديات للمستخدمين الجزائريين هو الدفع مقابل الخدمات الرقمية. يحل Aboni هذه المشكلة.\n\n## CCP / الذهبية\nيمكنك تحويل المبلغ إلى حساب CCP الخاص بنا ورفع الإيصال كإثبات.\n\n## BaridiMob\nBaridiMob هي الطريقة الأسرع — تحويلات فورية.\n\n## النقد عبر الوكلاء\nنعمل مع وكلاء موثوقين في المدن الكبرى.\n\nبعد الدفع، ارفع إثباتك في صفحة الطلب.',
      tag: 'guides', is_published: true, published_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    },
    {
      slug: 'spotify-vs-youtube-music',
      title_en: 'Spotify vs YouTube Music: Which is Better?',
      title_fr: 'Spotify vs YouTube Music : Lequel choisir ?',
      title_ar: 'سبوتيفاي أم يوتيوب ميوزيك: أيهما أفضل؟',
      excerpt_en: 'A detailed comparison of two popular music streaming services to help you choose.',
      excerpt_fr: 'Une comparaison détaillée de deux services de streaming musical populaires.',
      excerpt_ar: 'مقارنة مفصلة بين خدمتين شهيرتين لبث الموسيقى لمساعدتك في الاختيار.',
      content_en: 'Both Spotify and YouTube Music are excellent choices for music streaming, but each has its strengths.\n\n## Spotify Premium\nSpotify offers the best music discovery algorithm, collaborative playlists, and podcasts. It has a clean interface and excellent offline support.\n\n## YouTube Music Premium\nYouTube Music gives you access to music videos, remixes, and covers that other platforms don\'t have. Plus, you get YouTube Premium ad-free included.\n\n## Verdict\nIf you love podcasts and music discovery, go with Spotify. If you watch music videos and want YouTube ad-free, YouTube Premium is the better choice.',
      content_fr: 'Spotify et YouTube Music sont excellents, chacun avec ses forces.\n\n## Spotify Premium\nSpotify offre le meilleur algorithme de découverte, des playlists collaboratives et des podcasts.\n\n## YouTube Music Premium\nYouTube Music donne accès à des clips, remixes et reprises. Plus, YouTube Premium sans publicité inclus.\n\n## Verdict\nPour les podcasts et la découverte, choisissez Spotify. Pour les clips vidéo, YouTube Premium.',
      content_ar: 'سبوتيفاي ويوتيوب ميوزيك ممتازان، لكل منهما نقاط قوته.\n\n## سبوتيفاي بريميوم\nيقدم سبوتيفاي أفضل خوارزمية اكتشاف، قوائم تعاونية، ومدونات صوتية.\n\n## يوتيوب ميوزيك بريميوم\nيوتيوب ميوزيك يمنحك الوصول إلى المقاطع والريمكسات والغلاف. بالإضافة إلى يوتيوب بريميوم بدون إعلانات.\n\n## الخلاصة\nإذا تحب المدونات الصوتية والاكتشاف، اختر سبوتيفاي. للمقاطع المرئية، يوتيوب بريميوم.',
      tag: 'comparisons', is_published: true, published_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    },
  ]);

  // Coupons
  await knex('coupons').del();
  await knex('coupons').insert([
    { code: 'WELCOME10', description: '10% off your first order', discount_percent: 10, max_uses: 100, is_active: true },
    { code: 'SPRING20', description: '20% off spring sale', discount_percent: 20, max_uses: 50, is_active: true },
    { code: 'BUNDLE15', description: '15% off bundles', discount_percent: 15, max_uses: 0, is_active: true },
  ]);

  // Settings
  await knex('settings').del();
  await knex('settings').insert([
    { key: 'site_name', value: 'Aboni', category: 'general', is_public: true },
    { key: 'site_description', value: 'Digital subscriptions store for Algeria', category: 'general', is_public: true },
    { key: 'support_email', value: 'support@aboni.dz', category: 'contact', is_public: true },
    { key: 'support_phone', value: '+213 500 000 000', category: 'contact', is_public: true },
    { key: 'ccp_account', value: '0020010100123456 78', category: 'payment', is_public: true },
    { key: 'baridimob_id', value: 'abdouani', category: 'payment', is_public: true },
    { key: 'address', value: 'Algiers, Algeria', category: 'contact', is_public: true },
    { key: 'facebook_url', value: 'https://facebook.com/aboni', category: 'social', is_public: true },
    { key: 'instagram_url', value: 'https://instagram.com/aboni', category: 'social', is_public: true },
    { key: 'free_delivery_threshold', value: '0', category: 'general', is_public: true },
  ]);

  // Activity logs sample
  await knex('activity_logs').del();
  const adminUser = await knex('users').where('role', 'super_admin').first();
  const now = new Date();
  if (adminUser) {
  for (let i = 0; i < 8; i++) {
    const d = new Date(now.getTime() - i * 3600000);
    await knex('activity_logs').insert({
      user_id: adminUser.id, user_name: 'Super Admin',
      action: ['login', 'order_reviewed', 'product_created', 'user_updated', 'login', 'order_reviewed', 'settings_updated', 'login'][i],
      entity: i % 2 === 0 ? 'order' : 'user',
      entity_id: i + 1,
      metadata: JSON.stringify({ note: 'Sample activity' }),
      ip_address: '127.0.0.1',
      created_at: d,
      updated_at: d,
    });
  }
  }
}

export async function down(knex: Knex): Promise<void> {}
