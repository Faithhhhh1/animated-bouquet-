'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getGarden,
  deleteBouquetFromGarden,
  toggleFavorite,
  isFavorite,
} from '@/lib/storage';

import BouquetRenderer from '@/components/BouquetRenderer';


export default function GardenPage() {

  const [garden, setGarden] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [filter, setFilter] = useState('all');

  // 🔒 ADMIN LOGIN
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');


  useEffect(() => {
    loadGarden();
  }, []);


  const loadGarden = () => {
    const items = getGarden();

    setGarden(items);

    const favMap = {};

    items.forEach((item) => {
      favMap[item.id] = isFavorite(item.id);
    });

    setFavorites(favMap);
  };


  const handleToggleFavorite = (id) => {

    const value = toggleFavorite(id);

    setFavorites((prev) => ({
      ...prev,
      [id]: value,
    }));

  };


  const handleDelete = (id) => {

    if (window.confirm('Delete this bouquet?')) {
      deleteBouquetFromGarden(id);
      loadGarden();
    }

  };


  const getShareUrl = (encoded) => {

    if (typeof window === 'undefined') {
      return '';
    }

    return `${window.location.origin}/animated-bouquet/bouquet?d=${encoded}`;

  };



  // 🔒 PASSWORD SCREEN
  if (!isAdmin) {

    return (

      <main className="min-h-screen flex items-center justify-center relative z-10">

        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl text-center">


          <h1 className="font-script text-5xl mb-6">
            🌸 Admin Garden
          </h1>


          <input
            type="password"
            placeholder="Password"
            className="border rounded-xl px-5 py-3 text-black"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <button

            className="block mx-auto mt-5 bg-pink-500 text-white px-8 py-3 rounded-full"

            onClick={() => {

              if (password === 'ArsthLivesForYou!!') {

                setIsAdmin(true);

              } else {

                alert('Wrong password');

              }

            }}

          >

            Enter Garden

          </button>


        </div>

      </main>

    );

  }



  const filtered =
    filter === 'favorites'
      ? garden.filter((b) => favorites[b.id])
      : garden;



  return (

    <main className="min-h-screen relative z-10">


      <header className="py-6 text-center bg-white/80">


        <Link
          href="/"
          className="font-script text-4xl"
        >

          Bloomshire

        </Link>


      </header>




      <section className="max-w-5xl mx-auto p-8">


        <div className="bg-white/80 rounded-3xl p-8 shadow-lg">



          <h1 className="text-center tracking-widest mb-8">

            🌸 OUR GARDEN

          </h1>




          <div className="flex justify-center gap-4 mb-8">


            <button

              onClick={() => setFilter('all')}

              className="bg-black text-white px-5 py-2 rounded-full"

            >

              ALL ({garden.length})

            </button>



            <button

              onClick={() => setFilter('favorites')}

              className="bg-pink-500 text-white px-5 py-2 rounded-full"

            >

              ❤️ FAVORITES

            </button>


          </div>





          {filtered.length === 0 ? (


            <div className="text-center py-20">


              <h2 className="text-2xl mb-5">

                No bouquets yet 🌱

              </h2>


              <Link

                href="/build"

                className="bg-pink-500 text-white px-6 py-3 rounded-full"

              >

                Create Bouquet

              </Link>


            </div>


          ) : (


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">



              {filtered.map((bouquet) => (


                <div

                  key={bouquet.id}

                  className="bg-white rounded-2xl shadow p-5"

                >



                  <BouquetRenderer

                    selectedFlowerIds={bouquet.flowers || []}

                    vaseId={bouquet.vase || 'modern'}

                    size={180}

                  />



                  {bouquet.card && (


                    <div className="mt-5">


                      <p className="text-sm">

                        "{bouquet.card.message}"

                      </p>


                      <p className="text-xs mt-3">

                        To: {bouquet.card.recipientName || 'Friend'}

                        <br />

                        From: {bouquet.card.senderName || 'Anonymous'}

                      </p>


                    </div>

                  )}




                  <div className="flex gap-3 mt-5">


                    <button

                      onClick={() =>
                        handleToggleFavorite(bouquet.id)
                      }

                    >

                      {favorites[bouquet.id]
                        ? '❤️'
                        : '🤍'}

                    </button>




                    <button

                      onClick={() =>
                        handleDelete(bouquet.id)
                      }

                    >

                      🗑️

                    </button>


                  </div>





                  {bouquet.encoded && (


                    <div className="flex gap-3 mt-5">


                      <button

                        onClick={() => {

                          navigator.clipboard.writeText(

                            getShareUrl(bouquet.encoded)

                          );

                          alert('Copied!');

                        }}

                        className="bg-gray-100 px-3 py-1 rounded-full"

                      >

                        📋 Copy

                      </button>



                      <Link

                        href={`/bouquet?d=${bouquet.encoded}`}

                        className="bg-pink-500 text-white px-3 py-1 rounded-full"

                      >

                        👁 View

                      </Link>


                    </div>

                  )}



                </div>


              ))}



            </div>


          )}



        </div>



      </section>



    </main>

  );

}
