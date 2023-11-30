import { Category } from 'routes/categories/entities/category.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (cat) => cat.products)
  category: Category;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
