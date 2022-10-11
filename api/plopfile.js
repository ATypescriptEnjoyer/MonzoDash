// plopfile.js
export default function (plop) {
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'module name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{name}}/{{name}}.controller.ts',
        templateFile: 'plop-templates/controller.hbs',
      },
      {
        type: 'add',
        path: 'src/{{name}}/{{name}}.module.ts',
        templateFile: 'plop-templates/module.hbs',
      },
      {
        type: 'add',
        path: 'src/{{name}}/{{name}}.service.ts',
        templateFile: 'plop-templates/service.hbs',
      },
      {
        type: 'add',
        path: 'src/{{name}}/schemas/{{name}}.schema.ts',
        templateFile: 'plop-templates/schema.hbs',
      },
    ],
  });
}
