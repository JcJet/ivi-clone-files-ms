import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

@Entity(`files`)
export class FileRecord {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'd192167d-c239-4a7a-8c28-7deb9ec276a8.jpg',
    description: 'Название файла',
  })
  @Column({ type: 'varchar' })
  fileName: string;

  @ApiProperty({ example: 'movies', description: 'Название сущности' })
  @Column({ type: 'varchar', nullable: true })
  essenceTable: string;

  @ApiProperty({ example: '1', description: 'Идентификатор сущности' })
  @Column({ type: 'numeric', nullable: true })
  essenceId: number;
}
