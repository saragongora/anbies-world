import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import clouds from "../assets/nuvens.svg";
import containerMemoria from "../assets/container_memoria.svg";
import background from "../assets/fundo.mp4";
import verso from "../assets/cartas/verso.svg";

// importa todos os SVGs da pasta cartas
const cartas = import.meta.glob("../assets/cartas/*.svg", { eager: true });
const cartasArray = Object.values(cartas).map((m) => m.default);

export default function Memoria() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [completou, setCompletou] = useState(false);
  const [tentativas, setTentativas] = useState(0);

  const generateCards = () => {
    const selected = [];
    while (selected.length < 5) {
      const rand = cartasArray[Math.floor(Math.random() * cartasArray.length)];
      if (!selected.includes(rand) && rand !== verso) selected.push(rand);
    }

    const duplicated = [...selected, ...selected]
      .map((src, i) => ({ id: i, src }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicated);
    setFlipped([]);
    setMatched([]);
    setTentativas(0);
    setCompletou(false);
  };

  // Gera cartas no primeiro carregamento com um pequeno delay para evitar flash
  useEffect(() => {
    const t = setTimeout(generateCards, 50);
    return () => clearTimeout(t);
  }, []);

  const handleFlip = (index) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    )
      return;
    setFlipped((prev) => [...prev, index]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      setTentativas((prev) => prev + 1);
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

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setTimeout(() => setCompletou(true), 500);
    }
  }, [matched, cards]);

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
      <div className="relative z-10 w-[900px] max-w-[95%] flex flex-col items-center">
        <motion.img
          src={containerMemoria}
          alt="container memoria"
          className="w-full drop-shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Grid de cartas com efeito stagger */}
        <motion.div
          className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-5 grid-rows-2 gap-6 w-[750px]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3, // espera um pouco depois do container
                staggerChildren: 0.07
              }
            }
          }}
        >
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <motion.div
                key={card.id}
                className="w-[120px] h-[160px] cursor-pointer perspective"
                onClick={() => handleFlip(index)}
                variants={{
                  hidden: { scale: 0.8, opacity: 0 },
                  visible: { scale: 1, opacity: 1 }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="relative w-full h-full transform-style-preserve-3d"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Frente */}
                  <div className="absolute w-full h-full backface-hidden rounded-xl shadow-md overflow-hidden">
                    <img
                      src={verso}
                      alt="verso"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Verso */}
                  <div className="absolute w-full h-full backface-hidden rounded-xl shadow-md overflow-hidden rotate-y-180">
                    <img
                      src={card.src}
                      alt="carta"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Botão Voltar */}
      <motion.button
        onClick={() => navigate("/")}
        className="absolute bottom-4 left-16 z-20 px-4 py-2 bg-[#5289b8] text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 transition"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        ← Voltar
      </motion.button>

      {/* Modal de Parabéns */}
<AnimatePresence>
  {completou && (
    <motion.div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setCompletou(false)} // fecha ao clicar fora
    >
      {/* Caixa de mensagem */}
      <motion.div
        className="bg-white rounded-xl shadow-lg px-10 py-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()} // impede fechar se clicar dentro
      >
        <p className="text-lg font-semibold text-[#5289b8] text-center mb-6">
          Parabéns! Você completou em {tentativas} tentativas!
        </p>
        <button
          onClick={generateCards}
          className="block mx-auto px-6 py-2 bg-[#5289b8] text-white rounded-lg hover:brightness-110 transition"
        >
          Jogar Novamente
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
