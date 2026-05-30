import { Gyroscope } from "expo-sensors";
import { useEffect, useState } from "react";

const useGyroscope = () => {
  const [available, setAvailable] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;
    (async () => {
      const isAvailable = await Gyroscope.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;
      Gyroscope.setUpdateInterval(100);
      subscription = Gyroscope.addListener(({ x, y, z }) => {
        setX(x);
        setY(y);
        setZ(z);
      });
    })();

    return () => subscription?.remove();
  }, []);

  return { available, x, y, z };
};

export default useGyroscope;
