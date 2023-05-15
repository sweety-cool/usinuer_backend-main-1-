import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface notif_email_listAttributes {
  id: number;
  customer_id: number;
  supplier_id: number;
  project_id: number;
  email_type: string;
  email_subject: string;
  email_body: string;
  notif_date: Date;
  message_status: string;
}

export type notif_email_listPk = "id";
export type notif_email_listId = notif_email_list[notif_email_listPk];
export type notif_email_listOptionalAttributes = "id";
export type notif_email_listCreationAttributes = Optional<notif_email_listAttributes, notif_email_listOptionalAttributes>;

export class notif_email_list extends Model<notif_email_listAttributes, notif_email_listCreationAttributes> implements notif_email_listAttributes {
  id!: number;
  customer_id!: number;
  supplier_id!: number;
  project_id!: number;
  email_type!: string;
  email_subject!: string;
  email_body!: string;
  notif_date!: Date;
  message_status!: string;

  customer!: users;
  getCustomer!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCustomer!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCustomer!: Sequelize.BelongsToCreateAssociationMixin<users>;


  static initModel(sequelize: Sequelize.Sequelize): typeof notif_email_list {
    return sequelize.define('notif_email_list', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email_subject: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email_body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notif_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    message_status: {
      type: DataTypes.CHAR(1),
      allowNull: false
    }
  }, {
    tableName: 'notif_email_list',
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
  }) as typeof notif_email_list;
  }
}
