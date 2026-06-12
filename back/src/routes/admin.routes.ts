import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, rowToAdminImage, type AdminImageRow } from '../lib/db.js';

const ALLOWED_CATEGORIES = ['Treino', 'Competição', 'Recuperação', 'Nutrição', 'Equipamento'];

const categorizeSchema = z.object({
  imageId: z.string().min(1),
  category: z.string().refine((c) => ALLOWED_CATEGORIES.includes(c), {
    message: `Categoria inválida. Use: ${ALLOWED_CATEGORIES.join(', ')}`,
  }),
});

const selectAll = db.prepare('SELECT * FROM admin_images ORDER BY uploaded_at DESC');
const selectById = db.prepare('SELECT * FROM admin_images WHERE id = ?');
const updateCategory = db.prepare('UPDATE admin_images SET category = ? WHERE id = ?');

export async function adminRoutes(app: FastifyInstance) {
  app.get('/api/admin/images', { preHandler: [app.requireAdmin] }, async () => {
    return (selectAll.all() as AdminImageRow[]).map(rowToAdminImage);
  });

  app.post('/api/admin/categorize', { preHandler: [app.requireAdmin] }, async (request, reply) => {
    const body = categorizeSchema.parse(request.body);

    const row = selectById.get(body.imageId) as AdminImageRow | undefined;
    if (!row) {
      return reply.code(404).send({ detail: 'Imagem não encontrada' });
    }

    updateCategory.run(body.category, body.imageId);

    return {
      imageId: body.imageId,
      category: body.category,
      message: `Imagem categorizada como "${body.category}"`,
    };
  });
}
