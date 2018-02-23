/// <reference path='@ajtii/commons.d.ts' />

import 'sequelize';

declare module 'sequelize' {

  interface Associations {

    belongsTo<T extends Model<AnyObj, AnyObj>>(
      target: T,
      options?: AssociationOptionsBelongsTo
    ): T;

    hasOne<T extends Model<AnyObj, AnyObj>>(
      target: T,
      options?: AssociationOptionsHasOne
    ): T;

  }

  interface Model<TInstance, TAttributes> {

    prototype: TInstance;

  }

}
