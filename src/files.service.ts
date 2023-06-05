import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileRecord } from './files.entity';
import { FileDto } from './dto/file.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { logCall } from "./decorators/logging-decorator";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileRecord)
    private filesRepository: Repository<FileRecord>,
  ) {}
  async createFile(file, dto: FileDto): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      const buffer: Buffer = new Buffer(file.buffer.data);
      fs.writeFile(path.join(filePath, fileName), buffer, (err) => {
        if (err) throw err;
      });

      await this.filesRepository.insert({ ...dto, fileName });
      return fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*  async editFile(id: number, dto: FileDto): Promise<any> {
    const fileUpdateResult = await this.filesRepository.update(id, dto);
    return fileUpdateResult;
  }*/
  @logCall()
  async deleteFile(fileName: string): Promise<any> {
    const deletionResult = await this.filesRepository.delete({ fileName });
    const filePath = path.resolve(__dirname, '..', 'static');
    try {
      fs.rm(path.join(filePath, fileName), () => {});
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при удалении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletionResult;
  }
  async getFiles(dto: FileDto) {
    return await this.filesRepository.findBy({ ...dto });
  }
  @logCall()
  async deleteFiles(dto: FileDto): Promise<any> {
    console.log(dto);
    const fileNames = await this.getFiles(dto);
    await this.filesRepository.delete({ ...dto });

    const filePath = path.resolve(__dirname, '..', 'static');
    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i].fileName;
      try {
        fs.rm(path.join(filePath, fileName), () => {});
      } catch (e) {
        throw new HttpException(
          'Произошла ошибка при удалении файла',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return fileNames;
  }
}
