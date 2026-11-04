import { delay, http, HttpResponse } from 'msw';
import { plans } from './fixtures/plans';
import { videos } from './fixtures/videos';
import { stats } from './fixtures/stats';
import { adminImages } from './fixtures/admin-images';
import { advanceMockBiblioteca, getMockBibliotecaFotos, getMockProfessorBiblioteca } from './fixtures/biblioteca';
import { chamadosIniciais } from './fixtures/chamados';
import type { CategorizeResponse, UserProfile } from '@/types';

// Estado mutável em memória (persiste durante a sessão do browser)
const imagesState = adminImages.map((img) => ({ ...img }));

const chamadosState = chamadosIniciais.map((c) => ({ ...c }));

export const handlers = [
  http.get('/api/chamados/meus', async () => HttpResponse.json(chamadosState.filter((c) => c.atleta?.id === 'u-diego'))),
  http.post('/api/chamados', async ({ request }) => {
    const b = (await request.json()) as { texto: string; tela?: string | null };
    const novo = { id: `c${Date.now()}`, tipo: 'erro' as const, tela: b.tela ?? null, texto: b.texto, extra: null, temPrint: false, status: 'recebido' as const, resposta: null, criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString(), atleta: { id: 'u-diego', nome: 'Diego Fernandes', email: 'diego.fernandes@exemplo.com' } };
    chamadosState.unshift(novo);
    return HttpResponse.json(novo, { status: 201 });
  }),
  http.get('/api/admin/chamados', async ({ request }) => {
    const u = new URL(request.url);
    const st = u.searchParams.get('status'); const tp = u.searchParams.get('tipo');
    return HttpResponse.json(chamadosState.filter((c) => (!st || c.status === st) && (!tp || c.tipo === tp)));
  }),
  http.patch('/api/admin/chamados/:id', async ({ params, request }) => {
    const b = (await request.json()) as { status?: never; resposta?: string | null };
    const c = chamadosState.find((x) => x.id === params.id);
    if (!c) return HttpResponse.json({ detail: 'Chamado não encontrado' }, { status: 404 });
    if (b.status) c.status = b.status;
    if (b.resposta !== undefined) c.resposta = b.resposta;
    return HttpResponse.json(c);
  }),
  http.get('/api/plans', async () => {
    await delay(300);
    return HttpResponse.json(plans);
  }),

  http.get('/api/gamification/stats', async () => {
    await delay(450);
    return HttpResponse.json(stats);
  }),

  http.get('/api/videos/feed', async () => {
    await delay(600);
    return HttpResponse.json([]);
  }),

  http.get('/api/videos/:id', async ({ params }) => {
    await delay(400);
    const video = videos.find((v) => v.id === params.id);
    if (!video) {
      return HttpResponse.json({ detail: 'Vídeo não encontrado' }, { status: 404 });
    }
    if (video.locked) {
      return HttpResponse.json(
        { detail: 'Este vídeo requer plano Premium ou superior' },
        { status: 403 }
      );
    }
    return HttpResponse.json(video);
  }),

  http.post('/api/users/profile', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Partial<UserProfile>;
    const profile: UserProfile = {
      id: 'mock-profile',
      email: 'atleta@bjjreplay.app',
      name: body.name ?? 'João Pereira',
      avatarUrl: body.avatarUrl ?? null,
      sportLevel: body.sportLevel ?? 'iniciante',
      plan: 'free',
      isAdmin: false,
      belt: body.belt ?? 'azul',
      degree: body.degree ?? 0,
      weightKg: body.weightKg ?? 74,
      academyName: body.academyName ?? 'Gracie Barra Fortaleza',
      role: 'atleta',
      athleteCategory: body.athleteCategory ?? 'adulto',
      guardianCpf: body.guardianCpf ?? null,
      guardianName: body.guardianName ?? null,
      birthDate: body.birthDate ?? null,
    };
    return HttpResponse.json(profile, { status: 200 });
  }),

  http.get('/api/admin/images', async () => {
    await delay(500);
    return HttpResponse.json(imagesState);
  }),

  http.post('/api/admin/categorize', async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as { imageId: string; category: string };
    const image = imagesState.find((img) => img.id === body.imageId);
    if (!image) {
      return HttpResponse.json({ detail: 'Imagem não encontrada' }, { status: 404 });
    }
    image.category = body.category;
    const response: CategorizeResponse = {
      imageId: body.imageId,
      category: body.category,
      message: `Imagem categorizada como "${body.category}"`,
    };
    return HttpResponse.json(response);
  }),

  /** Biblioteca de replays — simula motor assíncrono com transição de status */
  http.get('/api/biblioteca/:alunoId', async () => {
    await delay(350);
    return HttpResponse.json(advanceMockBiblioteca());
  }),

  http.get('/api/biblioteca/:alunoId/fotos', async () => {
    await delay(300);
    return HttpResponse.json(getMockBibliotecaFotos());
  }),

  http.get('/api/professor/biblioteca', async () => {
    await delay(400);
    return HttpResponse.json(getMockProfessorBiblioteca());
  }),
];
