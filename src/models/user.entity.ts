import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Token from "./token.entity"
import Task from "./task.entity"
import CPF from "./cpf.entity"


@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string //! significa obrigatorio ? opcional

  @Column()
  email!: string

  @Column()
  password!: string

  @OneToMany(() => Token, token => token.user)
  tokens!: Token[]

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[]

  @OneToMany(() => CPF, cpf => cpf.user)
  cpfs!: Task[]
}