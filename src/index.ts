import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
    .command('greet [name]', 'Greet a user', (yargs) => {
        return yargs.positional('name', {
            describe: 'Name to greet',
            type: 'string',
        });
    }, (argv) => {
        if (argv.name) {
            console.log(`Hello, ${argv.name}!`);
        } else {
            console.log('Hello, world!');
        }
    })
    .demandCommand(1, 'Please enter a command')
    .strict()
    .showHelpOnFail(true)
    .parse();

