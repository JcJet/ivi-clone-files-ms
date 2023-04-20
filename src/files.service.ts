import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileRecord } from './files.entity';
import { FileDto } from './dto/file.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

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

      const buffer: Buffer = Buffer.from(Array<number>(file.buffer.data));
      await fs.writeFile(path.join(filePath, fileName), buffer, (err) => {
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
  async getFile(dto: FileDto) {
    const fileRecord = await this.filesRepository
      .createQueryBuilder('files')
      .where('files.essenceTable = :essenceTable', dto)
      .andWhere('files.essenceId = :essenceId', dto)
      .getOne();
    return fileRecord ? fileRecord.fileName : undefined;
  }
  async getFiles(dto: FileDto) {
    //const all = await this.commentsRepository.find();
    return await this.filesRepository
      .createQueryBuilder('files')
      .where('files.essenceTable = :essenceTable', dto)
      .andWhere('files.essenceId = :essenceId', dto)
      .getMany();
  }

  async deleteFiles(dto: FileDto): Promise<any> {
    //TODO: test it
    const deleteResult = await this.filesRepository
      .createQueryBuilder('files')
      .delete()
      .where('essenceTable = :essenceTable', dto)
      .andWhere('essenceId = :essenceId', dto)
      .returning('*')
      .execute();

    const filePath = path.resolve(__dirname, '..', 'static');
    for (let i = 0; i < deleteResult.raw.length; i++) {
      const fileName = deleteResult.raw[i].fileName;
      try {
        fs.rm(path.join(filePath, fileName), () => {});
      } catch (e) {
        throw new HttpException(
          'Произошла ошибка при удалении файла',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return deleteResult.raw;
  }
}
