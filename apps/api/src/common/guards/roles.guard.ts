/**
 * Roles Guard - JWT token'ındaki kullanıcı rolünü kontrol eder.
 * @Roles() dekoratörü ile belirtilen rollere sahip olmayan kullanıcıları reddeder.
 * 
 * Güvenlik akışı:
 * 1. AuthGuard('jwt') token'ı doğrular ve request.user'a atar
 * 2. RolesGuard request.user.role'ü kontrol eder
 * 3. Eşleşmezse ForbiddenException fırlatır
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Roles() ile belirtilen izin verilen rolleri al
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // @Roles() dekoratörü yoksa erişime izin ver
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // JWT'den gelen kullanıcı bilgisini al
    const request = context.switchToHttp().getRequest();
    const user = request.user as { role: Role } | undefined;

    if (!user) {
      throw new ForbiddenException('Kimlik doğrulama gerekli');
    }

    // Kullanıcının rolü izin verilen roller arasında mı?
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Bu işlem için gereken rol: ${requiredRoles.join(' veya ')}. Mevcut rol: ${user.role}`,
      );
    }

    return true;
  }
}
