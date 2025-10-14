// pages/HelpPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  CreditCard, 
  BookOpen, 
  User, 
  ShoppingCart,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const HelpPage = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const faqSections = [
    {
      id: "account",
      title: "Account & Login",
      icon: <User className="h-5 w-5" />,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Start Reading' in the navigation bar and fill out the registration form with your email, username, and password."
        },
        {
          q: "I forgot my password. What should I do?",
          a: "Click 'Forgot Password?' on the login page. Enter your email and we'll send you a reset link valid for 10 minutes."
        },
        {
          q: "Can I change my username?",
          a: "Currently, usernames cannot be changed after account creation. Choose carefully during registration."
        }
      ]
    },
    {
      id: "books",
      title: "Books & Reading",
      icon: <BookOpen className="h-5 w-5" />,
      questions: [
        {
          q: "How do I find books?",
          a: "Use the search bar in the navigation or browse through genres on the Home page. You can filter by category, author, or popularity."
        },
        {
          q: "What happens after I purchase a book?",
          a: "Purchased books are automatically added to your Library. You can access them anytime from the 'Library' section in the navigation."
        },
        {
          q: "Can I read books on multiple devices?",
          a: "Yes! Your library syncs across all devices where you're logged into your TomeShelf account."
        }
      ]
    },
    {
      id: "purchases",
      title: "Purchases & Payments",
      icon: <CreditCard className="h-5 w-5" />,
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept credit/debit cards via Stripe and also offer Cash on Delivery (COD) for your convenience."
        },
        {
          q: "How does Cash on Delivery work?",
          a: "Select COD at checkout. You'll pay when your order is delivered. Note: Available in select regions only."
        },
        {
          q: "Where can I see my order history?",
          a: "All your orders are available in the 'Orders' section. You can track status and view order details there."
        },
        {
          q: "Can I get a refund?",
          a: "Due to the digital nature of our products, refunds are typically not provided once a book has been added to your library."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Issues",
      icon: <Search className="h-5 w-5" />,
      questions: [
       
        {
          q: "The website is slow. How can I improve performance?",
          a: "Ensure you have a stable internet connection. Try closing other browser tabs or restarting your browser."
        },
        {
          q: "I'm having trouble with payments.",
          a: "Check your card details, ensure sufficient funds, or try a different payment method. For Stripe issues, wait a few minutes and try again."
        }
      ]
    }
  ];

  const quickLinks = [
    {
      title: "Reset Password",
      description: "Can't remember your password?",
      link: "/login",
      icon: <User className="h-5 w-5" />
    },
    {
      title: "My Library",
      description: "Access all your purchased books",
      link: "/library",
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and get help with TomeShelf
          </p>
        </div>

        {/* Quick Action Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.link}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="text-indigo-600 group-hover:text-indigo-700">
                  {link.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {faqSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-indigo-600">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                {openSections[section.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {openSections[section.id] && (
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    {section.questions.map((item, index) => (
                      <div key={index} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {item.q}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Still Need Help?</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> support@tomeshelf.com
            </p>
            <p className="text-sm text-gray-600">
              <strong>Response Time:</strong> Typically within 24 hours
            </p>
          </div>
        </div>

        {/* Project Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            <strong>Note:</strong> This is a personal project for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;