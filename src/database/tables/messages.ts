// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn
// } from "typeorm";
// import { User } from "./user";

// enum MessageType {
//   TEXT = "text",
//   IMAGE = "image",
//   MULTIPLE_IMAGE = "multipleImages"
// }

// @Entity()
// export class Message {
//   @PrimaryGeneratedColumn()
//   _id: number;

//   @Column()
//   text: string;

//   @Column({
//     type: "enum",
//     enum: MessageType,
//     default: MessageType.TEXT
//   })
//   messageType: MessageType;

//   @ManyToOne(() => User)
//   sender: number;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
