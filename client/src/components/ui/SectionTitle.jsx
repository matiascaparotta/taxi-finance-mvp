function SectionTitle({ title, subtitle }) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
  
        {subtitle && (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        )}
      </div>
    );
  }
  
  export default SectionTitle;