import { pgTable, serial, varchar, text, integer, real, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
    id: serial("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    email: text("email").notNull().unique(),   
    name: text("name"),                        
    role: varchar("role", { length: 10 }).notNull().$type<'Employee' | 'Manager'>(),
    department: text("department").notNull(),
  });

export const ReceiptTable = pgTable("receipt", {
    id: serial("id").primaryKey(),
    storeName: text("store_name").notNull(),
    storePhone: varchar("store_phone", { length: 10 }).notNull(),
    storeAddress: text("store_address").notNull(),
    storeWebsite: text("store_website"),
    paymentMethod: text("payment_method").notNull(),
    datetime: timestamp("datetime", { withTimezone: true }).notNull(),
    totalAmount: real("total_amount").notNull(),
    owner: integer("owner").references(() => UserTable.id)
});

export const ReceiptItemTable = pgTable("receipt_item", {
    id: serial("id").primaryKey(),
    receiptId: integer("receipt_id").notNull().references(() => ReceiptTable.id),
    name: text("name").notNull(),
    amount: integer("amount").notNull().default(1),
    cost: real("cost").notNull()
});
