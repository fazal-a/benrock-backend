// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
  
//   BeforeInsert
// } from "typeorm";
// import { Role } from "./roles";
// import { hashPassword } from "../../utils/password";

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   _id: number;

//   @Column()
//   name: string;

//   @Column()
//   email: string;

//   @Column()
//   password: string;

//   @Column()
//   longitude: string;

//   @Column()
//   latitude: string;

//   @Column({ default: "" })
//   description: string;

//   @ManyToOne(() => Role)
//   role: number;

//   @BeforeInsert()
//   async hashPasswordBeforeInsert(): Promise<void> {
//     this.password = await hashPassword(this.password);
//   }
// }
