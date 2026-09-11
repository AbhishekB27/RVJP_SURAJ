import Image from "next/image";
import Link from "next/link";
import { Heart, Scale, ShieldCheck, Users, PenSquare } from "lucide-react";
import AboutSection from "@/components/about";
import MissionVisionSection from "@/components/mission-vision-section";
import CampaignsSection from "@/components/CampaignsSection";
import FeaturedVoices from "@/components/FeaturedVoices";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import JoinSection from "@/components/JoinSection";

const impactItems = [
  {
    icon: ShieldCheck,
    title: "RAISE AWARENESS",
    description: "Educate and empower our communities",
  },
  {
    icon: Users,
    title: "SUPPORT SURVIVORS",
    description: "Provide a safe space to share and heal",
  },
  {
    icon: Scale,
    title: "FIGHT FOR JUSTICE",
    description: "Advocate for strict laws and equal rights",
  },
  {
    icon: Heart,
    title: "BUILD A SAFER INDIA",
    description: "Together, we can create lasting change",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-black text-white">
      {/* forcing 100vh here squeezed the stacked mobile layout — headline,
          emblem and the impact strip all had to fit one screen */}
      <div className="flex h-full flex-col lg:min-h-screen">
        {/* ================= NAVBAR ================= */}


        {/* ================= HERO ================= */}
        <section className="relative flex flex-1 flex-col overflow-hidden">
          {/* Background artwork */}
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 h-full w-full bg-black/50" />
          <div className="absolute right-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-red-700/10 blur-[160px]" />

          {/* Content fills remaining space, centered */}
          <div className="relative mt-6 z-10 mx-auto flex w-full max-w-[1600px] flex-1 items-center px-6 py-3 lg:px-10">
            <div className="grid w-full items-center gap-6 lg:grid-cols-2 lg:gap-16">
              {/* Left: headline */}
              <div className="flex lg:ml-12 h-full flex-col items-center justify-center text-center lg:items-start lg:text-left">
                <p className="text-lg font-semibold tracking-wide text-white sm:text-xl lg:text-2xl">
                  Together, we can
                </p>
                <h1 className="font-display mt-1 text-[13vw] font-bold uppercase leading-[0.88] tracking-[0.01em] sm:text-6xl lg:text-[5.2vw] xl:text-[4.6vw]">
                  <span className="block text-white">Break</span>
                  <span className="mt-1 block text-red-600">The Silence</span>
                </h1>
                <span className="mt-3 block h-1 w-16 bg-red-600 lg:mt-4" />
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base lg:mt-4 lg:text-lg">
                  RVJP is a movement against sexual violence.
                  <br />
                  We stand with survivors. We fight for justice.
                  <br />
                  <span className="font-semibold text-red-500">
                    We create a safer tomorrow.
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-3 lg:mt-6 lg:justify-start lg:gap-4">
                  <Link
                    href="/shareStory"
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:px-6 lg:py-3 lg:text-base"
                  >
                    <PenSquare className="h-4 w-4" aria-hidden="true" />
                    Share Your Story
                  </Link>
                  <Link
                    href="/join"
                    className="inline-flex items-center gap-2 rounded-md border border-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:px-6 lg:py-3 lg:text-base"
                  >
                    <Users className="h-4 w-4" aria-hidden="true" />
                    Join RVJP
                  </Link>
                </div>
              </div>

              {/* Right: emblem block */}
              <div className="flex h-full flex-col items-center justify-center text-center">
                <img
                  src="/rvjp-logo1.png"
                  alt="Rape Virodhi Janta Party emblem"
                  width={1024}
                  height={1024}
                  className="w-32 max-w-full sm:w-40 lg:w-48 xl:w-56"
                />
                <h2 className="font-display mt-2 text-2xl font-bold uppercase leading-tight tracking-[0.02em] sm:text-3xl lg:mt-3 lg:text-4xl xl:text-5xl">
                  <span className="text-red-600">Rape</span>{" "}
                  <span className="text-white">Virodhi</span>
                  <span className="block text-white">Janta Party</span>
                </h2>
                <div className="mt-3 flex w-full max-w-xl items-center gap-3">
                  <span className="h-px flex-1 bg-red-600" />
                  <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.15em] text-white sm:text-xs lg:text-sm">
                    A Voice. A Movement. A Change.
                  </span>
                  <span className="h-px flex-1 bg-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= IMPACT STRIP ================= */}
          <div className="relative z-10 mx-auto w-full max-w-[1500px] shrink-0 px-6 pb-4 lg:px-10 lg:pb-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm sm:grid-cols-4 lg:p-5">
              {impactItems.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600/10 lg:h-10 lg:w-10">
                    <Icon className="h-4 w-4 text-red-600 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase leading-tight tracking-wide text-white lg:text-xs">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-snug text-white/70 lg:text-xs">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <AboutSection />
      <MissionVisionSection />
      <CampaignsSection />
      <FeaturedVoices />
      <TestimonialsSection />
      <BlogSection />
      <JoinSection />
    </main>
  );
}