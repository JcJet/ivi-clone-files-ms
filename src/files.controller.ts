import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileDto } from './dto/file.dto';
import { FileRecord } from './files.entity';
import { DeleteResult } from 'typeorm';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern({ cmd: 'createFile' })
  async createFile(
    @Payload() data: { file: any; dto: FileDto },
  ): Promise<string> {
    return await this.filesService.createFile(data.file, data.dto);
  }
  @MessagePattern({ cmd: 'deleteFileByName' })
  async deleteFile(
    @Payload() data: { fileName: string },
  ): Promise<DeleteResult> {
    return await this.filesService.deleteFile(data.fileName);
  }

  @MessagePattern({ cmd: 'getFiles' })
  async getFiles(@Payload() data: { dto: FileDto }): Promise<FileRecord[]> {
    return await this.filesService.getFiles(data.dto);
  }

  @MessagePattern({ cmd: 'deleteFiles' })
  async deleteFiles(@Payload() data: { dto: FileDto }): Promise<FileRecord[]> {
    return await this.filesService.deleteFiles(data.dto);
  }
}
