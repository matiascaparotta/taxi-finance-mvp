function Stat({ label, value, detail = null }) {
    return (
      <div>
        <p className="text-sm text-slate-400">{label}</p>
  
        <p className="mt-1 text-lg font-semibold text-white">
          {value}
        </p>

        {detail && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {detail}
          </p>
        )}
      </div>
    );
  }
  
  export default Stat;
