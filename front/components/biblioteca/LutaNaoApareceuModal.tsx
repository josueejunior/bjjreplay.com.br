'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Send, Loader2 } from 'lucide-react';
import { relatarLutaSumida } from '@/lib/api/endpoints';

interface LutaNaoApareceuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LutaNaoApareceuModal({ isOpen, onClose }: LutaNaoApareceuModalProps) {
  const [horarioAprox, setHorarioAprox] = useState('');
  const [tatame, setTatame] = useState('');
  const [adversario, setAdversario] = useState('');
  const [evento, setEvento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!horarioAprox.trim()) {
      setError('Informe o horário aproximado da luta');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await relatarLutaSumida({
        horario_aprox: horarioAprox.trim(),
        tatame: tatame.trim() || undefined,
        adversario: adversario.trim() || undefined,
        evento: evento.trim() || undefined,
        observacao: observacao.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setHorarioAprox('');
        setTatame('');
        setAdversario('');
        setEvento('');
        setObservacao('');
      }, 2000);
    } catch (err) {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-surface p-6"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Sua luta não apareceu?</h2>
                  <p className="text-xs text-zinc-500">Vamos localizar pra você</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="rounded-xl border border-neon/30 bg-neon/10 p-4 text-center">
                <p className="font-medium text-neon">Relato enviado!</p>
                <p className="mt-1 text-sm text-zinc-400">Vamos localizar sua luta o mais rápido possível.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Horário aproximado da luta *
                  </label>
                  <input
                    type="text"
                    value={horarioAprox}
                    onChange={(e) => setHorarioAprox(e.target.value)}
                    placeholder="Ex: por volta das 14h30"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-neon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Tatame
                  </label>
                  <input
                    type="text"
                    value={tatame}
                    onChange={(e) => setTatame(e.target.value)}
                    placeholder="Ex: Tatame 3"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-neon focus:outline-none"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Nome do adversário
                  </label>
                  <input
                    type="text"
                    value={adversario}
                    onChange={(e) => setAdversario(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-neon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Nome do evento
                  </label>
                  <input
                    type="text"
                    value={evento}
                    onChange={(e) => setEvento(e.target.value)}
                    placeholder="Ex: Copa BJJ Piauí"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-neon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Observação
                  </label>
                  <textarea
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Algo mais que ajude a localizar..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-neon focus:outline-none"
                  />
                </div>

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 font-semibold text-black transition-all hover:bg-neon/90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar relato
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
