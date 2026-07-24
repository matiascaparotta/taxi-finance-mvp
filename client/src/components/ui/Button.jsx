function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-bold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
      >
        {children}
      </button>
    );
  }
  
  export default Button;
