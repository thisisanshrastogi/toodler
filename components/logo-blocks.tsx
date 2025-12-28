type LogoBlocksProps = {
  size?: "sm" | "md" | "lg";
};

export const LogoBlocks = ({ size = "md" }: LogoBlocksProps) => {
  const sizes = {
    sm: "w-10 h-10 text-2xl",
    md: "w-12 h-12 text-3xl",
    lg: "w-16 h-16 text-4xl",
  };

  const letters = [
    { char: "T", color: "bg-pink-400", rotate: "-rotate-3", delay: "0s" },
    { char: "o", color: "bg-yellow-400", rotate: "rotate-2", delay: "0.1s" },
    { char: "o", color: "bg-orange-400", rotate: "-rotate-2", delay: "0.2s" },
    { char: "d", color: "bg-green-400", rotate: "rotate-3", delay: "0.3s" },
    { char: "l", color: "bg-blue-400", rotate: "-rotate-1", delay: "0.4s" },
    { char: "e", color: "bg-purple-400", rotate: "rotate-2", delay: "0.5s" },
    { char: "r", color: "bg-cyan-400", rotate: "-rotate-3", delay: "0.6s" },
  ];

  return (
    <>
      {/* Animation styles */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>

      <div className="flex gap-1 select-none">
        {letters.map((item, index) => (
          <div
            key={index}
            style={{
              animation: `gentleFloat 3s ease-in-out infinite`,
              animationDelay: item.delay,
            }}
            className={`
              ${item.color} ${item.rotate}
              ${sizes[size].split(" ").slice(0, 2).join(" ")}
              flex items-center justify-center
              border-4 border-black rounded-xl
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            `}
          >
            <span
              className={`font-black text-black ${sizes[size].split(" ")[2]}`}
            >
              {item.char}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};
