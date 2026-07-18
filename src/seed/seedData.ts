import dotenv from "dotenv";
dotenv.config();

import { db } from "../config/db";
import bcrypt from "bcryptjs";

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Seed demo user
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ email: "demo@wayfarer.com" });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Demo@123", salt);
      await usersCollection.insertOne({
        name: "Demo User",
        email: "demo@wayfarer.com",
        password: hashedPassword,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Demo user created: demo@wayfarer.com / Demo@123");
    } else {
      console.log("ℹ️  Demo user already exists");
    }

    // Seed admin user
    const adminUser = await usersCollection.findOne({ email: "admin@wayfarer.com" });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@123", salt);
      await usersCollection.insertOne({
        name: "Admin User",
        email: "admin@wayfarer.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Admin user created: admin@wayfarer.com / Admin@123");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Seed items
    const itemsCollection = db.collection("items");
    const existingItems = await itemsCollection.countDocuments();

    if (existingItems === 0) {
      const items = [
        {
          title: "Luxury Beachfront Villa",
          shortDescription: "Stunning 5-bedroom villa with private beach access and infinity pool overlooking the ocean.",
          fullDescription: "Experience the ultimate beachfront luxury in this stunning 5-bedroom villa. Featuring an infinity pool that blends seamlessly with the ocean horizon, a private chef kitchen, and floor-to-ceiling windows offering panoramic sea views. Each bedroom comes with an en-suite bathroom, smart home technology, and a private balcony. The property includes a tropical garden, outdoor dining area, and direct access to a pristine white sand beach.",
          category: "Villa",
          price: 850,
          location: "Maldives",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
          ],
          rating: 4.9,
          userId: "seed",
          userName: "Demo User",
          date: "2026-06-01",
          featured: true,
          views: 1250,
          reviews: [
            { userId: "1", userName: "Sarah M.", rating: 5, comment: "Absolutely breathtaking! The view from the infinity pool is unforgettable.", createdAt: new Date("2026-05-15") },
            { userId: "2", userName: "James K.", rating: 5, comment: "World-class service and amenities. Every detail was perfect.", createdAt: new Date("2026-05-10") },
          ],
          createdAt: new Date("2026-01-15"),
          updatedAt: new Date("2026-05-01"),
        },
        {
          title: "Mountain Retreat Cabin",
          shortDescription: "Cozy log cabin nestled in the mountains with hot tub and stunning valley views.",
          fullDescription: "Escape to this charming log cabin surrounded by towering pines and mountain peaks. This cozy retreat features a stone fireplace, a private hot tub on the deck, a fully equipped kitchen, and two comfortable bedrooms. Enjoy hiking trails right from your doorstep, stargaze from the outdoor fire pit, and wake up to breathtaking sunrise views over the valley. The perfect getaway for nature lovers and couples.",
          category: "Cabin",
          price: 320,
          location: "Swiss Alps",
          images: [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
            "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
          ],
          rating: 4.7,
          userId: "seed",
          userName: "Demo User",
          date: "2026-05-15",
          featured: true,
          views: 890,
          reviews: [
            { userId: "3", userName: "Emily R.", rating: 4, comment: "Magical mountain escape. The hot tub under the stars was incredible.", createdAt: new Date("2026-04-20") },
          ],
          createdAt: new Date("2026-02-10"),
          updatedAt: new Date("2026-04-15"),
        },
        {
          title: "Modern City Apartment",
          shortDescription: "Sleek downtown apartment with skyline views, gym access, and rooftop terrace.",
          fullDescription: "Live in the heart of the city in this modern, fully-furnished apartment. The open-plan living space features floor-to-ceiling windows showcasing the stunning skyline. Enjoy access to world-class amenities including a fitness center, rooftop terrace with panoramic views, concierge service, and secure parking. Walking distance to fine dining, shopping, and entertainment districts.",
          category: "Apartment",
          price: 450,
          location: "New York, USA",
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
          ],
          rating: 4.5,
          userId: "seed",
          userName: "Demo User",
          date: "2026-04-20",
          featured: false,
          views: 2100,
          reviews: [
            { userId: "4", userName: "Michael T.", rating: 5, comment: "Perfect location, stunning views. Felt like a true New Yorker.", createdAt: new Date("2026-03-25") },
          ],
          createdAt: new Date("2026-03-01"),
          updatedAt: new Date("2026-04-01"),
        },
        {
          title: "Tropical Beach Resort",
          shortDescription: "All-inclusive beach resort with overwater bungalows and coral reef access.",
          fullDescription: "Discover paradise at this 5-star beach resort featuring luxurious overwater bungalows, pristine coral reefs perfect for snorkeling, multiple infinity pools, a world-class spa, and gourmet dining experiences. Each bungalow has a glass floor panel to view marine life, a private sundeck, and direct lagoon access. All-inclusive packages available.",
          category: "Resort",
          price: 1200,
          location: "Bora Bora",
          images: [
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
            "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800",
          ],
          rating: 4.8,
          userId: "seed",
          userName: "Demo User",
          date: "2026-06-10",
          featured: true,
          views: 3400,
          reviews: [
            { userId: "5", userName: "Lisa W.", rating: 5, comment: "The overwater bungalow was a dream come true! Absolute paradise.", createdAt: new Date("2026-05-28") },
            { userId: "6", userName: "David C.", rating: 5, comment: "Best vacation of our lives. The snorkeling was world-class.", createdAt: new Date("2026-05-20") },
          ],
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-05-10"),
        },
        {
          title: "Historic Downtown Loft",
          shortDescription: "Converted warehouse loft with exposed brick, high ceilings, and industrial charm.",
          fullDescription: "Stay in a piece of history in this beautifully converted warehouse loft. The space features original exposed brick walls, 20-foot ceilings with wooden beams, polished concrete floors, and oversized windows flooding the space with natural light. The open-concept kitchen and living area are perfect for entertaining. Located in the trendy arts district with galleries, cafes, and boutiques steps away.",
          category: "Apartment",
          price: 280,
          location: "London, UK",
          images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
          ],
          rating: 4.6,
          userId: "seed",
          userName: "Demo User",
          date: "2026-03-01",
          featured: false,
          views: 1560,
          reviews: [
            { userId: "7", userName: "Olivia H.", rating: 5, comment: "Incredible space! The exposed brick and high ceilings are stunning.", createdAt: new Date("2026-02-15") },
          ],
          createdAt: new Date("2026-02-01"),
          updatedAt: new Date("2026-02-20"),
        },
        {
          title: "Desert Oasis Villa",
          shortDescription: "Private desert villa with infinity pool, palm garden, and panoramic dune views.",
          fullDescription: "Immerse yourself in luxury at this stunning desert villa. Featuring a temperature-controlled infinity pool overlooking endless sand dunes, a lush palm garden oasis, traditional architecture with modern amenities, and a rooftop terrace perfect for stargazing. Enjoy camel treks, desert safaris, and gourmet dining under the stars. An unforgettable Arabian nights experience.",
          category: "Villa",
          price: 680,
          location: "Dubai, UAE",
          images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          ],
          rating: 4.4,
          userId: "seed",
          userName: "Demo User",
          date: "2026-05-05",
          featured: false,
          views: 780,
          reviews: [
            { userId: "8", userName: "Ahmed S.", rating: 4, comment: "Unique desert experience. The sunset views from the pool are unparalleled.", createdAt: new Date("2026-04-10") },
          ],
          createdAt: new Date("2026-03-15"),
          updatedAt: new Date("2026-04-05"),
        },
        {
          title: "Lakeside Family Cabin",
          shortDescription: "Spacious family cabin with private dock, kayaks, and stunning lakefront access.",
          fullDescription: "Create unforgettable family memories at this spacious lakeside cabin. With direct lake access, a private dock, kayaks, and a rowboat included, adventure awaits right outside your door. The cabin features a great room with a stone fireplace, a game room, a fully equipped kitchen, and a wrap-around porch with lake views. Perfect for families or groups of friends.",
          category: "Cabin",
          price: 380,
          location: "Lake Tahoe, USA",
          images: [
            "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800",
          ],
          rating: 4.3,
          userId: "seed",
          userName: "Demo User",
          date: "2026-06-20",
          featured: false,
          views: 450,
          reviews: [],
          createdAt: new Date("2026-04-01"),
          updatedAt: new Date("2026-05-15"),
        },
        {
          title: "Santorini Cliff Suite",
          shortDescription: "Iconic white-washed suite with private plunge pool and caldera sunset views.",
          fullDescription: "Experience the magic of Santorini from this breathtaking cliffside suite. Carved into the caldera, this white-washed paradise features a private plunge pool with infinity edge overlooking the Aegean Sea, a cave-style bedroom carved from volcanic rock, and a terrace with the most famous sunset views in the world. Includes daily breakfast delivered to your terrace and VIP access to local wineries.",
          category: "Resort",
          price: 950,
          location: "Santorini, Greece",
          images: [
            "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
            "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
          ],
          rating: 4.9,
          userId: "seed",
          userName: "Demo User",
          date: "2026-07-01",
          featured: true,
          views: 5200,
          reviews: [
            { userId: "9", userName: "Sophia L.", rating: 5, comment: "The sunset from our private plunge pool was absolutely magical!", createdAt: new Date("2026-06-15") },
            { userId: "10", userName: "Nikos P.", rating: 5, comment: "Perfect honeymoon destination. Every detail was romantic and luxurious.", createdAt: new Date("2026-06-08") },
          ],
          createdAt: new Date("2026-01-05"),
          updatedAt: new Date("2026-06-01"),
        },
        {
          title: "Urban Chic Studio",
          shortDescription: "Trendy micro-apartment with smart home features, walking distance to hotspots.",
          fullDescription: "Experience the future of urban living in this meticulously designed micro-apartment. Smart home technology controls lighting, temperature, and entertainment. The space-saving design includes a Murphy bed, fold-down desk, and modular furniture. A communal rooftop garden, co-working space, and gym are just an elevator ride away. Perfect for digital nomads and city explorers.",
          category: "Apartment",
          price: 180,
          location: "Tokyo, Japan",
          images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          ],
          rating: 4.2,
          userId: "seed",
          userName: "Demo User",
          date: "2026-04-10",
          featured: false,
          views: 3200,
          reviews: [],
          createdAt: new Date("2026-03-20"),
          updatedAt: new Date("2026-04-01"),
        },
        {
          title: "Wine Country Estate",
          shortDescription: "Grand vineyard estate with wine cellar, pool, and panoramic valley views.",
          fullDescription: "Live like royalty at this magnificent vineyard estate. Set on 50 acres of rolling vineyards, the estate features a 6-bedroom main house, a private wine cellar with tasting room, a saltwater pool overlooking the valley, and a gourmet chef's kitchen. Enjoy private wine tours, truffle hunting, and farm-to-table dining experiences. The ultimate luxury escape for wine enthusiasts.",
          category: "Villa",
          price: 1500,
          location: "Tuscany, Italy",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
          ],
          rating: 4.7,
          userId: "seed",
          userName: "Demo User",
          date: "2026-08-01",
          featured: true,
          views: 1800,
          reviews: [
            { userId: "11", userName: "Marco V.", rating: 5, comment: "An absolute paradise for wine lovers. The estate is magnificent.", createdAt: new Date("2026-07-10") },
          ],
          createdAt: new Date("2026-02-15"),
          updatedAt: new Date("2026-06-20"),
        },
      ];

      const itemsWithTimestamps = items.map((item) => ({
        ...item,
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date(),
      }));

      await itemsCollection.insertMany(itemsWithTimestamps);
      console.log(`✅ ${items.length} sample items created`);
    } else {
      console.log(`ℹ️  ${existingItems} items already exist in database`);
    }

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
