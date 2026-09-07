import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomBytes } from 'crypto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ok } from '../../common/response';

const uploadRoot = join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

function ensureDir(subdir: string) {
  const dir = join(uploadRoot, subdir);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, ensureDir('files'));
        },
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${randomBytes(6).toString('hex')}${extname(file.originalname)}`;
          cb(null, name);
        },
      }),
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^(image\/(jpeg|png|webp|gif)|application\/pdf)$/)) {
          return cb(new BadRequestException('Only images and PDF allowed') as any, false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException({ success: false, message: 'File required' });
    const url = `/uploads/files/${file.filename}`;
    return ok({ url, filename: file.filename }, 'Uploaded');
  }
}
