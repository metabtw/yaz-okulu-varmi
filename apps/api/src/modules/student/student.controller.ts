/**
 * Student Controller - Öğrenci dashboard endpoint'leri.
 * Tüm endpoint'ler JWT + RolesGuard ile korunur, sadece STUDENT erişebilir.
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudentService } from './student.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AddFavoriteSchema, RecordInteractionSchema } from './student.dto';
import type { AddFavoriteDto, RecordInteractionDto } from './student.dto';
import { Role } from '../../common/constants/roles';
import type { Request } from 'express';

interface JwtUser {
  id: string;
  email: string;
  role: string;
}

@Controller('student')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.STUDENT)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.studentService.getProfile(user.id);
  }

  @Get('stats')
  async getStats(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.studentService.getStats(user.id);
  }

  @Get('favorites')
  async getFavorites(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.studentService.getFavorites(user.id);
  }

  @Post('favorites')
  async addFavorite(
    @Req() req: Request,
    @Body(new ZodValidationPipe(AddFavoriteSchema)) dto: AddFavoriteDto,
  ) {
    const user = req.user as JwtUser;
    return this.studentService.addFavorite(user.id, dto.courseId);
  }

  @Delete('favorites/:courseId')
  async removeFavorite(@Req() req: Request, @Param('courseId') courseId: string) {
    const user = req.user as JwtUser;
    return this.studentService.removeFavorite(user.id, courseId);
  }

  @Get('search-history')
  async getSearchHistory(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.studentService.getSearchHistory(user.id);
  }

  @Get('interactions')
  async getInteractions(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.studentService.getInteractions(user.id);
  }

  @Get('recommendations')
  async getRecommendations(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.studentService.getRecommendations(user.id);
  }

  @Post('interactions')
  async recordInteraction(
    @Req() req: Request,
    @Body(new ZodValidationPipe(RecordInteractionSchema)) dto: RecordInteractionDto,
  ) {
    const user = req.user as JwtUser;
    return this.studentService.recordInteraction(
      user.id,
      dto.courseId,
      dto.actionType,
    );
  }
}
