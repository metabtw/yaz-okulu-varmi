/**
 * Student DTO'ları - Öğrenci endpoint'leri için Zod şemaları.
 */
import { z } from 'zod';

export const AddFavoriteSchema = z.object({
  courseId: z.string().min(1, 'courseId zorunludur'),
});

export type AddFavoriteDto = z.infer<typeof AddFavoriteSchema>;

export const RecordInteractionSchema = z.object({
  courseId: z.string().min(1, 'courseId zorunludur'),
  actionType: z.enum(['VIEW', 'FAVORITE', 'APPLY']),
});

export type RecordInteractionDto = z.infer<typeof RecordInteractionSchema>;
