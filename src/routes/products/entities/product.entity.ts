import { Category } from 'routes/categories/entities/category.entity';
import { User } from 'routes/users/entities/user.entity';
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

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (cat) => cat.products, { onDelete: 'CASCADE' })
  category: Category;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
