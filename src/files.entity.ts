import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(`files`)
export class FileRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  fileName: string;

  @Column({ type: 'varchar', nullable: true })
  essenceTable: string;

  @Column({ type: 'numeric', nullable: true })
  essenceId: number;
}
