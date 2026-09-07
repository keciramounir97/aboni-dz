import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { HealthModule } from './modules/health/health.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { FaqsModule } from './modules/faq/faqs.module';
import { BlogModule } from './modules/blog/blog.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ActivityLogsModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ContactsModule,
    NewsletterModule,
    UploadsModule,
    HealthModule,
    ReviewsModule,
    WishlistModule,
    CouponsModule,
    FaqsModule,
    BlogModule,
    TestimonialsModule,
    SettingsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
