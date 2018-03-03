import 'sequelize';

declare module 'sequelize' {

  interface Associations {

    belongsTo<T extends Model<Instance<object>, object>>(
      target: T,
      options?: AssociationOptionsBelongsTo
    ): T;

    hasOne<T extends Model<Instance<object>, object>>(
      target: T,
      options?: AssociationOptionsHasOne
    ): T;

  }

  interface Model<TInstance, TAttributes> {

    prototype: TInstance;

  }

  interface FindOptions<T> {

    tableHint?: keyof TableHints;

  }

  interface TableHints {

    NOLOCK: 'NOLOCK';

    READUNCOMMITTED: 'READUNCOMMITTED';

    UPDLOCK: 'UPDLOCK';

    REPEATABLEREAD: 'REPEATABLEREAD';

    SERIALIZABLE: 'SERIALIZABLE';

    READCOMMITTED: 'READCOMMITTED';

    TABLOCK: 'TABLOCK';

    TABLOCKX: 'TABLOCKX';

    PAGLOCK: 'PAGLOCK';

    ROWLOCK: 'ROWLOCK';

    NOWAIT: 'NOWAIT';

    READPAST: 'READPAST';

    XLOCK: 'XLOCK';

    SNAPSHOT: 'SNAPSHOT';

    NOEXPAND: 'NOEXPAND';

  }

  interface SequelizeStaticAndInstance {

    TableHints: TableHints;

  }

}
