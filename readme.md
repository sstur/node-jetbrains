##Command Line tools for JetBrains projects

This tool will implement various command-line actions that might be useful within your project directory if you use a JetBrains IDE such as IntelliJ, WebStorm, RubyMine or PHPStorm.

The only command implemented at this time is `init` which will initialize a new JetBrains project from existing source files (or an empty directory). This is useful if you wish to open the project in IntelliJ for the first time.

Installation:

    npm install -g jetbrains

Usage:

    cd ~/my_new_project
    jetbrains init

Then you can open `~/my_new_project` in IntelliJ simply by using "Open Project"

Roadmap:
 * Add support for renaming projects
 * Remove items from "recent projects" list
