import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Bug, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const supportTopics = [
  {
    icon: <Headphones className="w-5 h-5 text-blue-600" />,
    title: "General Support",
    description: "Questions about using the platform, understanding results, or account issues.",
  },
  {
    icon: <Bug className="w-5 h-5 text-red-600" />,
    title: "Bug Reports",
    description: "Found something that isn't working correctly? Let us know and we'll investigate.",
  },
  {
    icon: <HelpCircle className="w-5 h-5 text-purple-600" />,
    title: "Technical Questions",
    description: "Questions about the analysis methodology, cost formulas, or file compatibility.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-green-600" />,
    title: "Enterprise Enquiries",
    description: "Interested in a custom deployment, white-label version, or enterprise support contract.",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:info@sctdjm.com?subject=${encodeURIComponent(subject || "Support Request")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;
    toast({ title: "Opening email client", description: "Your default email app will open with the message pre-filled." });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <Headphones className="w-4 h-4" />
            <span className="text-sm font-medium">Contact Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">We're Here to Help</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Reach out to the Sterling Carter Technology Distributors support team. We typically respond within one business day.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Address</p>
                    <p className="text-gray-600 text-sm">15A Lady Musgrave Road<br />St. Andrew, Kingston 5<br />JAMAICA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Email</p>
                    <a href="mailto:info@sctdjm.com" className="text-blue-600 hover:underline text-sm">info@sctdjm.com</a>
                    <p className="text-gray-500 text-xs mt-0.5">We respond within 1 business day</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Phone</p>
                    <a href="tel:+18769686637" className="text-blue-600 hover:underline text-sm">(876) 968-6637</a>
                    <p className="text-gray-500 text-xs mt-0.5">Mon–Fri, 8am–5pm Jamaica Time</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Business Hours</p>
                    <p className="text-gray-600 text-sm">Monday – Friday: 8:00am – 5:00pm</p>
                    <p className="text-gray-600 text-sm">Saturday: 9:00am – 1:00pm</p>
                    <p className="text-gray-500 text-xs mt-0.5">Jamaica Standard Time (UTC-5)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support topics */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What Can We Help With?</h2>
              <div className="grid grid-cols-1 gap-3">
                {supportTopics.map((t) => (
                  <div key={t.title} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {t.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Send Us a Message
                </CardTitle>
                <p className="text-sm text-gray-500">Fill out the form below and we'll get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Your Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question about CMYK analysis"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question or issue in detail..."
                      className="mt-1 min-h-[140px]"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    This will open your email client with the message pre-filled.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
