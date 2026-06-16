import React from 'react'
import { Send, Phone, Mail, Headphones, MapPin, Building2, ArrowRight } from 'lucide-react'
import Header from '@/features/home/components/Header'
import Footer from '@/features/home/components/Footer'

export default function ContactUs() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />

      <main className="max-w-[1920px] mx-auto px-8 lg:px-24 py-16">
        <section className="grid grid-cols-12 gap-8 mb-24 items-end">
          <div className="col-span-12 lg:col-span-8">
            <span className="font-label text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4 block">Communication Portal</span>
            <h1 className="font-headline text-7xl font-bold tracking-tighter leading-none text-on-surface">TECHNICAL<br/>ENQUIRY.</h1>
          </div>
          <div className="col-span-12 lg:col-span-4 pb-2">
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
              Connect with our engineering laboratory for specialized component requests, overclocking consultations, and logistical support.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 bg-surface-container-low p-12 ghost-border">
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold mb-2 text-on-surface">Initialize Connection</h2>
              <p className="text-on-surface-variant font-label text-sm uppercase tracking-wider">Estimated Response Time: &lt; 4 Hours</p>
            </div>
            <form className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="group">
                  <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Subject Identity</label>
                  <input className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all py-4 text-on-surface" placeholder="Full Name" type="text" />
                </div>
                <div className="group">
                  <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Protocol Address</label>
                  <input className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all py-4 text-on-surface" placeholder="Email Address" type="email" />
                </div>
              </div>
              <div>
                <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Project Classification</label>
                <select className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all py-4 text-on-surface">
                  <option>Technical Consultation</option>
                  <option>Enterprise Logistics</option>
                  <option>Component Customization</option>
                  <option>RMA &amp; Support</option>
                </select>
              </div>
              <div>
                <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Detailed Specification</label>
                <textarea className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all py-4 text-on-surface resize-none" placeholder="Message content..." rows="6"></textarea>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-5 font-headline font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-lg transition-all group" type="submit">
                  <span>Execute Transmission</span>
                  <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </form>
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-8 ghost-border flex-grow">
              <h3 className="font-headline text-2xl font-bold mb-8 text-on-surface">Direct Channels</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="bg-surface-container-high p-3 rounded transition-colors group-hover:bg-primary-fixed">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Lab Hotline</p>
                    <p className="text-xl font-headline font-bold text-on-surface">+1 (800) 992-TECH</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="bg-surface-container-high p-3 rounded transition-colors group-hover:bg-primary-fixed">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Secure Uplink</p>
                    <p className="text-xl font-headline font-bold text-on-surface">secure@precision-tech.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="bg-surface-container-high p-3 rounded transition-colors group-hover:bg-primary-fixed">
                    <Headphones className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Live Dispatch</p>
                    <p className="text-xl font-headline font-bold text-on-surface">24/7 Global NOC</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden group h-[400px] ghost-border">
              <img
                alt="Clean room laboratory"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfZOyHDlGVfox63Kb10Ju-BHvqGYyR73DggO0dmwa2A6NQf3WDwl1X5sID9EYvZ3M4JUefwNhKAVTBdT1_t-lDeWDBnCjupcjVdZkPtsoBTf0gLeUmPvZ-XH0jrFgCg1o1jy5NgByXUMi1oLM5KUkVLIY9RYSGtueMdYwBYmxP50cVT54QFanzAAhh8SuMHtqh8C-D1DOlfxAK0PKw-dQewelqZIrXjB-rPb8OjQknXRt3bO7Kjaw1TrYLSPRGEBNgofyN4b46F0YN"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-on-primary">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] mb-1">HQ Location</p>
                <p className="font-headline text-2xl font-bold">Research Cell Alpha</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 lg:col-span-4 bg-surface-container p-12 h-full flex flex-col justify-center">
              <span className="text-secondary font-headline font-bold uppercase tracking-widest text-xs mb-4 block">Physical Node</span>
              <h2 className="font-headline text-4xl font-bold mb-6 text-on-surface">Laboratory <br/>Coordinates</h2>
              <p className="text-on-surface-variant mb-8">
                Silicon Valley Innovation Park<br/>
                Building 12, Level 4<br/>
                94043 California, USA
              </p>
              <button className="text-on-surface flex items-center gap-2 font-semibold hover:text-primary transition-colors group">
                <span>Get Navigational Data</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="col-span-12 lg:col-span-8 h-[500px] bg-surface-dim relative overflow-hidden ghost-border">
              <div className="w-full h-full bg-slate-200">
                <img
                  alt="Technical map layout"
                  className="w-full h-full object-cover grayscale opacity-50 contrast-125"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlUObv0iCd06o7tWN1PzGRpwMhAMkI4C5UpH8fAiMkyvK3RIy9lT0vAisnMABF8GXZTB6DKeQJrRioEHer78T1nZb3H12G6Hr5YKusGll-gZwy2SaTLXH6um0lvr06tDEcO4TQHY0kNqHS567G_CZK_bHEvWJNLtWYT-YFLGom94mW-PcCAeuzFyUe71OJ9DyKe23-nGY9k55rQHKY01UAApSk4dUHm60l1wmvaOBsddhdB5DJqMYn4Xd7i_Oc1RUoWWdJ7HiQieut"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping"></div>
                    <div className="relative z-10 w-6 h-6 bg-primary rounded-full border-4 border-surface"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
