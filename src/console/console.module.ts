import { Module } from "@nestjs/common";
import { Example } from "./Example";

@Module({
  providers: [Example],
  imports: [],
})
export class ConsoleModule {}
