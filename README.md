# Discord.JS Bot Template
## Why?
This is a template I personally use and find useful. You may be
thinking, "There are 1000 other templates, why not just use
another one?" The reason I created this one is that almost
every other template I found was either too complicated or
not up to date. This template is simple, easy to understand,
and up to date (I'll try to keep it that way, but no guarantees).

It also doesn't have any useless commands. The only command I
have prebuilt is the help command. The help command is dynamic,
so as long as you set up the description of the commands you make,
it will automatically generate a list of commands.

## Features
- Minimal
- Easy to understand
- Dynamic help command
- Command handler
- Event handler

## Explanation / Structure
I tried to make it easy to understand, but I think it's useful
to have this explanation here. First I'll lay out the file
structure, then I'll what each file does, and it's purpose.
```
    - src
        - bot
            - commands
                - _example.ts
                - help.ts
            - events
                - _example.ts
                - messageCreate.ts
        - utils
            - readConfig.ts
```

The bot folder is for everything related to the discord bot. If
you want to add any files related to the bot it's recommended to
keep it in that folder.

*For both the commands and events folders, any file starting with
an "_" is ignored*

The commands folder is for all the commands you want to add to the
bot. You can add as many commands as you want, and you can also add
folders to organize them. Everything will still work just fine. For
every command you add you can simply add a file to the commands then
copy the code from the _example.ts file (Except for the description
types part, you should import that in the command file).

*Make sure to add the command description as that's what the help
command uses to generate the list of commands.*

The events folder is similar to the commands folder, you can
add folders to organize the events, and it has an _example.ts file.
Instead of a description there is a settings object. This object
(as of the time of writing) only contains one property, "once".
If once is set to true, the event be set to use client.once, if
it's set to false, it will use client.on. The event that is being
listened for is the file name (without the .ts extension). The
file besides the _example.ts file is the messageCreate.ts file. It
is being used for the command handler. If you want any commands to
work make sure not to delete the messageCreate.ts file.

The utils folder is for any utility functions you want to use.
Currently, there is only one file, readConfig.ts. This is used to
read the config.json file. If you want to add more to the config,
you should add the types to the "Config" interface in that file, as
well as the config.example.json file (It will work if you don't add
the element to the config.example.json file, but it's recommended
to add it so people know all the elements without having to look
in the readConfig.ts file).