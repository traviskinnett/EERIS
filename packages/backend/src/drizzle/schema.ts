import {
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { send } from "process";

export const UserTable = pgTable("user", {
  id: serial("id").primaryKey(),
  uuid: text("uuid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: varchar("role", { length: 10 })
    .notNull()
    .$type<"Employee" | "Manager">(),
  department: text("department").notNull(),
});

export const ReceiptTable = pgTable("receipt", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull(),
  storePhone: varchar("store_phone").notNull(),
  storeAddress: text("store_address").notNull(),
  storeWebsite: text("store_website"),
  category: text("category").notNull(),
  paymentMethod: text("payment_method").notNull(),
  datetime: timestamp("datetime", { withTimezone: true }).notNull(),
  totalAmount: real("total_amount").notNull(),
  ownerId: text("owner_id").references(() => UserTable.uuid),
  ownerName: text("owner_name"),
  status: varchar("status", { length: 10 })
    .notNull()
    .default("Pending")
    .$type<"Pending" | "Approved" | "Denied">(),
  items: jsonb("items").notNull().$type<
    {
      name: string;
      quantity: number;
      unitPrice: number;
    }[]
  >(),
});

export const MessageTable = pgTable("message", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  datetime: timestamp("datetime", { withTimezone: true }).notNull(),
  senderId: text("sender_id")
    .references(() => UserTable.uuid)
    .notNull(),
  senderName: text("sender_name").notNull(),
  receiverId: text("receiver_id")
    .references(() => UserTable.uuid)
    .notNull(),
  receiverName: text("receiver_name").notNull(),
  status: varchar("status", { length: 10 })
    .notNull()
    .default("Unread")
    .$type<"Read" | "Unread">(),
});
