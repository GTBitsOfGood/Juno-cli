import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CommandArg, ParsedCommandArgProperties, Subcommand } from './cli';
import { DefaultApi } from 'juno-sdk';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSubcommands: Subcommand = {
  auth: {
    describe: 'Run a Juno user auth command',
    type: 'string',
    subcommands: {
      key: {
        describe: 'Issue api key',
        type: 'string',
        handler: async (argv) => {
          const api = new DefaultApi('http://localhost:53986');
          const {
            projectId,
            projectName,
            email,
            password,
            description,
            environment,
          } = argv;
          /*
          Should be:
          const createApiKeyResponse = await api.authControllerCreateApiKey({
              project: {id: projectId, name: projectName},
              email,
              password,
              description,
              environment,
          });
          */
          const createApiKeyResponse = await api.authControllerCreateApiKey({
            headers: {
              project: projectId || projectName || undefined,
              email,
              password,
              description,
              environment,
            },
          });
          console.log('Issuing API key...');
          console.log(createApiKeyResponse);
        },
        args: {
          projectId: {
            describe: 'Project ID',
            validator: (arg) => {
              return !Number.isNaN(arg);
            },
          },
          projectName: {
            describe: 'Project Name',
            validator: (arg) => {
              return arg.length > 0;
            },
          },
          email: {
            describe: 'Email',
            validator: (arg) => {
              return emailRegex.test(arg);
            },
          },
          password: {
            describe: 'Password',
            validator: (arg) => {
              return arg.length > 0;
            },
          },
          description: {
            describe: 'API description',
            validator: (arg) => {
              return arg.length > 0;
            },
          },
          environment: {
            describe: 'API environment',
            validator: (arg) => {
              return arg.length > 0;
            },
          },
        },
      },
    },
  },
  email: {
    describe: 'Run a Juno user email command',
    type: 'string',
    subcommands: {
      register: {
        describe: 'Register an email',
        type: 'string',
        handler: (argv) => {
          console.log('Registering email...');
        },
        args: {
          test: {
            describe: 'Test arg',
            validator: (arg) => {
              return true;
            },
          },
        },
      },
      send: {
        describe: 'Send an email',
        type: 'string',
        handler: (argv) => {
          console.log('Sending email...');
        },
      },
    },
  },
  project: {
    describe: 'Run a Juno user project command',
    type: 'string',
    subcommands: {
      get: {
        describe: 'Get a project',
        type: 'string',
        handler: (argv) => {
          console.log('Getting project...');
        },
      },
      create: {
        describe: 'Create a project',
        type: 'string',
        handler: (argv) => {
          console.log('Creating project...');
        },
      },
      link: {
        describe: 'Link a project',
        type: 'string',
        handler: (argv) => {
          console.log('Linking user to project...');
        },
      },
    },
  },
  '': {
    describe: 'Run a Juno user command',
    type: 'string',
    subcommands: {
      get: {
        describe: 'Get user information',
        type: 'string',
        handler: (argv) => {
          console.log('Getting user information...');
        },
      },
      create: {
        describe: 'Create a user',
        type: 'string',
        handler: (argv) => {
          console.log('Creating user...');
        },
      },
      setType: {
        describe: 'Set user type',
        type: 'string',
        handler: (argv) => {
          console.log('Setting user type...');
        },
      },
      link: {
        describe: 'Link a user to a project',
        type: 'string',
        handler: (argv) => {
          console.log('Linking user...');
        },
      },
    },
  },
};

function buildCommands(yargs: Argv, commands: Subcommand, parentCommand = '') {
  Object.entries(commands).forEach(([commandName, command]) => {
    const fullCommandName = parentCommand.length
      ? `${parentCommand}:${commandName}`.trim()
      : commandName;

    let commandArgs: Record<string, ParsedCommandArgProperties> = {};
    let usageString = fullCommandName || parentCommand;

    if (command.args) {
      usageString += ' ';
      Object.entries(command.args).forEach(([argName, argProps]) => {
        usageString += `<${argName}> `;
        if (command.args) {
          const parsedCommand: any = command.args[argName];
          parsedCommand.type = 'string';
          commandArgs[argName] = parsedCommand;
        }
      });
    }

    if (command.subcommands) {
      buildCommands(yargs, command.subcommands, fullCommandName);
    } else {
      yargs.command(
        usageString.trim(),
        buildCommandDescription(command.describe, command.args),
        (yargs) => {
          Object.entries(commandArgs).forEach(([name, arg]) => {
            if (arg.type != 'string') throw new Error();
            yargs.positional(name, {
              describe: arg.describe,
              type: arg.type,
            });
          });
        },
        (argv) => {
          let isValid = true;
          Object.entries(commandArgs).forEach(([name, arg]) => {
            if (!arg.validator(argv[name] as string)) {
              console.error(
                `Invalid value for '${name}': ${argv[name]}, requires ${arg.type}.`,
              );
              isValid = false;
            }
          });

          if (isValid) {
            command.handler ? command.handler(argv) : () => {};
          } else {
            process.exit(1);
          }
        },
      );
    }
  });
}

function buildCommandDescription(
  describe: string,
  args: CommandArg | undefined,
): string {
  let string = `${describe}`;
  return string;
}

yargs(hideBin(process.argv))
  .usage('$0 <command>')
  .command(
    'user [subcommand]',
    'Run a Juno user command',
    (yargs) => {
      buildCommands(yargs, userSubcommands);
    },
    (argv) => {
      if (
        !argv.subcommand ||
        !((argv.subcommand as string) in userSubcommands) ||
        userSubcommands[argv.subcommand as string].subcommands
      ) {
        console.error(`Invalid subcommand: ${argv.subcommand}`);
        yargs.showHelp();
        process.exit(1);
      }
    },
  )
  .demandCommand(1, 'Please enter a command')
  .strict()
  .help()
  .parse();
