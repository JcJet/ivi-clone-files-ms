import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileDto } from './dto/file.dto';
import { FileRecord } from './files.entity';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern('create_file')
  async createFile(
    @Payload() data: { file: any; dto: FileDto },
  ): Promise<string> {
    return await this.filesService.createFile(data.file, data.dto);
  }
  @MessagePattern('delete_file_by_name')
  async deleteFile(@Payload() data: { fileName: string }): Promise<any> {
    return await this.filesService.deleteFile(data.fileName);
  }

  /*  @MessagePattern('edit_file')
  async editFile(
    @Payload() data: { id: number; dto: FileDto },
  ): Promise<any> {
    return await this.filesService.editFile(data.id, data.dto);
  }*/

  @MessagePattern('get_files')
  async getFiles(@Payload() data: { dto: FileDto }): Promise<FileRecord[]> {
    return await this.filesService.getFiles(data.dto);
  }

  @MessagePattern('delete_files')
  async deleteFiles(@Payload() data: { dto: FileDto }): Promise<FileRecord[]> {
    return await this.filesService.deleteFiles(data.dto);
  }
}
