import { useNavigate } from "react-router-dom";

import HistoryWorkDayCard from "./HistoryWorkDayCard";

function WorkDayCard({ workDay }) {
  const navigate = useNavigate();

  if (!workDay) {
    return null;
  }

  return (
    <HistoryWorkDayCard
      workDay={workDay}
      onClick={() => navigate(`/work-days/${workDay.id}`)}
    />
  );
}

export default WorkDayCard;
