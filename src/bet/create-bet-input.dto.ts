import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class CreateBetInputDto {
  /**
   * The ID of the user placing the bet.
   */
  @Field(() => ID, { description: 'The ID of the user placing the bet' })
  userId: number;

  /**
   * The amount of the bet.
   */
  @Field({ description: 'The amount of the bet' })
  betAmount: number;

  /**
   * The chance of winning the bet. Must be between 0 and 1.
   */
  @Max(1, { message: 'Chance must be between 0 and 1' })
  @Min(0)
  @Field(() => Float, {
    description: 'The chance of winning the bet. Must be between 0 and 1.',
  })
  chance: number;
}
