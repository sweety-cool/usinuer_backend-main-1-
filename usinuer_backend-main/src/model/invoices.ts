import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface invoicesAttributes {
  id: number;
  inv_no: number;
  project_id: number;
  transaction_id: number;
  commission_rate: number;
  pdf_link: string;
  created_date: Date;
}

export type invoicesPk = "id";
export type invoicesId = invoices[invoicesPk];
export type invoicesOptionalAttributes = "id";
export type invoicesCreationAttributes = Optional<invoicesAttributes, invoicesOptionalAttributes>;

export class invoices extends Model<invoicesAttributes, invoicesCreationAttributes> implements invoicesAttributes {
  id!: number;
  inv_no!: number;
  project_id!: number;
  transaction_id!: number;
  commission_rate!: number;
  pdf_link!: string;
  created_date!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof invoices {
    return sequelize.define('invoices', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    inv_no: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commission_rate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    pdf_link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'invoices',
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
  }) as typeof invoices;
  }
}
