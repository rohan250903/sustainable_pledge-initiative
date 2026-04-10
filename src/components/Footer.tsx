import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-200 py-4 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-2 text-sm">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-green-400 fill-green-400" />
        <span>for a sustainable future by <span className="font-semibold text-white">Rohan Ghosh</span></span>
      </div>
    </footer>
  );
}
