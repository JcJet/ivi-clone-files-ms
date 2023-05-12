import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileDto } from './dto/file.dto';
import { FileRecord } from './files.entity';
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern('createFile')
  async createFile(
    @Payload() data: { file: any; dto: FileDto },
  ): Promise<string> {
    return await this.filesService.createFile(data.file, data.dto);
  }
  @MessagePattern('deleteFileByName')
  async deleteFile(@Payload() data: { fileName: string }): Promise<any> {
    return await this.filesService.deleteFile(data.fileName);
  }

  /*  @MessagePattern('editFile')
  async editFile(
    @Payload() data: { id: number; dto: FileDto },
  ): Promise<any> {
    return await this.filesService.editFile(data.id, data.dto);
  }*/

  @MessagePattern('getFiles')
  async getFiles(@Payload() data: { dto: FileDto }): Promise<FileRecord[]> {
    return await this.filesService.getFiles(data.dto);
  }

  @MessagePattern('deleteFiles')
  async deleteFiles(@Payload() data: { dto: FileDto }): Promise<FileRecord[]> {
    return await this.filesService.deleteFiles(data.dto);
  }
}
