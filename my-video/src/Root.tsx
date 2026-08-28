import "./index.css";
import { Composition } from "remotion";
import { NameFieldScene } from "./NameFieldScene";
import { VideoSetupScene } from "./VideoSetupScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NameFieldSquare"
        component={NameFieldScene}
        durationInFrames={205}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="NameFieldVertical"
        component={NameFieldScene}
        durationInFrames={215}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* "5s – 10s" duration-label title card */}
      <Composition
        id="VideoSetupSquare"
        component={VideoSetupScene}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="VideoSetupVertical"
        component={VideoSetupScene}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
