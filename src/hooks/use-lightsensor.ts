import { LightSensor } from "expo-sensors";
import { useEffect, useState } from "react";

const useLightSensor = () => {
  const [available, setAvailable] = useState(false);
  const [illuminance, setIlluminance] = useState(0);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;
    (async () => {
      const isAvailable = await LightSensor.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;
      subscription = LightSensor.addListener(({ illuminance }) => {
        setIlluminance(illuminance);
      });
    })();

    return () => subscription?.remove();
  }, []);

  return { available, illuminance };
};

export default useLightSensor;
