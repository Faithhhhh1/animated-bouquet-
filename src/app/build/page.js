'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { flowers, occasions, themes, closings, suggestFlowers } from '@/lib/flowers';
import { vases } from '@/lib/vases';
import { encodeBouquet } from '@/lib/encoding';
import { saveBouquetToGarden } from '@/lib/storage';
import { toPng } from 'html-to-image';
import FlowerSVG from '@/components/FlowerSVG';
import VaseSVG from '@/components/VaseSVG';
import BouquetRenderer from '@/components/BouquetRenderer';
import ErrorBoundary from '@/components/ErrorBoundary';

const TOTAL_STEPS = 6;

const musicOptions = [
  { id: 'gentle', name: '🎵 Gentle Piano', description: 'Soft, calming piano melody' },
  { id: 'cheerful', name: '🎶 Cheerful Ukulele', description: 'Upbeat, happy strumming' },
  { id: 'romantic', name: '🎻 Romantic Strings', description: 'Elegant violin & cello' },
  { id: 'nature', name: '🌿 Nature Sounds', description: 'Birds, gentle breeze, water' },
  { id: 'none', name: '🔇 No Music', description: 'Silent delivery' },
];

function BuildContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBW = searchParams.get('bw') === 'true';

  const [step, setStep] = useState(1);
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [selectedVase, setSelectedVase] = useState('modern');
  const [occasion, setOccasion] = useState('');
  const [theme, setTheme] = useState('classic');
  const [card, setCard] = useState({
    recipientName: '',
    message: '',
    senderName: '',
    closing: 'Sincerely,',
  });
  const [scheduleDate, setScheduleDate] = useState('');
  const [musicChoice, setMusicChoice] = useState('gentle');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [hoveredFlower, setHoveredFlower] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  // Suggest flowers when occasion changes
  useEffect(() => {
    if (occasion) {
      const suggested = suggestFlowers(occasion);
      setSuggestion(suggested);
    } else {
      setSuggestion(null);
    }
  }, [occasion]);

  const toggleFlower = useCallback((flowerId) => {
    setSelectedFlowers(prev => {
      if (prev.includes(flowerId)) {
        return prev.filter(f => f !== flowerId);
      }
      if (prev.length >= 10) return prev;
      return [...prev, flowerId];
    });
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1: return selectedFlowers.length >= 3;
      case 2: return !!selectedVase;
      case 3: return true;
      case 4: return card.message.trim().length > 0;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const generateShareUrl = useCallback(() => {
    const data = {
      f: selectedFlowers,
      v: selectedVase,
      o: occasion,
      t: theme,
      c: card,
      m: musicChoice,
      s: scheduleDate || null,
      bw: isBW,
      ts: Date.now(),
    };

    const encoded = encodeBouquet(data);
    if (encoded) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
const url = `${baseUrl}/animated-bouquet/bouquet?d=${encoded}`;
setShareUrl(url);

      // Save to garden
      saveBouquetToGarden({
        flowers: selectedFlowers,
        vase: selectedVase,
        occasion,
        theme,
        card,
        music: musicChoice,
        schedule: scheduleDate || null,
        bw: isBW,
        encoded,
      });
    }
  }, [selectedFlowers, selectedVase, occasion, theme, card, musicChoice, scheduleDate, isBW]);

  const handleNext = () => {
    if (step === 5) {
      generateShareUrl();
    }
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsImage = async () => {
    const el = document.getElementById('bouquet-capture');
    if (!el) return;

    try {
      const dataUrl = await toPng(el, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: (themes.find(t => t.id === theme) || themes[0]).bg,
      });
      const link = document.createElement('a');
      link.download = `bouquet-for-${card.recipientName || 'you'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Download failed:', e);
      alert('Download failed. Please try taking a screenshot instead.');
    }
  };

  const qrUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
    : '';

  const themeStyle = isBW ? { filter: 'grayscale(100%)' } : {};

  return (
    <div className="min-h-screen relative z-10" style={themeStyle}>
      {/* Header */}
      <header className="py-6 text-center border-b border-white/20" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}>
        <Link href="/" className="font-script text-4xl hover:text-bloom-rose transition-colors" style={{ color: '#4a1a2a', textShadow: '0 0 15px rgba(255,255,255,0.6), 0 1px 6px rgba(140,40,70,0.3)' }}>
          Bloomshire
        </Link>
      </header>

      {/* Progress bar */}
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="flex items-center justify-center">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex items-center">
              <button
                className={`step-dot ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : 'pending'
                  } ${i + 1 < step ? 'cursor-pointer hover:scale-150' : 'cursor-default'}`}
                onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                aria-label={`Step ${i + 1}${i + 1 < step ? ' (completed, click to go back)' : i + 1 === step ? ' (current)' : ''}`}
                disabled={i + 1 > step}
              />
              {i < TOTAL_STEPS - 1 && (
                <div className={`step-line w-8 ${i + 1 < step ? 'completed' : 'pending'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-charcoal/50 mt-2 font-display tracking-widest">
          STEP {step} OF {TOTAL_STEPS}
        </p>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg" style={{ border: '1px solid rgba(255,255,255,0.5)' }}>
          {/* STEP 1: Pick Flowers */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-center text-lg tracking-[0.2em] mb-2">PICK YOUR BLOOMS</h2>
              <p className="text-center text-charcoal/60 text-sm mb-8">
                Select 3 to 10 flowers for your bouquet ({selectedFlowers.length}/10)
              </p>

              {/* Progress indicator for minimum flowers */}
              <div className="max-w-xs mx-auto mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min((selectedFlowers.length / 3) * 100, 100)}%`,
                        backgroundColor: selectedFlowers.length >= 3 ? '#4a7c59' : '#e84057',
                      }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${selectedFlowers.length >= 3 ? 'text-bloom-leaf' : 'text-bloom-rose'
                    }`}>
                    {selectedFlowers.length >= 3 ? '✓ Ready!' : `${selectedFlowers.length}/3 min`}
                  </span>
                </div>
              </div>

              {/* Suggestion bar */}
              {suggestion && suggestion.length > 0 && (
                <div className="mb-6 p-4 bg-bloom-rose/5 rounded-xl text-center">
                  <p className="text-xs font-display tracking-widest text-bloom-rose mb-2">
                    ✨ SUGGESTED FOR {occasions.find(o => o.id === occasion)?.label?.toUpperCase()}
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {suggestion.map(f => (
                      <button
                        key={f.id}
                        onClick={() => toggleFlower(f.id)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${selectedFlowers.includes(f.id)
                          ? 'bg-bloom-rose text-white border-bloom-rose'
                          : 'border-bloom-rose/30 text-bloom-rose hover:bg-bloom-rose/10'
                          }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                  {/* Quick-add all suggestions */}
                  <button
                    onClick={() => {
                      const toAdd = suggestion.filter(f => !selectedFlowers.includes(f.id)).map(f => f.id);
                      setSelectedFlowers(prev => [...prev, ...toAdd].slice(0, 10));
                    }}
                    className="mt-3 text-xs px-4 py-1.5 bg-bloom-rose text-white rounded-full hover:bg-bloom-rose/90 transition-colors"
                  >
                    ✨ USE ALL SUGGESTIONS
                  </button>
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {flowers.map((flower) => (
                  <div
                    key={flower.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedFlowers.includes(flower.id)}
                    aria-label={`${flower.name} — ${flower.meaning}`}
                    className={`flower-card group ${selectedFlowers.includes(flower.id) ? 'selected' : ''}`}
                    onClick={() => toggleFlower(flower.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlower(flower.id); } }}
                    onMouseEnter={() => setHoveredFlower(flower.id)}
                    onMouseLeave={() => setHoveredFlower(null)}
                  >
                    {selectedFlowers.includes(flower.id) && (
                      <div className="count-badge">
                        {selectedFlowers.indexOf(flower.id) + 1}
                      </div>
                    )}
                    <div className="flex justify-center">
                      <FlowerSVG flowerId={flower.id} size={80} />
                    </div>
                    <p className="text-center text-xs font-medium mt-1">{flower.name}</p>

                    {/* Tooltip with meaning */}
                    <div className="tooltip">
                      <strong>{flower.name}</strong><br />
                      {flower.meaning}<br />
                      <span className="text-gray-300">🌸 {flower.scent}</span><br />
                      <span className="text-gray-300">📅 Birth Month: {flower.birthMonth}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flower detail panel */}
              {hoveredFlower && (
                <div className="mt-6 p-4 bg-white rounded-xl shadow-sm text-center animate-fade-in">
                  {(() => {
                    const f = flowers.find(fl => fl.id === hoveredFlower);
                    return f ? (
                      <>
                        <h3 className="font-serif text-lg font-semibold">{f.name}</h3>
                        <p className="text-bloom-rose text-sm">{f.meaning}</p>
                        <p className="text-charcoal/50 text-xs mt-1">🌺 Scent: {f.scent}</p>
                        <p className="text-charcoal/50 text-xs">📅 Birth Month: {f.birthMonth}</p>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Choose Vase */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-center text-lg tracking-[0.2em] mb-2">CHOOSE A CONTAINER</h2>
              <p className="text-center text-charcoal/60 text-sm mb-8">
                Pick the perfect home for your flowers
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {vases.map((vase) => (
                  <div
                    key={vase.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedVase === vase.id}
                    aria-label={`${vase.name} — ${vase.description}`}
                    className={`vase-card text-center ${selectedVase === vase.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVase(vase.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedVase(vase.id); } }}
                  >
                    <div className="flex justify-center mb-3">
                      <VaseSVG vaseId={vase.id} size={120} />
                    </div>
                    <h3 className="font-serif text-sm font-semibold">{vase.name}</h3>
                    <p className="text-xs text-charcoal/50 mt-1">{vase.description}</p>
                  </div>
                ))}
              </div>

              {/* Preview */}
              {selectedFlowers.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="font-display text-xs tracking-widest text-charcoal/40 mb-4">PREVIEW</p>
                  <BouquetRenderer
                    selectedFlowerIds={selectedFlowers}
                    vaseId={selectedVase}
                    size={240}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Occasion & Theme */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-center text-lg tracking-[0.2em] mb-2">SET THE MOOD</h2>
              <p className="text-center text-charcoal/60 text-sm mb-8">
                Choose an occasion and color theme
              </p>

              {/* Occasion Tags */}
              <div className="mb-8">
                <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3 text-center">OCCASION</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ.id}
                      className={`occasion-tag ${occasion === occ.id ? 'selected' : ''}`}
                      onClick={() => setOccasion(occasion === occ.id ? '' : occ.id)}
                    >
                      {occ.emoji} {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3 text-center">COLOR THEME</h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      className={`theme-card ${theme === t.id ? 'selected' : ''}`}
                      onClick={() => setTheme(t.id)}
                      style={{ backgroundColor: t.bg, border: theme === t.id ? `2px solid ${t.accent}` : '2px solid #e0e0e0' }}
                      title={t.name}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-charcoal/40 mt-2">
                  {themes.find(t => t.id === theme)?.name}
                </p>
              </div>

              {/* Music Selection */}
              <div className="mt-8">
                <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3 text-center">BACKGROUND MUSIC</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-xl mx-auto">
                  {musicOptions.map((m) => (
                    <button
                      key={m.id}
                      className={`p-3 rounded-xl text-left border-2 transition-all text-sm ${musicChoice === m.id
                        ? 'border-bloom-rose bg-bloom-rose/5'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setMusicChoice(m.id)}
                    >
                      <span className="font-medium">{m.name}</span>
                      <p className="text-xs text-charcoal/50 mt-0.5">{m.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Write the Card */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-center text-lg tracking-[0.2em] mb-8">WRITE THE CARD</h2>

              <div className="max-w-lg mx-auto flex gap-6 items-start flex-col md:flex-row">
                {/* Decorative flowers beside card */}
                <div className="hidden md:flex flex-col gap-2 pt-8">
                  {selectedFlowers.slice(0, 3).map((fId, i) => (
                    <div key={fId} className="animate-sway" style={{ animationDelay: `${i * 0.5}s` }}>
                      <FlowerSVG flowerId={fId} size={60} />
                    </div>
                  ))}
                </div>

                {/* Card */}
                <div className="flex-1 w-full">
                  <div className="letter-card">
                    <div className="relative z-10 space-y-4">
                      <div>
                        <span className="text-charcoal/40 text-sm">Dear </span>
                        <input
                          type="text"
                          placeholder="Friend"
                          value={card.recipientName}
                          onChange={(e) => setCard({ ...card, recipientName: e.target.value })}
                          className="border-b border-dashed border-charcoal/20 outline-none text-charcoal w-40 text-base"
                          maxLength={30}
                        />
                      </div>

                      <textarea
                        placeholder="I have so much to tell you, but only this much space on this card! Still, you must know..."
                        value={card.message}
                        onChange={(e) => setCard({ ...card, message: e.target.value })}
                        className="w-full min-h-[120px] resize-none outline-none text-charcoal placeholder:text-charcoal/30 text-sm"
                        maxLength={2000}
                      />

                      <div className="text-right space-y-2">
                        <div>
                          <select
                            value={card.closing}
                            onChange={(e) => setCard({ ...card, closing: e.target.value })}
                            className="bg-transparent outline-none text-sm cursor-pointer border-b border-dashed border-charcoal/20"
                          >
                            {closings.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={card.senderName}
                          onChange={(e) => setCard({ ...card, senderName: e.target.value })}
                          className="border-b border-dashed border-charcoal/20 outline-none text-charcoal text-right w-40 text-sm"
                          maxLength={30}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-right text-xs text-charcoal/30 mt-2">{card.message.length}/2000</p>
                </div>

                {/* Right decorative flowers */}
                <div className="hidden md:flex flex-col gap-2 pt-12">
                  {selectedFlowers.slice(3, 6).map((fId, i) => (
                    <div key={fId} className="animate-sway" style={{ animationDelay: `${i * 0.7 + 0.3}s` }}>
                      <FlowerSVG flowerId={fId} size={60} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Preview & Customize */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-center text-lg tracking-[0.2em] mb-2">PREVIEW YOUR BOUQUET</h2>
              <p className="text-center text-charcoal/60 text-sm mb-8">
                Review your creation before sending
              </p>

              <div id="bouquet-capture" className="max-w-md mx-auto">
                {/* Bouquet with decorative background */}
                <div className="relative bg-gradient-to-b from-transparent via-bloom-rose/[0.03] to-transparent rounded-3xl py-6">
                  {/* Soft radial glow behind bouquet */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      top: '15%',
                      width: 220,
                      height: 220,
                      background: 'radial-gradient(circle, rgba(244,160,181,0.1) 0%, transparent 70%)',
                    }}
                  />
                  <BouquetRenderer
                    selectedFlowerIds={selectedFlowers}
                    vaseId={selectedVase}
                    size={320}
                  />
                </div>

                {/* Flower names ribbon */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-2 mb-6 px-4">
                  {selectedFlowers.map((fId, i) => {
                    const f = flowers.find(fl => fl.id === fId);
                    return f ? (
                      <span
                        key={`${fId}-${i}`}
                        className="text-[10px] px-2.5 py-0.5 rounded-full border font-medium"
                        style={{
                          borderColor: `${f.color}40`,
                          backgroundColor: `${f.color}10`,
                          color: f.color === '#ffffff' || f.color === '#fff5ee' ? '#666' : f.color,
                        }}
                      >
                        {f.name}
                      </span>
                    ) : null;
                  })}
                </div>

                {/* Card preview — elevated design */}
                <div className="relative max-w-sm mx-auto">
                  {/* Decorative tape / wax seal */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-bloom-rose/80 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs">💌</span>
                  </div>
                  <div className="letter-card rounded-xl shadow-lg border-bloom-rose/10">
                    <div className="relative z-10 pt-2">
                      <p className="text-sm text-charcoal/80">Dear {card.recipientName || 'Friend'},</p>
                      <p className="text-sm mt-3 whitespace-pre-wrap leading-relaxed">{card.message}</p>
                      <div className="text-right mt-6 space-y-0.5">
                        <p className="text-sm italic text-charcoal/70">{card.closing}</p>
                        <p className="text-sm font-medium">{card.senderName || 'Anonymous'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Occasion tag */}
                {occasion && (
                  <div className="text-center mt-5">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-bloom-rose/8 text-bloom-rose rounded-full text-xs font-display tracking-wider shadow-sm">
                      <span>{occasions.find(o => o.id === occasion)?.emoji}</span>
                      {occasions.find(o => o.id === occasion)?.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Schedule delivery */}
              <div className="max-w-sm mx-auto mt-8 p-4 bg-white rounded-xl shadow-sm">
                <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3">⏰ SCHEDULE DELIVERY (OPTIONAL)</h3>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm outline-none focus:border-bloom-rose"
                  min={new Date().toISOString().slice(0, 16)}
                />
                {scheduleDate && (
                  <p className="text-xs text-bloom-sage mt-2">
                    🕐 Will be best opened on {new Date(scheduleDate).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Share */}
          {step === 6 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-center text-lg tracking-[0.2em] mb-2">SEND THE BOUQUET</h2>
              <p className="text-center text-charcoal/60 text-sm mb-8">
                Share your digital bouquet with someone special
              </p>

              {/* Mini bouquet preview */}
              <div className="max-w-sm mx-auto mb-8">
                <BouquetRenderer
                  selectedFlowerIds={selectedFlowers}
                  vaseId={selectedVase}
                  size={240}
                />
              </div>

              {/* Card preview */}
              <div className="letter-card max-w-sm mx-auto mb-8">
                <div className="relative z-10">
                  <p className="text-sm">Dear {card.recipientName || 'Friend'}</p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{card.message}</p>
                  <div className="text-right mt-4">
                    <p className="text-sm">{card.closing}</p>
                    <p className="text-sm">{card.senderName || 'Anonymous'}</p>
                  </div>
                </div>
              </div>

              {/* Share URL */}
              {shareUrl && (
                <div className="max-w-lg mx-auto space-y-6">
                  {/* Copy link */}
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3">🔗 SHAREABLE LINK</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 p-2 bg-gray-50 rounded-lg text-xs text-charcoal/70 outline-none"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="btn-primary text-xs px-4 py-2"
                      >
                        {copied ? '✓ COPIED!' : 'COPY'}
                      </button>
                    </div>
                  </div>

                  {/* Share buttons */}
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3">📱 SHARE VIA</h3>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`🌸 I made you a digital bouquet! ${shareUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent('A Digital Bouquet for You 🌸')}&body=${encodeURIComponent(`Someone special made you a digital bouquet!\n\nOpen it here: ${shareUrl}`)}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Email
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🌸 I just sent a digital bouquet! Check it out: ${shareUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                      >
                        X / Twitter
                      </a>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: 'A Digital Bouquet for You 🌸',
                              text: 'Someone special made you a digital bouquet!',
                              url: shareUrl,
                            });
                          }
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                      >
                        More...
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3">📷 QR CODE</h3>
                    <div className="qr-container inline-block">
                      <img
                        src={qrUrl}
                        alt="QR Code"
                        width={180}
                        height={180}
                        className="rounded"
                      />
                    </div>
                    <p className="text-xs text-charcoal/40 mt-2">Scan to open the bouquet</p>
                  </div>

                  {/* Download */}
                  <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <h3 className="font-display text-xs tracking-widest text-charcoal/60 mb-3">📥 DOWNLOAD</h3>
                    <button onClick={downloadAsImage} className="btn-secondary text-xs">
                      DOWNLOAD AS IMAGE
                    </button>
                  </div>

                  {/* Create another */}
                  <div className="text-center pt-4">
                    <Link href="/build" className="btn-ghost">
                      CREATE ANOTHER BOUQUET
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.4)' }}>
        <div className="max-w-md mx-auto flex justify-between items-center">
          {step > 1 ? (
            <button onClick={handleBack} className="btn-ghost text-sm">
              BACK
            </button>
          ) : (
            <Link href="/" className="btn-ghost text-sm">
              HOME
            </Link>
          )}

          {step < TOTAL_STEPS && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`btn-primary text-sm ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {step === 5 ? 'CREATE SHAREABLE LINK' : 'NEXT'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuildPage() {
  return (
    <ErrorBoundary fallbackMessage="Something went wrong while building your bouquet. Please try again.">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className="animate-spin-slow inline-block mb-4">🌸</div>
            <p className="font-display text-sm tracking-widest text-charcoal/50">LOADING...</p>
          </div>
        </div>
      }>
        <BuildContent />
      </Suspense>
    </ErrorBoundary>
  );
}
