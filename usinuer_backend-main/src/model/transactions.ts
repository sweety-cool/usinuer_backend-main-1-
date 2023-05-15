import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';
import type { projects, projectsId } from './projects';


export interface transactionsAttributes {
  id: number;
  type?: string;
  creator_id?: number;
  buyer_id?: number;
  provider_id?: number;
  transaction_time?: number;
  amount?: number;
  amount_gbp?: number;
  status?: string;
  description?: string;
  paypal_address?: string;
  user_type?: string;
  reciever_id?: number;
  project_id?: number;
  package_id?: number;
  update_flag?: number;
  country_code?: number;
}

export type transactionsPk = "id";
export type transactionsId = transactions[transactionsPk];
export type transactionsOptionalAttributes = "id" | "type" | "creator_id" | "buyer_id" | "provider_id" | "transaction_time" | "amount" | "amount_gbp" | "status" | "description" | "paypal_address" | "user_type" | "reciever_id" | "project_id" | "package_id" | "update_flag" | "country_code";
export type transactionsCreationAttributes = Optional<transactionsAttributes, transactionsOptionalAttributes>;

export class transactions extends Model<transactionsAttributes, transactionsCreationAttributes> implements transactionsAttributes {
  id!: number;
  type?: string;
  creator_id?: number;
  buyer_id?: number;
  provider_id?: number;
  transaction_time?: number;
  amount?: number;
  amount_gbp?: number;
  status?: string;
  description?: string;
  paypal_address?: string;
  user_type?: string;
  reciever_id?: number;
  project_id?: number;
  package_id?: number;
  update_flag?: number;
  country_code?: number;

  projects!: projects[];
  getProjects!: Sequelize.HasManyGetAssociationsMixin<projects>;
  setProjects!: Sequelize.HasManySetAssociationsMixin<projects, projectsId>;
  addProject!: Sequelize.HasManyAddAssociationMixin<projects, projectsId>;
  addProjects!: Sequelize.HasManyAddAssociationsMixin<projects, projectsId>;
  createProject!: Sequelize.HasManyCreateAssociationMixin<projects>;
  removeProject!: Sequelize.HasManyRemoveAssociationMixin<projects, projectsId>;
  removeProjects!: Sequelize.HasManyRemoveAssociationsMixin<projects, projectsId>;
  hasProject!: Sequelize.HasManyHasAssociationMixin<projects, projectsId>;
  hasProjects!: Sequelize.HasManyHasAssociationsMixin<projects, projectsId>;
  countProjects!: Sequelize.HasManyCountAssociationsMixin;
    // projects belongsTo users via creator_id
    creator!: users;
    getCreator!: Sequelize.BelongsToGetAssociationMixin<users>;
    setCreator!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
    createCreator!: Sequelize.BelongsToCreateAssociationMixin<users>;
    // projects belongsTo users via programmer_id
    programmer!: users;
    getProgrammer!: Sequelize.BelongsToGetAssociationMixin<users>;
    setProgrammer!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
    createProgrammer!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof transactions {
    return sequelize.define('transactions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    creator_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0
    },
    buyer_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0
    },
    provider_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0
    },
    transaction_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    amount_gbp: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    status: {
      type: DataTypes.CHAR(16),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paypal_address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    user_type: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    reciever_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    project_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    package_id: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    update_flag: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    country_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'transactions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof transactions;
  }
}
