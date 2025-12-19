const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Page = require("../models/Page");

const createAboutPage = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Delete old about page if exists
    await Page.deleteOne({ slug: "about" });

    // Create new about page
    const aboutPage = new Page({
      slug: "about",
      title: "About Us",
      metaDescription:
        "Learn about A.B. Roberts Funeral Home - our mission, values, facilities, and dedicated team.",
      content: {
        hero: {
          title: "About A.B. Roberts Funeral Home",
          subtitle:
            "Serving families with dignity, professionalism, and compassion during life's most difficult moments.",
        },
        whoWeAre: {
          title: "Who We Are",
          paragraph1:
            "A.B. Roberts Funeral Home is a professionally managed funeral service provider dedicated to honoring life and supporting families through respectful and well-organized funeral arrangements.",
          paragraph2:
            "We understand that the loss of a loved one is never easy. Our role is to ease the burden by providing reliable services, clear communication, and a calm environment where families can grieve, remember, and celebrate life with dignity.",
        },
        mission: {
          title: "Our Mission",
          text: "Our mission is to provide compassionate, dependable, and professional funeral services that meet the emotional, cultural, and practical needs of every family we serve.",
        },
        values: {
          title: "Our Values",
          items: [
            {
              name: "Respect",
              description:
                "We treat every family and every life with the highest level of respect and care.",
            },
            {
              name: "Professionalism",
              description:
                "Our staff is trained to deliver organized, timely, and high-standard services at all times.",
            },
            {
              name: "Compassion",
              description:
                "We serve with empathy, patience, and understanding, recognizing the emotional weight families carry.",
            },
            {
              name: "Integrity",
              description:
                "We operate with honesty, transparency, and clear communication in all our dealings.",
            },
          ],
        },
        facilities: {
          title: "Our Facilities",
          intro:
            "A.B. Roberts Funeral Home operates modern and well-maintained facilities designed to provide comfort, privacy, and peace of mind.",
          items: [
            "A fully equipped chapel for funeral and memorial services",
            "A conference room for family meetings and planning",
            "Professional embalming and preparation areas",
            "A showroom displaying caskets and funeral materials",
            "Administrative offices for efficient coordination",
          ],
        },
        team: {
          title: "Our Team",
          paragraph1:
            "Our team consists of experienced and dedicated professionals committed to delivering quality service with care and sensitivity.",
          paragraph2:
            "From administrative staff to technical and support personnel, every member of our team plays an important role in ensuring that each service is handled with respect, accuracy, and professionalism.",
          paragraph3:
            "We believe that service to families begins with listening, patience, and attention to detail.",
        },
        leadership: {
          title: "Leadership",
          paragraph1:
            "A.B. Roberts Funeral Home is led by experienced management committed to upholding high standards of service and ethical practice.",
          paragraph2:
            "Our leadership ensures that every aspect of our operations reflects our core values of dignity, professionalism, and compassion.",
        },
      },
    });

    await aboutPage.save();
    console.log("✅ About page created successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating about page:", error.message);
    process.exit(1);
  }
};

createAboutPage();
