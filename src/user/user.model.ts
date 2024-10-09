import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
@ObjectType()
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  @Field(() => ID)
  id: number;

  @Column
  @Field()
  name: string;

  @Column
  @Field()
  balance: number;
}
