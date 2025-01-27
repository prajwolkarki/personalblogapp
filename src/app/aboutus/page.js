// app/about/page.js
import Link from "next/link";
import { FiTarget, FiFeather, FiUsers, FiGlobe, FiBook } from "react-icons/fi";
import Image from "next/image";


export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto mt-5 px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Empowering Minds, Sharing Wisdom
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Join a community where knowledge flows freely and connections grow
          naturally
        </p>
        <div className="relative h-64 bg-blue-50 rounded-lg mb-8">
          {/* Replace with Image component */}
          <Image
            src="/images/illustration.jpg"
            alt="Community illustration"
            fill
            className="object-cover object-center rounded-lg"
            sizes="100vw"
          />
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Why We Exist
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <FiTarget className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Focused Knowledge Sharing
            </h3>
            <p className="text-gray-600">
              A space dedicated to meaningful exchange of ideas beyond social
              media noise
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <FiFeather className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Effortless Publishing
            </h3>
            <p className="text-gray-600">
              Simple tools that let your ideas flow without technical barriers
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <FiUsers className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Supportive Community</h3>
            <p className="text-gray-600">
              Connect with curious minds and grow together
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16 bg-blue-50 py-12 px-6 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FiBook,
              title: "Personal Blog Space",
              text: "Build your digital identity as a thought leader",
            },
            {
              icon: FiGlobe,
              title: "Global Reach",
              text: "Share your perspective with a worldwide audience",
            },
            {
              icon: FiUsers,
              title: "Community Support",
              text: "Get feedback and encouragement from peers",
            },
            {
              icon: FiFeather,
              title: "Writing Tools",
              text: "Clean editor with markdown support",
            },
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
              <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Our Story
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            Founded in 2023 by a team of passionate writers and developers, we
            set out to create a space where ideas matter more than algorithms.
            Frustrated by the click-driven nature of modern social media, we
            built ब्लग संसार to:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-gray-600">
            <li>Democratize content creation</li>
            <li>Prioritize quality over virality</li>
            <li>Connect people through meaningful ideas</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-orange-50 py-12 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Ready to Share Your Wisdom?
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of thinkers already shaping conversations on our
          platform
        </p>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
        >
          Start Writing Now
        </Link>
      </section>
    </div>
  );
}
