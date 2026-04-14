import { Leaf } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <img src="/headermsit.png" alt="Logo 1"
      style={{ width: 90, height: 90, objectFit: 'contain' }} />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold leading-tight">
            Green Sustainability Pledge
          </h1>
          <p className="text-green-200 text-xs md:text-sm mt-0.5 leading-snug">
            An initiative taken by <span className="font-semibold text-white">Greenovation Club</span> of{' '}
            <span className="font-semibold text-white">Meghnad Saha Institute of Technology</span>
          </p>
        </div>
      </div>
    </header>
  );
}
