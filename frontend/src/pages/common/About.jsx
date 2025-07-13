import { Truck, ShieldCheck, Smile } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import  men1  from "../../assets/men/men1.webp";

const teamMembers = [
  {
    name: 'John Doe',
    role: 'CEO',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'Jane Smith',
    role: 'COO',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    name: 'Bob Johnson',
    role: 'CTO',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
]

const coreValues = [
  {
    title: 'Fast Shipping',
    description: 'We deliver products quickly and reliably.',
    icon: <Truck className="text-primary w-8 h-8" />,
  },
  {
    title: 'Secure Shopping',
    description: '100% protected transactions and data security.',
    icon: <ShieldCheck className="text-green-600 w-8 h-8" />,
  },
  {
    title: 'Customer Happiness',
    description: 'Dedicated 24/7 support team.',
    icon: <Smile className="text-yellow-500 w-8 h-8" />,
  },
]

const stats = [
  { label: 'Happy Customers', value: '10M+' },
  { label: 'Brand Partners', value: '150+' },
  { label: 'Countries Served', value: '50+' },
  { label: 'Customer Support', value: '24/7' },
]

export default function About() {
  return (
    <div className="min-h-screen pt-20 bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 bg-gray-900 text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">About Our Company</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Dedicated to providing exceptional quality and service since our founding.
        </p>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2025, we started as a small team passionate about bringing
              high-quality products to our community. What began as a local boutique has
              grown into a trusted international ecommerce platform serving millions of
              customers worldwide.
            </p>
            <p className="text-muted-foreground">
              Our commitment to quality, sustainability, and customer satisfaction has
              remained at the core of everything we do.
            </p>
          </div>
          <div>
            <img
              src={men1}
              alt="Our Team"
              className="w-full rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {coreValues.map((value, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-8">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
