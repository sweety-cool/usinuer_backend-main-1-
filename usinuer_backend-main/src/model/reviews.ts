import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';
import type { projects, projectsId } from './projects';

export interface reviewsAttributes {
  id: number;
  comments?: string;
  rating?: number;
  provider_rate1?: number;
  provider_rate2?: number;
  provider_rate3?: number;
  provider_rate4?: number;
  provider_rate5?: number;
  provider_rate6?: number;
  provider_rating_avg?: number;
  emp_rate1?: number;
  emp_rate2?: number;
  emp_rate3?: number;
  emp_rate4?: number;
  emp_rate5?: number;
  emp_rate6?: number;
  emp_rating_avg?: number;
  review_time?: number;
  review_post_date?: Date;
  review_type?: '1' | '2';
  project_id: number;
  buyer_id: number;
  provider_id: number;
  hold?: '0' | '1';
  buyer_status?: string;
  provider_status?: string;
  country_code?: number;
}

export type reviewsPk = "id";
export type reviewsId = reviews[reviewsPk];
export type reviewsOptionalAttributes = "id" | "comments" | "rating" | "provider_rate1" | "provider_rate2" | "provider_rate3" | "provider_rate4" | "provider_rate5" | "provider_rate6" | "provider_rating_avg" | "emp_rate1" | "emp_rate2" | "emp_rate3" | "emp_rate4" | "emp_rate5" | "emp_rate6" | "emp_rating_avg" | "review_time" | "review_post_date" | "review_type" | "hold" | "buyer_status" | "provider_status" | "country_code";
export type reviewsCreationAttributes = Optional<reviewsAttributes, reviewsOptionalAttributes>;

export class reviews extends Model<reviewsAttributes, reviewsCreationAttributes> implements reviewsAttributes {
  id!: number;
  comments?: string;
  rating?: number;
  provider_rate1?: number;
  provider_rate2?: number;
  provider_rate3?: number;
  provider_rate4?: number;
  provider_rate5?: number;
  provider_rate6?: number;
  provider_rating_avg?: number;
  emp_rate1?: number;
  emp_rate2?: number;
  emp_rate3?: number;
  emp_rate4?: number;
  emp_rate5?: number;
  emp_rate6?: number;
  emp_rating_avg?: number;
  review_time?: number;
  review_post_date?: Date;
  review_type?: '1' | '2';
  project_id!: number;
  buyer_id!: number;
  provider_id!: number;
  hold?: '0' | '1';
  buyer_status?: string;
  provider_status?: string;
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

  machanic!: users;
  getMachanic!: Sequelize.BelongsToGetAssociationMixin<users>;
  setMachanic!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createMachanic!: Sequelize.BelongsToCreateAssociationMixin<users>;

  customer!: users;
  getCustomer!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCustomer!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCustomer!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof reviews {
    return sequelize.define('reviews', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    provider_rate1: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    provider_rate2: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    provider_rate3: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    provider_rate4: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    provider_rate5: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    provider_rate6: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    provider_rating_avg: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    emp_rate1: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    emp_rate2: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    emp_rate3: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    emp_rate4: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    emp_rate5: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    emp_rate6: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    emp_rating_avg: {
      type: DataTypes.FLOAT(2,1),
      allowNull: true
    },
    review_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    review_post_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    review_type: {
      type: DataTypes.ENUM('1','2'),
      allowNull: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hold: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true
    },
    buyer_status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    provider_status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    country_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'reviews',
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
  }) as typeof reviews;
  }
}
