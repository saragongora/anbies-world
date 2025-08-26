import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // 👈 importa o Link

import clouds from "../assets/nuvens.svg";
import container from "../assets/container_principal.svg";
import background from "../assets/fundo.mp4";

import setaAnterior from "../assets/seta_anterior.png";
import setaProximo from "../assets/seta_proximo.png";

import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";

import titulo1 from "../assets/titulo1.svg";
import titulo2 from "../assets/titulo2.svg";
import titulo3 from "../assets/titulo3.svg";
import titulo4 from "../assets/titulo4.svg";
import titulo5 from "../assets/titulo5.svg";


// Lista de páginas (cada item com imagem, título e link)
const paginas = [
  { img: img1, titulo: titulo1, link: "/feliz" },
  { img: img2, titulo: titulo2, link: "/conexo" }, 
  { img: img3, titulo: titulo3, link: "/cruzadas" },
  { img: img5, titulo: titulo5, link: "/memoria" },
  { img: img4, titulo: titulo4, link: "/parabens" },
];

export default function Home() {
  const [indice, setIndice] = useState(0);

  const proximo = () => setIndice((prev) => (prev + 1) % paginas.length);
  const anterior = () => setIndice((prev) => (prev - 1 + paginas.length) % paginas.length);

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

      {/* Container principal */}
      <div className="relative z-10 w-[400px] max-w-[90%]">
        {/* Fundo do caderno + Conteúdo juntos na mesma animação */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Fundo do caderno */}
          <img
            src={container}
            alt="container"
            className="w-full drop-shadow-2xl"
          />

          {/* Conteúdo sobre o caderno */}
          <div className="absolute inset-0 flex flex-col items-center justify-start gap-6 mt-[150px]">
            <div className="flex items-center justify-between w-full px-8">
              {/* seta esquerda */}
              <button onClick={anterior}>
                <img
                  src={setaAnterior}
                  alt="anterior"
                  className="w-8 h-8 hover:scale-110 transition"
                />
              </button>

              {/* imagem central */}
              <Link to={paginas[indice].link}>
                <img
                  key={paginas[indice].img}
                  src={paginas[indice].img}
                  alt="conteudo"
                  className="w-40 h-40 object-contain cursor-pointer"
                />
              </Link>

              {/* seta direita */}
              <button onClick={proximo}>
                <img
                  src={setaProximo}
                  alt="proximo"
                  className="w-8 h-8 hover:scale-110 transition"
                />
              </button>
            </div>

            {/* título embaixo */}
            <Link to={paginas[indice].link}>
              <img
                key={paginas[indice].titulo}
                src={paginas[indice].titulo}
                alt="titulo"
                className="w-48 object-contain cursor-pointer"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
