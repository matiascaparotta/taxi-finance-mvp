import { useEffect, useState } from "react";
import { getWorkDays } from "../services/workDayService";

function HomePage() {
  const [workDays, setWorkDays] = useState([]);

  useEffect(() => {
    loadWorkDays();
  }, []);

  const loadWorkDays = async () => {
    try {
      const data = await getWorkDays();
      setWorkDays(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">
        Bienvenido a Taxi Finance 🚖
      </h2>

      <p className="mb-6">
        Jornadas registradas: <strong>{workDays.length}</strong>
      </p>
    </section>
  );
}

export default HomePage;