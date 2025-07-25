import { Mail, MessageSquareText, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Contact() {
  const contacts = [
    {
      title: "Chat to sales",
      description: "Speak to our friendly team.",
      email: "souradeephazra93@gmail.com",
      icon: <MessageSquareText className="w-6 h-6 text-primary" />,
    },
    {
      title: "Chat to support",
      description: "We’re here to help.",
      email: "souradeephazra93@gmail.com",
      icon: <Mail className="w-6 h-6 text-primary" />,
    },
    {
      title: "Visit us",
      description: "Visit our office HQ.",
      email: "View on Google Maps",
      link: "https://maps.app.goo.gl/B9Dq6ucDSEWbGaV39", // replace with actual link
      icon: <MapPin className="w-6 h-6 text-primary" />,
    },
    {
      title: "Call us",
      description: "Mon–Fri from 8am to 5pm.",
      email: "8017295229",
      tel: true,
      icon: <Phone className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 px-4 bg-white text-center">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-8 h-8 bg-primary rounded-full" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact our friendly team</h1>
        <p className="text-muted-foreground text-base">Let us know how we can help.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {contacts.map((item, idx) => (
          <Card key={idx} className="text-left shadow-sm hover:shadow-md transition-all h-full">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted mb-2">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
              {item.link ? (
                <a href={item.link} target="_blank" className="text-sm text-primary font-medium hover:underline">
                  {item.email}
                </a>
              ) : item.tel ? (
                <a href={`tel:${item.email}`} className="text-sm text-primary font-medium hover:underline">
                  {item.email}
                </a>
              ) : (
                <a href={`mailto:${item.email}`} className="text-sm text-primary font-medium hover:underline">
                  {item.email}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
