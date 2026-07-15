import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  IconArrowRight,
  IconPlay,
  IconQr,
  IconRefresh,
  IconShield,
  IconStar,
  IconUpload,
} from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";


const features = [
  {
    icon: IconQr,
    title: "Static QR",
    description: "Print once, never reprint",
  },
  {
    icon: IconRefresh,
    title: "Smart Rotation",
    description: "Least-recently-used review rotation",
  },
  {
    icon: IconUpload,
    title: "Easy to Use",
    description: "Simple CSV upload and management",
  },
  {
    icon: IconShield,
    title: "No AI / No App",
    description: "Web-based platform, no complex setup",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,70,185,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(107,127,215,0.1),_transparent_50%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How It Works
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <a href="#faqs" className="transition-colors hover:text-foreground">
            FAQs
          </a>
        </nav>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "default" }), "gap-1.5")}
        >
          Open Dashboard
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>


      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-muted/60 bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
              <IconStar className="h-3.5 w-3.5 text-gold" />
              Static QR. Smarter Reviews.
            </div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Collect more{" "}
              <span className="text-primary">Google</span> reviews with ease
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Create one static QR code per business. Customers select their
              service, copy a rotated review line, and continue to Google.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "gap-1.5")}
              >
                Open Dashboard
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#how-it-works"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <IconPlay className="h-2.5 w-2.5" />
                </span>
                See How It Works
              </a>
            </div>
          </div>

          <div className="relative flex justify-center animate-fade-up-delay lg:justify-end">
            <div
              aria-hidden
              className="absolute -right-4 top-8 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute bottom-4 left-8 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="relative animate-float">
              <div className="absolute -left-10 top-16 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-lg shadow-foreground/10 ring-1 ring-border">
                <span className="text-2xl font-bold text-[#4285F4]">G</span>
              </div>
              <Card className="w-[260px] rounded-[2rem] border-[6px] border-foreground bg-surface p-5 shadow-2xl shadow-foreground/15 sm:w-[280px]">
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-border" />
                <div className="rounded-2xl bg-surface-muted p-4">
                  <div className="mx-auto flex aspect-square w-full max-w-[180px] items-center justify-center rounded-xl bg-surface p-3 shadow-sm">
                    <div
                      className="h-full w-full rounded-md"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #1a2340 25%, transparent 25%), linear-gradient(#1a2340 25%, transparent 25%), linear-gradient(90deg, transparent 75%, #1a2340 75%), linear-gradient(transparent 75%, #1a2340 75%)",
                        backgroundSize: "12px 12px",
                        backgroundPosition: "0 0, 0 0, 0 0, 0 0",
                        backgroundColor: "#fff",
                        opacity: 0.9,
                      }}
                    />
                  </div>
                  <p className="mt-4 text-center text-sm font-bold text-foreground">
                    Leave a Review
                  </p>
                  <div className="mt-2 flex justify-center gap-1 text-gold">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <IconStar key={n} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>


        <section
          id="features"
          className="relative z-10 border-y border-border bg-surface/80 backdrop-blur-sm"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{feature.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three steps from setup to more Google reviews.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create a business",
                body: "Add your Google Place ID or review URL so scans land in the right place.",
              },
              {
                step: "02",
                title: "Add services & reviews",
                body: "Your business gets one permanent QR code, while each service keeps its own review text pool.",
              },
              {
                step: "03",
                title: "Print & collect",
                body: "Customers scan, copy a rotated review line, and post it on Google.",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="p-6 transition-shadow hover:shadow-md hover:shadow-foreground/5"
              >
                <span className="text-xs font-bold tracking-widest text-primary">
                  {item.step}
                </span>
                <h3 className="mt-2 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Card>
            ))}
          </div>
        </section>


        <section id="pricing" className="border-t border-border bg-surface/60 py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Simple pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free while you set up your first business and QR codes.
            </p>
            <Card className="mx-auto mt-8 max-w-sm p-8 shadow-sm">
              <p className="text-sm font-semibold text-primary">Starter</p>
              <p className="mt-2 text-4xl font-extrabold text-foreground">Free</p>
              <p className="mt-1 text-sm text-muted-foreground">During early access</p>
              <ul className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-success">✓</span> Unlimited businesses
                </li>
                <li className="flex gap-2">
                  <span className="text-success">✓</span> One static QR per business
                </li>
                <li className="flex gap-2">
                  <span className="text-success">✓</span> LRU review rotation
                </li>
                <li className="flex gap-2">
                  <span className="text-success">✓</span> CSV import
                </li>
              </ul>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8 w-full gap-1.5")}
              >
                Open Dashboard
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </div>
        </section>


        <section id="faqs" className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            FAQs
          </h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: "Do I need to reprint QR codes?",
                a: "No. Each business QR link is permanent. Services can change without reprinting it.",
              },
              {
                q: "How does review rotation work?",
                a: "Each scan serves the least-recently-used review line from your pool, then redirects to Google.",
              },
              {
                q: "Is there an app to install?",
                a: "No. Everything runs in the browser — for you and for your customers.",
              },
            ].map((faq) => (
              <Card
                key={faq.q}
                className="px-5 py-4"
              >
                <p className="font-semibold text-foreground">{faq.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-navy">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-center sm:flex-row sm:text-left lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gold">
                <IconStar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white">Simple. Smart. Effective.</p>
                <p className="text-sm text-white/70">More reviews. Better reputation.</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "secondary" }), "gap-1.5 bg-white text-foreground hover:bg-muted")}
            >
              Get started
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
