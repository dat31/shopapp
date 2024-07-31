import { Product } from 'routes/products/entities/product.entity';
import { User } from 'routes/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, (prod) => prod.category)
  products: Product[];

  @ManyToOne(() => User, (user) => user.categories)
  user: User;
}
