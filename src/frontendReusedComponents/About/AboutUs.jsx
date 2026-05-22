import React from 'react'
import { Thermometer, Cpu, Wifi, Users, Quote, ArrowRight } from 'lucide-react'

export default function AboutUs() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <nav className="w-full sticky top-0 z-50 bg-slate-50/70 backdrop-blur-xl shadow-sm font-headline tracking-tight">
        <div className="flex justify-between items-center h-16 px-8 max-w-[1920px] mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-slate-900 font-display">PRECISION TECH</div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="/">Home</a>
            <a className="text-blue-700 border-b-2 border-blue-600 pb-1" href="/about">About</a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors" href="/contact">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:bg-slate-100/50 p-2 rounded-sm transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
            </button>
            <button className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2 rounded-lg font-medium transition-all">Sign Up</button>
          </div>
        </div>
        <div className="bg-slate-200/20 h-[1px]"></div>
      </nav>

      <main className="max-w-[1920px] mx-auto">
        <section className="relative h-[800px] flex items-center overflow-hidden bg-surface">
          <div className="container mx-auto px-12 z-10 grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-6">
              <span className="font-label text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-6 block">Est. 2024 / Laboratory Grade</span>
              <h1 className="font-headline text-8xl font-bold tracking-tighter text-on-surface leading-[0.9] mb-8">
                PRECISION<br/>
                <span className="text-primary italic">BY DESIGN.</span>
              </h1>
              <p className="text-xl text-on-surface-variant leading-relaxed max-w-lg mb-10">
                At Tech Atelier, we don't just assemble components; we engineer digital environments. Our laboratory focuses on the intersection of extreme thermal dynamics and computational efficiency.
              </p>
              <div className="flex gap-4">
                <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all hover:bg-primary-container shadow-lg">
                  View Technical Specs
                </button>
                <button className="border-2 border-outline-variant text-on-surface px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all hover:bg-surface-container-high">
                  Lab Tour
                </button>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 relative">
              <div className="aspect-[16/9] w-[120%] -ml-[10%] bg-surface-container-highest rounded-lg overflow-hidden shadow-2xl relative">
                <img
                  alt="Motherboard macro shot"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOuKzbjJlRWRHF9f2FxQGQKat5Z67IV2bYnImUAdETVIQNsv4zixvBSAJjJW7VJMkYERL8jbTXIY9GVCbqaBHcyqgrvLYH-oGBAh7c8XUgod8XhE7XALdqknJL1IjfpbigXmmLUViB1BYclC9q2nocizR010Bt6j850Tv_d2uNYoOKb_JYn7awhVz-5REALrnNShvHKsButmJJsmgtbuyjfcuCFQ9R9TWh40SQErgcE1TRaBn1OHaR61tEwBEW9SsRkSHsi84ZvMpB"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-lg border border-outline-variant/20 shadow-xl max-w-xs">
                <span className="font-headline text-4xl font-bold text-primary block">0.01mm</span>
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">Production Tolerance Threshold</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-0 translate-x-1/4 skew-x-[-12deg]"></div>
        </section>

        <section className="py-32 bg-surface-container-low">
          <div className="container mx-auto px-12">
            <div className="grid grid-cols-12 gap-16 items-start">
              <div className="col-span-12 lg:col-span-4 sticky top-32">
                <h2 className="font-headline text-5xl font-bold tracking-tighter text-on-surface">OUR<br/>DNA</h2>
                <div className="w-16 h-1 bg-secondary mt-6"></div>
                <p className="mt-8 text-on-surface-variant text-lg">Every component that enters our atelier undergoes a rigorous 72-hour thermal stress cycle in our sub-zero testing chamber.</p>
              </div>
              <div className="col-span-12 lg:col-span-8 space-y-24">
                <div className="grid grid-cols-2 gap-12">
                  <div className="group">
                    <div className="font-headline text-2xl font-bold mb-4 flex items-center gap-3">
                      <Thermometer className="w-6 h-6 text-primary" />
                      <span>Extreme Thermal Control</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      Heat is the enemy of performance. Our cooling solutions utilize aerospace-grade materials and custom micro-fin architectures to ensure 99.9% uptime under peak load.
                    </p>
                  </div>
                  <div className="group">
                    <div className="font-headline text-2xl font-bold mb-4 flex items-center gap-3">
                      <Cpu className="w-6 h-6 text-primary" />
                      <span>Signal Integrity</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      Through advanced EMI shielding and multi-layer trace isolation, we eliminate cross-talk and jitter in our high-speed data interconnects.
                    </p>
                  </div>
                </div>
                <div className="aspect-[21/9] bg-surface-container-highest rounded-lg overflow-hidden relative">
                  <img
                    alt="Engineer in clean room"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ02bnai4alJxlB13fylgKy3Mu8wq6UEQli9cCOmnjpZNFofKgzLN3gXy8iHWqafIw8wnxWvKRDtLZQybBj-P29ye8grJ5ciOZqhZhY-i3xmDgRTIAKWaMHDjjj4Gsc9AddA9dsMZMK9bCezytv1iiEKSnSCJSylyE4X3cJRZRRXSscu6Z7e7m4PBkyaI_dj60lsdr7RZXoQOX1G8euedCflt2KpHaXYWqTQA2qNWlZNdKmyWbT9i4LQeqFpnpyjkPJZAJhEFAwlt_"
                  />
                  <div className="absolute inset-0 bg-on-surface/20 mix-blend-multiply"></div>
                  <div className="absolute bottom-8 left-8 text-surface text-sm font-label uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    Live Monitoring: Chamber A-04
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-surface">
          <div className="container mx-auto px-12">
            <div className="mb-16">
              <h2 className="font-headline text-5xl font-bold tracking-tighter text-on-surface text-center">THE TESTING GROUNDS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px]">
              <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-lg overflow-hidden group relative">
                <img
                  alt="Assembly Bay"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ88L4_jJgYIZgcnY9YC5xMvEJSH7OAr1b76B9-adCiQ9Lt3JVCouSRgrSkKVXdjXjYudafwqIbzKSdlek1Q9DGVG_9QskGgm7kwMbkuNyVvOCifmBRwFfZOw3WMbMz2maV11jdCmKv-3T44tZG-6PDvuuPb0oCMCWDme6V9QVmMHTwnT4Z1-vLTSf81wtoSAp-RBnE9reZIECVwBMO9E8cLbhZhCPzf-0Td_Ve7rPdRBZuqtr4xVyaTeNuOLWmzsLSwyCwTOJPkyp"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent p-12 flex flex-col justify-end">
                  <h3 className="font-headline text-3xl font-bold text-surface">Assembly Bay 01</h3>
                  <p className="text-surface/80 mt-2 max-w-xs">Where high-performance architecture meets surgical precision assembly.</p>
                </div>
              </div>
              <div className="md:col-span-2 bg-surface-container-lowest rounded-lg overflow-hidden relative group">
                <img
                  alt="Tech equipment"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSQ1Yg1MjkvYI0Q5_-XiDBbAtReF4pK_NUZtn8-YOBzXohxXE-LkyAU-6yj2e2AVciF-x_549q0nHfT_kNZWQBtZS7rmyJqcuHdBUeZjBknuzkaWaj8p1i7GUnpermUMYU_xJkIMwubpsckTNj9xZw6zjO3dmK4en10uYmn6wPimEpXV_jAh2MW9pXQxZLjYMWML9e5aHZ8gc74yU8_exIGI95sAYiEWvK8zn9V6qXLls-C4gOHGgRYsDFezoywc-v3CMXfWz3f0g8"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-6 right-6">
                  <span className="bg-secondary text-on-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-tighter rounded">Performance Alpha</span>
                </div>
              </div>
              <div className="md:col-span-1 bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-8 text-center border-t-4 border-primary">
                <Wifi className="w-10 h-10 text-primary mb-4" />
                <div className="font-headline text-4xl font-bold text-on-surface">1.21k</div>
                <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">Units Verified / Day</div>
              </div>
              <div className="md:col-span-1 bg-surface-container-lowest rounded-lg overflow-hidden relative group">
                <img
                  alt="Cooling tubes"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7Xilj57cgQ8uZ3Zb0e4D8GLpnMJ8Di7QUilOnfktnOQoO3hmodwJ0dUB4LFrrOU-lgdisNnLWjDmXVFrHd2pkmpEhMveTXSHD9kdxwl3pMvqKop7r2DSOwJPxPVNEhQNesSH8NHBxI7G6tXhyK7kaW0ju0JRNo59xuUS3o1CcSZXjyWPqbiX1i2yxY9EzFLiEbdEq65Q4Dbl3eb652-Hm2lSRmYkWb79MW16koKd7uLQmXAkRTtLMbl8wEY2byzyeXzBlxm2nY-Iu"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-on-surface text-surface overflow-hidden relative">
          <div className="container mx-auto px-12 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 text-primary mx-auto mb-8" />
              <blockquote className="font-headline text-6xl font-light tracking-tight leading-[1.1] mb-12">
                &ldquo;In the realm of <span className="italic font-bold">extreme hardware</span>, there is no room for 'good enough'. We operate in the final percentiles of performance.&rdquo;
              </blockquote>
              <cite className="not-italic block">
                <span className="font-label uppercase tracking-widest text-primary font-bold">Marcus Vane</span>
                <span className="text-surface/50 text-sm mt-1 block">Chief Engineer, Tech Atelier</span>
              </cite>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 font-headline text-[24rem] font-bold text-surface-container-lowest/5 select-none leading-none">TECH</div>
        </section>

        <section className="py-32 bg-background">
          <div className="container mx-auto px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24">
              <div>
                <span className="font-label text-sm text-primary uppercase tracking-[0.3em] font-bold">Vision 2025</span>
                <h2 className="font-headline text-6xl font-bold tracking-tighter text-on-surface mt-4">EVOLUTIONARY<br/>BENCHMARKS</h2>
              </div>
              <p className="max-w-sm text-on-surface-variant mb-2">Our commitment to research and development drives us toward the next frontier of hardware integration.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-outline-variant/30">
              <div className="p-12 border-r border-outline-variant/30 hover:bg-surface-container-low transition-colors group">
                <span className="font-headline text-lg font-bold text-primary block mb-12">PHASE I</span>
                <h4 className="font-headline text-3xl font-bold mb-6 group-hover:translate-x-2 transition-transform">Liquid Silicon Cooling</h4>
                <p className="text-on-surface-variant">Integrating non-conductive thermal fluids directly into the substrate for zero-latency heat transfer.</p>
              </div>
              <div className="p-12 border-r border-outline-variant/30 hover:bg-surface-container-low transition-colors group">
                <span className="font-headline text-lg font-bold text-primary block mb-12">PHASE II</span>
                <h4 className="font-headline text-3xl font-bold mb-6 group-hover:translate-x-2 transition-transform">Neural Interconnects</h4>
                <p className="text-on-surface-variant">Developing AI-driven bus architectures that predict data flow patterns to reduce energy consumption.</p>
              </div>
              <div className="p-12 hover:bg-surface-container-low transition-colors group">
                <span className="font-headline text-lg font-bold text-primary block mb-12">PHASE III</span>
                <h4 className="font-headline text-3xl font-bold mb-6 group-hover:translate-x-2 transition-transform">Zero-G Production</h4>
                <p className="text-on-surface-variant">Exploring manufacturing in orbital environments to achieve perfect crystalline purity in component wafers.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-slate-100 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-12 max-w-[1920px] mx-auto">
          <div>
            <div className="font-display font-bold text-lg mb-4 text-on-surface">PRECISION TECH</div>
            <p className="text-slate-500 font-body text-sm uppercase tracking-widest leading-loose max-w-sm">
              &copy; 2024 PRECISION TECH. ENGINEERED FOR PERFORMANCE.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4 md:justify-end items-center">
            <a className="font-body text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="font-body text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="font-body text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
            <a className="font-body text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors opacity-80 hover:opacity-100" href="#">Returns</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
