import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInputDto {
  /**
   * The name of the user.
   */
  @Field({ description: 'The name of the user' })
  name: string;

  /**
   * The balance of the user.
   */
  @Field({ description: 'The balance of the user' })
  balance: number;
}