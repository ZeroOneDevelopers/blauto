'use client';
import { motion } from 'framer-motion';
import { SparklesIcon, RocketLaunchIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const items = [
  {
    title: 'Curated Icons',
    description: 'Limited Ferrari, Lamborghini, Rolls-Royce and Maybach masterpieces with documented provenance.',
    icon: SparklesIcon
  },
  {
    title: 'Bespoke Experiences',
    description: 'Private unveilings, racetrack experiences and white-glove delivery for every collector.',
    icon: RocketLaunchIcon
  },
  {
    title: 'Trusted Advisors',
    description: 'Discreet acquisition services, financing support and premium after-sales stewardship.',
    icon: ShieldCheckIcon
  }
];

export default function Highlights() {
  return (
    <section className="section-padding">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
            className="group card-hover surface-panel p-10"
          >
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 transition duration-500 group-hover:bg-white/20">
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-heading text-2xl text-white">{item.title}</h3>
            <p className="mt-4 text-sm text-silver/70">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
