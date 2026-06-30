function Stat({ label, value }) {
    return (
      <div>
        <p className="text-sm text-slate-400">{label}</p>
  
        <p className="mt-1 text-lg font-semibold text-white">
          {value}
        </p>
      </div>
    );
  }
  
  export default Stat;