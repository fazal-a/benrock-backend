// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinTable,
//   ManyToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn
// } from "typeorm";
// import { Message } from "./messages";
// import { User } from "./user";

// @Entity()
// export class Chat {
//   @PrimaryGeneratedColumn()
//   _id: number;

//   @ManyToMany(() => User)
//   @JoinTable()
//   users: User[];

//   @OneToOne(() => Message, { nullable: true })
//   lastMessage: Message;

//   @Column({ default: 0 })
//   unSeenCount: number;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
