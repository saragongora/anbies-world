import { useEffect, useRef } from "react";
import fundo from "./assets/fundo.mp3"; // ajuste se necessário

export default function BackgroundMusic() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // 🔊 define volume inicial (30%)
    }

    // Desbloqueia o áudio após a primeira interação do usuário
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
