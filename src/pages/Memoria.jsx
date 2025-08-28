import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import clouds from "../assets/nuvens.svg";
import containerMemoria from "../assets/container_memoria.svg";
import background from "../assets/fundo.mp4";

// importa todos os SVGs da pasta cartas
const cartas = import.meta.glob("../assets/cartas/*.svg", { eager: true });
const cartasArray = Object.values(cartas).map((m) => m.default);

export default function Memoria() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // índices das cartas viradas no momento
  const [matched, setMatched] = useState([]); // índices já combinados

  // Gera o baralho inicial
  const generateCards = () => {
    const selected = [];
    while (selected.length < 5) {
      const rand = cartasArray[Math.floor(Math.random() * cartasArray.length)];
      if (!selected.includes(rand)) selected.push(rand);
    }

    const duplicated = [...selected, ...selected]
      .map((src, i) => ({ id: i, src }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicated);
    setFlipped([]);
    setMatched([]);
  };

  useEffect(() => {
    generateCards();
  }, []);

  // Clique para virar
  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped((prev) => [...prev, index]);
  };

  // Checa match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first]?.src === cards[second]?.src) {
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);
      } else {
        const t = setTimeout(() => setFlipped([]), 900);
        return () => clearTimeout(t);
      }
    }
  }, [flipped, cards]);

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

      {/* Container */}
      <div className="relative z-10 w-[900px] max-w-[95%]">
        <motion.img
          src={containerMemoria}
          alt="container memoria"
          className="w-full drop-shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Grid de cartas */}
        <div className="absolute top-[100px] left-1/2 -translate-x-1/2 grid grid-cols-5 grid-rows-2 gap-6 w-[750px]">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <motion.div
                key={card.id}
                className="w-[120px] h-[160px] cursor-pointer perspective"
                onClick={() => handleFlip(index)}
              >
                <motion.div
                  className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Frente (❓ - aparece primeiro) */}
                  <div className="absolute w-full h-full backface-hidden rounded-xl shadow-md flex items-center justify-center bg-[#87CEEB] text-4xl font-bold select-none">
                    ❓
                  </div>

                  {/* Verso (imagem - visível quando gira) */}
                  <div className="absolute w-full h-full backface-hidden rounded-xl shadow-md flex items-center justify-center bg-white overflow-hidden rotate-y-180 select-none">
                    <img src={card.src} alt="carta" className="object-contain w-full h-full p-2" />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Botão Voltar */}
        <motion.button
          onClick={() => navigate("/")}
          className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-[#5289b8] text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 transition"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          ← Voltar
        </motion.button>

        {/* Botão Reiniciar */}
        <motion.button
          onClick={generateCards}
          className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-green-600 text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 transition"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          🔄 Reiniciar
        </motion.button>
      </div>
    </div>
  );
}
