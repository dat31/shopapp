import { Category } from 'routes/categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Category, { cascade: true })
  @JoinTable()
  categories: Category[];

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;
}
