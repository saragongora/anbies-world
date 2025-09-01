import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";

import clouds from "../assets/nuvens.svg";
import background from "../assets/fundo.mp4";
import containerNivel1 from "../assets/cruzadas_nivel1.svg";
import containerFeliz from "../assets/container_palavras.svg";

/* =====================
  Nivel 1
===================== */
export function LevelOne() {
  const GRID_ROWS = 6;
  const GRID_COLS = 9;

  const CLUE_CELLS_L1 = new Set(
    [
      [0, 0], [0, 1], [0, 8],
      [1, 7],
      [2, 0], [2, 1], [2, 6],
      [3, 4],
      [4, 6],
      [5, 0], [5, 2],
    ].map(([r, c]) => `${r}-${c}`)
  );

  const ANSWERS = [
    "", "", "J", "O", "S", "E", "P", "H", "",
    "W", "E", "Y", "O", "U", "N", "G", "", "K",
    "", "", "S", "U", "R", "F", "", "J", "A",
    "E", "N", "Z", "O", "", "O", "V", "E", "R",
    "O", "C", "I", "O", "S", "O", "", "A", "M",
    "", "T", "", "C", "E", "L", "E", "N", "A",
  ];

  const [letters, setLetters] = useState(Array(GRID_ROWS * GRID_COLS).fill(""));
  const [success, setSuccess] = useState(false);
  const refs = useRef(Array(GRID_ROWS * GRID_COLS).fill(null));

  const inputable = useMemo(() => {
    const arr = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (!CLUE_CELLS_L1.has(`${r}-${c}`)) arr.push(r * GRID_COLS + c);
      }
    }
    return new Set(arr);
  }, []);

  const handleChange = (idx, value) => {
    const ch = (value || "")
      .toUpperCase()
      .replace(/[^A-ZÁÂÃÉÊÍÓÔÕÚÇ]/g, "");

    setLetters((prev) => {
      const copy = [...prev];
      copy[idx] = ch.slice(-1);
      return copy;
    });

    // Focar no próximo campo automaticamente
    if (ch && idx < GRID_ROWS * GRID_COLS - 1) {
      setTimeout(() => {
        focusNext(idx, "right");
      }, 10);
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !letters[idx]) {
      e.preventDefault();
      focusNext(idx, "left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusNext(idx, "right");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusNext(idx, "left");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusNext(idx, "up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusNext(idx, "down");
    }
  };

  const focusNext = (idx, dir) => {
    const step =
      dir === "left"
        ? -1
        : dir === "right"
          ? 1
          : dir === "up"
            ? -GRID_COLS
            : GRID_COLS;

    let next = idx + step;
    while (next >= 0 && next < GRID_ROWS * GRID_COLS) {
      if (inputable.has(next)) {
        refs.current[next]?.focus?.();
        refs.current[next]?.select?.();
        return;
      }
      next += step;
    }
  };

  // 👉 Checagem automática sempre que letras mudam
  useEffect(() => {
    let allCorrect = true;

    for (let i = 0; i < ANSWERS.length; i++) {
      if (ANSWERS[i]) {
        if (letters[i] !== ANSWERS[i]) {
          allCorrect = false;
          break;
        }
      }
    }

    if (allCorrect) {
      setSuccess(true);
    }
  }, [letters]);

  return (
    <div className="relative z-20 flex flex-col items-center gap-4">
      {/* Container Feliz */}
      <div className="relative w-[900px] max-w-[95vw] mx-auto">
        <img
          src={containerFeliz}
          alt="Container fundo"
          className="w-full h-auto drop-shadow-2xl"
        />

        {/* Área do jogo */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-[800px] max-w-full translate-y-12">
            <img
              src={containerNivel1}
              alt="Cruzadas - Nível 1"
              className="w-full h-auto select-none pointer-events-none drop-shadow-xl rounded-lg"
            />

            {/* Overlay grid */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div
                className="grid w-full h-full"
                style={{
                  gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                  gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                }}
              >
                {letters.map((val, idx) => {
                  const r = Math.floor(idx / GRID_COLS);
                  const c = idx % GRID_COLS;
                  const isClue = CLUE_CELLS_L1.has(`${r}-${c}`);

                  if (isClue) return <div key={idx} />;

                  return (
                    <div
                      key={idx}
                      className="relative flex items-center justify-center bg-transparent"
                    >
                      <input
                        ref={(el) => (refs.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-full h-full text-center font-bold uppercase bg-transparent focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de sucesso */}
      {success && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          onClick={() => setSuccess(false)} // 👉 clicou fora → fecha modal
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()} // 👉 impede fechar ao clicar dentro
          >
            <h2 className="text-2xl font-bold text-[#5289b8] mb-4">
              Parabéns!
            </h2>
            <p className="text-lg">Você completou o nível 1</p>
          </motion.div>
        </div>
      )}

    </div>
  );
}


/* =====================
   Componente principal
===================== */
export default function Cruzadas() {
  const navigate = useNavigate();
  const [nivelSelecionado, setNivelSelecionado] = useState(null);

  const handleBack = () => {
    if (nivelSelecionado) {
      setNivelSelecionado(null); // volta para o menu de níveis
    } else {
      navigate("/"); // volta para home
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <video
        src={background}
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <motion.img
        src={clouds}
        alt="clouds"
        className="absolute bottom-0 w-full"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5 }}
      />

      {/* Menu de níveis */}
      {!nivelSelecionado && (
        <motion.div
          className="relative z-20 flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={containerFeliz}
            alt="Container níveis"
            className="relative z-10 w-[900px] max-w-[95%] drop-shadow-2xl"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="flex flex-wrap gap-4 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button
                  key={n}
                  onClick={() => setNivelSelecionado(n)}
                  className="px-6 py-3 bg-[#5289b8] text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Nível {n}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {nivelSelecionado === 1 && <LevelOne />}

      {/* Botão voltar */}
      <div className="absolute bottom-4 left-4 flex gap-4 z-30">
        <motion.button
          onClick={handleBack}
          className="px-6 py-3 bg-[#5289b8] text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Voltar
        </motion.button>
      </div>
    </div>
  );
}
