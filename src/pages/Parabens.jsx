import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import clouds from "../assets/nuvens.svg";
import container from "../assets/container_parabens.svg";
import background from "../assets/fundo.mp4";

import setaAnterior from "../assets/seta_anterior.png";
import setaProximo from "../assets/seta_proximo.png";

import envelopeFechado from "../assets/envelope_fechado.svg";

// envelopes abertos
import envelope1 from "../assets/envelope1.svg";
import envelope2 from "../assets/envelope2.svg";
import envelope3 from "../assets/envelope3.svg";
import envelope4 from "../assets/envelope4.svg";
import envelope5 from "../assets/envelope5.svg";
import envelope6 from "../assets/envelope6.svg";
import envelope7 from "../assets/envelope7.svg";
import envelope8 from "../assets/envelope8.svg";

// títulos
import nome1 from "../assets/nome1.svg";
import nome2 from "../assets/nome2.svg";
import nome3 from "../assets/nome3.svg";
import nome4 from "../assets/nome4.svg";
import nome5 from "../assets/nome5.svg";
import nome6 from "../assets/nome6.svg";
import nome7 from "../assets/nome7.svg";
import nome8 from "../assets/nome8.svg";


import audio1 from "../assets/audio1.mp3";
import audio2 from "../assets/audio2.mp3";
import audio3 from "../assets/audio3.mp3";
import audio4 from "../assets/audio4.mp3";
import audio5 from "../assets/audio5.mp3";
import audio6 from "../assets/audio6.mp3";
import audio7 from "../assets/audio7.mp3";
import audio8 from "../assets/audio8.mp3";


import { useMusic } from "../MusicContext";

const itens = [
  { titulo: nome1, envelope: envelope1, audio: audio1 },
  { titulo: nome2, envelope: envelope2, audio: audio2 },
  { titulo: nome3, envelope: envelope3, audio: audio3 },
  { titulo: nome4, envelope: envelope4, audio: audio4 },
  { titulo: nome5, envelope: envelope5, audio: audio5 },
  { titulo: nome6, envelope: envelope6, audio: audio6 },
  { titulo: nome7, envelope: envelope7, audio: audio7 },
  { titulo: nome8, envelope: envelope8, audio: audio8 },
];

export default function Parabens() {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [aberto, setAberto] = useState(false);
  const audioRef = useRef(new Audio());

  const { pauseMusic, resumeMusic } = useMusic();

  useEffect(() => {
    pauseMusic();
    return () => resumeMusic();
  }, []);

  const proximo = () => {
    pararAudio();
    setAberto(false);
    setIndice((prev) => (prev + 1) % itens.length);
  };

  const anterior = () => {
    pararAudio();
    setAberto(false);
    setIndice((prev) => (prev - 1 + itens.length) % itens.length);
  };

  const pararAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const toggleEnvelope = () => {
    if (aberto) {
      setAberto(false);
      pararAudio();
    } else {
      setAberto(true);
      audioRef.current.src = itens[indice].audio;
      audioRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Fundo em vídeo */}
      <video
        src={background}
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Nuvens */}
      <motion.img
        src={clouds}
        alt="clouds"
        className="absolute bottom-0 w-full"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5 }}
      />

      {/* Container parabéns */}
      <div className="relative z-10 w-[400px] max-w-[90%]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <img src={container} alt="container" className="w-full drop-shadow-2xl" />

          <div className="absolute inset-0 flex flex-col items-center justify-start gap-6 mt-[100px]">
            <div className="flex items-center justify-between w-full px-8">
              {/* seta esquerda */}
              <button onClick={anterior}>
                <img src={setaAnterior} alt="anterior" className="w-8 h-8 hover:scale-110 transition" />
              </button>

              {/* envelope central */}
              <div className="w-40 h-56 flex items-center justify-center">
                <img
                  src={aberto ? itens[indice].envelope : envelopeFechado}
                  alt="envelope"
                  className="w-full h-auto object-contain cursor-pointer"
                  onClick={toggleEnvelope}
                />
              </div>

              {/* seta direita */}
              <button onClick={proximo}>
                <img src={setaProximo} alt="proximo" className="w-8 h-8 hover:scale-110 transition" />
              </button>
            </div>

            {/* título embaixo */}
            <img
              src={itens[indice].titulo}
              alt="titulo"
              className="w-48 object-contain cursor-pointer"
              onClick={toggleEnvelope}
            />
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => navigate("/")}
        className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-[#5289b8] text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 transition"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        ← Voltar
      </motion.button>
    </div>
  );
}
