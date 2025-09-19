import DemonSlayer from '../assets/DemonSlayer.jpg'
import ChainsawMan from '../assets/ChainsawMan.jpg'
import OnePiece from '../assets/OnePiece.jpg'

const BookComponent = () => {
  return (
    <section className="px-6 py-5  md:px-16">
      <h1 className="text-xl font-bold text-[#E74C3C] mb-6">Featured List</h1>

      {/* Fixed-width card grid */}
      <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-6">
        
        {/* Card */}
        <div className="relative w-[200px] h-[280px] rounded-lg overflow-hidden shadow-lg group transition-opacity duration-300 hover:opacity-90">
          <img
            src={DemonSlayer}
            alt="Demon Slayer"
            className="w-full h-full object-cover"
          />
          {/* Overlay (fixed background) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/40 px-3 py-3">
            <div className="transition-transform duration-300 group-hover:-translate-y-2">
              <p className="text-white font-extrabold text-sm tracking-wide">
                Demon Slayer
              </p>
              <p className="text-gray-200 font-semibold text-xs">
                Koyoharu Gotouge
              </p>
            </div>
          </div>
        </div>

        {/* Repeat for other cards */}
        <div className="relative w-[200px] h-[280px] rounded-lg overflow-hidden shadow-lg group transition-opacity duration-300 hover:opacity-90">
          <img
            src={OnePiece}
            alt="One Piece"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/40 px-3 py-3">
            <div className="transition-transform duration-300 group-hover:-translate-y-2">
              <p className="text-white font-extrabold text-sm tracking-wide">
                One Piece
              </p>
              <p className="text-gray-200 font-semibold text-xs">
                Eiichiro Oda
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-[200px] h-[280px] rounded-lg overflow-hidden shadow-lg group transition-opacity duration-300 hover:opacity-90">
          <img
            src={ChainsawMan}
            alt="Chainsaw Man"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/40 px-3 py-3">
            <div className="transition-transform duration-300 group-hover:-translate-y-2">
              <p className="text-white font-extrabold text-sm tracking-wide">
                Chainsaw Man
              </p>
              <p className="text-gray-200 font-semibold text-xs">
                Tatsuki Fujimoto
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-[200px] h-[280px] rounded-lg overflow-hidden shadow-lg group transition-opacity duration-300 hover:opacity-90">
          <img
            src={ChainsawMan}
            alt="Chainsaw Man"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/40 px-3 py-3">
            <div className="transition-transform duration-300 group-hover:-translate-y-2">
              <p className="text-white font-extrabold text-sm tracking-wide">
                Chainsaw Man
              </p>
              <p className="text-gray-200 font-semibold text-xs">
                Tatsuki Fujimoto
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-[200px] h-[280px] rounded-lg overflow-hidden shadow-lg group transition-opacity duration-300 hover:opacity-90">
          <img
            src={ChainsawMan}
            alt="Chainsaw Man"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/40 px-3 py-3">
            <div className="transition-transform duration-300 group-hover:-translate-y-2">
              <p className="text-white font-extrabold text-sm tracking-wide">
                Chainsaw Man
              </p>
              <p className="text-gray-200 font-semibold text-xs">
                Tatsuki Fujimoto
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}

export default BookComponent
