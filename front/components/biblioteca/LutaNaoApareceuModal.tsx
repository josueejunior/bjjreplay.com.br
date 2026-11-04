'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Send, Loader2 } from 'lucide-react';
import { pedirLutaNaoEncontrada } from '@/lib/api/endpoints';

interface LutaNaoApareceuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TATAMES = ['Tatame 1'];
const LIMITE_DIAS = 7;
// Dia no fuso do aluno (toISOString é UTC: depois das 21h em SP já daria amanhã).
const iso = (diasAtras: number) => new Date(Date.now() - diasAtras * 86_400_000).toLocaleDateString('en-CA');

const campo =
  'w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white placeholder-zinc-500 focus:border-neon focus:outline-none';
const rotulo = 'mb-1.5 block text-base font-medium text-zinc-200';

/** "Não encontrei minha luta": pede dia e horário, aceita até 7 dias para trás (Lucas, 04/11/2026, 18:18; antes disse 10). */
export function LutaNaoApareceuModal({ isOpen, onClose }: LutaNaoApareceuModalProps) {
  const hoje = useMemo(() => iso(0), []);
  const maisAntiga = useMemo(() => iso(LIMITE_DIAS), []);
  const [data, setData] = useState(hoje);
  const [horario, setHorario] = useState('');
  const [tatame, setTatame] = useState(TATAMES.length === 1 ? TATAMES[0] : '');
  const [faltaram, setFaltaram] = useState('1');
  const [adversario, setAdversario] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!horario) return setError('Informe o horário aproximado da luta');
    if (data < maisAntiga || data > hoje) return setError('Escolha um dia dos últimos 7 dias');
    setLoading(true);
    setError('');
    try {
      await pedirLutaNaoEncontrada({
        data, horario, tatame, faltaram: Number(faltaram),
        adversario: adversario.trim() || null, observacao: observacao.trim() || null,
      });
      setSuccess(true);
    } catch (err) {
      const detalhe = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      setError(detalhe ?? 'Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fechar = () => {
    onClose();
    setSuccess(false);
    setHorario(''); setAdversario(''); setObservacao(''); setFaltaram('1'); setData(hoje);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onClick={fechar}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-surface p-6"
            role="dialog"
            aria-labelledby="luta-modal-titulo"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </span>
                <div>
                  <h2 id="luta-modal-titulo" className="text-lg font-bold text-white">Não encontrei minha luta</h2>
                  <p className="text-sm text-zinc-400">Diga o dia e o horário que a gente procura</p>
                </div>
              </div>
              <button onClick={fechar} aria-label="Fechar" className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="rounded-xl border border-neon/30 bg-neon/10 p-4 text-center">
                <p className="text-base font-medium text-neon">Pedido enviado!</p>
                <p className="mt-1 text-base text-zinc-300">Vamos procurar nas gravações. Você acompanha em “Minha luta”.</p>
                <Link href="/minha-luta" className="mt-3 inline-block text-base font-semibold text-white underline">Ver meus pedidos</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="nl-data" className={rotulo}>Dia da luta *</label>
                    <input id="nl-data" type="date" required min={maisAntiga} max={hoje} value={data} onChange={(e) => setData(e.target.value)} className={campo.replace('px-4', 'px-2')} />
                  </div>
                  <div>
                    <label htmlFor="nl-hora" className={rotulo}>Horário aprox. *</label>
                    <input id="nl-hora" type="time" required value={horario} onChange={(e) => setHorario(e.target.value)} className={campo} />
                  </div>
                </div>
                <p className="-mt-2 text-sm text-zinc-400">Dá para pedir a busca de lutas dos últimos 7 dias.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="nl-tatame" className={rotulo}>Tatame *</label>
                    <select id="nl-tatame" required value={tatame} onChange={(e) => setTatame(e.target.value)} className={campo}>
                      <option value="">Escolha</option>
                      {TATAMES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nl-falt" className={rotulo}>Quantas faltaram *</label>
                    <input id="nl-falt" type="number" inputMode="numeric" min={1} max={20} required value={faltaram} onChange={(e) => setFaltaram(e.target.value)} className={campo} />
                  </div>
                </div>
                <div>
                  <label htmlFor="nl-adv" className={rotulo}>Com quem lutou (opcional)</label>
                  <input id="nl-adv" type="text" maxLength={80} value={adversario} onChange={(e) => setAdversario(e.target.value)} placeholder="Nome de quem treina na academia" className={campo} />
                </div>
                <div>
                  <label htmlFor="nl-obs" className={rotulo}>Observação (opcional)</label>
                  <textarea id="nl-obs" rows={2} maxLength={280} value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Algo que ajude a localizar" className={`${campo} resize-none`} />
                </div>
                {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-base text-red-300">{error}</p>}
                <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-base font-semibold text-white hover:bg-red-500 disabled:opacity-60">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  {loading ? 'Enviando…' : 'Pedir que procurem'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
