// models/index.js
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

import Program from "./program.js";

// ===== إنشاء اتصال قاعدة البيانات =====
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// ===== تعريف الموديلات كدوال =====

// Role
const RoleModel = (sequelize, DataTypes) =>
  sequelize.define(
    "Role",
    {
      id: { type: DataTypes.TINYINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    },
    { tableName: "roles", timestamps: false }
  );

// User
const UserModel = (sequelize, DataTypes) =>
  sequelize.define(
    "User",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(200), allowNull: false },
      email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      role_id: { type: DataTypes.TINYINT, defaultValue: 1 },
      last_login: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "users", timestamps: true }
  );

// Organization
const OrganizationModel = (sequelize, DataTypes) =>
  sequelize.define(
    "Organization",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      website: { type: DataTypes.STRING(500) },
      contact_email: { type: DataTypes.STRING(255) },
      contact_phone: { type: DataTypes.STRING(50) },
    },
    { tableName: "organizations", timestamps: true }
  );

// Venue
const VenueModel = (sequelize, DataTypes) =>
  sequelize.define(
    "Venue",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255) },
      address: { type: DataTypes.TEXT },
      city: { type: DataTypes.STRING(100) },
      latitude: { type: DataTypes.DECIMAL(10, 7) },
      longitude: { type: DataTypes.DECIMAL(10, 7) },
    },
    { tableName: "venues", timestamps: true }
  );

// Tag
const TagModel = (sequelize, DataTypes) =>
  sequelize.define(
    "Tag",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), //unique: true, 
      allowNull: false },
      slug: {
        type: DataTypes.STRING(120),
      //unique: true 
      },
    },
    { tableName: "tags", timestamps: false }
  );

// Event
const EventModel = (sequelize, DataTypes) =>
  sequelize.define(
    "Event",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      short_description: { type: DataTypes.STRING(500) },
      full_description: { type: DataTypes.TEXT },
      start_date: { type: DataTypes.DATE, allowNull: false },
      end_date: { type: DataTypes.DATE, allowNull: false },
      registration_deadline: { type: DataTypes.DATE },
      location: { type: DataTypes.STRING(255) },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        defaultValue: "draft",
      },
      visibility: { type: DataTypes.ENUM("public", "private"), defaultValue: "public" },
    },
    { tableName: "events", timestamps: true }
  );

// EventImage
const EventImageModel = (sequelize, DataTypes) =>
  sequelize.define(
    "EventImage",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      url: { type: DataTypes.STRING(1000), allowNull: false },
      alt_text: { type: DataTypes.STRING(255) },
      is_cover: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: "event_images", timestamps: true }
  );

// EventTag
const EventTagModel = (sequelize, DataTypes) =>
  sequelize.define(
    "EventTag",
    {
      event_id: { type: DataTypes.BIGINT, primaryKey: true },
      tag_id: { type: DataTypes.INTEGER, primaryKey: true },
    },{ tableName: "event_tags", timestamps: false }
  );

// Submission
const SubmissionModel = (sequelize, DataTypes) =>
  sequelize.define(
    "Submission",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      submitter_name: { type: DataTypes.STRING(200) },
      submitter_email: { type: DataTypes.STRING(255) },
      organization_name: { type: DataTypes.STRING(255) },
      title: { type: DataTypes.STRING(255) },
      description: { type: DataTypes.TEXT },
      start_date: { type: DataTypes.DATE },
      end_date: { type: DataTypes.DATE },
      registration_link: { type: DataTypes.STRING(1000) },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      review_notes: { type: DataTypes.TEXT },
    },
    { tableName: "submissions", timestamps: true }
  );

// AuditLog
const AuditLogModel = (sequelize, DataTypes) =>
  sequelize.define(
    "AuditLog",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      entity: { type: DataTypes.STRING(100) },
      entity_id: { type: DataTypes.BIGINT },
      action: { type: DataTypes.STRING(50) },
      performed_by: { type: DataTypes.BIGINT },
      details: { type: DataTypes.JSON },
    },
    { tableName: "audit_logs", timestamps: true }
  );

// Program
import ProgramModel from "./program.js";

// ===== تهيئة الموديلات =====
const Role = RoleModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Organization = OrganizationModel(sequelize, DataTypes);
const Venue = VenueModel(sequelize, DataTypes);
const Tag = TagModel(sequelize, DataTypes);
const Event = EventModel(sequelize, DataTypes);
const EventImage = EventImageModel(sequelize, DataTypes);
const EventTag = EventTagModel(sequelize, DataTypes);
const Submission = SubmissionModel(sequelize, DataTypes);
const AuditLog = AuditLogModel(sequelize, DataTypes);

// ===== علاقات بين الموديلات (إن لزم) =====
User.belongsTo(Role, { foreignKey: "role_id" });
Event.belongsTo(User, { foreignKey: "created_by", as: "creator" });
Event.belongsTo(Organization, { foreignKey: "organizer_id", as: "organizer" });
Event.belongsTo(Venue, { foreignKey: "venue_id", as: "venue" });
EventImage.belongsTo(Event, { foreignKey: "event_id", onDelete: "CASCADE" });
Event.belongsToMany(Tag, { through: EventTag, foreignKey: "event_id" });
Tag.belongsToMany(Event, { through: EventTag, foreignKey: "tag_id" });

// ===== التصدير =====
export {
  sequelize,
  Role,
  User,
  Organization,
  Venue,
  Tag,
  Event,
  EventImage,
  EventTag,
  Submission,
  AuditLog,
  Program,
};