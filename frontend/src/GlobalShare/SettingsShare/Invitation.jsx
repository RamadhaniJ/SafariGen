import { useState } from "react";
import {
  Copy,
  Check,
  Share2,
  Gift,
  Sparkles,
  X,
  Link2,
  Users,
  Trophy,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  TikTokIcon,
  InstagramIcon,
  FacebookIcon,
  ThreadsIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from "../../SafariPreview/DigitalPage/SocialIcons/Icons";

/* ─────────────────────────────────────────────────────────────
   REPLACE THESE LATER WITH REAL DATA FROM BACKEND
   ───────────────────────────────────────────────────────────── */
const DUMMY_DATA = {
  inviteCode: "SAFARI-2025-XK9F",
  inviteLink: "https://safarigen.io/join?ref=SAFARI-2025-XK9F",
  rewardAmount: "1,000",
  rewardCurrency: "TZS",
  joinedCount: 3,
  totalEarned: "150,000",
};
/* ───────────────────────────────────────────────────────────── */

const SHARE_MESSAGE = `Hey! I'd love to welcome you to SafariGen — the smartest way to plan safari adventures. Use my invite code and we both get rewarded!`;

export default function InvitationComponentGlobal() {
  // ── Later: fetch from backend and setInviteData(resp.data)
  const [inviteData] = useState(DUMMY_DATA);

  const [copied, setCopied] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  /* ── Copy code to clipboard ── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteData.inviteCode);
      setCopied(true);
      toast.success("Invite code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please try manually.");
    }
  };

  /* ── Copy link to clipboard ── */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteData.inviteLink);
      toast.success("Invite link copied!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  /* ── Native share (mobile) or fallback to popup ── */
  const handleShare = async () => {
    const shareText = `${SHARE_MESSAGE}\n\nCode: ${inviteData.inviteCode}\n${inviteData.inviteLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join SafariGen",
          text: SHARE_MESSAGE,
          url: inviteData.inviteLink,
        });
      } catch (err) {
        // User cancelled — no error toast needed
        if (err?.name !== "AbortError") {
          setShowSharePopup(true);
        }
      }
    } else {
      setShowSharePopup(true);
    }
  };

  /* ── Social share handlers ── */
  const shareText = encodeURIComponent(
    `${SHARE_MESSAGE} Code: ${inviteData.inviteCode}`
  );
  const shareUrl = encodeURIComponent(inviteData.inviteLink);
  const fullText = encodeURIComponent(
    `${SHARE_MESSAGE}\n\nCode: ${inviteData.inviteCode}\n${inviteData.inviteLink}`
  );

  const shareChannels = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: WhatsAppIcon,
      color: "bg-[#E3F1E8] text-[#1E5A3B] border-[#1E5A3B]/25",
      href: `https://wa.me/?text=${fullText}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: FacebookIcon,
      color: "bg-[#E2EEF4] text-[#1D4E68] border-[#1D4E68]/25",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`,
    },
    {
      id: "threads",
      label: "Threads",
      icon: ThreadsIcon,
      color: "bg-[#F6F1E7] text-[#0F2A2E] border-[#E4DCCB]",
      href: `https://www.threads.net/intent/post?text=${fullText}`,
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: InstagramIcon,
      color: "bg-[#FBE5E2] text-[#8E2A1F] border-[#8E2A1F]/25",
      // Instagram has no direct share URL — just copy text and open app
      onClick: async () => {
        await navigator.clipboard.writeText(
          `${SHARE_MESSAGE}\n\nCode: ${inviteData.inviteCode}\n${inviteData.inviteLink}`
        );
        toast.success("Message copied — paste it in your Instagram DM or Story!");
        setTimeout(() => {
          window.open("https://www.instagram.com/", "_blank");
        }, 500);
      },
    },
    {
      id: "tiktok",
      label: "TikTok",
      icon: TikTokIcon,
      color: "bg-[#F6F1E7] text-[#0F2A2E] border-[#E4DCCB]",
      // TikTok has no direct share URL — copy and open
      onClick: async () => {
        await navigator.clipboard.writeText(
          `${SHARE_MESSAGE}\n\nCode: ${inviteData.inviteCode}\n${inviteData.inviteLink}`
        );
        toast.success("Message copied — paste it in your TikTok bio or DM!");
        setTimeout(() => {
          window.open("https://www.tiktok.com/", "_blank");
        }, 500);
      },
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: YouTubeIcon,
      color: "bg-[#FBE5E2] text-[#8E2A1F] border-[#8E2A1F]/25",
      // YouTube — copy and open (usually shared in comments/description)
      onClick: async () => {
        await navigator.clipboard.writeText(
          `${SHARE_MESSAGE}\n\nCode: ${inviteData.inviteCode}\n${inviteData.inviteLink}`
        );
        toast.success("Message copied — paste it in your YouTube description or comment!");
        setTimeout(() => {
          window.open("https://www.youtube.com/", "_blank");
        }, 500);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

      {/* Ambient brand washes */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/12 blur-[150px] rounded-full" />

      <div className="max-w-2xl relative z-10 space-y-8">

        {/* ── Header ── */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2A2E]">
            Invite friends, earn rewards
          </h1>
          <p className="text-sm text-[#6B6459] max-w-lg leading-relaxed">
            Share your unique invite code with friends. When they join SafariGen
            and start planning, you both earn rewards.
          </p>
        </div>

        {/* ── Hero card ── */}
        <div className="relative overflow-hidden bg-[#0F2A2E] border border-[#E4DCCB]/15  p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(15,42,46,0.4)]">

          {/* Ambient glows inside the dark card */}
          <div className="pointer-events-none absolute -top-24 -left-20 w-56 h-56 bg-[#E8772E]/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 w-56 h-56 bg-[#F2B544]/12 rounded-full blur-3xl" />

          <div className="relative space-y-6">

            {/* Icon + title */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8772E] flex items-center justify-center shadow-md shadow-[#E8772E]/30">
                <Gift className="w-5 h-5 text-[#0F2A2E]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#F2B544]">
                  Your invite code
                </p>
                <p className="text-xs text-[#F6F1E7]/70 mt-0.5">
                  Share it with friends to earn {inviteData.rewardCurrency}{" "}
                  {inviteData.rewardAmount}
                </p>
              </div>
            </div>

            {/* Code display */}
            <div className="relative">
              <div className="flex items-center justify-between gap-3 bg-[#1C3B40] border border-[#E4DCCB]/20  px-5 py-4">
                <code className="font-mono text-lg sm:text-xl font-black text-[#F2B544] tracking-wider truncate">
                  {inviteData.inviteCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                    copied
                      ? "bg-[#E3F1E8] text-[#1E5A3B] border border-[#1E5A3B]/25"
                      : "bg-[#E8772E] text-[#0F2A2E] border border-[#E8772E] hover:bg-[#D4661F] active:bg-[#B34F12] active:text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5  bg-[#E8772E] text-[#0F2A2E] text-sm font-bold
                           shadow-lg shadow-[#E8772E]/25 transition-all duration-300
                           hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                           active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                <Share2 className="w-4 h-4" />
                Share invite
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5  bg-transparent border border-[#E4DCCB]/25 text-[#F6F1E7] text-sm font-bold
                           transition-all duration-300
                           hover:bg-[#1C3B40] hover:border-[#E4DCCB]/40
                           active:scale-[0.99]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                <Link2 className="w-4 h-4" />
                Copy link
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#E4DCCB]  p-5 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FCE9DA] flex items-center justify-center">
                <Users className="w-4 h-4 text-[#B34F12]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                Friends joined
              </span>
            </div>
            <p className="text-2xl font-black text-[#0F2A2E] tabular-nums">
              {inviteData.joinedCount}
            </p>
          </div>

          <div className="bg-white border border-[#E4DCCB]  p-5 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FDF4DD] flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#7A4E08]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                Total earned
              </span>
            </div>
            <p className="text-2xl font-black text-[#0F2A2E] tabular-nums">
              <span className="text-xs font-bold text-[#6B6459] mr-1">
                {inviteData.rewardCurrency}
              </span>
              {inviteData.totalEarned}
            </p>
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="bg-white border border-[#E4DCCB]  p-6 shadow-[0_1px_2px_rgba(15,42,46,0.04)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4DCCB]">
            <div className="w-8 h-8 bg-[#FCE9DA] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#B34F12]" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0F2A2E]">
              How it works
            </h3>
          </div>

          <div className="space-y-3">
            {[
              "Share your unique invite code with friends",
              "They sign up on SafariGen and start planning",
              "You both get rewarded instantly",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 l bg-[#FCE9DA] text-[#B34F12] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-[#6B6459] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Share popup ── */}
      {showSharePopup && (
        <div
          onClick={() => setShowSharePopup(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F2A2E]/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[#E4DCCB]  p-6 shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                  Share via
                </p>
                <h3 className="text-lg font-bold text-[#0F2A2E] mt-0.5">
                  Pick a channel
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSharePopup(false)}
                className="w-9 h-9 border border-[#E4DCCB] bg-white text-[#6B6459] hover:bg-[#F6F1E7] hover:text-[#0F2A2E] flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Channels grid */}
            <div className="grid grid-cols-3 gap-3">
              {shareChannels.map((ch) => {
                const Icon = ch.icon;
                const content = (
                  <>
                    <span
                      className={`w-12 h-12 rounded-2xl  flex items-center justify-center border transition-transform duration-200 group-hover:scale-110 ${ch.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold text-[#0F2A2E]">
                      {ch.label}
                    </span>
                  </>
                );

                if (ch.href) {
                  return (
                    <a
                      key={ch.id}
                      href={ch.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={ch.onClick}
                    className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    {content}
                  </button>
                );
              })}
            </div>

            {/* Footer tip */}
            <div className="mt-6 pt-4 border-t border-[#E4DCCB]">
              <p className="text-[11px] text-[#6B6459] leading-relaxed text-center">
                Your invite code and link are included automatically when sharing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}