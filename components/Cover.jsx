export default function Cover({ volume = 27, number = 2, year = 2026 }) {
  return (
    <div className="cover">
      <span className="cover__badge"><span className="oa">Açıq giriş</span></span>
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-label={`Üz qabığı: Cild ${volume}, № ${number}, ${year}`}>
        <defs>
          <linearGradient id="cv" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0E2942" />
            <stop offset="1" stopColor="#0A5563" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#cv)" />
        <g fill="none" stroke="#5BC7D4" strokeWidth="1.4" opacity=".4">
          <path d="M-10 300 C 60 270, 110 330, 160 300 S 270 270, 310 300" />
          <path d="M-10 320 C 60 290, 110 350, 160 320 S 270 290, 310 320" />
          <path d="M-10 342 C 60 312, 110 372, 160 342 S 270 312, 310 342" />
          <path d="M-10 366 C 60 336, 110 396, 160 366 S 270 336, 310 366" />
        </g>
        <path d="M150 58l5 17.5 18-.3-14.5 10.8 5.6 17.2L150 110l-14.7 10.2 5.6-17.2L126.3 75l18 .3z" fill="#fff" opacity=".95" />
        <circle cx="150" cy="89" r="3.6" fill="#9A6B1E" />
        <text x="150" y="172" textAnchor="middle" fill="#fff" fontFamily="Spectral" fontSize="30" fontWeight="600">ELMİ</text>
        <text x="150" y="206" textAnchor="middle" fill="#fff" fontFamily="Spectral" fontSize="30" fontWeight="600">ƏSƏRLƏRİ</text>
        <line x1="80" y1="226" x2="220" y2="226" stroke="#5BC7D4" strokeWidth="1.2" opacity=".6" />
        <text x="150" y="250" textAnchor="middle" fill="#bcd6e0" fontFamily="IBM Plex Mono" fontSize="11" letterSpacing="2">CJMSE · DƏNİZ ELMLƏRİ</text>
        <text x="150" y="268" textAnchor="middle" fill="#7E9AAE" fontFamily="IBM Plex Mono" fontSize="9" letterSpacing="1.5">ADDA · BAKI</text>
        <rect x="98" y="284" width="104" height="22" rx="11" fill="rgba(91,199,212,.18)" />
        <text x="150" y="299" textAnchor="middle" fill="#5BC7D4" fontFamily="IBM Plex Mono" fontSize="11" fontWeight="500">CİLD {volume} · № {number} · {year}</text>
      </svg>
    </div>
  );
}
