

function Tile({ size = 40, className = "", label, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={`text-[#B98B3E] transition-colors duration-300 group-hover:text-[#16211A] ${className}`}
    >
      <rect
        width="24"
        height="24"
        rx="7"
        className="fill-[#B98B3E]/10 stroke-[#B98B3E]/25 transition-colors duration-300 group-hover:fill-[#B98B3E] group-hover:stroke-[#B98B3E]"
        strokeWidth="1"
      />
      {children}
    </svg>
  );
}

/* ------------------------------- Facebook ------------------------------- */
export function FacebookIcon({ size, className }) {
  return (
    <Tile size={size} className={className} label="Facebook">
      <path
        transform="translate(0,-0.5)"
        fill="currentColor"
        d="M13.3 21v-7.6h2.5l.4-2.9h-2.9V8.7c0-.84.23-1.41 1.44-1.41h1.53V4.68c-.27-.04-1.18-.12-2.24-.12-2.22 0-3.74 1.35-3.74 3.84V10.5H7.8v2.9h2.49V21h3.01z"
      />
    </Tile>
  );
}

/* ------------------------------ Instagram ------------------------------- */
export function InstagramIcon({ size, className }) {
  return (
    <Tile size={size} className={className} label="Instagram">
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="3.7"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.15" cy="7.85" r="1" fill="currentColor" />
    </Tile>
  );
}

/* -------------------------------- TikTok -------------------------------- */
export function TikTokIcon({ size, className }) {
  return (
    <Tile size={size} className={className} label="TikTok">
      <g transform="translate(4.5,4.5) scale(0.625)">
        <path
          fill="currentColor"
          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        />
      </g>
    </Tile>
  );
}

/* -------------------------------- YouTube ------------------------------- */
export function YouTubeIcon({ size, className }) {
  return (
    <Tile size={size} className={className} label="YouTube">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M6.2 6.6h11.6a2.7 2.7 0 0 1 2.7 2.7v5.4a2.7 2.7 0 0 1-2.7 2.7H6.2a2.7 2.7 0 0 1-2.7-2.7V9.3a2.7 2.7 0 0 1 2.7-2.7Z
           M10.4 9.6v4.8l4.4-2.4-4.4-2.4Z"
      />
    </Tile>
  );
}

/* -------------------------------- Twitter ------------------------------- */
export function TwitterIcon({ size, className }) {
  return (
    <Tile size={size} className={className} label="Twitter">
      <g transform="translate(4.56,4.56) scale(0.62)">
        <path
          fill="currentColor"
          d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
        />
      </g>
    </Tile>
  );
}

/* -------------------------------- Threads ------------------------------- */
export function ThreadsIcon({ size, className }) {
  return (
    <Tile size={size} className={className} label="Threads">
      <g transform="translate(4.56,4.56) scale(0.62)">
        <path
          fill="currentColor"
          d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"
        />
      </g>
    </Tile>
  );
}


/* ------------------------------ WhatsApp ------------------------------- */
export function WhatsAppIcon({ size, className }) {
  return (
    <Tile size={size} className={className} label="WhatsApp">
      {/* Speech bubble with tail */}
      <path
        d="M12 5.5a6.5 6.5 0 0 0-5.56 9.86L5.5 18.5l3.2-.86A6.5 6.5 0 1 0 12 5.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9.9 9.4c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.2.3-.8.8-.8 1.9s.7 2.2.8 2.4c.1.2 1.4 2.2 3.4 3 1.7.7 2 .5 2.4.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.2-.2-.4-.3-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.2.2-.5.7-.6.8-.1.1-.3.1-.4 0-.2-.1-.8-.3-1.5-.9-.6-.6-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.2-.2.2-.4 0-.1 0-.2-.1-.4 0-.1-.5-1.3-.7-1.7Z"
        fill="currentColor"
      />
    </Tile>
  );
}


export default {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  TwitterIcon,
  ThreadsIcon,
  WhatsAppIcon,
};