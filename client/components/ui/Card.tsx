interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl bg-white border border-slate-100 shadow-sm p-5
        ${onClick ? "cursor-pointer hover:shadow-md hover:border-emerald-100 transition-all duration-150 active:scale-[0.98]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
