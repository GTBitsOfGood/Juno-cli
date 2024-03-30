export interface Command {
  describe: string;
  type: string;
  handler?: (argv: any) => void;
  args?: CommandArg;
  subcommands?: Subcommand;
}

export interface CommandArg {
  [name: string]: CommandArgProperties;
}

export interface CommandArgProperties {
  describe: string;
  validator: (arg: string) => boolean;
}

export interface ParsedCommandArgProperties extends CommandArgProperties {
  type: string;
}

export interface Subcommand {
  [key: string]: Command;
}
