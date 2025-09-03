import { createContext, useContext, useRef, useEffect } from "react";
import fundo from "./assets/fundo.mp3";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
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
    return () => document.removeEventListener("click", enableAudio);
  }, []);

  const pauseMusic = () => {
    audioRef.current?.pause();
  };

  const resumeMusic = () => {
    audioRef.current?.play().catch(() => {});
  };

  return (
    <MusicContext.Provider value={{ pauseMusic, resumeMusic }}>
      <audio ref={audioRef} src={fundo} autoPlay loop muted />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
