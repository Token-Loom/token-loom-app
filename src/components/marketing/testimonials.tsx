import { Card } from '@/components/ui/card'
import Image from 'next/image'

const testimonials = [
  {
    quote:
      "The controlled burn feature helped us execute our token reduction strategy perfectly. The platform's security and transparency gave our community confidence.",
    author: 'Sarah Chen',
    role: 'Project Lead, SolanaDAO',
    image: '/testimonials/avatar1.png'
  },
  {
    quote:
      'Implementing our burn schedule was seamless. The analytics dashboard made it easy to track and communicate progress to stakeholders.',
    author: 'Michael Rodriguez',
    role: 'CTO, TokenTech',
    image: '/testimonials/avatar2.png'
  },
  {
    quote:
      'The instant burn feature is exactly what we needed for our emergency supply adjustment. The process was quick and verifiable.',
    author: 'Alex Thompson',
    role: 'Founder, SolanaFi',
    image: '/testimonials/avatar3.png'
  }
]

export function Testimonials() {
  return (
    <section className='py-16'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='font-display mb-4 text-3xl font-bold text-[#E6E6E6] sm:text-4xl'>What Our Users Say</h2>
          <p className='mx-auto max-w-2xl text-[#A3A3A3]'>
            Join hundreds of projects that have successfully managed their token supply using our platform.
          </p>
        </div>

        <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {testimonials.map(testimonial => (
            <Card key={testimonial.author} className='flex h-full flex-col justify-between bg-[#1E1E24] p-6'>
              <blockquote className='mb-6'>
                <p className='text-[#E6E6E6]'>{testimonial.quote}</p>
              </blockquote>
              <div className='flex items-center gap-4'>
                <div className='relative h-12 w-12 overflow-hidden rounded-full'>
                  <Image src={testimonial.image} alt={testimonial.author} fill className='object-cover' />
                </div>
                <div>
                  <cite className='not-italic text-[#E6E6E6]'>{testimonial.author}</cite>
                  <p className='text-sm text-[#A3A3A3]'>{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
