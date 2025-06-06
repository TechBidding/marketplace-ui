import React from "react";
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCode,
  HiOutlineGlobe,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlinePlay
} from "react-icons/hi";

export const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const bgPage = isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
  const bgCard = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
  const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50";
  const textClr = isDark ? "text-gray-100" : "text-gray-900";
  const subtleText = isDark ? "text-gray-400" : "text-gray-600";

  const features = [
    {
      icon: <HiOutlineCode className="w-8 h-8" />,
      title: "Skilled Developers",
      description: "Connect with vetted professionals across all tech stacks and experience levels.",
      color: "blue"
    },
    {
      icon: <HiOutlineGlobe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Access talent from around the world with seamless communication tools.",
      color: "emerald"
    },
    {
      icon: <HiOutlineLightningBolt className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Get your projects completed quickly with our efficient matching system.",
      color: "purple"
    },
    {
      icon: <HiOutlineShieldCheck className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Protected transactions with escrow services and milestone-based payments.",
      color: "orange"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "Found the perfect developer for our mobile app. The quality exceeded our expectations!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Project Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The platform made it easy to manage multiple projects and communicate with our team.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "E-commerce Owner",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Transformed our online store with a talented developer. Revenue increased by 200%!",
      rating: 5
    }
  ];

  const stats = [
    { value: "10,000+", label: "Projects Completed" },
    { value: "5,000+", label: "Active Developers" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Available" }
  ];

  const FeatureCard = ({ feature }: { feature: any }) => (
    <div className={`${bgCard} rounded-2xl p-8 border ${borderClr} hover:shadow-xl transition-all duration-300 group`}>
      <div className={`p-4 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 w-fit mb-6 group-hover:scale-110 transition-transform duration-200`}>
        <div className={`text-${feature.color}-600 dark:text-${feature.color}-400`}>
          {feature.icon}
        </div>
      </div>
      <h3 className={`text-xl font-bold ${textClr} mb-3`}>{feature.title}</h3>
      <p className={`${subtleText} leading-relaxed`}>{feature.description}</p>
    </div>
  );

  const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
    <div className={`${bgCard} rounded-2xl p-6 border ${borderClr}`}>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <HiOutlineStar key={i} className="w-5 h-5 text-yellow-500 fill-current" />
        ))}
      </div>
      <p className={`${textClr} mb-6 leading-relaxed`}>"{testimonial.content}"</p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className={`font-semibold ${textClr}`}>{testimonial.name}</p>
          <p className={`text-sm ${subtleText}`}>{testimonial.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgPage}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`${bgCard} mx-4 mt-8 rounded-3xl border ${borderClr} shadow-xl`}>
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-20">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 max-w-7xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <HiOutlineSparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">Welcome to the Future of Work</span>
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Connect. Create.
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Collaborate.
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                The premier marketplace connecting talented developers with innovative clients.
                Bring your ideas to life with our global network of skilled professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started Free
                  <HiOutlineArrowRight className="w-5 h-5" />
                </button>
                <button className="flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200">
                  <HiOutlinePlay className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36"></div>
          </div>
        </div>
      </section>

      {/* User Selection Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl lg:text-5xl font-bold ${textClr} mb-6`}>
              Choose Your Path
            </h2>
            <p className={`text-xl ${subtleText} max-w-3xl mx-auto`}>
              Whether you're looking to hire talent or showcase your skills, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Client Card */}
            <div className={`${bgCard} rounded-3xl p-8 border ${borderClr} hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
                    <HiOutlineUserGroup className="w-12 h-12" />
                  </div>
                </div>
                <h3 className={`text-2xl font-bold ${textClr} mb-4 text-center`}>
                  I'm a Client
                </h3>
                <p className={`${subtleText} text-center mb-8 leading-relaxed`}>
                  Looking to hire talented developers for your next project? Post your requirements and connect with skilled professionals.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/signup?role=client")}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Sign Up as Client
                    <HiOutlineArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/login?role=client")}
                    className={`w-full flex items-center justify-center gap-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} px-6 py-4 rounded-xl font-semibold transition-all duration-200`}
                  >
                    Login as Client
                  </button>
                </div>
              </div>
            </div>

            {/* Developer Card */}
            <div className={`${bgCard} rounded-3xl p-8 border ${borderClr} hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white">
                    <HiOutlineCode className="w-12 h-12" />
                  </div>
                </div>
                <h3 className={`text-2xl font-bold ${textClr} mb-4 text-center`}>
                  I'm a Developer
                </h3>
                <p className={`${subtleText} text-center mb-8 leading-relaxed`}>
                  Ready to showcase your skills and work on exciting projects? Join our community of talented developers.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/signup?role=developer")}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Sign Up as Developer
                    <HiOutlineArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/login?role=developer")}
                    className={`w-full flex items-center justify-center gap-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} px-6 py-4 rounded-xl font-semibold transition-all duration-200`}
                  >
                    Login as Developer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl lg:text-5xl font-bold ${textClr} mb-2`}>
                  {stat.value}
                </div>
                <div className={`${subtleText} font-medium`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold ${textClr} mb-6`}>
              Why Choose Our Platform?
            </h2>
            <p className={`text-xl ${subtleText} max-w-3xl mx-auto`}>
              We provide everything you need to successfully complete your projects with confidence and ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold ${textClr} mb-6`}>
              How It Works
            </h2>
            <p className={`text-xl ${subtleText} max-w-3xl mx-auto`}>
              Get started in three simple steps and watch your project come to life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Post Your Project",
                description: "Describe your project requirements and set your budget. Our AI will help match you with the right talent.",
                icon: <HiOutlineCode className="w-12 h-12" />
              },
              {
                step: "02",
                title: "Choose Developer",
                description: "Review proposals, check portfolios, and select the perfect developer for your project needs.",
                icon: <HiOutlineUserGroup className="w-12 h-12" />
              },
              {
                step: "03",
                title: "Track Progress",
                description: "Monitor milestones, communicate seamlessly, and release payments as work is completed.",
                icon: <HiOutlineChartBar className="w-12 h-12" />
              }
            ].map((step, index) => (
              <div key={index} className={`${bgCard} rounded-2xl p-8 border ${borderClr} text-center`}>
                <div className="relative mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className={`text-xl font-bold ${textClr} mb-3`}>{step.title}</h3>
                <p className={`${subtleText} leading-relaxed`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold ${textClr} mb-6`}>
              What Our Clients Say
            </h2>
            <p className={`text-xl ${subtleText} max-w-3xl mx-auto`}>
              Join thousands of satisfied clients who have successfully completed their projects.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`${bgCard} rounded-3xl border ${borderClr} overflow-hidden`}>
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 px-8 py-16 text-center">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Start Your Project?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join our platform today and connect with talented developers who can bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/signup")}
                    className="flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Your Project
                    <HiOutlineArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/browse")}
                    className="flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200"
                  >
                    Browse Talent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
