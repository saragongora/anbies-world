import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import clouds from "../assets/nuvens.svg";
import background from "../assets/fundo.mp4";
import containerConexo from "../assets/container_conexo.svg";

import { niveis } from "../data/niveis";

export default function Conexo() {
  const navigate = useNavigate();
  const [nivelSelecionado, setNivelSelecionado] = useState(null);
  const [palavrasSelecionadas, setPalavrasSelecionadas] = useState([]);
  const [gruposCorretos, setGruposCorretos] = useState([]);
  const [palavrasNivel, setPalavrasNivel] = useState([]);
  const [palavrasErradas, setPalavrasErradas] = useState([]);
  const [tentativas, setTentativas] = useState(0);
  const [completou, setCompletou] = useState(false);

  // embaralhar quando escolher nível
  useEffect(() => {
    if (nivelSelecionado) {
      setPalavrasNivel([...niveis[nivelSelecionado]].sort(() => Math.random() - 0.5));
    }
  }, [nivelSelecionado]);

  const selecionarPalavra = (palavra) => {
    if (palavrasSelecionadas.includes(palavra)) {
      setPalavrasSelecionadas(palavrasSelecionadas.filter((p) => p !== palavra));
    } else if (palavrasSelecionadas.length < 4) {
      setPalavrasSelecionadas([...palavrasSelecionadas, palavra]);
    }
  };

  useEffect(() => {
    if (palavrasSelecionadas.length === 4 && nivelSelecionado) {
      setTentativas((prev) => prev + 1);

      const grupos = palavrasSelecionadas.map(
        (p) => niveis[nivelSelecionado].find((obj) => obj.palavra === p).grupo
      );

      if (grupos.every((g) => g === grupos[0])) {
        const grupoId = grupos[0];
        const palavrasDoGrupo = niveis[nivelSelecionado].filter((obj) => obj.grupo === grupoId);
        const { titulo, cor } = palavrasDoGrupo[0];

        setGruposCorretos((prev) => {
          const novosGrupos = [
            ...prev,
            { id: grupoId, titulo, cor, palavras: palavrasDoGrupo.map((p) => p.palavra) },
          ];

          if (novosGrupos.length === 4) {
            setCompletou(true);
          }

          return novosGrupos;
        });

        setPalavrasSelecionadas([]);
      } else {
        setPalavrasErradas(palavrasSelecionadas);
        setTimeout(() => {
          setPalavrasErradas([]);
          setPalavrasSelecionadas([]);
        }, 700);
      }
    }
  }, [palavrasSelecionadas]);

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
      <motion.div
        className="relative z-10 w-[900px] max-w-[95%] drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <img src={containerConexo} alt="container conexo" className="w-full" />

        {/* contador de tentativas */}
        {nivelSelecionado && (
          <p className="absolute top-[130px] right-[50px] text-lg font-semibold text-gray-700 z-20">
            Tentativas: {tentativas}
          </p>
        )}

        {/* Conteúdo do jogo */}
        <div className="absolute top-[170px] left-1/2 -translate-x-1/2 w-[800px] max-w-[90%] flex flex-col items-center">
          {!nivelSelecionado && (
            <motion.div
              className="grid grid-cols-5 gap-x-12 gap-y-10 justify-items-center w-full px-8 translate-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {Array.from({ length: Object.keys(niveis).length }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setNivelSelecionado(i + 1)}
                  className="w-20 h-20 flex items-center justify-center bg-[#5289b8] text-white font-bold text-lg rounded-xl shadow-lg hover:scale-110 transition"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {i + 1}
                </motion.button>
              ))}
            </motion.div>
          )}

          {nivelSelecionado && (
            <div className="flex flex-col gap-4 w-full items-center relative">
              {/* grupos corretos */}
              {gruposCorretos.map((grupo) => (
                <motion.div
                  key={grupo.id}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  layout
                  style={{ backgroundColor: grupo.cor, color: "#333" }}
                  className="rounded-xl p-3 shadow-lg w-full flex flex-col items-center justify-center text-center"
                >
                  <p className="font-bold text-lg mb-1">{grupo.titulo}</p>
                  <p className="text-sm">{grupo.palavras.join(", ")}</p>
                </motion.div>
              ))}

              {/* grade de palavras */}
              <div className="grid grid-cols-4 gap-4 p-6 w-full">
                {palavrasNivel
                  .filter((obj) => !gruposCorretos.some((g) => g.id === obj.grupo))
                  .map((obj, idx) => {
                    const selecionada = palavrasSelecionadas.includes(obj.palavra);
                    const errada = palavrasErradas.includes(obj.palavra);

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => selecionarPalavra(obj.palavra)}
                        animate={
                          errada
                            ? { backgroundColor: "#e74444", color: "#fff" }
                            : selecionada
                              ? { backgroundColor: "#5289b8", color: "#fff" }
                              : { backgroundColor: "#e5e7eb", color: "#333" }
                        }
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-center justify-center px-3 py-4 rounded-lg font-semibold text-center"
                      >
                        {obj.palavra}
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de parabéns */}
<AnimatePresence>
  {completou && (
    <motion.div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setCompletou(false)} // fecha ao clicar no fundo
    >
      {/* Caixa centralizada */}
      <motion.div
        className="bg-white rounded-xl shadow-lg px-10 py-12"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        <p className="text-lg font-semibold text-[#5289b8] text-center">
          Parabéns! Você completou em {tentativas} tentativas!
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>




      {/* Botão Voltar */}
      <motion.button
        onClick={() => {
          if (nivelSelecionado === null) {
            navigate("/");
          } else {
            setNivelSelecionado(null);
            setPalavrasSelecionadas([]);
            setGruposCorretos([]);
            setTentativas(0);
            setCompletou(false);
          }
        }}
        className="absolute bottom-4 left-4 z-30 px-4 py-2 bg-[#5289b8] text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 transition"
      >
        ← Voltar
      </motion.button>
    </div>
  );
}
