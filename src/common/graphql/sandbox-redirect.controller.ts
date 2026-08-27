import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class SandboxRedirectController {
  // Ссылку "для просмотра" открывают в браузере, а интерфейсом по заданию
  // служит песочница — незачем показывать пустой корень.
  @Get()
  @Redirect('/graphql', 302)
  toSandbox(): void {}
}
