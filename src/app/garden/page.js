'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGarden, deleteBouquetFromGarden, toggleFavorite, isFavorite } from '@/lib/storage';
import { flowers as flowerData, occasions } from '@/lib/flowers';
import BouquetRenderer from '@/components/BouquetRenderer';

export default function GardenPage() {
  const [garden, setGarden] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  // 🔒 ADMIN PASSWORD START
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center relative z-10">
        <div className="bg-white/80 p-8 rounded-3xl text-center shadow-lg">
          <h1 className="text-3xl mb-5">
            🌸 Admin Garden
          </h1>

          <input
            type="password"
            placeholder="Enter password"
            className="border p-3 rounded-xl text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="block mx-auto mt-5 px-6 py-3 rounded-full bg-pink-500 text-white"
            onClick={() => {
              if (password === "ArsthLivesForYou!!") {
                setIsAdmin(true);
              } else {
                alert("Wrong password");
              }
            }}
          >
            Enter Garden
          </button>
        </div>
      </main>
    );
  }
  // 🔒 ADMIN PASSWORD END


  useEffect(() => {
    setMounted(true);
    loadGarden();
  }, []);

  const loadGarden = () => {
    const items = getGarden();
    setGarden(items);
    const favMap = {};
    items.forEach(item => {
      favMap[item.id] = isFavorite(item.id);
    });
    setFavorites(favMap);
  };

  const handleToggleFavorite = (id) => {
    const newState = toggleFavorite(id);
    setFavorites(prev => ({ ...prev, [id]: newState }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this bouquet from your garden?')) {
      deleteBouquetFromGarden(id);
      loadGarden();
    }
  };

  const getShareUrl = (encoded) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/bouquet?d=${encoded}`;
  };

  const filtered = filter === 'favorites'
    ? garden.filter(b => favorites[b.id])
    : garden;

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="py-6 text-center border-b border-white/20" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}>
        <Link href="/" className="font-script text-4xl hover:text-bloom-rose transition-colors" style={{ color: '#4a1a2a', textShadow: '0 0 15px rgba(255,255,255,0.6), 0 1px 6px rgba(140,40,70,0.3)' }}>
          Bloomshire
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg" style={{ border: '1px solid rgba(255,255,255,0.5)' }}>
          <h1 className="font-display text-center text-lg tracking-[0.2em] mb-2" style={{ color: '#4a1a2a' }}>OUR GARDEN</h1>
          <p className="text-center text-charcoal/60 text-sm mb-8">
            {garden.length > 0
              ? 'Thanks for stopping by! Here are your created bouquets.'
              : 'Your garden is empty. Create your first bouquet!'}
          </p>

          {/* Filter tabs */}
          {garden.length > 0 && (
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setFilter('all')}
                className={`font-display text-xs tracking-widest px-4 py-2 rounded-full transition-all ${filter === 'all'
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-charcoal hover:bg-gray-100'
                  }`}
              >
                ALL ({garden.length})
              </button>
              <button
                onClick={() => setFilter('favorites')}
                className={`font-display text-xs tracking-widest px-4 py-2 rounded-full transition-all ${filter === 'favorites'
                  ? 'bg-bloom-rose text-white'
                  : 'bg-white text-charcoal hover:bg-gray-100'
                  }`}
              >
                ❤️ FAVORITES ({garden.filter(b => favorites[b.id]).length})
              </button>
            </div>
          )}

          {/* Bouquet Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((bouquet, index) => {
                const occasionData = occasions.find(o => o.id === bouquet.occasion);
                return (
                  <div
                    key={bouquet.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards', opacity: 0 }}
                  >
                    {/* Bouquet preview */}
                    <div className="p-4 flex justify-center bg-gray-50/50">
                      <BouquetRenderer
                        selectedFlowerIds={bouquet.flowers || []}
                        vaseId={bouquet.vase || 'modern'}
                        size={180}
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      {/* Occasion tag */}
                      {occasionData && (
                        <span className="inline-block px-3 py-1 bg-bloom-rose/10 text-bloom-rose rounded-full text-xs font-display tracking-wider">
                          {occasionData.emoji} {occasionData.label}
                        </span>
                      )}

                      {/* Card preview */}
                      {bouquet.card && (
                        <div className="text-sm">
                          <p className="font-mono text-xs text-charcoal/70 line-clamp-2">
                            &ldquo;{bouquet.card.message}&rdquo;
                          </p>
                          <p className="text-xs text-charcoal/40 mt-1">
                            To: {bouquet.card.recipientName || 'Friend'} • From: {bouquet.card.senderName || 'Anonymous'}
                          </p>
                        </div>
                      )}

                      {/* Flower tags */}
                      <div className="flex flex-wrap gap-1">
                        {(bouquet.flowers || []).slice(0, 5).map(fId => {
                          const flower = flowerData.find(f => f.id === fId);
                          return flower ? (
                            <span key={fId} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-charcoal/60">
                              {flower.name}
                            </span>
                          ) : null;
                        })}
                        {(bouquet.flowers || []).length > 5 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-charcoal/40">
                            +{bouquet.flowers.length - 5} more
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <p className="text-xs text-charcoal/30">
                        Created {new Date(bouquet.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleFavorite(bouquet.id)}
                            className="text-lg hover:scale-125 transition-transform"
                            title={favorites[bouquet.id] ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {favorites[bouquet.id] ? '❤️' : '🤍'}
                          </button>
                          <button
                            onClick={() => handleDelete(bouquet.id)}
                            className="text-lg hover:scale-125 transition-transform opacity-40 hover:opacity-100"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {bouquet.encoded && (
                            <button
                              onClick={() => {
                                const url = getShareUrl(bouquet.encoded);
                                navigator.clipboard.writeText(url).then(() => {
                                  alert('Link copied!');
                                });
                              }}
                              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              📋 Copy Link
                            </button>
                          )}
                          {bouquet.encoded && (
                            <Link
                              href={`/bouquet?d=${bouquet.encoded}`}
                              className="text-xs px-3 py-1 bg-bloom-rose text-white rounded-full hover:bg-bloom-rose/80 transition-colors"
                            >
                              👁️ View
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="relative mb-8">
                {/* Decorative illustration */}
                <div className="flex justify-center items-end gap-2">
                  <div className="text-4xl animate-sway" style={{ animationDelay: '0s' }}>🌱</div>
                  <div className="text-5xl animate-sway" style={{ animationDelay: '0.3s' }}>🌿</div>
                  <div className="text-6xl animate-float">🌷</div>
                  <div className="text-5xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
                  <div className="text-4xl animate-sway" style={{ animationDelay: '0.7s' }}>🌱</div>
                </div>
                <div className="mt-2 w-32 h-0.5 bg-bloom-leaf/30 rounded-full mx-auto" />
              </div>
              <h2 className="font-serif text-xl mb-2">
                {filter === 'favorites'
                  ? 'No favorites yet'
                  : 'Your garden awaits'}
              </h2>
              <p className="text-charcoal/60 text-sm mb-8 max-w-xs mx-auto">
                {filter === 'favorites'
                  ? 'Heart a bouquet to save it to your favorites collection.'
                  : 'Every great garden starts with a single bloom. Create your first bouquet and watch your garden grow!'}
              </p>
              <div className="space-y-3">
                <Link href="/build" className="btn-primary block mx-auto max-w-xs">
                  🌺 BUILD YOUR FIRST BOUQUET
                </Link>
                <Link href="/build?bw=true" className="btn-secondary block mx-auto max-w-xs">
                  TRY BLACK & WHITE
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center py-8">
          <Link href="/" className="btn-ghost">
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
