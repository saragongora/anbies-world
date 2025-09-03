import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import clouds from "../assets/nuvens.svg";
import containerFeliz from "../assets/container_feliz.svg";
import background from "../assets/fundo.mp4";

export default function Feliz() {
  const navigate = useNavigate();
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

      {/* Container principal bem maior */}
      <div className="relative z-10 w-[900px] max-w-[95%] drop-shadow-2xl">
        {/* imagem principal */}
        <motion.img
          src={containerFeliz}
          alt="container feliz"
          className="w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/*  link 1  */}
        <a
          href="https://x.com/hyunjae05/status/1745024913449390559"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-[70%] left-[5%] w-[120px] h-[120px] cursor-pointer"
        />

        {/* link 2  */}
        <a
          href="https://x.com/hyunjae05/status/1745024913449390559"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-[10%] right-[10%] w-[100px] h-[100px] cursor-pointer"
        />

        {/* link 3  */}
        <a
          href="https://x.com/hyunjae05/status/1745024913449390559"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-[10%] right-[15%] w-[140px] h-[100px] cursor-pointer"
        />
      </div>


      {/* Botão Voltar*/}
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
