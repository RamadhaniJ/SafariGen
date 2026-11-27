// ── Page8PDFCompanyAboutSection.jsx (Premium Book Page — Part Nine: Colophon) ──
import React from "react";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Building2,
  Quote,
  Compass,
  MessageCircle,
  Award,
  ArrowRight,
} from "lucide-react";
import { Ornament } from "./PdfShare/ShareSection";
import PdfBookPage from "./PdfShare/SmartSplit";
import {
  FacebookIcon,
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  ThreadsIcon,
} from "../../DigitalPage/SocialIcons/Icons";

/* ── Social media map (name → icon component) ── */
const SOCIAL_ICON_MAP = {
  TIKTOK: TikTokIcon,
  TICKTOK: TikTokIcon, // typo-safe
  INSTAGRAM: InstagramIcon,
  FACEBOOK: FacebookIcon,
  YOUTUBE: YouTubeIcon,
  TWITTER: TwitterIcon,
  THREADS: ThreadsIcon,
};

// Social accounts come from the company's own settings (client_info.company_socials).

/* ── Chapter opener ── */
function ChapterOpener({ part, icon, title, subtitle }) {
  return (
    <div className="mb-8 border-b border-[#B98B3E]/35 pb-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px w-10 bg-[#B98B3E]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.42em] text-[#8A6528]">
          {part}
        </span>
      </div>

      <h1 className="ddw-serif flex items-center gap-3 text-[36px] font-bold leading-[1.08] tracking-tight text-[#0B1410]">
        <span className="text-[#B98B3E] [&>svg]:h-7 [&>svg]:w-7">{icon}</span>
        {title}
      </h1>

      {subtitle && (
        <div className="mt-3 flex items-center gap-3">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
          <p className="text-[11.5px] font-medium italic tracking-wide text-[#8A6528]">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Section label ── */
function SectionLabel({ icon, label }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#B98B3E]/45 bg-[#B98B3E]/[0.08] text-[#8A6528]">
        <span className="[&>svg]:h-2.5 [&>svg]:w-2.5">{icon}</span>
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-[#B98B3E]/45 to-transparent" />
    </div>
  );
}

/* ── Company intro ── */
function CompanyIntro({ companyName, about }) {
  return (
    <div>
      <SectionLabel icon={<Compass />} label="Who We Are" />

      <div className="relative border border-[#B98B3E]/35 bg-[#FDFBF6] pl-6 pr-6 py-5">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />
        <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />

        <h2 className="ddw-serif mb-3 text-[24px] font-bold leading-tight text-[#0B1410]">
          {companyName}
          <span className="text-[#B98B3E]">.</span>
        </h2>

        <p className="text-[13.5px] leading-relaxed text-[#0F1A14]/85">
          {about}
        </p>
      </div>
    </div>
  );
}

/* ── Contact item ── */
function ContactItem({ icon, label, value, tone = "gold" }) {
  if (!value) return null;
  const accent = tone === "green" ? "#1E5A3B" : "#B98B3E";
  const accentDeep = tone === "green" ? "#1E5A3B" : "#8A6528";

  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/35 bg-[#FDFBF6] pl-5 pr-4 py-3.5">
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{
          background: `linear-gradient(to bottom, #E4C888, ${accent}, ${accentDeep})`,
        }}
      />

      <span className="absolute right-1.5 top-1.5 h-2 w-2 border-r border-t border-[#B98B3E]/45" />

      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center border"
          style={{
            borderColor: `${accent}66`,
            background: `${accent}0F`,
            color: accent,
          }}
        >
          <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
        </div>

        <div className="min-w-0">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
            {label}
          </p>
          <p className="ddw-serif mt-0.5 break-words text-[13px] font-semibold leading-snug text-[#0B1410]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Contact grid ── */
function ContactGrid({ address, country, whatsapp, phone, email, website }) {
  if (![address, country, whatsapp, phone, email, website].some(Boolean)) return null;
  return (
    <div>
      <SectionLabel icon={<ShieldCheck />} label="Get in Touch" />

      <div className="grid grid-cols-2 gap-3">
        <ContactItem icon={<MapPin />} label="Headquarters" value={address} />
        <ContactItem icon={<Globe />} label="Country" value={country} />
        <ContactItem
          icon={<MessageCircle />}
          label="WhatsApp"
          value={whatsapp}
          tone="green"
        />
        <ContactItem
          icon={<Phone />}
          label="Phone"
          value={phone}
          tone="green"
        />
        <ContactItem icon={<Mail />} label="Email" value={email} />
        <ContactItem icon={<Globe />} label="Website" value={website} />
      </div>
    </div>
  );
}

/* ── Social media row ── */
function SocialMediaRow({ accounts }) {
  if (!accounts || accounts.length === 0) return null;

  return (
    <div>
      <SectionLabel icon={<Sparkles />} label="Follow Our Journeys" />

      <div className="flex flex-wrap gap-3">
        {accounts.map((acc, i) => {
          const key = acc.name?.toUpperCase();
          const Icon = SOCIAL_ICON_MAP[key];

          return (
            <div
              key={i}
              className="relative inline-flex items-center gap-3 border border-[#B98B3E]/45 bg-[#FDFBF6] px-4 py-2.5"
            >
              <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />

              <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#B98B3E]/45 bg-[#B98B3E]/[0.06] text-[#8A6528]">
                {Icon ? (
                  <Icon className="h-3.5 w-3.5 text-[#8A6528]" />
                ) : (
                  <Globe className="h-3.5 w-3.5 text-[#8A6528]" />
                )}
              </span>

              <div className="leading-tight">
                <p className="text-[8.5px] font-bold uppercase tracking-[0.28em] text-[#8A6528]">
                  {acc.name}
                </p>
                <p className="ddw-serif text-[12.5px] font-semibold text-[#0B1410]">
                  {acc.handle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Motivation quote ── */
function MotivationQuote({ quote, attribution }) {
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/45 bg-[#0B1410] px-8 py-7 text-center">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #B98B3E 35%, #E4C888 50%, #B98B3E 65%, transparent)",
        }}
      />

      <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#E4C888]/60" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#E4C888]/60" />
      <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#E4C888]/60" />
      <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#E4C888]/60" />

      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#B98B3E]/70" />
        <Quote className="h-4 w-4 text-[#E4C888]" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#B98B3E]/70" />
      </div>

      <p className="ddw-serif mx-auto max-w-[145mm] text-[15px] italic leading-relaxed text-[#F8F4EA]">
        {quote}
      </p>

      {attribution && (
        <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.32em] text-[#E4C888]/80">
          — {attribution}
        </p>
      )}

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#B98B3E]/60" />
        <span className="h-1 w-1 rotate-45 bg-[#B98B3E]" />
        <span className="h-1.5 w-1.5 rotate-45 border border-[#B98B3E]" />
        <span className="h-1 w-1 rotate-45 bg-[#B98B3E]" />
        <span className="h-px w-8 bg-[#B98B3E]/60" />
      </div>
    </div>
  );
}

/* ── Logo plate ── */
function LogoPlate({ logoUrl, companyName, address }) {
  return (
    <div>
      <SectionLabel icon={<Award />} label="Official Brand" />

      <div className="relative break-inside-avoid border border-[#B98B3E]/45 bg-[#FDFBF6] p-5 flex items-center gap-5">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />

        <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />
        <span className="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-[#B98B3E]/45" />

        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center border border-[#B98B3E]/55 bg-[#0B1410] p-2">
          <span className="absolute left-1 top-1 h-2.5 w-2.5 border-l-2 border-t-2 border-[#E4C888]" />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 border-r-2 border-t-2 border-[#E4C888]" />
          <span className="absolute bottom-1 left-1 h-2.5 w-2.5 border-b-2 border-l-2 border-[#E4C888]" />
          <span className="absolute bottom-1 right-1 h-2.5 w-2.5 border-b-2 border-r-2 border-[#E4C888]" />

          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <Compass className="h-8 w-8 text-[#B98B3E]" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
            Official Company
          </p>
          <p className="ddw-serif mt-1 text-[20px] font-bold leading-tight text-[#0B1410]">
            {companyName}
          </p>
          {address && (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] tracking-wide text-[#6B6153]">
              <MapPin className="h-3 w-3 text-[#B98B3E]" />
              {address}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Signature SVG (visible handwriting feel) ── */
function SignatureScribble() {
  return (
    <svg
      viewBox="0 0 240 60"
      className="h-12 w-48"
      aria-hidden="true"
      preserveAspectRatio="xMinYMid meet"
    >
      <path
        d="M8 40 C 20 10, 34 8, 42 30 S 60 50, 72 30 S 92 6, 104 34 S 122 48, 132 26 S 152 8, 164 32 S 184 48, 194 26 S 216 10, 232 28"
        fill="none"
        stroke="#8A6528"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 48 C 60 54, 140 56, 220 42"
        fill="none"
        stroke="#B98B3E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Staff signature ── */
function StaffSignature({ staffName, companyName, tourCode }) {
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/40 bg-[#FDFBF6] px-6 py-5">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="mb-1.5 text-[8.5px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
            Curated By
          </p>
          <p className="ddw-serif text-[18px] font-bold leading-tight text-[#0B1410]">
            {staffName}
          </p>
          <p className="mt-1 text-[10.5px] tracking-wide text-[#6B6153]">
            Safari Consultant · {companyName}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="mb-1.5 flex items-center justify-end gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
            <Award className="h-2.5 w-2.5" />
            Reference
          </p>
          <p className="ddw-serif text-[14px] font-bold italic leading-tight text-[#8A6528]">
            № {tourCode}
          </p>
        </div>
      </div>

      {/* Signature line */}
      <div className="mt-4 pt-4 border-t border-[#B98B3E]/25">
        <SignatureScribble />
        <p className="mt-2 text-[8.5px] uppercase tracking-[0.28em] text-[#8A6528]/70">
          Authorised Signature
        </p>
      </div>
    </div>
  );
}

/* ── Closing CTA ── */
function ClosingCTA({ website }) {
  if (!website) return null;
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/45 bg-[#0B1410] px-7 py-5">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #B98B3E 35%, #E4C888 50%, #B98B3E 65%, transparent)",
        }}
      />
      <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#E4C888]/60" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#E4C888]/60" />

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 shrink-0 text-[#E4C888]" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#E4C888]">
              Begin Your Next Journey
            </p>
            <p className="ddw-serif text-[14px] leading-tight text-[#F8F4EA]/90">
              Visit us online or reach out any time — our team is always here.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right shrink-0">
          <div>
            <p className="text-[8.5px] font-bold uppercase tracking-[0.32em] text-[#E4C888]/70">
              Website
            </p>
            <p className="ddw-serif text-[14px] font-bold leading-tight text-[#F8F4EA]">
              {website}
            </p>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-[#E4C888]" />
        </div>
      </div>
    </div>
  );
}

/* ── Colophon footer note ── */
function ColophonFooter({ companyName }) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-[#B98B3E]/35 pt-5">
      <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#8A6528]/70">
        Thank you for choosing {companyName}
      </span>
      <span className="text-[9px] uppercase tracking-[0.32em] text-[#8A6528]/60">
        End of Proposal
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Page8PDFCompanyAboutSection({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info } = itinerary || {};

  if (!client_info) return null;

  // Only the company's own details: never fill gaps with another company's.
  const companyName = client_info.company_name || client_info.staff_company || "";
  const companyAddress = client_info.company_address || null;
  const companyCountry = client_info.company_country || null;
  const companyPhone = client_info.company_phone || null;
  const companyWhatsApp = client_info.company_whatsapp || null;
  const companySocials = (client_info.company_socials || []).map((sm) => ({ name: sm.name, handle: sm.handle }));
  const companyEmail = client_info.company_email || null;


  function cleanWebsite(url) {
      if (!url || typeof url !== "string" || !url.trim()) return null;
      let cleaned = url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
      cleaned = cleaned.replace(/^www\./i, "");
      return `www.${cleaned}`;
    }


  const companyWebsite = cleanWebsite(client_info.company_website)
    
  const companyLogo = client_info.company_logo || null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${
    client_info.first_name || ""
  } ${client_info.last_name || ""}`.trim();

  const tourCode = client_info.tour_code || "—";
  const staffName = client_info.creator_full_name || "Our Safari Team";

  const startYear = (() => {
    const d = new Date(client_info.tour_start_date);
    return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  })();




  const companyAbout =
    client_info.company_about ||
    "We are a premier safari operator dedicated to crafting unforgettable, bespoke wildlife experiences in the heart of Tanzania. Our commitment to excellence, conservation, and personalised service ensures that every journey is nothing short of extraordinary.";

  /* ── Sections array ── */
  const sections = [
    {
      id: "intro",
      weight: 70,
      element: <CompanyIntro companyName={companyName} about={companyAbout} />,
    },
    {
      id: "contacts",
      weight: 150,
      element: (
        <ContactGrid
          address={companyAddress}
          country={companyCountry}
          whatsapp={companyWhatsApp}
          phone={companyPhone}
          email={companyEmail}
          website={companyWebsite}
        />
      ),
    },
    {
      id: "social",
      weight: 55,
      element: <SocialMediaRow accounts={companySocials} />,
    },
    {
      id: "ornament",
      weight: 20,
      element: <Ornament className="opacity-80" />,
    },
    {
      id: "quote",
      weight: 70,
      element: (
        <MotivationQuote
          quote="The world is a book, and those who do not travel read only one page. May your journey through Tanzania be a chapter you revisit for a lifetime."
          attribution={`${companyName} · ${startYear}`}
        />
      ),
    },
    {
      id: "logo",
      weight: 70,
      element: (
        <LogoPlate
          logoUrl={companyLogo}
          companyName={companyName}
          address={companyAddress}
        />
      ),
    },
    {
      id: "signature",
      weight: 90,
      element: (
        <StaffSignature
          staffName={staffName}
          companyName={companyName}
          tourCode={tourCode}
        />
      ),
    },
    {
      id: "cta",
      weight: 50,
      element: <ClosingCTA website={companyWebsite} />,
    },
    {
      id: "colophon",
      weight: 25,
      element: <ColophonFooter companyName={companyName} />,
    },
  ];

  return (
    <PdfBookPage
      tourCode={tourCode}
      leftRailLabel={`${companyName} · About`}
      watermarkSide="right"
      opener={
        <ChapterOpener
          part="Part Nine"
          icon={<Building2 />}
          title="About Us & Contact"
          subtitle={`Prepared for ${clientName} · Ready to help you plan your next journey.`}
        />
      }
      openerWeight={60}
      sections={sections}
    />
  );
}