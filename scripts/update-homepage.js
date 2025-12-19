const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Page = require("../models/Page");

const updateHomepage = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Delete old home page
    await Page.deleteOne({ slug: "home" });

    // Create new home page with slider content
    const homePage = new Page({
      slug: "home",
      title: "Homepage",
      metaDescription: "Professional funeral services in Liberia",
      content: {
        hero: {
          slides: [
            {
              title: "A.B. Roberts Funeral Home",
              subtitle:
                "Serving Families with Dignity, Care, and Professional Excellence",
              image: "",
            },
            {
              title: "Honoring Life With Dignity",
              subtitle:
                "Providing professional funeral services with compassion, care, and respect.",
              image: "",
            },
            {
              title: "Trusted Care When It Matters Most",
              subtitle:
                "Serving families with excellence, professionalism, and understanding.",
              image: "",
            },
          ],
        },
        welcome: {
          title: "Welcome to A.B. Roberts Funeral Home",
          paragraph1:
            "A.B. Roberts Funeral Home is a trusted funeral service provider committed to offering respectful and professional care to families across Liberia.",
          paragraph2:
            "With modern facilities, experienced staff, and a strong sense of compassion, we stand with families during moments of loss, providing support, guidance, and dignified services.",
          quote:
            "Our goal is to ensure that every farewell is handled with the utmost care, respect, and professionalism.",
        },
        services: {
          title: "Our Funeral Services",
          intro:
            "We offer a range of carefully designed funeral service packages to meet the needs and preferences of families. Each service is handled with professionalism, attention to detail, and respect for cultural and family values.",
          highlights: [
            "Professional embalming services",
            "Chapel and quiet hour services",
            "Video recording and live coverage",
            "Quality caskets and memorial items",
            "Conveyance and logistical support",
          ],
          note: "Full service details and pricing are available on our Services page.",
        },
        facilities: {
          title: "Our Facilities",
          paragraph1:
            "Our facilities are designed to provide comfort, privacy, and a peaceful environment for families and guests. We maintain modern and well-equipped spaces including our chapel, conference rooms, offices, showroom, and administrative building.",
          paragraph2:
            "Each area is carefully maintained to reflect dignity, order, and respect.",
        },
        commitment: {
          title: "Our Commitment to Families",
          paragraph1:
            "At A.B. Roberts Funeral Home, we understand that every family's needs are unique. Our team is committed to listening, guiding, and supporting you through every step of the process.",
          paragraph2:
            "We take pride in offering services that are both professional and compassionate.",
        },
        cta: {
          heading: "We Are Here to Support You",
          description:
            "Our compassionate team is available to assist you and provide guidance during this difficult time. We are committed to serving your family with dignity and care.",
          footer:
            "Available to serve families across Liberia with professionalism and compassion",
        },
      },
    });

    await homePage.save();
    console.log("✅ Homepage updated with slider functionality!");

    process.exit(0);
  } catch (error) {
    console.error("Error updating homepage:", error.message);
    process.exit(1);
  }
};

updateHomepage();
