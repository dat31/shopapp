import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { S3Service } from 's3/s3.service';

@EventSubscriber()
export class ProductsSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    dataSource: DataSource,
    private s3Service: S3Service,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  async afterUpdate(event: UpdateEvent<Product>) {
    const isImageUrlChange = event.updatedColumns.findIndex(
      (col) => col.databaseName === 'imageUrl',
    );
    if (isImageUrlChange === -1) {
      return;
    }
    const product = await event.manager.getRepository(Product).findOne({
      where: { id: event.databaseEntity.id },
      relations: { user: { owner: true } },
    });
    const uid = product?.user?.owner?.uid;
    if (!uid) {
      return;
    }
    return this.s3Service.deleteFile(uid, event.databaseEntity.imageUrl);
  }
}
