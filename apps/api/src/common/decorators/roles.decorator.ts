/**
 * Roles Decorator - Endpoint'lere rol bazlı erişim kontrolü atar.
 * Kullanım: @Roles(Role.ADMIN) veya @Roles(Role.UNIVERSITY, Role.ADMIN)
 * RolesGuard ile birlikte çalışır.
 */
import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles';

export const ROLES_KEY = 'roles';

/**
 * Controller veya method seviyesinde izin verilen rolleri tanımlar.
 * @param roles - İzin verilen roller listesi
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
