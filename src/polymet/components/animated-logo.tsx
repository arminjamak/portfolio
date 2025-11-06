export function AnimatedLogo() {
  return (
    <div className="relative w-8 h-8">
      {/* Main circle with A */}
      <div
        className="absolute inset-0 bg-black rounded-full flex items-center justify-center"
        style={{ border: "1.5px solid #808080" }}
      >
        <span className="text-white font-bold text-sm">A</span>
      </div>

      {/* Orbiting dot container */}
      <div
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "3s" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
