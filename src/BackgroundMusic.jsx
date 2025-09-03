import { useEffect, useRef } from "react";
import fundo from "./assets/fundo.mp3"; 

export default function BackgroundMusic() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; 
    }

    const enableAudio = () => {
      if (audio) {
        audio.muted = false;
        audio.play().catch(() => {});
      }
      document.removeEventListener("click", enableAudio);
    };

    document.addEventListener("click", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={fundo}
      autoPlay
      loop
      muted
    />
  );
}
