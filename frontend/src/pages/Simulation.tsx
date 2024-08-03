import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import { WIDTH } from "../game/constants";
import { pad } from "../game/padding";

export function Simulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputs, setOutputs] = useState<{ [key: number]: number[] }>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
  });

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current,
        (index: number, startX?: number) => {
          setOutputs((prevOutputs) => {
            return {
              ...prevOutputs,
              [index]: [...(prevOutputs[index] || []), startX || 0],
            };
          });
        }
      );

      // Clean up function to stop the BallManager when the component unmounts
      return () => {
        ballManager.stop();
      };
    }
  }, [canvasRef]);

  return (
    <div className="flex flex-col items-center justify-between h-screen lg:flex-row">
      <div className="flex flex-col justify-center pt-10 mx-16">
        {JSON.stringify(outputs, null, 2)}
      </div>
      <div className="flex flex-col items-center justify-center">
        <canvas ref={canvasRef} width={WIDTH} height={WIDTH}></canvas>
      </div>
    </div>
  );
}
