import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";

const useAccelerometer = () => {
  const [available, setAvailable] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;
    (async () => {
      const isAvailable = await Accelerometer.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        setX(x);
        setY(y);
        setZ(z);
      });
    })();

    return () => subscription?.remove();
  }, []);

  return { available, x, y, z };
};

export default useAccelerometer;
