import 'sequelize';
import { Instance } from 'sequelize';

declare module 'sequelize' {

  interface Associations {

    belongsTo<T extends Model<Instance<AnyObj>, AnyObj>>(
      target: T,
      options?: AssociationOptionsBelongsTo
    ): T;

    hasOne<T extends Model<Instance<AnyObj>, AnyObj>>(
      target: T,
      options?: AssociationOptionsHasOne
    ): T;

  }

  interface Model<TInstance, TAttributes> {

    prototype: TInstance;

  }

}
