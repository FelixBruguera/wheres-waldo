import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";
import { formatSeconds } from "../utils/formatSeconds";

const Timer = ({ startTime }) => {
  const initialDate = new Date(startTime + "Z");
  const initialSecondsElapsed = differenceInSeconds(new Date(), initialDate);
  const [secondsElapsed, setSecondsElapsed] = useState(initialSecondsElapsed);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  return (
    <p
      className="font-bold text-accent"
      aria-label="Time Elapsed"
      title="Time Elapsed"
    >
      {formatSeconds(secondsElapsed)}
    </p>
  );
};

export default Timer;
