function Card({ children, className = "" }) {
    return (
      <div
        className={`
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-6
          shadow-lg
          ${className}
        `}
      >
        {children}
      </div>
    );
  }
  
  export default Card;